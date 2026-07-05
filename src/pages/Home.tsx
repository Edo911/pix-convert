import { SEO } from '../components/SEO'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Converter } from '../components/Converter'
import { Link } from 'react-router-dom'
import { conversionRoutes } from './conversions'
import { getConversionCount } from '../lib/stats'

export function Home() {
  return (
    <>
      <SEO
        title="PixConvert — Free Online Image Converter (HEIC to JPG, PNG, WebP)"
        description="Fast, free, and private online image converter. Convert HEIC to JPG, PNG to JPG, WebP to PNG, AVIF, TIFF, and more. 100% browser-based — no uploads, no signup."
        keywords="free image converter, online image converter, HEIC to JPG, PNG to JPG, JPG to PNG, WebP converter, AVIF converter, TIFF converter, SVG converter, privacy-first image converter"
      />

      <Breadcrumbs items={[{ label: 'Home' }]} />

      <section className="home-hero">
        <h1 className="home-hero__title">Free Online Image Converter</h1>
        <p className="home-hero__subtitle">
          Convert images between any format — HEIC, JPEG, PNG, WebP, AVIF, TIFF, GIF, BMP, SVG, ICO
        </p>
        <p className="social-proof social-proof--hero">✦ {getConversionCount().toLocaleString()} images converted so far — 100% private, no uploads</p>
      </section>

      <Converter />

      <section className="content-section">
        <h2>All Conversion Types</h2>
        <div className="home-links__grid">
          {conversionRoutes.map((c) => (
            <Link key={c.path} to={c.path} className="home-links__item">
              Convert {c.fromFormat} to {c.toFormat} →
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2>Why Use PixConvert?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>100% Private</h3>
            <p>All image conversion happens directly in your browser. Files are never uploaded to any server — your data never leaves your device.</p>
          </div>
          <div className="benefit-card">
            <h3>No Signup Required</h3>
            <p>Start converting immediately. No accounts, no emails, no passwords. Just select your images and convert.</p>
          </div>
          <div className="benefit-card">
            <h3>Works Offline</h3>
            <p>After the page loads once, PixConvert can work without an internet connection. The entire processing engine runs locally.</p>
          </div>
          <div className="benefit-card">
            <h3>Batch Processing</h3>
            <p>Convert multiple images at once. Download them individually or as a ZIP archive. Save time on bulk conversions.</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>Popular Conversions</h2>
        <p>Whether you need to convert iPhone HEIC photos to JPG for sharing, compress PNG images to JPEG for faster loading, or convert modern WebP/AVIF files to universally compatible formats, PixConvert handles it all. Our browser-based converter supports 14 different image format combinations — more than any other free online tool.</p>
        <div className="popular-group">
          <h3>Apple HEIC Conversion</h3>
          <div className="inline-links">
            <Link to="/heic-to-jpg" className="inline-link">HEIC to JPG</Link>
            <Link to="/heic-to-png" className="inline-link">HEIC to PNG</Link>
          </div>
        </div>
        <div className="popular-group">
          <h3>Web Conversion</h3>
          <div className="inline-links">
            <Link to="/png-to-jpg" className="inline-link">PNG to JPG</Link>
            <Link to="/jpg-to-png" className="inline-link">JPG to PNG</Link>
            <Link to="/webp-to-png" className="inline-link">WebP to PNG</Link>
            <Link to="/webp-to-jpg" className="inline-link">WebP to JPG</Link>
          </div>
        </div>
        <div className="popular-group">
          <h3>Next-Gen Formats</h3>
          <div className="inline-links">
            <Link to="/avif-to-png" className="inline-link">AVIF to PNG</Link>
            <Link to="/avif-to-jpg" className="inline-link">AVIF to JPG</Link>
          </div>
        </div>
      </section>
    </>
  )
}
