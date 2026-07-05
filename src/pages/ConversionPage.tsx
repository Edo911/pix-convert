import { SEO } from '../components/SEO'
import { Converter } from '../components/Converter'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Link } from 'react-router-dom'
import { conversionRoutes } from './conversions'
import type { ConversionRoute } from './conversions'
import { getConversionCount } from '../lib/stats'

interface ConversionPageProps {
  route: ConversionRoute
}

const comparisonData: Record<string, { label: string; jpg: string; png: string; webp: string; heic: string; avif: string; tiff: string; gif: string; bmp: string }> = {
  'HEIC': { label: 'HEIC', jpg: '2-3x smaller', png: '3-5x smaller', webp: 'Similar size', heic: '—', avif: '1.5x larger', tiff: '10-20x smaller', gif: '5-10x smaller', bmp: '20-40x smaller' },
  'JPEG': { label: 'JPEG', jpg: '—', png: '3-10x smaller', webp: '25-35% larger', heic: '2-3x larger', avif: '50% larger', tiff: '5-15x smaller', gif: '2-5x smaller', bmp: '10-30x smaller' },
  'PNG': { label: 'PNG', jpg: '3-10x larger', png: '—', webp: '3-8x larger', heic: '3-5x larger', avif: '3-6x larger', tiff: 'Similar or smaller', gif: '2-4x larger', bmp: '3-8x smaller' },
  'WebP': { label: 'WebP', jpg: '25-35% smaller', png: '3-8x smaller', webp: '—', heic: 'Similar', avif: '20-30% larger', tiff: '8-15x smaller', gif: '1.5-3x smaller', bmp: '15-30x smaller' },
  'AVIF': { label: 'AVIF', jpg: '50% smaller', png: '3-6x smaller', webp: '20-30% smaller', heic: '1.5x smaller', avif: '—', tiff: '10-20x smaller', gif: '3-5x smaller', bmp: '20-40x smaller' },
  'TIFF': { label: 'TIFF', jpg: '5-15x larger', png: 'Similar or larger', webp: '8-15x larger', heic: '10-20x larger', avif: '10-20x larger', tiff: '—', gif: '5-10x larger', bmp: '2-4x smaller' },
  'GIF': { label: 'GIF', jpg: '2-5x larger', png: '2-4x smaller', webp: '1.5-3x larger', heic: '5-10x larger', avif: '3-5x larger', tiff: '5-10x larger', gif: '—', bmp: '5-15x smaller' },
  'BMP': { label: 'BMP', jpg: '10-30x larger', png: '3-8x larger', webp: '15-30x larger', heic: '20-40x larger', avif: '20-40x larger', tiff: '2-4x larger', gif: '5-15x larger', bmp: '—' },
}

const qualityData: Record<string, { compression: string; transparency: string; colors: string; bestFor: string }> = {
  'HEIC': { compression: 'Excellent (HEVC)', transparency: 'No', colors: '16.7M+', bestFor: 'iPhone photos, archiving' },
  'JPEG': { compression: 'Good (DCT)', transparency: 'No', colors: '16.7M', bestFor: 'Photos, web, social media' },
  'PNG': { compression: 'Lossless (DEFLATE)', transparency: 'Yes (alpha)', colors: '16.7M+', bestFor: 'Graphics, screenshots, editing' },
  'WebP': { compression: 'Excellent (VP8L/VP8)', transparency: 'Yes', colors: '16.7M+', bestFor: 'Web performance, modern sites' },
  'AVIF': { compression: 'Best (AV1)', transparency: 'Yes', colors: '16.7M+ (HDR)', bestFor: 'Next-gen web, smallest files' },
  'TIFF': { compression: 'None to good', transparency: 'Yes', colors: '16.7M+ (HDR)', bestFor: 'Professional print, scanning' },
  'GIF': { compression: 'LZW (256 colors)', transparency: 'Yes (binary)', colors: '256 max', bestFor: 'Simple animations, memes' },
  'BMP': { compression: 'None', transparency: 'No', colors: '16.7M', bestFor: 'Legacy Windows apps' },
  'SVG': { compression: 'Vector (XML)', transparency: 'Yes', colors: 'Infinite (vector)', bestFor: 'Icons, logos, illustrations' },
  'ICO': { compression: 'Varies', transparency: 'Yes', colors: '16.7M', bestFor: 'Favicons, Windows icons' },
}

export function ConversionPage({ route }: ConversionPageProps) {
  const related = conversionRoutes
    .filter((r) => r.path !== route.path && (r.fromFormat === route.fromFormat || r.toFormat === route.toFormat))
    .slice(0, 4)

  const howTo = {
    name: `How to Convert ${route.fromFormat} to ${route.toFormat}`,
    steps: [
      { name: `Upload your ${route.fromFormat} file`, text: `Drag and drop or click to select your ${route.fromFormat} image. Supports files up to 50 MB.` },
      { name: 'Adjust settings (optional)', text: `Choose quality, enable resize, or pick a preset for your use case like Web, Instagram, or Avatar.` },
      { name: `Convert to ${route.toFormat}`, text: `Click the Convert button. Processing happens instantly in your browser with no server uploads.` },
      { name: 'Download the result', text: `Preview the converted image side-by-side with the original, then download it to your device.` },
    ],
  }

  const fromQuality = qualityData[route.fromFormat] || qualityData['JPEG']
  const toQuality = qualityData[route.toFormat] || qualityData['PNG']

  return (
    <>
      <SEO
        title={route.title}
        description={route.description}
        path={route.path}
        keywords={route.keywords}
        faq={route.faq}
        howTo={howTo}
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
        <p className="social-proof">✦ {getConversionCount().toLocaleString()} images converted so far — 100% private, no uploads</p>
      </section>

      <Converter fromHint={route.fromFormat} toHint={route.toFormat} />

      <section className="content-section">
        <h2>How to Convert {route.fromFormat} to {route.toFormat} in 4 Simple Steps</h2>
        <div className="steps-grid">
          {howTo.steps.map((step, i) => (
            <div key={i} className="step-card">
              <span className="step-card__number">{i + 1}</span>
              <div>
                <h3 className="step-card__title">{step.name}</h3>
                <p className="step-card__text">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

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

      <section className="content-section content-section--comparison">
        <h2>{route.fromFormat} vs {route.toFormat}: Format Comparison</h2>
        <div className="comparison-tables">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>{route.fromFormat}</th>
                <th>{route.toFormat}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Compression</td>
                <td>{fromQuality.compression}</td>
                <td>{toQuality.compression}</td>
              </tr>
              <tr>
                <td>Transparency</td>
                <td>{fromQuality.transparency}</td>
                <td>{toQuality.transparency}</td>
              </tr>
              <tr>
                <td>Color Depth</td>
                <td>{fromQuality.colors}</td>
                <td>{toQuality.colors}</td>
              </tr>
              <tr>
                <td>Best For</td>
                <td>{fromQuality.bestFor}</td>
                <td>{toQuality.bestFor}</td>
              </tr>
              {comparisonData[route.fromFormat] && comparisonData[route.toFormat] && (
                <tr>
                  <td>File Size Ratio</td>
                  <td>Baseline</td>
                  <td>{comparisonData[route.fromFormat]?.[route.toFormat as keyof typeof comparisonData[string]] as string || 'Varies'}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-section content-section--text" dangerouslySetInnerHTML={{ __html: route.contentHtml }} />

      {route.faq.length > 0 && (
        <section className="content-section faq-section">
          <h2>Frequently Asked Questions</h2>
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
