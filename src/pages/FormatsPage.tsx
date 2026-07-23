import { SEO } from '../components/SEO'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Link } from 'react-router-dom'

const BASE = 'https://pix-convert-seven.vercel.app'

const formats = [
  {
    name: 'HEIC',
    fullName: 'High Efficiency Image Container',
    description: 'Apple\'s default photo format since iOS 11. Uses HEVC compression to cut file sizes roughly in half compared to JPEG, while keeping detail sharp. Great for saving space on iPhones and iPads, but limited support outside the Apple ecosystem.',
    pros: ['Smaller files than JPEG at similar quality', 'Supports 16-bit color depth', 'Can store multiple images (bursts, Live Photos)'],
    cons: ['Does not work on Windows without extra software', 'Limited browser support', 'Harder to share with non-Apple users'],
    bestFor: 'iPhone and iPad users who want to save storage space',
    convertTo: [
      { path: '/heic-to-jpg', label: 'HEIC to JPG' },
      { path: '/heic-to-png', label: 'HEIC to PNG' },
    ],
  },
  {
    name: 'JPEG',
    fullName: 'Joint Photographic Experts Group',
    description: 'The most widely used image format on the internet. JPEG uses lossy compression to shrink file sizes dramatically. It has been the default for digital cameras and phones for over two decades. Every device, browser, and app can open JPEG files.',
    pros: ['Universal compatibility everywhere', 'Small file sizes for photographs', 'Adjustable quality and compression levels'],
    cons: ['No transparency support', 'Quality drops slightly each time you re-save', 'Visible compression artifacts on sharp edges and text'],
    bestFor: 'Sharing photos online, email attachments, social media posts',
    convertTo: [
      { path: '/jpg-to-png', label: 'JPG to PNG' },
    ],
  },
  {
    name: 'PNG',
    fullname: 'Portable Network Graphics',
    description: 'A lossless format that keeps every pixel intact. PNG also supports transparency, making it the go-to choice for graphics, screenshots, and design work. The trade-off is larger file sizes compared to JPEG or WebP.',
    pros: ['Lossless quality — no compression artifacts', 'Full alpha transparency support', 'Great for text, logos, and sharp-edged graphics'],
    cons: ['Much larger files than JPEG or WebP', 'Not ideal for photographs', 'Can be slow to load on the web'],
    bestFor: 'Screenshots, graphic design, logos, images that need transparency',
    convertTo: [
      { path: '/png-to-jpg', label: 'PNG to JPG' },
    ],
  },
  {
    name: 'WebP',
    fullName: 'Web Picture Format',
    description: 'Google created WebP to be a better all-around format for the web. It supports both lossy and lossless compression, transparency, and animation. WebP files are typically 25-35% smaller than JPEG at the same quality, making websites load faster.',
    pros: ['Smaller files than JPEG and PNG', 'Supports transparency and animation', 'Backed by all major browsers since 2020'],
    cons: ['Older software cannot open WebP files', 'Some image editors still lack WebP support', 'Slightly slower encoding than JPEG'],
    bestFor: 'Modern websites, web performance optimization, progressive web apps',
    convertTo: [
      { path: '/webp-to-png', label: 'WebP to PNG' },
      { path: '/webp-to-jpg', label: 'WebP to JPG' },
    ],
  },
  {
    name: 'AVIF',
    fullName: 'AV1 Image File Format',
    description: 'The newest mainstream image format, built on the AV1 video codec. AVIF produces files that are 20-30% smaller than WebP while maintaining excellent quality. It also supports HDR, 10/12-bit color, and transparency. Browser support is growing fast.',
    pros: ['Best compression ratio of any raster format', 'Supports HDR and wide color gamut', 'Open royalty-free standard'],
    cons: ['Slow to encode (processing-intensive)', 'Not yet supported everywhere', 'Fewer editing tools available'],
    bestFor: 'Next-gen web images where file size matters most',
    convertTo: [
      { path: '/avif-to-png', label: 'AVIF to PNG' },
      { path: '/avif-to-jpg', label: 'AVIF to JPG' },
    ],
  },
  {
    name: 'TIFF',
    fullName: 'Tagged Image File Format',
    description: 'A flexible format used in professional photography, printing, and scanning. TIFF supports multiple compression methods, layers, and high bit depths. Files tend to be very large, but the quality is lossless — perfect for archival and prepress work.',
    pros: ['Industry standard for print and scanning', 'Supports layers, tags, and multiple color spaces', 'Lossless preservation of every detail'],
    cons: ['Very large file sizes', 'Not suitable for web use', 'Limited browser and mobile support'],
    bestFor: 'Professional printing, document scanning, photo archiving',
    convertTo: [
      { path: '/tiff-to-png', label: 'TIFF to PNG' },
      { path: '/tiff-to-jpg', label: 'TIFF to JPG' },
    ],
  },
  {
    name: 'GIF',
    fullName: 'Graphics Interchange Format',
    description: 'The classic format for simple animations on the web. GIF uses LZW compression and is limited to 256 colors per frame. Despite its age, GIF remains popular for memes, reaction images, and short looping animations because every platform and browser supports it.',
    pros: ['Universal support for animations', 'Simple and widely recognized', 'Supports basic transparency'],
    cons: ['Only 256 colors per frame', 'Large files for complex animations', 'No true alpha transparency (binary only)'],
    bestFor: 'Short animations, memes, simple graphics with flat colors',
    convertTo: [
      { path: '/gif-to-png', label: 'GIF to PNG' },
    ],
  },
  {
    name: 'BMP',
    fullName: 'Bitmap Image File',
    description: 'One of the oldest digital image formats, originating from Windows. BMP stores pixel data uncompressed, which means files are huge but loading is fast. Very rarely used today outside of legacy Windows applications.',
    pros: ['Simple uncompressed pixel data', 'Fast to load and render', 'Universal Windows support'],
    cons: ['Enormous file sizes', 'No compression or optimization', 'Not practical for web or modern workflows'],
    bestFor: 'Legacy Windows software, raw pixel data access',
    convertTo: [
      { path: '/bmp-to-jpg', label: 'BMP to JPG' },
    ],
  },
  {
    name: 'SVG',
    fullName: 'Scalable Vector Graphics',
    description: 'A vector format based on XML that describes shapes, paths, and colors mathematically. SVGs can be scaled to any size without losing quality. They are tiny in file size and perfect for icons, logos, and illustrations that need to look crisp at every resolution.',
    pros: ['Infinite scaling without quality loss', 'Tiny file sizes for simple graphics', 'Editable as text (XML)', 'Searchable and animatable'],
    cons: ['Not suitable for photographs', 'Complex SVGs can be slow to render', 'Security risks from embedded scripts'],
    bestFor: 'Icons, logos, charts, illustrations, UI elements',
    convertTo: [
      { path: '/svg-to-png', label: 'SVG to PNG' },
    ],
  },
  {
    name: 'ICO',
    fullName: 'Icon File Format',
    description: 'The standard format for Windows icons and browser favicons. ICO files can contain multiple sizes of the same image (16×16, 32×32, 48×48, etc.) so the OS or browser can pick the right one for the context.',
    pros: ['Multiple sizes in one file', 'Native Windows icon format', 'Required for browser favicons'],
    cons: ['Limited to icon use cases', 'Not a general-purpose image format', 'Older format with limited features'],
    bestFor: 'Favicons, desktop icons, Windows application icons',
    convertTo: [
      { path: '/ico-converter', label: 'ICO Converter' },
    ],
  },
]

export function FormatsPage() {
  return (
    <>
      <SEO
        title="Image Formats Explained — HEIC, JPEG, PNG, WebP, AVIF, TIFF, GIF | PixConvert"
        description="Complete guide to image formats. Understand the differences between HEIC, JPEG, PNG, WebP, AVIF, TIFF, GIF, BMP, SVG, and ICO. Find the right format for your needs."
        path="/formats"
        keywords="image formats explained, HEIC vs JPEG, PNG vs WebP, AVIF format, image format comparison, best image format"
      />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Image Formats Guide',
          description: 'Comprehensive guide to all major image formats with comparisons and conversion tools.',
          url: `${BASE}/formats`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: formats.map((f, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: f.name,
              description: f.description.split('.')[0] + '.',
            })),
          },
        })}
      </script>

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Image Formats' },
        ]}
      />

      <section className="conversion-hero">
        <h1 className="conversion-hero__title">Image Formats Explained</h1>
        <p className="conversion-hero__desc">
          Not sure which image format to use? Here is a plain breakdown of every major format — what it does well, where it falls short, and when you should pick it.
        </p>
      </section>

      <section className="content-section">
        <div className="home-links__grid">
          {formats.map((f) => (
            <a key={f.name} href={`#format-${f.name.toLowerCase()}`} className="home-links__item">
              {f.name} — {f.fullName}
            </a>
          ))}
        </div>
      </section>

      {formats.map((f) => (
        <section key={f.name} id={`format-${f.name.toLowerCase()}`} className="content-section content-section--text">
          <h2>{f.name} ({f.fullName})</h2>
          <p>{f.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', margin: '1rem 0' }}>
            <div>
              <h3>Advantages</h3>
              <ul>
                {f.pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Drawbacks</h3>
              <ul>
                {f.cons.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          <p><strong>Best for:</strong> {f.bestFor}</p>

          {f.convertTo.length > 0 && (
            <div className="inline-links" style={{ marginTop: '0.75rem' }}>
              {f.convertTo.map((c) => (
                <Link key={c.path} to={c.path} className="inline-link">
                  {c.label} →
                </Link>
              ))}
            </div>
          )}
        </section>
      ))}

      <section className="content-section content-section--text">
        <h2>How to Pick the Right Format</h2>
        <p>Here is a quick decision guide if you are not sure what to choose:</p>
        <ul>
          <li><strong>Sharing a photo with someone?</strong> Use JPEG. It works everywhere and the file stays small.</li>
          <li><strong>Need transparency or crisp edges?</strong> PNG is your best bet for graphics and screenshots.</li>
          <li><strong>Building a website and want fast load times?</strong> WebP gives you the best balance of size and quality for modern browsers.</li>
          <li><strong>Want the smallest possible file size?</strong> AVIF pushes compression further than anything else right now.</li>
          <li><strong>Printing professionally or archiving?</strong> TIFF preserves everything at the cost of large files.</li>
          <li><strong>Making a quick animation?</strong> GIF is still the simplest way to share looping clips.</li>
          <li><strong>Designing an icon or logo?</strong> SVG scales perfectly and stays tiny.</li>
        </ul>
        <p>Whichever format you start with, you can always convert it to something else with PixConvert — right in your browser, no uploads needed.</p>
      </section>

      <section className="content-section">
        <h2>Related Conversions</h2>
        <div className="home-links__grid">
          <Link to="/heic-to-jpg" className="home-links__item">HEIC to JPG →</Link>
          <Link to="/png-to-jpg" className="home-links__item">PNG to JPG →</Link>
          <Link to="/webp-to-png" className="home-links__item">WebP to PNG →</Link>
          <Link to="/avif-to-png" className="home-links__item">AVIF to PNG →</Link>
          <Link to="/tools" className="home-links__item">All Tools →</Link>
        </div>
      </section>
    </>
  )
}
