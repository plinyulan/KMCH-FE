import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import liff from '@line/liff'

import './index.css'
import App from './App.jsx'
import { setLineId } from './services/api'

// LIFF must be initialized once, on the entry URL, BEFORE any SPA navigation
// strips the LIFF query params. Each page then just calls LIFF APIs without
// re-initialising.
const STAFF_PATHS = ['/display', '/manual-queue']

liff
  .init({ liffId: import.meta.env.VITE_LIFF_ID })
  .then(async () => {
    const isStaffPage = STAFF_PATHS.some((p) => window.location.pathname.startsWith(p))
    if (!liff.isLoggedIn()) {
      if (!isStaffPage) liff.login()
      return
    }
    try {
      const profile = await liff.getProfile()
      if (profile?.userId) setLineId(profile.userId)
    } catch {
      /* ignore */
    }
  })
  .catch((err) => {
    console.error('LIFF init failed:', err)
  })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
