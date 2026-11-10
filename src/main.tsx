import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Pagina vine prerandată (scripts/prerender.mjs), pentru roboți și
// previzualizări. Nu o hidratăm: animațiile și tema citită din localStorage ar
// da altă randare decât cea de la build, deci React o înlocuiește pur și
// simplu — vizitatorul vede exact ce vedea și înainte.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
