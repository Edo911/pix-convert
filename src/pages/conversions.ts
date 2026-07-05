export interface ConversionRoute {
  path: string
  title: string
  description: string
  keywords: string
  fromFormat: string
  toFormat: string
}

export const conversionRoutes: ConversionRoute[] = [
  {
    path: '/heic-to-jpg',
    title: 'Free HEIC to JPG Converter Online — Convert HEIC/HEIF to JPEG',
    description: 'Convert HEIC and HEIF photos to JPG format online for free. 100% browser-based — no uploads, no servers. Supports iPhone HEIC images from iOS 11 and later.',
    keywords: 'HEIC to JPG, HEIC converter, HEIF to JPG, iPhone HEIC to JPEG, free HEIC converter online',
    fromFormat: 'HEIC',
    toFormat: 'JPEG',
  },
  {
    path: '/heic-to-png',
    title: 'Free HEIC to PNG Converter Online — Convert HEIC/HEIF to PNG',
    description: 'Convert HEIC and HEIF images to PNG format instantly in your browser. Preserve transparency. No file uploads, no signup, completely free.',
    keywords: 'HEIC to PNG, HEIF to PNG, iPhone HEIC to PNG, free HEIC to PNG converter, HEIC converter online',
    fromFormat: 'HEIC',
    toFormat: 'PNG',
  },
  {
    path: '/png-to-jpg',
    title: 'Free PNG to JPG Converter Online — Convert PNG to JPEG',
    description: 'Convert PNG images to JPG format online for free. Reduce file size while maintaining quality. Browser-based processing — your files stay private.',
    keywords: 'PNG to JPG, PNG to JPEG, convert PNG to JPG online, free PNG to JPG converter, image converter',
    fromFormat: 'PNG',
    toFormat: 'JPEG',
  },
  {
    path: '/jpg-to-png',
    title: 'Free JPG to PNG Converter Online — Convert JPEG to PNG',
    description: 'Convert JPG images to PNG format online for free. Preserve transparency and lossless quality. 100% private browser-based conversion.',
    keywords: 'JPG to PNG, JPEG to PNG, convert JPG to PNG online, free JPG to PNG converter, image converter',
    fromFormat: 'JPEG',
    toFormat: 'PNG',
  },
  {
    path: '/webp-to-png',
    title: 'Free WebP to PNG Converter Online — Convert WebP to PNG',
    description: 'Convert WebP images to PNG format online for free. Perfect for using WebP images in apps and editors that don\'t support WebP. No uploads needed.',
    keywords: 'WebP to PNG, convert WebP to PNG online, free WebP to PNG converter, WebP converter, image format converter',
    fromFormat: 'WebP',
    toFormat: 'PNG',
  },
  {
    path: '/webp-to-jpg',
    title: 'Free WebP to JPG Converter Online — Convert WebP to JPEG',
    description: 'Convert WebP images to JPG format instantly in your browser. Reduce file size while maintaining compatibility. Free, fast, and private.',
    keywords: 'WebP to JPG, WebP to JPEG, convert WebP to JPG online, free WebP converter, WebP to JPEG converter',
    fromFormat: 'WebP',
    toFormat: 'JPEG',
  },
  {
    path: '/avif-to-png',
    title: 'Free AVIF to PNG Converter Online — Convert AVIF to PNG',
    description: 'Convert AVIF images to PNG format online for free. AVIF is the next-gen image format — make it compatible with any app. Browser-based processing.',
    keywords: 'AVIF to PNG, convert AVIF to PNG online, free AVIF converter, AVIF to PNG converter, next-gen image converter',
    fromFormat: 'AVIF',
    toFormat: 'PNG',
  },
  {
    path: '/avif-to-jpg',
    title: 'Free AVIF to JPG Converter Online — Convert AVIF to JPEG',
    description: 'Convert AVIF images to JPG format instantly. Make AVIF files compatible with all platforms. Private browser-based conversion, no uploads.',
    keywords: 'AVIF to JPG, AVIF to JPEG, convert AVIF to JPG online, free AVIF converter, AVIF to JPEG converter',
    fromFormat: 'AVIF',
    toFormat: 'JPEG',
  },
  {
    path: '/tiff-to-png',
    title: 'Free TIFF to PNG Converter Online — Convert TIFF to PNG',
    description: 'Convert TIFF images to PNG format online for free. Perfect for scanned documents and high-resolution photos. 100% private browser conversion.',
    keywords: 'TIFF to PNG, convert TIFF to PNG online, free TIFF converter, TIF to PNG, TIFF image converter',
    fromFormat: 'TIFF',
    toFormat: 'PNG',
  },
  {
    path: '/tiff-to-jpg',
    title: 'Free TIFF to JPG Converter Online — Convert TIFF to JPEG',
    description: 'Convert TIFF images to JPG format instantly in your browser. Reduce massive TIFF file sizes while maintaining good quality. No uploads, no signup.',
    keywords: 'TIFF to JPG, TIFF to JPEG, convert TIFF to JPG online, free TIFF to JPG converter, TIF to JPEG',
    fromFormat: 'TIFF',
    toFormat: 'JPEG',
  },
  {
    path: '/svg-to-png',
    title: 'Free SVG to PNG Converter Online — Convert SVG to PNG',
    description: 'Convert SVG vector graphics to PNG raster images online for free. Perfect for using icons and logos in any application. Browser-based conversion.',
    keywords: 'SVG to PNG, convert SVG to PNG online, free SVG to PNG converter, SVG to PNG raster, vector to PNG',
    fromFormat: 'SVG',
    toFormat: 'PNG',
  },
  {
    path: '/gif-to-png',
    title: 'Free GIF to PNG Converter Online — Convert GIF to PNG',
    description: 'Convert GIF frames to PNG images online for free. Extract and convert GIF frames to high-quality PNGs. Private browser-based processing.',
    keywords: 'GIF to PNG, convert GIF to PNG online, free GIF to PNG converter, GIF frame extractor, GIF to PNG online',
    fromFormat: 'GIF',
    toFormat: 'PNG',
  },
  {
    path: '/bmp-to-jpg',
    title: 'Free BMP to JPG Converter Online — Convert BMP to JPEG',
    description: 'Convert BMP images to JPG format online for free. Drastically reduce BMP file sizes while maintaining visual quality. No uploads, completely private.',
    keywords: 'BMP to JPG, BMP to JPEG, convert BMP to JPG online, free BMP converter, bitmap to JPEG converter',
    fromFormat: 'BMP',
    toFormat: 'JPEG',
  },
  {
    path: '/ico-converter',
    title: 'Free ICO Converter Online — Convert Images to ICO Format',
    description: 'Convert PNG, JPG, and other images to ICO format for favicons and app icons. Create Windows icon files directly in your browser. Free and private.',
    keywords: 'ICO converter, image to ICO, PNG to ICO, JPG to ICO, favicon converter, free ICO converter online, icon converter',
    fromFormat: 'PNG',
    toFormat: 'ICO',
  },
]
