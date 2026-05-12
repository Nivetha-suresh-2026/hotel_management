import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'

// ── Unregister any stale service workers ────────────────────────────────────
// A previously installed vite-plugin-pwa workbox SW can intercept Supabase's
// BroadcastChannel auth messages, causing "message channel closed" errors and
// leaving the app stuck on the loading screen after a refresh.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((sw) => {
      sw.unregister();
      console.log('[SW] Unregistered stale service worker:', sw.scope);
    });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
