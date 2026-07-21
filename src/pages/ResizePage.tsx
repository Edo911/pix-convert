import { SEO } from '../components/SEO'
import { Converter } from '../components/Converter'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Link } from 'react-router-dom'

const BASE = 'https://pix-convert-seven.vercel.app'

export function ResizePage() {
  return (
    <>
      <SEO
        title="Free Image Resizer — Resize Photos Online | PixConvert"
        description="Resize images online for free. Scale photos to any dimension — 1920x1080, 1080x1080, custom sizes. Perfect for web, social media, and email. No uploads needed."
        path="/resize"
        keywords="resize image, image resizer, resize photo online, change image size, scale image, resize JPEG, resize PNG, resize WebP"
        ogType="website"
      />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'PixConvert Image Resizer',
          url: `${BASE}/resize`,
          applicationCategory: 'Multimedia',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          description: 'Free online image resizer. Scale photos to any dimension for web, social media, and email.',
        })}
      </script>

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Resize Images' }]} />

      <section className="conversion-hero">
        <h1 className="conversion-hero__title">Resize Images Online — Free & Instant</h1>
        <p className="conversion-hero__desc">
          Resize photos to any dimension. Perfect for Instagram (1080x1080), Facebook (1200x630), Twitter, LinkedIn, and more.
          100% browser-based — no uploads, no signup.
        </p>
      </section>

      <Converter />

      <section className="content-section">
        <h2>Popular Image Sizes for Social Media</h2>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Recommended Size</th>
              <th>Aspect Ratio</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Instagram Post</td><td>1080 x 1080 px</td><td>1:1</td></tr>
            <tr><td>Instagram Story</td><td>1080 x 1920 px</td><td>9:16</td></tr>
            <tr><td>Facebook Post</td><td>1200 x 630 px</td><td>1.91:1</td></tr>
            <tr><td>Twitter/X Post</td><td>1200 x 675 px</td><td>16:9</td></tr>
            <tr><td>LinkedIn Post</td><td>1200 x 627 px</td><td>1.91:1</td></tr>
            <tr><td>YouTube Thumbnail</td><td>1280 x 720 px</td><td>16:9</td></tr>
            <tr><td>Pinterest Pin</td><td>1000 x 1500 px</td><td>2:3</td></tr>
            <tr><td>WhatsApp Profile</td><td>500 x 500 px</td><td>1:1</td></tr>
          </tbody>
        </table>
      </section>

      <section className="content-section content-section--text">
        <h2>How to Resize Images</h2>
        <ul>
          <li><strong>Step 1:</strong> Upload your images by dragging them into the converter</li>
          <li><strong>Step 2:</strong> Enable "Resize image" in the settings panel</li>
          <li><strong>Step 3:</strong> Enter your desired width and/or height in pixels</li>
          <li><strong>Step 4:</strong> Click Convert and download your resized images</li>
        </ul>
        <p>The aspect ratio is preserved automatically. If you only specify width, the height adjusts proportionally, and vice versa.</p>
      </section>

      <section className="content-section related-section">
        <h2>Related Tools</h2>
        <div className="related-grid">
          <Link to="/compress" className="related-link">Compress Images →</Link>
          <Link to="/png-to-jpg" className="related-link">PNG to JPG →</Link>
          <Link to="/webp-to-png" className="related-link">WebP to PNG →</Link>
          <Link to="/avif-to-png" className="related-link">AVIF to PNG →</Link>
        </div>
      </section>
    </>
  )
}
