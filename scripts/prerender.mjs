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
  { path: '/heic-to-jpg', title: 'Free HEIC to JPG Converter Online — Convert HEIC/HEIF to JPEG', description: 'Convert HEIC and HEIF photos to JPG format online for free. 100% browser-based — no uploads, no servers. Supports iPhone HEIC images from iOS 11 and later.' },
  { path: '/heic-to-png', title: 'Free HEIC to PNG Converter Online — Convert HEIC/HEIF to PNG', description: 'Convert HEIC and HEIF images to PNG format instantly in your browser. Preserve transparency. No file uploads, no signup, completely free.' },
  { path: '/png-to-jpg', title: 'Free PNG to JPG Converter Online — Convert PNG to JPEG', description: 'Convert PNG images to JPG format online for free. Reduce file size while maintaining quality. Browser-based processing — your files stay private.' },
  { path: '/jpg-to-png', title: 'Free JPG to PNG Converter Online — Convert JPEG to PNG', description: 'Convert JPG images to PNG format online for free. Preserve transparency and lossless quality. 100% private browser-based conversion.' },
  { path: '/webp-to-png', title: 'Free WebP to PNG Converter Online — Convert WebP to PNG', description: 'Convert WebP images to PNG format online for free. Perfect for using WebP images in apps and editors that don\'t support WebP. No uploads needed.' },
  { path: '/webp-to-jpg', title: 'Free WebP to JPG Converter Online — Convert WebP to JPEG', description: 'Convert WebP images to JPG format instantly in your browser. Reduce file size while maintaining compatibility. Free, fast, and private.' },
  { path: '/avif-to-png', title: 'Free AVIF to PNG Converter Online — Convert AVIF to PNG', description: 'Convert AVIF images to PNG format online for free. AVIF is the next-gen image format — make it compatible with any app. Browser-based processing.' },
  { path: '/avif-to-jpg', title: 'Free AVIF to JPG Converter Online — Convert AVIF to JPEG', description: 'Convert AVIF images to JPG format instantly. Make AVIF files compatible with all platforms. Private browser-based conversion, no uploads.' },
  { path: '/tiff-to-png', title: 'Free TIFF to PNG Converter Online — Convert TIFF to PNG', description: 'Convert TIFF images to PNG format online for free. Perfect for scanned documents and high-resolution photos. 100% private browser conversion.' },
  { path: '/tiff-to-jpg', title: 'Free TIFF to JPG Converter Online — Convert TIFF to JPEG', description: 'Convert TIFF images to JPG format instantly in your browser. Reduce massive TIFF file sizes while maintaining good quality. No uploads, no signup.' },
  { path: '/svg-to-png', title: 'Free SVG to PNG Converter Online — Convert SVG to PNG', description: 'Convert SVG vector graphics to PNG raster images online for free. Perfect for using icons and logos in any application. Browser-based conversion.' },
  { path: '/gif-to-png', title: 'Free GIF to PNG Converter Online — Convert GIF to PNG', description: 'Convert GIF frames to PNG images online for free. Extract and convert GIF frames to high-quality PNGs. Private browser-based processing.' },
  { path: '/bmp-to-jpg', title: 'Free BMP to JPG Converter Online — Convert BMP to JPEG', description: 'Convert BMP images to JPG format online for free. Drastically reduce BMP file sizes while maintaining visual quality. No uploads, completely private.' },
  { path: '/ico-converter', title: 'Free ICO Converter Online — Convert Images to ICO Format', description: 'Convert PNG, JPG, and other images to ICO format for favicons and app icons. Create Windows icon files directly in your browser. Free and private.' },
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
