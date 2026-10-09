export function projectURL(current: string, id: string) {
  const url = new URL(current)
  url.hash = ''
  url.searchParams.set('tab', 'projects')
  url.searchParams.set('project', id)
  return url
}

export function projectsURL(current: string) {
  const url = new URL(current)
  url.hash = ''
  url.searchParams.delete('project')
  url.searchParams.set('tab', 'projects')
  return url
}

export function matchesTerms(text: string, query: string) {
  const normalize = (value: string) => value.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean)
  const haystack = normalize(text)
  return terms.every(term => haystack.includes(term))
}
