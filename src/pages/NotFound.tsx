import { SEO } from '../components/SEO'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <>
      <SEO title="404 — Page Not Found | PixConvert" description="The page you are looking for does not exist. Convert images online for free at PixConvert." path="/404" />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: '404' }]} />
      <section className="conversion-hero">
        <h1 className="conversion-hero__title" style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>404</h1>
        <p className="conversion-hero__desc">Page not found. Let's get you back on track.</p>
        <div className="not-found-actions">
          <Link to="/" className="convert-btn" style={{ textDecoration: 'none' }}>Go Home</Link>
          <Link to="/blog" className="convert-btn convert-btn--secondary" style={{ textDecoration: 'none' }}>Read Our Blog</Link>
        </div>
      </section>
    </>
  )
}
