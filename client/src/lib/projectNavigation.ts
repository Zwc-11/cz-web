/** URL for a case study: keeps other query params, drops any hash. */
export function projectURL(current: string, id: string) {
  const url = new URL(current)
  url.hash = ''
  url.searchParams.delete('tab')
  url.searchParams.set('project', id)
  return url
}

/** URL for the homepage after closing a case study. */
export function homeURL(current: string) {
  const url = new URL(current)
  url.hash = ''
  url.searchParams.delete('project')
  url.searchParams.delete('tab')
  return url
}
