import { blogPosts } from '../pages/blog/blog-posts'

const pathToSlugs: Record<string, string[]> = {
  '/heic-to-jpg': ['heic-vs-jpg-complete-guide', 'how-to-convert-heic-to-jpg-on-windows', 'heic-to-jpg-on-mac', 'how-to-open-heic-files-on-android'],
  '/heic-to-png': ['heic-vs-jpg-complete-guide', 'how-to-convert-heic-to-jpg-on-windows', 'how-to-open-heic-files-on-android'],
  '/png-to-jpg': ['png-vs-jpg-best-for-web', 'webp-vs-png-vs-jpg', 'lossless-vs-lossy-image-compression', 'best-image-format-for-social-media'],
  '/jpg-to-png': ['png-vs-jpg-best-for-web', 'webp-vs-png-vs-jpg', 'lossless-vs-lossy-image-compression'],
  '/webp-to-png': ['webp-vs-png-vs-jpg', 'png-vs-jpg-best-for-web', 'gif-vs-png-vs-webp-animation'],
  '/webp-to-jpg': ['webp-vs-png-vs-jpg', 'png-vs-jpg-best-for-web', 'lossless-vs-lossy-image-compression'],
  '/avif-to-png': ['what-is-avif-format', 'webp-vs-png-vs-jpg', 'lossless-vs-lossy-image-compression'],
  '/avif-to-jpg': ['what-is-avif-format', 'webp-vs-png-vs-jpg', 'lossless-vs-lossy-image-compression'],
  '/tiff-to-png': ['tiff-vs-png-vs-jpeg-scanning', 'lossless-vs-lossy-image-compression'],
  '/tiff-to-jpg': ['tiff-vs-png-vs-jpeg-scanning', 'lossless-vs-lossy-image-compression'],
  '/svg-to-png': ['svg-vs-png-web-design', 'best-image-format-for-social-media'],
  '/gif-to-png': ['gif-vs-png-vs-webp-animation', 'best-image-format-for-social-media'],
  '/bmp-to-jpg': ['lossless-vs-lossy-image-compression', 'tiff-vs-png-vs-jpeg-scanning'],
  '/ico-converter': ['svg-vs-png-web-design'],
}

export function getRelatedPostsForPath(path: string) {
  const slugs = pathToSlugs[path]
  if (!slugs) return []
  return slugs
    .map((slug) => blogPosts.find((p) => p.slug === slug))
    .filter((p): p is (typeof blogPosts)[number] => p !== undefined)
}
