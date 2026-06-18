declare module '*.css'

declare module 'heic2any' {
  interface HeicOptions {
    blob: Blob
    toType?: string
    quality?: number
  }

  function heic2any(options: HeicOptions): Promise<Blob | Blob[]>
  export default heic2any
}

declare module 'utif' {
  interface TiffIfd {
    width: number
    height: number
    data: Uint8Array
  }

  export function decode(buffer: ArrayBuffer): TiffIfd[]
  export function decodeImage(buffer: ArrayBuffer, ifd: TiffIfd): void
  export function toRGBA8(ifd: TiffIfd): Uint8Array
}

declare module 'gifenc' {
  export function quantize(rgba: Uint8ClampedArray, maxColors: number): number[][]
  export function GIFEncoder(): {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      opts: { palette: number[][]; delay?: number },
    ): void
    finish(): void
    bytes(): Uint8Array
  }
}
