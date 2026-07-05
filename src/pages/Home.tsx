import { SEO } from '../components/SEO'
import { Converter } from '../components/Converter'
import { Link } from 'react-router-dom'

const conversions = [
  { path: '/heic-to-jpg', from: 'HEIC', to: 'JPG' },
  { path: '/heic-to-png', from: 'HEIC', to: 'PNG' },
  { path: '/png-to-jpg', from: 'PNG', to: 'JPG' },
  { path: '/jpg-to-png', from: 'JPG', to: 'PNG' },
  { path: '/webp-to-png', from: 'WebP', to: 'PNG' },
  { path: '/webp-to-jpg', from: 'WebP', to: 'JPG' },
  { path: '/avif-to-png', from: 'AVIF', to: 'PNG' },
  { path: '/avif-to-jpg', from: 'AVIF', to: 'JPG' },
  { path: '/tiff-to-png', from: 'TIFF', to: 'PNG' },
  { path: '/tiff-to-jpg', from: 'TIFF', to: 'JPG' },
  { path: '/svg-to-png', from: 'SVG', to: 'PNG' },
  { path: '/gif-to-png', from: 'GIF', to: 'PNG' },
  { path: '/bmp-to-jpg', from: 'BMP', to: 'JPG' },
  { path: '/ico-converter', from: 'Image', to: 'ICO' },
]

export function Home() {
  return (
    <>
      <SEO
        title="PixConvert — Free Online Image Converter (HEIC to JPG, PNG, WebP)"
        description="Fast, free, and private online image converter. Convert HEIC to JPG, PNG to JPG, WebP to PNG, AVIF, TIFF, and more. 100% browser-based — no uploads, no signup."
        keywords="free image converter, online image converter, HEIC to JPG, PNG to JPG, JPG to PNG, WebP converter, AVIF converter, TIFF converter, SVG converter, privacy-first image converter"
      />

      <section className="home-hero">
        <h1 className="home-hero__title">Free Online Image Converter</h1>
        <p className="home-hero__subtitle">
          Convert images between any format — HEIC, JPEG, PNG, WebP, AVIF, TIFF, GIF, BMP, SVG, ICO
        </p>
      </section>

      <Converter />

      <section className="home-links">
        <h2>Popular Conversions</h2>
        <div className="home-links__grid">
          {conversions.map((c) => (
            <Link key={c.path} to={c.path} className="home-links__item">
              Convert {c.from} to {c.to} →
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
