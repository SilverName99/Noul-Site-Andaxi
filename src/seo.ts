/** Setează titlul, descrierea și URL-ul canonic pentru pagina curentă —
 *  Google le preia la indexare (randează JavaScript-ul). */
export function setPageMeta(title: string, description: string, path: string) {
  document.title = title

  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'description'
    document.head.appendChild(meta)
  }
  meta.content = description

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = `https://andaxi.ro${path}`
}
