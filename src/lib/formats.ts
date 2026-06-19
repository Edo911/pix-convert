export type ImageFormat =
  | 'jpeg'
  | 'png'
  | 'webp'
  | 'avif'
  | 'gif'
  | 'bmp'
  | 'ico'
  | 'heic'
  | 'heif'
  | 'tiff'
  | 'svg'

export interface FormatInfo {
  id: ImageFormat
  label: string
  mime: string
  extension: string
  lossy: boolean
  canInput: boolean
  canOutput: boolean
}

export const FORMATS: Record<ImageFormat, FormatInfo> = {
  jpeg: {
    id: 'jpeg',
    label: 'JPEG',
    mime: 'image/jpeg',
    extension: 'jpg',
    lossy: true,
    canInput: true,
    canOutput: true,
  },
  png: {
    id: 'png',
    label: 'PNG',
    mime: 'image/png',
    extension: 'png',
    lossy: false,
    canInput: true,
    canOutput: true,
  },
  webp: {
    id: 'webp',
    label: 'WebP',
    mime: 'image/webp',
    extension: 'webp',
    lossy: true,
    canInput: true,
    canOutput: true,
  },
  avif: {
    id: 'avif',
    label: 'AVIF',
    mime: 'image/avif',
    extension: 'avif',
    lossy: true,
    canInput: true,
    canOutput: true,
  },
  gif: {
    id: 'gif',
    label: 'GIF',
    mime: 'image/gif',
    extension: 'gif',
    lossy: false,
    canInput: true,
    canOutput: true,
  },
  bmp: {
    id: 'bmp',
    label: 'BMP',
    mime: 'image/bmp',
    extension: 'bmp',
    lossy: false,
    canInput: true,
    canOutput: true,
  },
  ico: {
    id: 'ico',
    label: 'ICO',
    mime: 'image/x-icon',
    extension: 'ico',
    lossy: false,
    canInput: true,
    canOutput: true,
  },
  heic: {
    id: 'heic',
    label: 'HEIC',
    mime: 'image/heic',
    extension: 'heic',
    lossy: true,
    canInput: true,
    canOutput: false,
  },
  heif: {
    id: 'heif',
    label: 'HEIF',
    mime: 'image/heif',
    extension: 'heif',
    lossy: true,
    canInput: true,
    canOutput: false,
  },
  tiff: {
    id: 'tiff',
    label: 'TIFF',
    mime: 'image/tiff',
    extension: 'tiff',
    lossy: false,
    canInput: true,
    canOutput: true,
  },
  svg: {
    id: 'svg',
    label: 'SVG',
    mime: 'image/svg+xml',
    extension: 'svg',
    lossy: false,
    canInput: true,
    canOutput: false,
  },

}

export const OUTPUT_FORMATS = Object.values(FORMATS).filter((f) => f.canOutput)
export const INPUT_FORMATS = Object.values(FORMATS).filter((f) => f.canInput)

export function recommendOutputFormat(inputFormat: ImageFormat): ImageFormat {
  switch (inputFormat) {
    case 'png':
    case 'svg':
      return 'png'
    case 'gif':
      return 'gif'
    case 'bmp':
    case 'ico':
    case 'heic':
    case 'heif':
    case 'tiff':
      return 'webp'
    default:
      return 'avif'
  }
}

const EXTENSION_MAP: Record<string, ImageFormat> = {
  jpg: 'jpeg',
  jpeg: 'jpeg',
  png: 'png',
  webp: 'webp',
  avif: 'avif',
  gif: 'gif',
  bmp: 'bmp',
  ico: 'ico',
  heic: 'heic',
  heif: 'heif',
  tif: 'tiff',
  tiff: 'tiff',
  svg: 'svg',
}

function readAscii(bytes: Uint8Array, offset: number, length: number): string {
  return String.fromCharCode(...bytes.subarray(offset, offset + length))
}

export function detectFormat(file: File, buffer: ArrayBuffer): ImageFormat | null {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext && ext in EXTENSION_MAP) {
    return EXTENSION_MAP[ext]
  }

  const bytes = new Uint8Array(buffer)
  if (bytes.length < 12) return null

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg'
  if (bytes[0] === 0x89 && readAscii(bytes, 1, 3) === 'PNG') return 'png'
  if (readAscii(bytes, 0, 3) === 'GIF') return 'gif'
  if (readAscii(bytes, 0, 2) === 'BM') return 'bmp'
  if (readAscii(bytes, 0, 4) === 'RIFF' && readAscii(bytes, 8, 4) === 'WEBP') return 'webp'

  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    const brand = readAscii(bytes, 8, 4)
    if (brand.startsWith('avif') || brand.startsWith('avis')) return 'avif'
    if (brand.includes('heic') || brand.includes('heix') || brand.includes('hevc')) return 'heic'
    if (brand.includes('heif') || brand.includes('mif1')) return 'heif'
  }

  if (
    (bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a && bytes[3] === 0x00) ||
    (bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[2] === 0x00 && bytes[3] === 0x2a)
  ) {
    return 'tiff'
  }

  if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) {
    return 'ico'
  }

  const head = readAscii(bytes, 0, Math.min(bytes.length, 256)).trimStart()
  if (head.startsWith('<svg') || head.startsWith('<?xml')) return 'svg'

  return null
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
