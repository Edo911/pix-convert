import { SEO } from '../components/SEO'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Link } from 'react-router-dom'
import { conversionRoutes } from './conversions'
import { blogPosts } from './blog/blog-posts'

export function SitemapPage() {
  return (
    <>
      <SEO
        title="Sitemap — All Pages | PixConvert"
        description="Complete list of all PixConvert pages, tools, converters, and blog articles. Find any page on the site."
        path="/sitemap"
        keywords="sitemap, all pages, site map"
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Sitemap' },
        ]}
      />

      <section className="conversion-hero">
        <h1 className="conversion-hero__title">Sitemap</h1>
        <p className="conversion-hero__desc">
          A full directory of every page on PixConvert.
        </p>
      </section>

      <section className="content-section content-section--text">
        <h2>Tools</h2>
        <div className="inline-links">
          <Link to="/compress" className="inline-link">Compress Images</Link>
          <Link to="/resize" className="inline-link">Resize Images</Link>
          <Link to="/tools" className="inline-link">All Tools</Link>
        </div>
      </section>

      <section className="content-section content-section--text">
        <h2>Format Converters</h2>
        <div className="inline-links">
          {conversionRoutes.map((r) => (
            <Link key={r.path} to={r.path} className="inline-link">
              {r.fromFormat} to {r.toFormat}
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section content-section--text">
        <h2>Guides</h2>
        <div className="inline-links">
          <Link to="/formats" className="inline-link">Image Formats Guide</Link>
          <Link to="/how-to" className="inline-link">How-To Guides</Link>
        </div>
      </section>

      <section className="content-section content-section--text">
        <h2>Blog</h2>
        <div className="inline-links">
          <Link to="/blog" className="inline-link">All Articles</Link>
          {blogPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="inline-link">
              {post.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section content-section--text">
        <h2>Other</h2>
        <div className="inline-links">
          <Link to="/about" className="inline-link">About</Link>
          <Link to="/privacy" className="inline-link">Privacy Policy</Link>
        </div>
      </section>
    </>
  )
}
