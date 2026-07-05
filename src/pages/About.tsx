import { SEO } from '../components/SEO'
import { Breadcrumbs } from '../components/Breadcrumbs'

export function About() {
  return (
    <>
      <SEO
        title="About PixConvert — Free Private Online Image Converter"
        description="Learn about PixConvert — a 100% browser-based image converter. No uploads, no servers, no signup. Convert HEIC, PNG, JPG, WebP, AVIF, TIFF, GIF, BMP, SVG privately."
        path="/about"
        keywords="about PixConvert, browser image converter, private image converter, free image converter online"
      />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
      <section className="content-section">
        <h1>About PixConvert</h1>
        <p>PixConvert is a free, private, browser-based image converter that processes everything locally on your device. Unlike other online converters that upload your files to a server, PixConvert uses WebAssembly to run the conversion engine directly in your browser.</p>
        <h2>Why We Built PixConvert</h2>
        <p>Most online image converters upload your personal photos to their servers — a privacy risk that most users don't realize. We built PixConvert to prove that image conversion can be fast, free, and completely private. Every conversion happens in your browser using WebAssembly technology, meaning your files never leave your computer.</p>
        <h2>How It Works</h2>
        <p>When you select an image, PixConvert reads it directly in your browser using canvas APIs and WebAssembly-optimized libraries. The conversion process uses the same underlying codecs that power professional image editing software, but compiled to run in your browser. This means you get the same quality as desktop software without installing anything.</p>
        <h2>Supported Formats</h2>
        <p>PixConvert supports 10 image formats and 14 conversion combinations: HEIC, JPEG, PNG, WebP, AVIF, TIFF, GIF, BMP, SVG, and ICO. We're constantly working to add more formats and improve conversion quality.</p>
        <h2>Privacy First</h2>
        <p>PixConvert does not have any servers that process images. There is no backend, no API, no database storing your files. The entire application is a static site hosted on Vercel, and the conversion engine runs in your browser's JavaScript runtime. We cannot see your images, nor do we want to.</p>
      </section>
    </>
  )
}
