/**
 * Prerandarea paginilor, după `vite build` și `vite build --ssr`.
 *
 * Pentru fiecare rută din src/seo.ts scrie dist/<ruta>/index.html cu:
 *  - capul paginii (titlu, descriere, canonical, Open Graph, Twitter, JSON-LD);
 *  - HTML-ul paginii, randat cu React pe server.
 * Așa roboții care nu rulează JavaScript (previzualizările de pe Facebook,
 * WhatsApp, LinkedIn) văd pagina corectă. În browser, React o înlocuiește.
 *
 * Fără dependențe în plus: doar Node și ce e deja în proiect.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

process.env.NODE_ENV = 'production'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')

const { render, ROUTES, renderHeadTags } = await import(
  pathToFileURL(join(ssrDir, 'entry-server.js')).href
)

const template = readFileSync(join(dist, 'index.html'), 'utf8')
const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/
const APP_SLOT = '<!--app-html-->'
if (!SEO_BLOCK.test(template) || !template.includes(APP_SLOT)) {
  throw new Error('index.html nu are reperele <!--seo:start-->…<!--seo:end--> și <!--app-html-->.')
}

// Rezerva pentru adrese necunoscute (gazde care servesc 404.html): pagina
// goală, cu capul paginii principale. Aplicația o randează în browser.
writeFileSync(join(dist, '404.html'), template.replace(APP_SLOT, ''))

// Fiecare rută în dist/pagini/<ruta>.html; public/.htaccess o servește la
// adresa fără slash (/erp). Nu în dist/<ruta>/index.html: un dosar real /erp
// l-ar face pe Apache să redirecționeze la /erp/ (vezi public/.htaccess).
const PAGES_DIR = 'pagini'
const routesOf = (list) => [...list].sort().join('|')
const htaccess = readFileSync(join(dist, '.htaccess'), 'utf8')
const rule = htaccess.match(/^\s*RewriteRule \^\(([^)]*)\)\/\?\$ pagini\/\$1\.html \[L\]/m)
const wanted = ROUTES.map((r) => r.path).filter((p) => p !== '/').map((p) => p.slice(1))
if (!rule || routesOf(rule[1].split('|')) !== routesOf(wanted)) {
  throw new Error(
    `public/.htaccess nu servește exact rutele din src/seo.ts. Regula trebuie să fie:\n` +
      `  RewriteRule ^(${wanted.join('|')})/?$ ${PAGES_DIR}/$1.html [L]`,
  )
}

for (const { path } of ROUTES) {
  const head = `<!--seo:start-->\n    ${renderHeadTags(path)}\n    <!--seo:end-->`
  const html = template.replace(SEO_BLOCK, () => head).replace(APP_SLOT, () => render(path))
  const file = path === '/' ? 'index.html' : join(PAGES_DIR, `${path.slice(1)}.html`)
  const outFile = join(dist, file)
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, html)
  console.log(`prerandat  ${path.padEnd(12)} → dist/${file}`)
}

rmSync(ssrDir, { recursive: true, force: true })
