import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppLayout } from './App'

/**
 * Intrarea pentru prerandare (vite build --ssr, apoi scripts/prerender.mjs):
 * HTML-ul fiecărei rute, ca roboții să găsească textul și capul paginii fără
 * să ruleze JavaScript.
 */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppLayout />
      </StaticRouter>
    </StrictMode>,
  )
}

export { ROUTES, renderHeadTags, SITE_URL, canonicalUrl } from './seo'
