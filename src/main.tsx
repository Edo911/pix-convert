import { StrictMode, useCallback, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { DropZone } from './components/DropZone'
import { FormatSelector } from './components/FormatSelector'
import {
  convertImage,
  ConversionError,
  type ConvertResult,
} from './lib/converter'
import { FORMATS, formatBytes, detectFormat, type ImageFormat } from './lib/formats'
import './index.css'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState<ImageFormat>('webp')
  const [quality, setQuality] = useState(0.85)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ConvertResult | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [inputFormat, setInputFormat] = useState<ImageFormat | null>(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      setInputFormat(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    file.arrayBuffer().then((buf) => {
      setInputFormat(detectFormat(file, buf))
    })
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    if (!result) {
      setResultUrl(null)
      return
    }
    const url = URL.createObjectURL(result.blob)
    setResultUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [result])

  const showQuality = useMemo(() => FORMATS[outputFormat].lossy, [outputFormat])

  const handleFileSelect = useCallback((selected: File) => {
    setFile(selected)
    setError(null)
    setResult(null)
  }, [])

  const handleConvert = useCallback(async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const converted = await convertImage(file, { outputFormat, quality })
      setResult(converted)
    } catch (err) {
      setError(err instanceof ConversionError ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }, [file, outputFormat, quality])

  const handleDownload = useCallback(() => {
    if (!result || !resultUrl) return
    const link = document.createElement('a')
    link.href = resultUrl
    link.download = result.fileName
    link.click()
  }, [result, resultUrl])

  const handleReset = useCallback(() => {
    setFile(null)
    setResult(null)
    setError(null)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div className="header__brand">
          <span className="header__logo" aria-hidden="true">◆</span>
          <div>
            <h1>PixConvert</h1>
            <p>Online image converter — fast, free, and private</p>
          </div>
        </div>
      </header>

      <main className="main">
        {!file ? (
          <DropZone onFileSelect={handleFileSelect} />
        ) : (
          <div className="workspace">
            <section className="panel panel--preview">
              <div className="panel__head">
                <h2>Source image</h2>
                <button type="button" className="btn btn--ghost" onClick={handleReset}>
                  Change file
                </button>
              </div>
              {previewUrl && (
                <div className="preview">
                  <img src={previewUrl} alt="Preview" />
                </div>
              )}
              <dl className="meta">
                <div>
                  <dt>File</dt>
                  <dd>{file.name}</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>{formatBytes(file.size)}</dd>
                </div>
                {inputFormat && (
                  <div>
                    <dt>Format</dt>
                    <dd>{FORMATS[inputFormat].label}</dd>
                  </div>
                )}
              </dl>
            </section>

            <section className="panel panel--controls">
              <h2>Settings</h2>
              <FormatSelector
                value={outputFormat}
                onChange={setOutputFormat}
                inputFormat={inputFormat}
              />
              {showQuality && (
                <div className="field">
                  <label htmlFor="quality">
                    Quality: {Math.round(quality * 100)}%
                  </label>
                  <input
                    id="quality"
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                  />
                </div>
              )}
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleConvert}
                disabled={loading}
              >
                {loading ? 'Converting…' : 'Convert'}
              </button>
              {error && <p className="message message--error" role="alert">{error}</p>}
            </section>

            {result && resultUrl && (
              <section className="panel panel--result">
                <h2>Result</h2>
                <div className="preview">
                  <img src={resultUrl} alt="Conversion result" />
                </div>
                <dl className="meta">
                  <div>
                    <dt>Format</dt>
                    <dd>{FORMATS[result.outputFormat].label}</dd>
                  </div>
                  <div>
                    <dt>File size</dt>
                    <dd>{formatBytes(result.blob.size)}</dd>
                  </div>
                  <div>
                    <dt>Dimensions</dt>
                    <dd>{result.width} × {result.height}</dd>
                  </div>
                </dl>
                <button type="button" className="btn btn--primary" onClick={handleDownload}>
                  Download {result.fileName}
                </button>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          All processing runs locally in your browser. Files are never uploaded to a server.
        </p>
      </footer>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
