import { SEO } from '../components/SEO'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Link } from 'react-router-dom'
import { conversionRoutes } from './conversions'

const BASE = 'https://pix-convert-seven.vercel.app'

const extraTools = [
  { path: '/compress', label: 'Compress Images', desc: 'Reduce file sizes by up to 90% without quality loss' },
  { path: '/resize', label: 'Resize Images', desc: 'Scale photos to any dimension for web and social media' },
]

export function ToolsPage() {
  return (
    <>
      <SEO
        title="All Image Tools — Free Online Converters, Compressor & Resizer | PixConvert"
        description="Complete suite of free image tools: convert between 10+ formats, compress images, resize photos. 100% private — no uploads, no signup."
        path="/tools"
        keywords="image tools, image converter, image compressor, image resizer, free online image tools, convert images"
        ogType="website"
      />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'PixConvert Image Tools',
          description: 'Free online image tools: convert, compress, and resize images in your browser.',
          url: `${BASE}/tools`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: [
              ...extraTools.map((t, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: t.label,
                url: `${BASE}${t.path}`,
                description: t.desc,
              })),
              ...conversionRoutes.map((r, i) => ({
                '@type': 'ListItem',
                position: extraTools.length + i + 1,
                name: `Convert ${r.fromFormat} to ${r.toFormat}`,
                url: `${BASE}${r.path}`,
                description: r.description,
              })),
            ],
          },
        })}
      </script>

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'All Tools' }]} />

      <section className="conversion-hero">
        <h1 className="conversion-hero__title">All Image Tools</h1>
        <p className="conversion-hero__desc">
          Convert, compress, resize — everything runs in your browser. No uploads, no signup, 100% private.
        </p>
      </section>

      <section className="content-section">
        <h2>Image Utilities</h2>
        <div className="home-links__grid">
          {extraTools.map((tool) => (
            <Link key={tool.path} to={tool.path} className="home-links__item">
              {tool.label} →
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2>Format Converters</h2>
        <div className="home-links__grid">
          {conversionRoutes.map((c) => (
            <Link key={c.path} to={c.path} className="home-links__item">
              Convert {c.fromFormat} to {c.toFormat} →
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
