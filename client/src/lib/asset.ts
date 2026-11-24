/**
 * Content paths are written relative ('logos/htn.png'). Pages now live at
 * /work, /projects and so on, so resolve them from the site root (or from the
 * single-file preview's base) instead of from the current path.
 */
export function asset(path: string) {
  if (/^(?:[a-z]+:|\/|#)/i.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\.\//, '')
}
