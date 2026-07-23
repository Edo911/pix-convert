import { SEO } from '../components/SEO'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Link } from 'react-router-dom'

const BASE = 'https://pix-convert-seven.vercel.app'

const guides = [
  {
    category: 'HEIC Conversion',
    items: [
      { path: '/heic-to-jpg', title: 'How to Convert HEIC to JPG', desc: 'Turn iPhone HEIC photos into universally compatible JPG files. Works on Windows, Mac, Android, and any browser.' },
      { path: '/heic-to-png', title: 'How to Convert HEIC to PNG', desc: 'Convert HEIC images to lossless PNG format. Preserve quality for editing or design work.' },
    ],
  },
  {
    category: 'Web Format Conversion',
    items: [
      { path: '/png-to-jpg', title: 'How to Convert PNG to JPG', desc: 'Shrink large PNG photos down to manageable JPG sizes without noticeable quality loss.' },
      { path: '/jpg-to-png', title: 'How to Convert JPG to PNG', desc: 'Upgrade JPG images to lossless PNG for editing, screenshots, or graphic design.' },
      { path: '/webp-to-png', title: 'How to Convert WebP to PNG', desc: 'Open WebP images in any editor by converting them to the universally supported PNG format.' },
      { path: '/webp-to-jpg', title: 'How to Convert WebP to JPG', desc: 'Get JPG files from WebP images for wider compatibility with older apps and devices.' },
    ],
  },
  {
    category: 'Next-Gen Format Conversion',
    items: [
      { path: '/avif-to-png', title: 'How to Convert AVIF to PNG', desc: 'Make AVIF images editable by converting them to lossless PNG.' },
      { path: '/avif-to-jpg', title: 'How to Convert AVIF to JPG', desc: 'Turn AVIF files into standard JPG images that work everywhere.' },
    ],
  },
  {
    category: 'Specialized Conversion',
    items: [
      { path: '/tiff-to-png', title: 'How to Convert TIFF to PNG', desc: 'Shrink massive TIFF scans into PNG files while keeping lossless quality.' },
      { path: '/tiff-to-jpg', title: 'How to Convert TIFF to JPG', desc: 'Reduce huge TIFF file sizes to compact JPGs for easier sharing.' },
      { path: '/svg-to-png', title: 'How to Convert SVG to PNG', desc: 'Rasterize vector SVG graphics into PNG images for use in any application.' },
      { path: '/gif-to-png', title: 'How to Convert GIF to PNG', desc: 'Extract individual GIF frames as high-quality PNG files.' },
      { path: '/bmp-to-jpg', title: 'How to Convert BMP to JPG', desc: 'Compress bloated BMP files into lightweight JPG images.' },
      { path: '/ico-converter', title: 'How to Create ICO Files', desc: 'Generate favicon and Windows icon files from any image format.' },
    ],
  },
  {
    category: 'Image Optimization',
    items: [
      { path: '/compress', title: 'How to Compress Images', desc: 'Reduce file sizes by up to 90% without visible quality loss. Works with JPEG, PNG, and WebP.' },
      { path: '/resize', title: 'How to Resize Images', desc: 'Scale images to exact dimensions for web, social media, or print. Maintain aspect ratio.' },
    ],
  },
]

export function HowToPage() {
  return (
    <>
      <SEO
        title="How to Convert Images — Step-by-Step Guides for Every Format | PixConvert"
        description="Step-by-step guides for converting images between HEIC, JPEG, PNG, WebP, AVIF, TIFF, GIF, BMP, SVG, and ICO. Free browser-based tools with no uploads."
        path="/how-to"
        keywords="how to convert images, image conversion guide, HEIC to JPG guide, PNG to JPG tutorial, WebP converter"
      />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Image Conversion Guides',
          description: 'Step-by-step guides for converting images between all popular formats.',
          url: `${BASE}/how-to`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: guides.flatMap((g) =>
              g.items.map((item, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: item.title,
                url: `${BASE}${item.path}`,
                description: item.desc,
              }))
            ),
          },
        })}
      </script>

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'How-To Guides' },
        ]}
      />

      <section className="conversion-hero">
        <h1 className="conversion-hero__title">How to Convert Images</h1>
        <p className="conversion-hero__desc">
          Pick a guide below. Each one walks you through the conversion process step by step — no software to install, everything runs in your browser.
        </p>
      </section>

      {guides.map((group) => (
        <section key={group.category} className="content-section">
          <h2>{group.category}</h2>
          <div className="blog-grid">
            {group.items.map((item) => (
              <Link key={item.path} to={item.path} className="blog-card">
                <h3 className="blog-card__title">{item.title}</h3>
                <p className="blog-card__desc">{item.desc}</p>
                <span className="blog-card__readmore">Start converting →</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="content-section content-section--text">
        <h2>Why Browser-Based Conversion?</h2>
        <p>Most image converters ask you to upload your files to their servers. That raises privacy concerns, especially if you are converting personal photos or sensitive documents. Browser-based tools like PixConvert process everything locally — your files never leave your device. There is no server involved, no account to create, and no data to worry about.</p>
        <p>The trade-off is that browser converters can be a bit slower on very large files (over 20 MB), and they need a modern browser. But for the vast majority of use cases, the convenience and privacy make it the better choice.</p>
      </section>

      <section className="content-section">
        <h2>Related Resources</h2>
        <div className="inline-links">
          <Link to="/formats" className="inline-link">Image Formats Guide →</Link>
          <Link to="/tools" className="inline-link">All Tools →</Link>
          <Link to="/blog" className="inline-link">Blog →</Link>
        </div>
      </section>
    </>
  )
}
