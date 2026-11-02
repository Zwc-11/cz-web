import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { projectURL, homeURL } from '../client/src/lib/projectNavigation.ts'
import { caseStudies, projectOrder } from '../client/src/content/caseStudies.ts'

const metadata = JSON.parse(readFileSync(new URL('../client/src/content/projectMetadata.json', import.meta.url), 'utf8'))

test('opening a case study sets ?project and drops old tab params and hashes', () => {
  const url = projectURL('https://caesarzhou.com/?tab=experience&ref=x#ecobee', 'murmur')
  assert.equal(url.search, '?ref=x&project=murmur')
  assert.equal(url.hash, '')
})

test('closing a case study returns to the plain homepage URL', () => {
  const url = homeURL('https://caesarzhou.com/?tab=projects&project=murmur&ref=x#case-scope')
  assert.equal(url.search, '?ref=x')
  assert.equal(url.hash, '')
})

test('every project has metadata, a card and a complete case study', async () => {
  const { projectCards, hackathons, education } = await import('../client/src/content/onepage.ts')
  assert.equal(projectOrder.length, new Set(projectOrder).size)
  assert.deepEqual(metadata.projects.map(p => p.id), projectOrder)
  assert.deepEqual(projectCards.map(c => c.id), projectOrder)
  for (const id of projectOrder) {
    const study = caseStudies[id]
    assert.ok(study, `Missing case study: ${id}`)
    assert.ok(study.overview && study.contribution && study.evidence && study.scope, `Incomplete case study: ${id}`)
    assert.ok(study.architecture.length > 1 && study.decisions.length > 0, `Missing engineering detail: ${id}`)
  }
  for (const project of metadata.projects) {
    assert.ok(project.links.length > 0, `Missing project link: ${project.id}`)
    for (const link of project.links) assert.equal(new URL(link.href).protocol, 'https:')
  }
  for (const h of hackathons) assert.ok(projectOrder.includes(h.projectId), `Hackathon links to unknown project: ${h.id}`)
  assert.ok(projectOrder.includes(education.award.projectId))
})

test('project cards are newest first', async () => {
  const { projectCards } = await import('../client/src/content/onepage.ts')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const key = date => {
    const match = /^(\w{3}) (\d{4})$/.exec(date)
    assert.ok(match && months.includes(match[1]), `Card date must look like "Oct 2026": ${date}`)
    return Number(match[2]) * 12 + months.indexOf(match[1])
  }
  const keys = projectCards.map(card => key(card.date))
  for (let i = 1; i < keys.length; i++) assert.ok(keys[i] <= keys[i - 1], `${projectCards[i].name} is newer than the card before it`)
})
