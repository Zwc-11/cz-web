import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { projectURL, projectsURL, matchesTerms } from '../client/src/lib/projectNavigation.ts'
import { caseStudies, projectOrder, selectedProjectIds } from '../client/src/content/caseStudies.ts'

test('opening a case preserves search and filters and clears legacy story hashes', () => {
  const url = projectURL('https://caesarzhou.com/?tab=experience&q=React%20Flow&focus=AI%20%26%20agents#ecobee', 'agentreplay')
  assert.equal(url.searchParams.get('tab'), 'projects')
  assert.equal(url.searchParams.get('project'), 'agentreplay')
  assert.equal(url.searchParams.get('q'), 'React Flow')
  assert.equal(url.searchParams.get('focus'), 'AI & agents')
  assert.equal(url.hash, '')
})

test('returning from a direct case URL keeps the reading context without a stale hash', () => {
  const url = projectsURL('https://caesarzhou.com/?project=hindsight&q=data&focus=Markets%20%26%20data#case-evidence')
  assert.equal(url.searchParams.has('project'), false)
  assert.equal(url.searchParams.get('tab'), 'projects')
  assert.equal(url.searchParams.get('q'), 'data')
  assert.equal(url.searchParams.get('focus'), 'Markets & data')
  assert.equal(url.hash, '')
})

test('search requires every term and handles case, accents and extra spaces', () => {
  assert.equal(matchesTerms('React Flow · Event sourcing · Résumé', '  REACT   sourcing  '), true)
  assert.equal(matchesTerms('Résumé', 'resume'), true)
  assert.equal(matchesTerms('React Flow · Event sourcing', 'React Rust'), false)
  assert.equal(matchesTerms('React', '   '), true)
})

test('every archived project has a case study and a reachable place in the index', () => {
  const archive = JSON.parse(readFileSync(new URL('../client/src/content/archive.json', import.meta.url), 'utf8'))
  const ids = ['takeone', ...archive.projects.map(p => p.id), ...archive.hackathons.map(p => p.id)]
  const metadata = JSON.parse(readFileSync(new URL('../client/src/content/projectMetadata.json', import.meta.url), 'utf8'))
  assert.deepEqual(new Set(projectOrder), new Set(ids))
  assert.deepEqual(new Set(metadata.projects.map(p => p.id)), new Set(ids))
  assert.equal(metadata.projects.length, ids.length)
  assert.equal(projectOrder.length, new Set(projectOrder).size)
  for (const id of ids) {
    const study = caseStudies[id]
    assert.ok(study, `Missing case study: ${id}`)
    assert.ok(study.contribution && study.evidence && study.scope, `Missing attribution or evidence: ${id}`)
    assert.ok(study.architecture.length > 1 && study.decisions.length > 0, `Missing engineering explanation: ${id}`)
  }
  for (const id of selectedProjectIds) assert.ok(projectOrder.includes(id))
  for (const project of metadata.projects) {
    assert.ok(['AI & agents', 'Data & ML systems', 'Applied AI'].includes(project.category))
    assert.equal(project.tags.length, new Set(project.tags).size)
    assert.ok(project.links.length > 0, `Missing project evidence link: ${project.id}`)
    for (const link of project.links) assert.equal(new URL(link.href).protocol, 'https:')
  }
})
