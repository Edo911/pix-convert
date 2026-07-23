import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')
const BASE = 'https://pix-convert-seven.vercel.app'

// Read original build HTML (not previously pre-rendered)
const srcHtml = readFileSync(join(DIST, 'index.html'), 'utf-8')

// Strip any previously injected prerender tags by removing everything
// from the last <style or <link> before </head> (i.e. the injected block)
function cleanBase(html) {
  // Remove only the <link rel="alternate"> tags injected by the source index.html,
  // preserving Vite-injected assets (script, modulepreload, stylesheet) that appear after them.
  return html.replace(/<link rel="alternate"[^>]*>\n?/g, '')
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function replaceOrAdd(html, tag, attrRegex, content) {
  const regex = new RegExp(`<${tag}[^>]*${attrRegex}[^>]*>`, 'i')
  if (regex.test(html)) {
    return html.replace(regex, content)
  }
  return html.replace('</head>', `${content}\n</head>`)
}

function replaceMeta(html, attr, value) {
  const escVal = esc(value)
  const tag = `<meta ${attr} content="${escVal}" />`
  const escapedAttr = attr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`<meta[^>]*${escapedAttr}[^>]*>`, 'i')
  if (regex.test(html)) {
    return html.replace(regex, tag)
  }
  return html.replace('</head>', `  ${tag}\n</head>`)
}

function buildPage(route) {
  const url = `${BASE}${route.path}`
  const image = route.ogImage || `${BASE}/og-image.svg`
  const ogType = route.ogType || (route.path.startsWith('/blog/') ? 'article' : 'website')
  let html = cleanBase(srcHtml)

  // Title
  html = html.replace(/<title>.*?<\/title>/, `<title>${esc(route.title)}</title>`)

  // Meta description
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${esc(route.description)}" />`
  )

  // Canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${esc(url)}" />`
  )

  // OG tags
  html = replaceMeta(html, 'property="og:url"', url)
  html = replaceMeta(html, 'property="og:type"', ogType)
  html = replaceMeta(html, 'property="og:title"', route.title)
  html = replaceMeta(html, 'property="og:description"', route.description)
  html = replaceMeta(html, 'property="og:image"', image)
  html = replaceMeta(html, 'property="og:image:width"', '1200')
  html = replaceMeta(html, 'property="og:image:height"', '630')

  // Twitter tags
  html = replaceMeta(html, 'name="twitter:card"', 'summary_large_image')
  html = replaceMeta(html, 'name="twitter:title"', route.title)
  html = replaceMeta(html, 'name="twitter:description"', route.description)
  html = replaceMeta(html, 'name="twitter:image"', image)

  // Article-specific tags
  if (route.articlePublished) {
    html = replaceMeta(html, 'property="article:published_time"', route.articlePublished)
  }
  if (route.articleModified) {
    html = replaceMeta(html, 'property="article:modified_time"', route.articleModified)
  }
  if (route.articleAuthor) {
    html = replaceMeta(html, 'property="article:author"', route.articleAuthor)
  }

  // Structured data — BreadcrumbList
  if (route.path && route.path !== '/') {
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        {
          '@type': 'ListItem',
          position: 2,
          name: route.title.split(' — ')[0].split(': ')[0].split(' | ')[0],
          item: url,
        },
      ],
    }
    const tag = `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`
    // Insert before </head>
    html = html.replace('</head>', `  ${tag}\n</head>`)
  }

  // Structured data — Article schema for blog posts
  if (route.path && route.path.startsWith('/blog/') && route.articlePublished) {
    const article = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: route.title,
      description: route.description,
      datePublished: route.articlePublished,
      dateModified: route.articleModified || route.articlePublished,
      author: {
        '@type': 'Person',
        name: route.articleAuthor || 'PixConvert Team',
      },
      publisher: {
        '@type': 'Organization',
        name: 'PixConvert',
        logo: {
          '@type': 'ImageObject',
          url: `${BASE}/favicon.svg`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      image: route.ogImage || `${BASE}/og-image.svg`,
    }
    const tag = `<script type="application/ld+json">${JSON.stringify(article)}</script>`
    html = html.replace('</head>', `  ${tag}\n</head>`)
  }

  // Structured data — FAQPage for conversion pages with FAQ
  if (route.faq && route.faq.length > 0) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: route.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }
    const tag = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`
    html = html.replace('</head>', `  ${tag}\n</head>`)
  }

  // Noscript fallback for crawlers
  if (route.noscript) {
    const noscript = `<noscript><div style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif"><h1>${esc(route.title)}</h1><p>${esc(route.description)}</p>${route.noscript}</div></noscript>`
    html = html.replace('<noscript>', `${noscript}<!--`)
    html = html.replace('</noscript>', '--></noscript>')
  }

  const dir = join(DIST, route.path === '/' ? '' : route.path)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}

const conversionMeta = [
  { path: '/heic-to-jpg', title: 'Free HEIC to JPG Converter Online — Convert HEIC/HEIF to JPEG', description: 'Convert HEIC and HEIF photos to JPG format online for free. 100% browser-based — no uploads, no servers. Supports iPhone HEIC images from iOS 11 and later.', faq: [
    { question: 'Why can\'t I open HEIC photos on my computer?', answer: 'HEIC is a proprietary format developed by Apple. Windows and most Android devices do not have built-in HEIC support. Converting to JPG solves this compatibility issue instantly.' },
    { question: 'Does converting HEIC to JPG reduce quality?', answer: 'JPEG uses lossy compression, so there is a minor reduction in technical quality. However, at high quality settings (90%+), the visual difference is negligible while gaining universal compatibility.' },
    { question: 'Can I convert multiple HEIC files at once?', answer: 'Yes. Drag and drop or select multiple HEIC images. PixConvert converts them all in batch and lets you download a ZIP archive with all converted files.' },
    { question: 'Are my HEIC photos uploaded to a server?', answer: 'No. All conversion happens entirely in your browser using WebAssembly. Your files never leave your device — 100% privacy and security.' },
  ] },
  { path: '/heic-to-png', title: 'Free HEIC to PNG Converter Online — Convert HEIC/HEIF to PNG', description: 'Convert HEIC and HEIF images to PNG format instantly in your browser. Preserve transparency. No file uploads, no signup, completely free.', faq: [
    { question: 'Why convert HEIC to PNG instead of JPG?', answer: 'PNG offers lossless compression and supports transparency. Choose PNG when you need to edit images further, need transparent backgrounds, or want to preserve every pixel without quality loss.' },
    { question: 'Will the PNG file be larger than the original HEIC?', answer: 'Yes. PNG files are typically 2-5x larger than HEIC because PNG uses lossless compression while HEIC uses highly efficient HEVC video compression.' },
    { question: 'Can I convert HEIC to PNG on my phone?', answer: 'Yes. PixConvert works in any modern browser on any device — desktop, tablet, or phone. Just open the page and select your HEIC files.' },
  ] },
  { path: '/png-to-jpg', title: 'Free PNG to JPG Converter Online — Convert PNG to JPEG', description: 'Convert PNG images to JPG format online for free. Reduce file size while maintaining quality. Browser-based processing — your files stay private.', faq: [
    { question: 'Do I lose quality converting PNG to JPG?', answer: 'JPEG uses lossy compression, so there is a trade-off. At quality settings above 80%, the visual difference is barely noticeable while file size drops dramatically.' },
    { question: 'What happens to transparency when converting PNG to JPG?', answer: 'JPEG does not support transparency. Transparent areas will be filled with white during conversion. If you need transparency, keep the image in PNG format.' },
    { question: 'What quality setting should I use?', answer: 'For web use, 80-85% quality offers an excellent balance of small file size and good visual quality. For archiving, use 90-95%.' },
  ] },
  { path: '/jpg-to-png', title: 'Free JPG to PNG Converter Online — Convert JPEG to PNG', description: 'Convert JPG images to PNG format online for free. Preserve transparency and lossless quality. 100% private browser-based conversion.', faq: [
    { question: 'Will a PNG be larger than the original JPG?', answer: 'Yes. PNG files are typically 3-10x larger than JPG because PNG uses lossless compression. The trade-off is perfect quality for editing.' },
    { question: 'Can I make the background transparent after converting?', answer: 'This converter changes the format to PNG, which supports transparency. However, it does not automatically remove backgrounds — use an image editor for that.' },
    { question: 'Is PNG better than JPG for printing?', answer: 'For printing, PNG is generally better as it preserves full quality without compression artifacts. TIFF is even better for professional print work if available.' },
  ] },
  { path: '/webp-to-png', title: 'Free WebP to PNG Converter Online — Convert WebP to PNG', description: 'Convert WebP images to PNG format online for free. Perfect for using WebP images in apps and editors that don\'t support WebP. No uploads needed.', faq: [
    { question: 'Why do I need to convert WebP to PNG?', answer: 'Some image editors and legacy applications cannot open WebP files. Converting to PNG gives you a universally compatible lossless image.' },
    { question: 'Will the PNG file be larger than the WebP?', answer: 'Yes, typically 3-8x larger. PNG uses lossless compression while WebP uses highly efficient compression algorithms.' },
    { question: 'Does this work with animated WebP files?', answer: 'This converter handles static WebP images. For animated WebP, the first frame is extracted and converted to PNG.' },
  ] },
  { path: '/webp-to-jpg', title: 'Free WebP to JPG Converter Online — Convert WebP to JPEG', description: 'Convert WebP images to JPG format instantly in your browser. Reduce file size while maintaining compatibility. Free, fast, and private.', faq: [
    { question: 'Why convert WebP to JPG?', answer: 'While WebP offers better compression, JPG remains universally compatible. Convert when you need to share with systems that don\'t support WebP.' },
    { question: 'What quality should I use for WebP to JPG?', answer: 'Since WebP is already compressed, use 85-95% quality to minimize additional quality loss during the conversion.' },
    { question: 'Is WebP better than JPG?', answer: 'WebP typically produces 25-35% smaller files than JPG at similar quality. However, JPG has broader compatibility across older software and devices.' },
  ] },
  { path: '/avif-to-png', title: 'Free AVIF to PNG Converter Online — Convert AVIF to PNG', description: 'Convert AVIF images to PNG format online for free. AVIF is the next-gen image format — make it compatible with any app. Browser-based processing.', faq: [
    { question: 'Why is my AVIF file not opening?', answer: 'AVIF is a relatively new format. Many image viewers and editors don\'t support it yet. Converting to PNG ensures compatibility with any software.' },
    { question: 'Will converting AVIF to PNG increase file size?', answer: 'Yes, significantly. AVIF uses advanced AV1 compression that produces much smaller files than lossless PNG. The PNG will be 3-6x larger.' },
    { question: 'Can I convert AVIF to PNG for printing?', answer: 'Yes. PNG preserves the full quality of the AVIF image, making it suitable for printing. For professional print work, consider TIFF format.' },
  ] },
  { path: '/avif-to-jpg', title: 'Free AVIF to JPG Converter Online — Convert AVIF to JPEG', description: 'Convert AVIF images to JPG format instantly. Make AVIF files compatible with all platforms. Private browser-based conversion, no uploads.', faq: [
    { question: 'Why convert AVIF to JPG?', answer: 'AVIF offers superior compression but limited compatibility. JPG works everywhere — on any device, browser, and application.' },
    { question: 'What quality setting for AVIF to JPG?', answer: 'Use 85-95% quality. Since AVIF is already highly compressed, this range minimizes additional quality loss while gaining JPG compatibility.' },
    { question: 'Is AVIF better than JPG?', answer: 'AVIF produces 50% smaller files than JPG at similar quality. However, JPG has universal support while AVIF is still gaining adoption.' },
  ] },
  { path: '/tiff-to-png', title: 'Free TIFF to PNG Converter Online — Convert TIFF to PNG', description: 'Convert TIFF images to PNG format online for free. Perfect for scanned documents and high-resolution photos. 100% private browser conversion.', faq: [
    { question: 'Why convert TIFF to PNG?', answer: 'TIFF files are very large and not web-friendly. PNG offers lossless quality with better compression and universal web support.' },
    { question: 'Will the PNG be smaller than the TIFF?', answer: 'Yes. PNG typically produces files 2-4x smaller than TIFF while maintaining lossless quality through more efficient compression.' },
    { question: 'Is PNG good for scanned documents?', answer: 'Yes. PNG preserves text clarity and sharp edges, making it ideal for scanned documents, receipts, and OCR processing.' },
  ] },
  { path: '/tiff-to-jpg', title: 'Free TIFF to JPG Converter Online — Convert TIFF to JPEG', description: 'Convert TIFF images to JPG format instantly in your browser. Reduce massive TIFF file sizes while maintaining good quality. No uploads, no signup.', faq: [
    { question: 'Why convert TIFF to JPG?', answer: 'TIFF files can be 10-50 MB each. Converting to JPG reduces them to 500 KB-2 MB while maintaining good visual quality for sharing and web use.' },
    { question: 'What quality for TIFF to JPG?', answer: 'Use 85-92% quality for the best balance. This typically reduces file size by 90%+ while keeping the image visually identical.' },
    { question: 'Is TIFF better than JPG?', answer: 'TIFF offers lossless quality and is preferred for professional print work. JPG offers much smaller files and universal compatibility for everyday use.' },
  ] },
  { path: '/svg-to-png', title: 'Free SVG to PNG Converter Online — Convert SVG to PNG', description: 'Convert SVG vector graphics to PNG raster images online for free. Perfect for using icons and logos in any application. Browser-based conversion.', faq: [
    { question: 'Why convert SVG to PNG?', answer: 'SVG is vector-based and scales infinitely, but not all applications support it. Converting to PNG gives you a raster image that works everywhere.' },
    { question: 'What size should I export the PNG?', answer: 'Choose a size based on your use case: 64px for favicons, 256px for icons, 512px for web graphics, or 1024px+ for high-resolution displays.' },
    { question: 'Will the PNG lose quality compared to SVG?', answer: 'PNG is raster-based, so it won\'t scale infinitely like SVG. At the chosen export size, the PNG will look crisp and sharp.' },
  ] },
  { path: '/gif-to-png', title: 'Free GIF to PNG Converter Online — Convert GIF to PNG', description: 'Convert GIF frames to PNG images online for free. Extract and convert GIF frames to high-quality PNGs. Private browser-based processing.', faq: [
    { question: 'Does this extract all GIF frames?', answer: 'Yes. For animated GIFs, each frame is extracted and converted to a separate PNG file. You can download them individually or as a ZIP.' },
    { question: 'Why convert GIF to PNG?', answer: 'PNG offers better color depth (16.7M vs 256 colors) and lossless quality. Converting static GIFs to PNG can improve visual quality.' },
    { question: 'Will the PNG be animated?', answer: 'No. PNG does not support animation. Each GIF frame becomes a separate static PNG file. For animated PNGs, look for APNG format support.' },
  ] },
  { path: '/bmp-to-jpg', title: 'Free BMP to JPG Converter Online — Convert BMP to JPEG', description: 'Convert BMP images to JPG format online for free. Drastically reduce BMP file sizes while maintaining visual quality. No uploads, completely private.', faq: [
    { question: 'Why are BMP files so large?', answer: 'BMP stores pixel data uncompressed. A single 4000x3000 BMP can be 36 MB. Converting to JPG reduces this to under 1 MB.' },
    { question: 'Is BMP still used?', answer: 'BMP is rarely used today outside of legacy Windows applications. Most modern workflows use JPEG, PNG, or WebP instead.' },
    { question: 'What quality for BMP to JPG?', answer: 'Use 85-92% quality. Since BMP is uncompressed, you have full control over the output quality and file size balance.' },
  ] },
  { path: '/ico-converter', title: 'Free ICO Converter Online — Convert Images to ICO Format', description: 'Convert PNG, JPG, and other images to ICO format for favicons and app icons. Create Windows icon files directly in your browser. Free and private.', faq: [
    { question: 'What sizes should my ICO file contain?', answer: 'Standard ICO files include 16x16, 32x32, 48x48, and 64x64 pixels. For favicons, 16x16 and 32x32 are essential.' },
    { question: 'Can I convert JPG to ICO?', answer: 'Yes. PixConvert accepts JPG, PNG, and other image formats as input for ICO conversion. PNG input is recommended for best quality.' },
    { question: 'How do I use the ICO file as a favicon?', answer: 'Upload the ICO file to your website root directory and add this to your HTML head: <link rel="icon" type="image/x-icon" href="/favicon.ico">' },
  ] },
]

const blogMeta = [
  { path: '/blog/heic-vs-jpg-complete-guide', title: 'HEIC vs JPG: Complete Comparison Guide 2026', description: 'Detailed comparison of HEIC and JPEG image formats. Learn about file size, quality, compatibility, and when to use each format.', date: '2026-06-15', author: 'Alex Martinez' },
  { path: '/blog/how-to-convert-heic-to-jpg-on-windows', title: 'How to Convert HEIC to JPG on Windows 10 and 11', description: 'Step-by-step guide to convert iPhone HEIC photos to JPG on Windows. Free methods including browser tools, Windows Photos app, and more.', date: '2026-06-12', author: 'Sarah Chen' },
  { path: '/blog/png-vs-jpg-best-for-web', title: 'PNG vs JPG: Which Image Format Is Best for Your Website?', description: 'Learn when to use PNG vs JPEG for web images. Performance tips, quality comparison, and SEO implications of image format choice.', date: '2026-06-10', author: 'Alex Martinez' },
  { path: '/blog/what-is-avif-format', title: 'What Is AVIF? The Next-Gen Image Format Explained', description: 'Everything you need to know about AVIF: the most advanced image format. Learn about compression, browser support, and how to use AVIF today.', date: '2026-06-08', author: 'Alex Martinez' },
  { path: '/blog/webp-vs-png-vs-jpg', title: 'WebP vs PNG vs JPG: Which Format Should You Use?', description: 'Head-to-head comparison of WebP, PNG, and JPEG. File sizes, quality, browser support, and recommendations for every use case.', date: '2026-06-05', author: 'Sarah Chen' },
  { path: '/blog/heic-to-jpg-on-mac', title: 'How to Convert HEIC to JPG on Mac: 4 Easy Methods', description: 'Convert iPhone HEIC photos to JPG on Mac automatically or manually. Includes built-in Mac tools and our free online converter.', date: '2026-06-03', author: 'Sarah Chen' },
  { path: '/blog/lossless-vs-lossy-image-compression', title: 'Lossless vs Lossy Image Compression: Complete Guide', description: 'Understand the difference between lossless and lossy compression. When to use each type and how it affects image quality.', date: '2026-06-01', author: 'Alex Martinez' },
  { path: '/blog/best-image-format-for-social-media', title: 'Best Image Format for Social Media in 2026: Complete Guide', description: 'Optimize your images for Instagram, Facebook, Twitter, LinkedIn, and TikTok. Recommended formats, sizes, and compression tips.', date: '2026-05-28', author: 'Sarah Chen' },
  { path: '/blog/how-to-open-heic-files-on-android', title: 'How to Open HEIC Files on Android: Complete Guide', description: 'Can Android open HEIC photos? Learn how to view and convert iPhone HEIC images on Samsung, Google Pixel, and other Android devices.', date: '2026-05-25', author: 'Sarah Chen' },
  { path: '/blog/tiff-vs-png-vs-jpeg-scanning', title: 'TIFF vs PNG vs JPEG: Best Format for Scanning Documents', description: 'Which image format is best for document scanning? Compare TIFF, PNG, and JPEG for scans, OCR, and archival purposes.', date: '2026-05-22', author: 'Alex Martinez' },
  { path: '/blog/svg-vs-png-web-design', title: 'SVG vs PNG for Web Design: When to Use Each', description: 'SVG vector vs PNG raster: which format works best for icons, logos, illustrations, and images on the modern web.', date: '2026-05-18', author: 'Alex Martinez' },
  { path: '/blog/gif-vs-png-vs-webp-animation', title: 'GIF vs PNG vs WebP for Animations: Which Is Best?', description: 'Compare GIF, animated PNG (APNG), and animated WebP for creating and sharing animations on the web and social media.', date: '2026-05-15', author: 'Sarah Chen' },
  { path: '/blog/how-to-convert-avif-to-jpg', title: 'How to Convert AVIF to JPG: Complete Guide for 2026', description: 'Learn how to convert AVIF images to JPG online for free. Step-by-step guide covering browser-based conversion, quality tips, and compatibility advice.', date: '2026-06-28', author: 'Elena Torres' },
  { path: '/blog/how-to-convert-tiff-to-jpg', title: 'How to Convert TIFF to JPG: Step-by-Step Guide', description: 'Convert TIFF files to JPG format online for free. Learn how to reduce huge TIFF scans to compact JPEG files while maintaining quality.', date: '2026-06-20', author: 'Alex Martinez' },
  { path: '/blog/how-to-convert-svg-to-png', title: 'How to Convert SVG to PNG: Convert Vectors to Raster Images', description: 'Free online SVG to PNG converter. Learn how to convert scalable vector graphics to raster PNG images for web design and social media.', date: '2026-06-15', author: 'Elena Torres' },
  { path: '/blog/how-to-convert-gif-to-png', title: 'How to Convert GIF to PNG: Free Online Guide', description: 'Convert GIF frames to PNG images for higher quality, smaller file sizes, and better color depth. Free browser-based conversion with no uploads.', date: '2026-06-10', author: 'Sarah Chen' },
  { path: '/blog/how-to-convert-ico-to-png', title: 'How to Convert ICO to PNG: Guide for Favicon Conversion', description: 'Convert ICO favicon files to PNG format for use in modern web design. Free online converter with no uploads needed.', date: '2026-06-05', author: 'Marcus Webb' },
  { path: '/blog/how-to-convert-bmp-to-jpg', title: 'How to Convert BMP to JPG: Free Online Guide', description: 'Convert BMP bitmap images to compressed JPG format online. Reduce Windows BMP files by up to 95% while maintaining visual quality.', date: '2026-05-28', author: 'Alex Martinez' },
  { path: '/blog/avif-vs-webp-comparison', title: 'AVIF vs WebP: Which Next-Gen Image Format Is Better?', description: 'Compare AVIF and WebP image formats for file size, quality, browser support, and practical use. Which next-gen format should you choose in 2026?', date: '2026-05-20', author: 'Sarah Chen' },
  { path: '/blog/image-format-compatibility-2026', title: 'Image Format Compatibility Guide for 2026: Browser Support Overview', description: 'Complete compatibility guide for all major image formats in 2026. Check browser support for JPEG, PNG, WebP, AVIF, HEIC, GIF, and SVG.', date: '2026-05-15', author: 'Elena Torres' },
  { path: '/blog/best-image-format-website-speed', title: 'Best Image Format for Website Speed: Performance Guide', description: 'Learn which image format gives the fastest page load times. Compare JPEG, PNG, WebP, AVIF, and SVG for web performance in 2026.', date: '2026-05-10', author: 'Marcus Webb' },
  { path: '/blog/privacy-friendly-online-converter', title: 'Privacy-Friendly Image Conversion: Why Browser-Based Tools Are Safer', description: 'Learn why browser-based image converters protect your privacy. No uploads, no servers, no data collection — your files never leave your device.', date: '2026-05-05', author: 'Elena Torres' },
  { path: '/blog/webp-vs-jpg-vs-png-vs-gif', title: 'WebP vs JPEG vs PNG vs GIF: Complete Image Format Comparison', description: 'Definitive comparison of the four most popular image formats. Learn when to use each format for optimal quality, file size, and compatibility.', date: '2026-04-28', author: 'Alex Martinez' },
  { path: '/blog/how-to-batch-convert-images-online', title: 'How to Batch Convert Images Online: Complete Guide', description: 'Learn how to batch convert multiple images at once. Convert dozens of files between formats simultaneously with a free browser-based tool.', date: '2026-04-20', author: 'Marcus Webb' },
  { path: '/blog/image-compression-webp-vs-jpeg-quality', title: 'Image Compression: WebP vs JPEG Quality at Different Settings', description: 'Detailed comparison of WebP vs JPEG image quality at various compression levels. Find the optimal quality setting for your use case.', date: '2026-04-15', author: 'Sarah Chen' },
  { path: '/blog/png-vs-svg-web-design', title: 'PNG vs SVG for Web Design: Choosing the Right Format', description: 'Compare PNG and SVG for web design projects. Learn when to use raster vs vector graphics for icons, logos, illustrations, and UI elements.', date: '2026-04-10', author: 'Elena Torres' },
  { path: '/blog/how-to-compress-images-for-web', title: 'How to Compress Images for Web: Complete Guide 2026', description: 'Learn how to compress images for faster websites. Compare JPEG, WebP, and AVIF compression. Reduce file sizes by up to 90% without quality loss.', date: '2026-07-10', author: 'Alex Martinez' },
  { path: '/blog/how-to-convert-heic-to-jpg-on-iphone', title: 'How to Convert HEIC to JPG on iPhone: Quick Guide', description: 'Convert HEIC photos to JPG directly on your iPhone. Free methods including browser tools and iOS shortcuts — no app installation needed.', date: '2026-07-08', author: 'Sarah Chen' },
  { path: '/blog/best-image-format-for-wordpress', title: 'Best Image Format for WordPress: Speed & SEO Guide', description: 'Optimize images for WordPress websites. Compare JPEG, PNG, WebP, and AVIF for WordPress. Improve Core Web Vitals and page speed.', date: '2026-07-05', author: 'Marcus Webb' },
  { path: '/blog/how-to-reduce-image-size-for-email', title: 'How to Reduce Image Size for Email Attachments', description: 'Make images small enough for email. Reduce photo file sizes for Gmail, Outlook, and other email services. Free online tool included.', date: '2026-07-01', author: 'Elena Torres' },
  { path: '/blog/how-to-convert-png-to-jpg-without-losing-quality', title: 'How to Convert PNG to JPG Without Losing Quality', description: 'Convert PNG to JPG while maintaining visual quality. Learn the optimal quality settings and when to use each format. Free online converter.', date: '2026-06-28', author: 'Alex Martinez' },
  { path: '/blog/how-to-convert-heic-to-jpg-on-android-phone', title: 'How to Convert HEIC to JPG on Android Phone', description: 'Open and convert iPhone HEIC photos on Android. Free methods for Samsung, Pixel, and other Android devices — no apps needed.', date: '2026-06-25', author: 'Sarah Chen' },
  { path: '/blog/image-compression-for-seo-2026', title: 'Image Compression for SEO: 2026 Complete Guide', description: 'How image compression affects Google rankings. Optimize images for Core Web Vitals, LCP, and SEO. Practical tips with file size benchmarks.', date: '2026-06-22', author: 'Alex Martinez' },
  { path: '/blog/webp-vs-jpeg-quality-comparison', title: 'WebP vs JPEG Quality: Which Looks Better at Same Size?', description: 'Direct quality comparison of WebP and JPEG at various compression levels. See which format delivers better visual quality at identical file sizes.', date: '2026-06-18', author: 'Sarah Chen' },
  { path: '/blog/how-to-make-picture-smaller', title: 'How to Make a Picture Smaller: 5 Easy Methods', description: 'Make photo file sizes smaller without losing quality. Learn to compress, resize, and optimize images. Free online tool included.', date: '2026-06-14', author: 'Elena Torres' },
  { path: '/blog/how-to-convert-webp-to-jpg-on-any-device', title: 'How to Convert WebP to JPG on Any Device: Complete Guide', description: 'Convert WebP images to JPG on Windows, Mac, iPhone, and Android. Free methods including browser tools and built-in software.', date: '2026-06-10', author: 'Marcus Webb' },
  { path: '/blog/avif-to-jpg-on-any-browser', title: 'How to Convert AVIF to JPG in Any Browser (2026)', description: 'Convert AVIF images to JPG online for free. Works in Chrome, Firefox, Safari, and Edge. No software needed — process files in your browser.', date: '2026-06-05', author: 'Sarah Chen' },
  { path: '/blog/how-to-convert-canvas-to-image', title: 'How to Convert HTML Canvas to Image (PNG, JPEG, WebP)', description: 'Export HTML Canvas elements as PNG, JPEG, or WebP images. Developer guide for canvas.toDataURL and canvas.toBlob methods.', date: '2026-06-01', author: 'Marcus Webb' },
  { path: '/blog/why-your-iphone-photos-are-heic-and-what-to-do', title: 'Why Your iPhone Photos Are HEIC (And What to Do About It)', description: 'iPhone saves photos as HEIC files by default. Here is why Apple chose this format, and how to deal with compatibility problems when sharing or editing.', date: '2026-07-15', author: 'Sarah Chen' },
  { path: '/blog/common-mistakes-when-converting-images', title: '7 Mistakes People Make When Converting Image Formats', description: 'Avoid these common pitfalls when converting between image formats. Learn what actually matters for quality, file size, and compatibility.', date: '2026-07-12', author: 'Alex Martinez' },
  { path: '/blog/how-to-optimize-images-for-email', title: 'How to Make Images Smaller for Email (Without Them Looking Terrible)', description: 'Email attachments have size limits and most email clients compress images anyway. Here is how to prepare images so they look good and actually send.', date: '2026-07-10', author: 'Elena Torres' },
  { path: '/blog/best-image-format-for-printing', title: 'Best Image Format for Printing: JPEG vs PNG vs TIFF vs PDF', description: 'Choosing the wrong format for print can waste ink, blur details, or cost you at the print shop. Here is what actually works and why.', date: '2026-07-05', author: 'Marcus Webb' },
  { path: '/blog/how-to-reduce-image-file-size-without-losing-quality', title: 'How to Reduce Image File Size Without Losing Quality (Practical Methods)', description: 'Your photos are too big but you do not want them to look blurry. These methods actually shrink file sizes while keeping images sharp.', date: '2026-07-02', author: 'Alex Martinez' },
]

const routes = [
  {
    path: '/',
    title: 'PixConvert — Free Online Image Converter (HEIC to JPG, PNG, WebP)',
    description: 'Fast, free, and private online image converter. Convert HEIC to JPG, PNG to JPG, WebP to PNG, AVIF, TIFF, and more. 100% browser-based — no uploads, no signup.',
  },
  { path: '/compress', title: 'Free Image Compressor Online — Reduce Photo File Size | PixConvert', description: 'Compress images online for free. Reduce JPEG, PNG, WebP file sizes by up to 90% without quality loss. 100% browser-based — no uploads.' },
  { path: '/resize', title: 'Free Image Resizer Online — Resize Photos Instantly | PixConvert', description: 'Resize images online for free. Change dimensions while maintaining aspect ratio. Perfect for social media, web, and email. No uploads needed.' },
  { path: '/tools', title: 'All Image Tools — Convert, Compress, Resize | PixConvert', description: 'Complete set of free online image tools. Convert between formats, compress images, resize photos. All processing happens in your browser.' },
  { path: '/formats', title: 'Image Formats Explained — HEIC, JPEG, PNG, WebP, AVIF, TIFF | PixConvert', description: 'Complete guide to image formats. Understand the differences between HEIC, JPEG, PNG, WebP, AVIF, TIFF, GIF, BMP, SVG, and ICO.' },
  { path: '/how-to', title: 'How to Convert Images — Step-by-Step Guides for Every Format | PixConvert', description: 'Step-by-step guides for converting images between HEIC, JPEG, PNG, WebP, AVIF, TIFF, GIF, BMP, SVG, and ICO. Free browser-based tools.' },
  { path: '/sitemap', title: 'Sitemap — All Pages | PixConvert', description: 'Complete list of all PixConvert pages, tools, converters, and blog articles.' },
  { path: '/about', title: 'About PixConvert — Free Private Image Converter', description: 'Learn about PixConvert: a free, privacy-first image converter. All processing happens in your browser — files are never uploaded to any server.' },
  { path: '/blog', title: 'Blog — Image Format Guides, Tutorials & Tips | PixConvert', description: 'Expert guides on image formats, conversion tutorials, and optimization tips. Learn about JPEG, PNG, WebP, AVIF, HEIC, and more.' },
  ...conversionMeta,
  ...blogMeta.map((b) => ({
    path: b.path,
    title: b.title,
    description: b.description,
    ogType: 'article',
    articlePublished: b.date,
    articleAuthor: b.author,
  })),
]

console.log(`Prerendering ${routes.length} pages...`)
for (const route of routes) {
  buildPage(route)
  console.log(`  ✓ ${route.path}`)
}
console.log('Done!')
