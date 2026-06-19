# PixConvert

Free online image converter. All processing runs locally in the browser — files are never uploaded to a server.

## Supported formats

| Input | Output |
|-------|--------|
| JPEG, PNG, WebP, AVIF, GIF, BMP, HEIC, HEIF, TIFF, ICO, SVG | JPEG, PNG, WebP, AVIF, GIF, BMP, ICO |

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Production build

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to any static host.

## Stack

- React + Vite + TypeScript
- heic2any — HEIC/HEIF
- UTIF — TIFF
- gifenc — GIF
- Canvas API — JPEG, PNG, WebP, AVIF
