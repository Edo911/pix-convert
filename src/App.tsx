import { Routes, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Home } from './pages/Home'
import { ConversionPage } from './pages/ConversionPage'
import { About } from './pages/About'
import { Privacy } from './pages/Privacy'
import { conversionRoutes } from './pages/conversions'

export function App() {
  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="header__brand">
          <span className="header__logo" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="pixconvertLogo" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <rect x="10" y="10" width="28" height="28" rx="9" fill="url(#pixconvertLogo)" />
              <path d="M18 24h12M24 18v12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <h1>PixConvert</h1>
            <p>Convert images locally in your browser — no servers, no signup, files up to 50 MB.</p>
          </div>
        </Link>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          {conversionRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ConversionPage route={route} />}
            />
          ))}
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer__links">
          <Link to="/">Home</Link>
          {conversionRoutes.map((r) => (
            <Link key={r.path} to={r.path}>{r.fromFormat} to {r.toFormat}</Link>
          ))}
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
        <p>All processing runs locally in your browser. Files are never uploaded to a server.</p>
      </footer>
    </div>
  )
}
