export function encodeBmp(canvas: HTMLCanvasElement): Blob {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get canvas context')

  const { width, height } = canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const { data } = imageData

  const rowSize = Math.ceil((width * 3) / 4) * 4
  const pixelDataSize = rowSize * height
  const fileSize = 54 + pixelDataSize
  const buffer = new ArrayBuffer(fileSize)
  const view = new DataView(buffer)
  const bytes = new Uint8Array(buffer)

  view.setUint8(0, 0x42)
  view.setUint8(1, 0x4d)
  view.setUint32(2, fileSize, true)
  view.setUint32(6, 0, true)
  view.setUint32(10, 54, true)
  view.setUint32(14, 40, true)
  view.setInt32(18, width, true)
  view.setInt32(22, height, true)
  view.setUint16(26, 1, true)
  view.setUint16(28, 24, true)
  view.setUint32(30, 0, true)
  view.setUint32(34, pixelDataSize, true)

  let offset = 54
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      bytes[offset++] = data[i + 2]
      bytes[offset++] = data[i + 1]
      bytes[offset++] = data[i]
    }
    const padding = rowSize - width * 3
    for (let p = 0; p < padding; p++) {
      bytes[offset++] = 0
    }
  }

  return new Blob([buffer], { type: 'image/bmp' })
}

export function encodeIco(pngBlob: Blob, size: number): Promise<Blob> {
  return pngBlob.arrayBuffer().then((pngBuffer) => {
    const pngBytes = new Uint8Array(pngBuffer)
    const headerSize = 6 + 16
    const totalSize = headerSize + pngBytes.length
    const buffer = new ArrayBuffer(totalSize)
    const view = new DataView(buffer)
    const bytes = new Uint8Array(buffer)

    view.setUint16(0, 0, true)
    view.setUint16(2, 1, true)
    view.setUint16(4, 1, true)

    view.setUint8(6, size >= 256 ? 0 : size)
    view.setUint8(7, size >= 256 ? 0 : size)
    view.setUint8(8, 0)
    view.setUint8(9, 0)
    view.setUint16(10, 1, true)
    view.setUint16(12, 32, true)
    view.setUint32(14, pngBytes.length, true)
    view.setUint32(18, headerSize, true)

    bytes.set(pngBytes, headerSize)
    return new Blob([buffer], { type: 'image/x-icon' })
  })
}

export async function encodeGif(canvas: HTMLCanvasElement): Promise<Blob> {
  const { GIFEncoder, quantize } = await import('gifenc')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get canvas context')

  const { width, height } = canvas
  const { data } = ctx.getImageData(0, 0, width, height)
  const palette = quantize(data, 256)
  const index = applyPalette(data, palette)

  const gif = GIFEncoder()
  gif.writeFrame(index, width, height, { palette, delay: 0 })
  gif.finish()

  return new Blob([gif.bytes()], { type: 'image/gif' })
}

function applyPalette(rgba: Uint8ClampedArray, palette: number[][]): Uint8Array {
  const out = new Uint8Array(rgba.length / 4)
  for (let i = 0; i < out.length; i++) {
    const r = rgba[i * 4]
    const g = rgba[i * 4 + 1]
    const b = rgba[i * 4 + 2]
    out[i] = nearestColorIndex(r, g, b, palette)
  }
  return out
}

function nearestColorIndex(r: number, g: number, b: number, palette: number[][]): number {
  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < palette.length; i++) {
    const [pr, pg, pb] = palette[i]
    const dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }
  return best
}
