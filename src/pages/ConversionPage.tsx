import { SEO } from '../components/SEO'
import { Converter } from '../components/Converter'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Link } from 'react-router-dom'
import type { ConversionRoute } from './conversions'
import { conversionRoutes } from './conversions'

interface ConversionPageProps {
  route: ConversionRoute
}

export function ConversionPage({ route }: ConversionPageProps) {
  const related = conversionRoutes
    .filter((r) => r.path !== route.path && (r.fromFormat === route.fromFormat || r.toFormat === route.toFormat))
    .slice(0, 4)

  return (
    <>
      <SEO
        title={route.title}
        description={route.description}
        path={route.path}
        keywords={route.keywords}
        faq={route.faq}
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: route.title.split(' — ')[0] },
        ]}
      />

      <section className="conversion-hero">
        <h1 className="conversion-hero__title">Convert {route.fromFormat} to {route.toFormat} Online</h1>
        <p className="conversion-hero__desc">{route.description}</p>
      </section>

      <Converter fromHint={route.fromFormat} toHint={route.toFormat} />

      {route.benefits.length > 0 && (
        <section className="content-section">
          <h2>Why Convert {route.fromFormat} to {route.toFormat}?</h2>
          <ul className="benefits-list">
            {route.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="content-section" dangerouslySetInnerHTML={{ __html: route.contentHtml }} />

      {route.faq.length > 0 && (
        <section className="content-section faq-section">
          <h2>Frequently Asked Questions About {route.fromFormat} to {route.toFormat} Conversion</h2>
          <div className="faq-list">
            {route.faq.map((item, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-item__question">{item.question}</summary>
                <p className="faq-item__answer">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="content-section related-section">
          <h2>Related Conversions</h2>
          <div className="related-grid">
            {related.map((r) => (
              <Link key={r.path} to={r.path} className="related-link">
                Convert {r.fromFormat} to {r.toFormat} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
