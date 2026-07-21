import { SEO } from '../components/SEO'
import { Converter } from '../components/Converter'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Link } from 'react-router-dom'

const BASE = 'https://pix-convert-seven.vercel.app'

export function CompressPage() {
  return (
    <>
      <SEO
        title="Free Image Compressor — Reduce Photo File Size Online | PixConvert"
        description="Compress images online for free. Reduce JPEG, PNG, WebP file sizes by up to 90% without visible quality loss. 100% browser-based — no uploads, no signup."
        path="/compress"
        keywords="compress image, image compressor, reduce file size, compress JPEG, compress PNG, compress WebP, photo compressor online, free image compressor"
        ogType="website"
      />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'PixConvert Image Compressor',
          url: `${BASE}/compress`,
          applicationCategory: 'Multimedia',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          description: 'Free online image compressor. Reduce JPEG, PNG, WebP file sizes by up to 90% without visible quality loss.',
        })}
      </script>

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Compress Images' }]} />

      <section className="conversion-hero">
        <h1 className="conversion-hero__title">Compress Images Online — Free & Private</h1>
        <p className="conversion-hero__desc">
          Reduce image file sizes by up to 90% without visible quality loss. Works with JPEG, PNG, WebP, AVIF, and more.
          100% browser-based — your files never leave your device.
        </p>
      </section>

      <Converter />

      <section className="content-section">
        <h2>Why Compress Your Images?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Faster Websites</h3>
            <p>Smaller images load faster. Compressing your photos can improve page speed by 3-5x, boosting both user experience and Google rankings.</p>
          </div>
          <div className="benefit-card">
            <h3>Save Storage Space</h3>
            <p>A 5 MB photo compressed to 500 KB saves 90% storage. Compress hundreds of photos and reclaim gigabytes of disk space.</p>
          </div>
          <div className="benefit-card">
            <h3>Email Without Limits</h3>
            <p>Most email services limit attachments to 10-25 MB. Compress your images to fit multiple photos in a single email attachment.</p>
          </div>
          <div className="benefit-card">
            <h3>Social Media Ready</h3>
            <p>Upload compressed images to Instagram, Facebook, Twitter, and LinkedIn without platform recompression artifacts.</p>
          </div>
        </div>
      </section>

      <section className="content-section content-section--text">
        <h2>How to Compress Images</h2>
        <p>Compressing images with PixConvert is simple and takes seconds:</p>
        <ul>
          <li><strong>Step 1:</strong> Drag and drop your images or click to select files</li>
          <li><strong>Step 2:</strong> Choose output format (WebP recommended for best compression)</li>
          <li><strong>Step 3:</strong> Adjust the quality slider — 75-85% is ideal for web use</li>
          <li><strong>Step 4:</strong> Click Compress and download your optimized images</li>
        </ul>
        <p>All processing happens in your browser. Your files are never uploaded to any server.</p>
      </section>

      <section className="content-section related-section">
        <h2>Related Tools</h2>
        <div className="related-grid">
          <Link to="/resize" className="related-link">Resize Images →</Link>
          <Link to="/heic-to-jpg" className="related-link">HEIC to JPG →</Link>
          <Link to="/png-to-jpg" className="related-link">PNG to JPG →</Link>
          <Link to="/webp-to-png" className="related-link">WebP to PNG →</Link>
        </div>
      </section>
    </>
  )
}
