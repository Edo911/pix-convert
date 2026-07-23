import { Routes, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Home } from './pages/Home'
import { ConversionPage } from './pages/ConversionPage'
import { CompressPage } from './pages/CompressPage'
import { ResizePage } from './pages/ResizePage'
import { ToolsPage } from './pages/ToolsPage'
import { FormatsPage } from './pages/FormatsPage'
import { HowToPage } from './pages/HowToPage'
import { SitemapPage } from './pages/SitemapPage'
import { About } from './pages/About'
import { Privacy } from './pages/Privacy'
import { BlogIndex, BlogArticle } from './pages/blog'
import { NotFound } from './pages/NotFound'
import { blogPosts } from './pages/blog/blog-posts'
import { conversionRoutes } from './pages/conversions'

export function App() {
  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="header__brand">
          <span className="header__logo" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="logoRainbow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff6b6b"/>
                  <stop offset="25%" stopColor="#ffd93d"/>
                  <stop offset="50%" stopColor="#6bcb77"/>
                  <stop offset="75%" stopColor="#4d96ff"/>
                  <stop offset="100%" stopColor="#9b59b6"/>
                </linearGradient>
                <filter id="logoGlow">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <rect x="8" y="8" width="32" height="32" rx="10" fill="url(#logoRainbow)" filter="url(#logoGlow)"/>
              <rect x="12" y="12" width="24" height="24" rx="7" fill="#0f0f13"/>
              <path d="M20 26l4-4 4 4" stroke="url(#logoRainbow)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 22l4 4 4-4" stroke="url(#logoRainbow)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
            </svg>
          </span>
          <div>
            <span className="brand-name" role="img" aria-label="PixConvert">PixConvert</span>
            <p>Convert images locally in your browser — no servers, no signup, files up to 50 MB.</p>
          </div>
        </Link>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compress" element={<CompressPage />} />
          <Route path="/resize" element={<ResizePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/formats" element={<FormatsPage />} />
          <Route path="/how-to" element={<HowToPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          {conversionRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ConversionPage route={route} />}
            />
          ))}
          <Route path="/blog" element={<BlogIndex />} />
          {blogPosts.map((post) => (
            <Route key={post.slug} path={`/blog/${post.slug}`} element={<BlogArticle slug={post.slug} />} />
          ))}
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer__links">
          <Link to="/">Home</Link>
          <Link to="/compress">Compress</Link>
          <Link to="/resize">Resize</Link>
          <Link to="/tools">All Tools</Link>
          <Link to="/formats">Formats</Link>
          <Link to="/how-to">How-To Guides</Link>
          {conversionRoutes.map((r) => (
            <Link key={r.path} to={r.path}>{r.fromFormat} to {r.toFormat}</Link>
          ))}
          <Link to="/blog">Blog</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/sitemap">Sitemap</Link>
        </div>
        <p>All processing runs locally in your browser. Files are never uploaded to a server.</p>
      </footer>
    </div>
  )
}
