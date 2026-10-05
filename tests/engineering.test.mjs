import test from 'node:test'
import assert from 'node:assert/strict'
import { replayWorkflow, resolveRecords, sampleRecords, runRequestPool, waitForRequest } from '../client/src/lib/engineering.ts'

test('a clean replay reaches the exact recorded confirmation state', () => {
  const frames = replayWorkflow('none')
  assert.equal(frames.length, 6)
  assert.equal(frames.at(-1).actual.submitted, true)
  for (const frame of frames) assert.deepEqual(frame.expected, frame.actual)
})

test('a missing field stops at the first difference and preserves earlier frames', () => {
  const frames = replayWorkflow('missing-field')
  assert.equal(frames.length, 4)
  assert.deepEqual(frames.at(-1).differences, ['email'])
  assert.equal(frames[2].actual.company, 'Acme Studio')
  assert.equal(frames[0].actual.company, '')
  assert.equal(frames.at(-1).actual.submitted, false)
})

test('a broken submission is detected even when all input fields match', () => {
  const last = replayWorkflow('broken-submit').at(-1)
  assert.deepEqual(last.differences, ['submitted'])
  assert.equal(last.expected.submitted, true)
  assert.equal(last.actual.submitted, false)
})

test('point-in-time reads exclude later revisions and future observations', () => {
  const snapshot = Object.fromEntries(resolveRecords(sampleRecords, 5).map(r => [r.metric, r.value]))
  assert.deepEqual(snapshot, { Revenue: 42, Orders: 130, Index: 102 })
  assert.equal(resolveRecords(sampleRecords, 2).length, 0)
  assert.equal(resolveRecords(sampleRecords, 6).find(r => r.metric === 'Revenue').value, 48)
})

test('latest-only reads leak future values, and late snapshots agree with the safe read', () => {
  assert.deepEqual(resolveRecords(sampleRecords, 1, false).map(r => r.value), [48, 145, 108])
  assert.deepEqual(resolveRecords(sampleRecords, 9), resolveRecords(sampleRecords, 9, false))
  assert.deepEqual(resolveRecords([...sampleRecords].reverse(), 5).sort((a,b) => a.metric.localeCompare(b.metric)), resolveRecords(sampleRecords, 5).sort((a,b) => a.metric.localeCompare(b.metric)))
})

test('publication ties resolve to the newest revision regardless of input order', () => {
  const rows = [{id:'a',metric:'A',value:1,observed:1,available:2,revision:1},{id:'b',metric:'A',value:2,observed:1,available:2,revision:2}]
  assert.equal(resolveRecords(rows, 2)[0].value, 2)
  assert.equal(resolveRecords([...rows].reverse(), 2)[0].value, 2)
})

test('request pool enforces concurrency, executes every task once, and isolates a failure', async () => {
  const tasks = Array.from({length:5}, (_,i) => ({id:String(i),label:String(i),duration:10}))
  let active=0, peak=0
  const result = await runRequestPool(tasks, {concurrency:2, fail:'2', onEvent:e => {
    if(e.state==='running') {active++; peak=Math.max(peak,active)} else active--
  }})
  assert.equal(peak, 2)
  assert.equal(active, 0)
  assert.deepEqual(result.failures, ['2'])
  assert.equal(result.events.filter(e=>e.state==='running').length, tasks.length)
  assert.equal(result.events.filter(e=>e.state==='done').length, 4)
})

test('cached tasks do not run and empty pools complete', async () => {
  const result = await runRequestPool([{id:'a',label:'A',duration:200}], {concurrency:3, cache:new Set(['a'])})
  assert.deepEqual(result.events.map(e=>e.state), ['cached'])
  assert.deepEqual((await runRequestPool([], {concurrency:1})).events, [])
})

test('a cache hit takes priority over a simulated endpoint failure', async () => {
  const result = await runRequestPool([{id:'a',label:'A',duration:10}], {concurrency:1, cache:new Set(['a']), fail:'a'})
  assert.deepEqual(result.events.map(e=>e.state), ['cached'])
  assert.deepEqual(result.failures, [])
})

test('cancellation rejects running and pre-aborted requests without later events', async () => {
  const controller = new AbortController()
  const events=[]
  const promise=runRequestPool([{id:'a',label:'A',duration:200},{id:'b',label:'B',duration:200}], {concurrency:1,signal:controller.signal,onEvent:e=>events.push(e)})
  controller.abort()
  await assert.rejects(promise, {name:'AbortError'})
  await assert.rejects(waitForRequest(10,controller.signal), {name:'AbortError'})
  assert.deepEqual(events.map(e=>e.state), ['running'])
})

test('request pool rejects invalid concurrency', async () => {
  for(const concurrency of [0,-1,1.5,NaN]) await assert.rejects(runRequestPool([], {concurrency}), RangeError)
})
