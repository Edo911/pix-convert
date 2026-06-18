import heic2any from 'heic2any'
import UTIF from 'utif'
import {
  detectFormat,
  FORMATS,
  type ImageFormat,
} from './formats'
import { encodeBmp, encodeGif, encodeIco } from './encoders'

export interface ConvertOptions {
  outputFormat: ImageFormat
  quality: number
}

export interface ConvertResult {
  blob: Blob
  inputFormat: ImageFormat
  outputFormat: ImageFormat
  width: number
  height: number
  fileName: string
}

export class ConversionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConversionError'
  }
}

const MAX_DIMENSION = 8192
const MAX_FILE_SIZE = 50 * 1024 * 1024

const OUTPUT_MIME_SUPPORT = new Map<string, boolean>()

function checkMimeSupport(mime: string): boolean {
  if (OUTPUT_MIME_SUPPORT.has(mime)) {
    return OUTPUT_MIME_SUPPORT.get(mime)!
  }
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const supported = canvas.toDataURL(mime).startsWith(`data:${mime}`)
  OUTPUT_MIME_SUPPORT.set(mime, supported)
  return supported
}

async function decodeHeic(buffer: ArrayBuffer): Promise<Blob> {
  try {
    const result = await heic2any({
      blob: new Blob([buffer], { type: 'image/heic' }),
      toType: 'image/png',
    })
    return Array.isArray(result) ? result[0] : result
  } catch {
    throw new ConversionError(
      'Failed to decode HEIC/HEIF. Try another file or convert it on the device where the photo was taken.',
    )
  }
}

function decodeTiff(buffer: ArrayBuffer): HTMLCanvasElement {
  try {
    const ifds = UTIF.decode(buffer)
    if (!ifds.length) throw new Error('empty')
    UTIF.decodeImage(buffer, ifds[0])
    const rgba = UTIF.toRGBA8(ifds[0])
    const canvas = document.createElement('canvas')
    canvas.width = ifds[0].width
    canvas.height = ifds[0].height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('ctx')
    const imageData = new ImageData(new Uint8ClampedArray(rgba), ifds[0].width, ifds[0].height)
    ctx.putImageData(imageData, 0, 0)
    return canvas
  } catch {
    throw new ConversionError('Failed to decode TIFF. The file may be corrupted or use unsupported compression.')
  }
}

async function blobToCanvas(blob: Blob): Promise<HTMLCanvasElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(blob)
      const canvas = document.createElement('canvas')
      canvas.width = bitmap.width
      canvas.height = bitmap.height
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('ctx')
      ctx.drawImage(bitmap, 0, 0)
      bitmap.close()
      return canvas
    } catch {
      // fallback below
    }
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      URL.revokeObjectURL(url)
      if (!ctx) {
        reject(new ConversionError('The browser could not render this image.'))
        return
      }
      ctx.drawImage(img, 0, 0)
      resolve(canvas)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new ConversionError('The browser does not support this image format.'))
    }
    img.src = url
  })
}

async function decodeToCanvas(file: File, buffer: ArrayBuffer, format: ImageFormat): Promise<HTMLCanvasElement> {
  if (format === 'heic' || format === 'heif') {
    const pngBlob = await decodeHeic(buffer)
    return blobToCanvas(pngBlob)
  }

  if (format === 'tiff') {
    return decodeTiff(buffer)
  }

  const mime = FORMATS[format]?.mime ?? file.type
  return blobToCanvas(new Blob([buffer], { type: mime || undefined }))
}

function validateCanvas(canvas: HTMLCanvasElement): void {
  if (canvas.width <= 0 || canvas.height <= 0) {
    throw new ConversionError('Image has zero dimensions.')
  }
  if (canvas.width > MAX_DIMENSION || canvas.height > MAX_DIMENSION) {
    throw new ConversionError(`Maximum size is ${MAX_DIMENSION}×${MAX_DIMENSION} pixels.`)
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new ConversionError(`The browser does not support exporting to ${mime}.`))
      },
      mime,
      quality,
    )
  })
}

async function encodeCanvas(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality: number,
): Promise<Blob> {
  const info = FORMATS[format]
  if (!info.canOutput) {
    throw new ConversionError(`${info.label} is input-only and cannot be used as output.`)
  }

  switch (format) {
    case 'bmp':
      return encodeBmp(canvas)
    case 'gif':
      return encodeGif(canvas)
    case 'ico': {
      const size = Math.min(canvas.width, canvas.height, 256)
      const icoCanvas = document.createElement('canvas')
      icoCanvas.width = size
      icoCanvas.height = size
      const ctx = icoCanvas.getContext('2d')
      if (!ctx) throw new ConversionError('Failed to prepare ICO output.')
      ctx.drawImage(canvas, 0, 0, size, size)
      const pngBlob = await canvasToBlob(icoCanvas, 'image/png', 1)
      return encodeIco(pngBlob, size)
    }
    case 'jpeg':
    case 'png':
    case 'webp':
    case 'avif':
    case 'tiff': {
      if (!checkMimeSupport(info.mime)) {
        throw new ConversionError(`Your browser does not support ${info.label} export. Try PNG or WebP instead.`)
      }
      return canvasToBlob(canvas, info.mime, info.lossy ? quality : 1)
    }
    default:
      throw new ConversionError(`Unknown output format: ${format}`)
  }
}

function buildOutputName(inputName: string, outputFormat: ImageFormat): string {
  const base = inputName.replace(/\.[^.]+$/, '') || 'image'
  return `${base}.${FORMATS[outputFormat].extension}`
}

export async function convertImage(file: File, options: ConvertOptions): Promise<ConvertResult> {
  if (!file.type.startsWith('image/') && !file.name.match(/\.(heic|heif|tif|tiff)$/i)) {
    throw new ConversionError('The selected file does not appear to be an image.')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ConversionError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`)
  }

  const buffer = await file.arrayBuffer()
  const detected = detectFormat(file, buffer)

  if (!detected) {
    throw new ConversionError(
      'Could not detect file format. Supported: JPEG, PNG, WebP, GIF, BMP, AVIF, HEIC, TIFF, ICO, SVG.',
    )
  }

  if (detected === options.outputFormat) {
    throw new ConversionError('Input and output formats are the same. Choose a different output format.')
  }

  const canvas = await decodeToCanvas(file, buffer, detected)
  validateCanvas(canvas)

  const blob = await encodeCanvas(canvas, options.outputFormat, options.quality)

  return {
    blob,
    inputFormat: detected,
    outputFormat: options.outputFormat,
    width: canvas.width,
    height: canvas.height,
    fileName: buildOutputName(file.name, options.outputFormat),
  }
}

export function getSupportedOutputFormats(): ImageFormat[] {
  // For UI we want a predictable set; actual exporting may still fail if the browser
  // cannot encode a specific mime. We'll surface those errors during conversion.
  return ['jpeg', 'png', 'webp', 'avif', 'tiff', 'gif', 'bmp', 'ico'] as ImageFormat[]
}


