import { SEO } from '../components/SEO'
import { Breadcrumbs } from '../components/Breadcrumbs'

export function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy — PixConvert"
        description="PixConvert processes all images locally in your browser. We never upload, store, or share your files. Read our privacy policy."
        path="/privacy"
        keywords="PixConvert privacy, browser-based privacy, no upload image converter, private photo converter"
      />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
      <section className="content-section">
        <h1>Privacy Policy</h1>
        <p><strong>Last updated:</strong> July 5, 2026</p>

        <h2>Zero-Knowledge Image Processing</h2>
        <p>PixConvert is a static web application that runs entirely in your browser. We do not operate any servers that receive, process, or store your images. When you use PixConvert, your files are processed locally on your device using WebAssembly and JavaScript — they never leave your computer.</p>

        <h2>No Data Collection</h2>
        <p>We do not collect, transmit, or store any personal information, images, or metadata from our users. There is no analytics service, no tracking pixels, no cookies (except localStorage for your preferences like quality settings), and no backend infrastructure that could access your files.</p>

        <h2>Third-Party Services</h2>
        <p>PixConvert is hosted on Vercel, a cloud platform for static sites. Vercel may collect standard server logs (IP address, request timestamp, page URL) for operational purposes. These logs are not accessible to us and are subject to Vercel's privacy policy.</p>

        <h2>Local Storage</h2>
        <p>We use your browser's localStorage to save your conversion preferences (output format, quality, resize settings). This data never leaves your browser and is used solely to remember your settings between visits. You can clear this data at any time through your browser settings.</p>

        <h2>Children's Privacy</h2>
        <p>PixConvert does not knowingly collect any personal information from children under 13. As we do not collect any data whatsoever, no special provisions are necessary beyond our existing zero-data policy.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.</p>

        <h2>Contact</h2>
        <p>If you have any questions about this privacy policy, please open an issue on our GitHub repository.</p>
      </section>
    </>
  )
}
