import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { zipSync } from 'fflate'
import { incrementConversionCount } from '../lib/stats'
import { addToHistory, getHistory } from '../lib/history'
import { DropZone } from './DropZone'
import { FormatSelector } from './FormatSelector'
import {
  convertImage,
  ConversionError,
  isOutputFormatSupported,
  type ConvertResult,
} from '../lib/converter'
import { FORMATS, formatBytes, detectFormat, recommendOutputFormat, type ImageFormat } from '../lib/formats'

const STORAGE_KEY = 'pixconvert-settings'

const PRESETS = [
  {
    id: 'web',
    label: 'Web / Blog',
    outputFormat: 'avif' as const,
    quality: 0.82,
    maxWidth: 1600,
    maxHeight: 1200,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    outputFormat: 'webp' as const,
    quality: 0.85,
    maxWidth: 1080,
    maxHeight: 1080,
  },
  {
    id: 'avatar',
    label: 'Avatar',
    outputFormat: 'png' as const,
    quality: 1,
    maxWidth: 512,
    maxHeight: 512,
  },
  {
    id: 'email',
    label: 'Email',
    outputFormat: 'jpeg' as const,
    quality: 0.76,
    maxWidth: 1200,
    maxHeight: 1200,
  },
]

interface ConverterProps {
  fromHint?: string
  toHint?: string
}

export function Converter({ fromHint, toHint }: ConverterProps) {
  const [files, setFiles] = useState<File[]>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState<ImageFormat>('webp')
  const [quality, setQuality] = useState(0.85)
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined)
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ConvertResult | null>(null)
  const [batchResults, setBatchResults] = useState<ConvertResult[] | null>(null)
  const [selectedResultIndex, setSelectedResultIndex] = useState(0)
  const [resizeEnabled, setResizeEnabled] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadName, setDownloadName] = useState<string | null>(null)
  const [inputFormat, setInputFormat] = useState<ImageFormat | null>(null)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const data = JSON.parse(stored) as {
        outputFormat?: ImageFormat
        quality?: number
        maxWidth?: number
        maxHeight?: number
        resizeEnabled?: boolean
      }
      if (data.outputFormat) setOutputFormat(data.outputFormat)
      if (typeof data.quality === 'number') setQuality(data.quality)
      if (typeof data.maxWidth === 'number') setMaxWidth(data.maxWidth)
      if (typeof data.maxHeight === 'number') setMaxHeight(data.maxHeight)
      if (typeof data.resizeEnabled === 'boolean') setResizeEnabled(data.resizeEnabled)
    } catch {
      // ignore invalid storage
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ outputFormat, quality, maxWidth, maxHeight, resizeEnabled }),
    )
  }, [outputFormat, quality, maxWidth, maxHeight, resizeEnabled])

  const selectedFile = files[selectedFileIndex] ?? null
  const selectedResult = batchResults?.[selectedResultIndex] ?? result

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null)
      setInputFormat(null)
      return
    }

    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
    selectedFile.arrayBuffer().then((buf) => {
      setInputFormat(detectFormat(selectedFile, buf))
    })

    return () => URL.revokeObjectURL(url)
  }, [selectedFile])

  useEffect(() => {
    if (!selectedResult) {
      setResultUrl(null)
      return
    }
    const url = URL.createObjectURL(selectedResult.blob)
    setResultUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedResult])

  useEffect(() => {
    let url: string | null = null

    const buildUrl = async () => {
      if (!batchResults) {
        setDownloadUrl(null)
        setDownloadName(null)
        return
      }

      if (batchResults.length === 1) {
        url = URL.createObjectURL(batchResults[0].blob)
        setDownloadUrl(url)
        setDownloadName(batchResults[0].fileName)
        return
      }

      const entries: Record<string, Uint8Array> = {}
      for (const fileResult of batchResults) {
        const bytes = new Uint8Array(await fileResult.blob.arrayBuffer())
        entries[fileResult.fileName] = bytes
      }

      const zipBytes = zipSync(entries)
      const zipBlob = new Blob([zipBytes], { type: 'application/zip' })
      url = URL.createObjectURL(zipBlob)
      setDownloadUrl(url)
      setDownloadName(`pixconvert-${outputFormat}-${batchResults.length}.zip`)
    }

    buildUrl()

    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [batchResults])

  const totalInputSize = useMemo(
    () => files.reduce((sum, fileItem) => sum + fileItem.size, 0),
    [files],
  )

  const effectiveMaxWidth = resizeEnabled ? maxWidth : undefined
  const effectiveMaxHeight = resizeEnabled ? maxHeight : undefined
  const showQuality = useMemo(() => FORMATS[outputFormat].lossy, [outputFormat])
  const recommendedFormat = useMemo(
    () => (inputFormat ? recommendOutputFormat(inputFormat) : 'webp'),
    [inputFormat],
  )
  const outputFormatSupported = useMemo(
    () => isOutputFormatSupported(outputFormat),
    [outputFormat],
  )

  const handleFileSelect = useCallback((selected: File[], append = false) => {
    setFiles((currentFiles) => (append ? [...currentFiles, ...selected] : selected))
    setSelectedFileIndex(0)
    setSelectedResultIndex(0)
    setPreviewUrl(null)
    setResult(null)
    setBatchResults(null)
    setProgress(null)
    setDownloadUrl(null)
    setDownloadName(null)
    setError(null)
  }, [])

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items
      if (!items) return
      const pastedFiles: File[] = []

      for (const item of Array.from(items)) {
        if (item.kind !== 'file') continue
        const file = item.getAsFile()
        if (file && file.type.startsWith('image/')) {
          pastedFiles.push(file)
        }
      }

      if (!pastedFiles.length) return
      event.preventDefault()
      handleFileSelect(pastedFiles, files.length > 0)
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [files.length, handleFileSelect])

  const handlePreset = useCallback((preset: typeof PRESETS[number]) => {
    setOutputFormat(preset.outputFormat)
    setQuality(preset.quality)
    setMaxWidth(preset.maxWidth)
    setMaxHeight(preset.maxHeight)
    setResizeEnabled(true)
  }, [])

  const handleConvert = useCallback(async () => {
    if (!files.length) return
    setLoading(true)
    setError(null)
    setResult(null)
    setBatchResults(null)
    setProgress({ current: 0, total: files.length })
    try {
      const converted: ConvertResult[] = []
      for (let index = 0; index < files.length; index += 1) {
        const fileItem = files[index]
        const resultItem = await convertImage(fileItem, {
          outputFormat,
          quality,
          maxWidth: effectiveMaxWidth,
          maxHeight: effectiveMaxHeight,
        })
        converted.push(resultItem)
        setProgress({ current: index + 1, total: files.length })
      }
      incrementConversionCount()
      const now = Date.now()
      converted.forEach((r, idx) => {
        addToHistory({
          id: `${now}-${idx}`,
          fromFormat: r.inputFormat,
          toFormat: r.outputFormat,
          inputSize: r.originalSize,
          outputSize: r.blob.size,
          width: r.width,
          height: r.height,
          fileName: r.fileName,
          timestamp: now,
        })
      })
      setBatchResults(converted)
      setSelectedResultIndex(0)
      setResult(converted[0])
    } catch (err) {
      setError(err instanceof ConversionError ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
      setProgress(null)
    }
  }, [files, outputFormat, quality, maxWidth, maxHeight])

  const handleDownload = useCallback(() => {
    if (!downloadUrl || !downloadName) return
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = downloadName
    link.click()
  }, [downloadUrl, downloadName])

  const addInputRef = useRef<HTMLInputElement | null>(null)

  const handleAddFiles = useCallback(() => {
    addInputRef.current?.click()
  }, [])

  const handleReset = useCallback(() => {
    setFiles([])
    setSelectedFileIndex(0)
    setSelectedResultIndex(0)
    setPreviewUrl(null)
    setResult(null)
    setBatchResults(null)
    setProgress(null)
    setDownloadUrl(null)
    setDownloadName(null)
    setError(null)
  }, [])

  const headerText = fromHint && toHint
    ? `Convert ${fromHint} to ${toHint}`
    : 'Convert images locally in your browser'

  return (
    <div className="converter">
      {fromHint && (
        <div className="converter__meta">
          <p className="converter__subtitle">
            {headerText} — no servers, no signup, files up to 50 MB.
          </p>
        </div>
      )}

      {!files.length ? (
        <DropZone onFileSelect={handleFileSelect} />
      ) : (
        <div className="workspace">
          <section className="panel panel--preview">
            <div className="panel__head">
              <div>
                <h2>Source</h2>
                <p className="panel__hint">{files.length} file{files.length > 1 ? 's' : ''}, {formatBytes(totalInputSize)}</p>
              </div>
              <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                <button type="button" className="btn btn--ghost" onClick={handleReset}>
                  Start over
                </button>
                <button type="button" className="btn btn--ghost" onClick={handleAddFiles}>
                  Add more files
                </button>
              </div>
            </div>
            {files.length > 1 && (
              <>
                <div className="file-list">
                  {files.map((fileItem, index) => (
                    <button
                      key={`${fileItem.name}-${index}`}
                      type="button"
                      className={`file-item ${index === selectedFileIndex ? 'file-item--active' : ''}`}
                      onClick={() => setSelectedFileIndex(index)}
                    >
                      {fileItem.name}
                    </button>
                  ))}
                </div>
                <p className="panel__hint">Tip: drag, drop or paste additional images to update the list.</p>
              </>
            )}
            {previewUrl && (
              <div className="preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
            <dl className="meta">
              <div>
                <dt>File</dt>
                <dd>{selectedFile?.name ?? '-'}</dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd>{selectedFile ? formatBytes(selectedFile.size) : '-'}</dd>
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
            <div className="recommendation">
              Recommended: <strong>{FORMATS[recommendedFormat].label}</strong>
            </div>
            <div className="presets">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`btn btn--ghost preset-button ${outputFormat === preset.outputFormat ? 'preset-button--active' : ''}`}
                  onClick={() => handlePreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <FormatSelector
              value={outputFormat}
              onChange={setOutputFormat}
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
            <div className="field field--toggle">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={resizeEnabled}
                  onChange={(e) => setResizeEnabled(e.target.checked)}
                />
                <span>Resize image</span>
              </label>
              <p className="field__hint">Enable to set a maximum width or height. Disabled keeps original dimensions.</p>
            </div>
            {resizeEnabled ? (
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="max-width">Max width</label>
                  <input
                    id="max-width"
                    type="number"
                    min={1}
                    placeholder="Auto"
                    value={maxWidth ?? ''}
                    onChange={(e) => setMaxWidth(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="max-height">Max height</label>
                  <input
                    id="max-height"
                    type="number"
                    min={1}
                    placeholder="Auto"
                    value={maxHeight ?? ''}
                    onChange={(e) => setMaxHeight(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            ) : null}
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleConvert}
              disabled={loading || !files.length || !outputFormatSupported}
            >
              {loading ? 'Converting…' : files.length > 1 ? 'Convert all files' : 'Convert'}
            </button>
            {!outputFormatSupported && (
              <p className="message message--warning">Your browser does not support exporting to {FORMATS[outputFormat].label}. Choose PNG or GIF.</p>
            )}
            {progress && (
              <p className="message message--info">Converted {progress.current} of {progress.total} file{progress.total > 1 ? 's' : ''}…</p>
            )}
            {error && <p className="message message--error" role="alert">{error}</p>}
          </section>

          {result && downloadUrl && (
            <section className="panel panel--result">
              <div className="panel__head">
                <div>
                  <h2>Result</h2>
                  {batchResults && batchResults.length > 1 ? (
                    <p className="panel__hint">Converted {batchResults.length} files</p>
                  ) : (
                    <p className="panel__hint">Preview</p>
                  )}
                </div>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button type="button" className="btn btn--ghost" onClick={handleDownload}>
                    Download {downloadName}
                  </button>
                </div>
              </div>
              {batchResults && batchResults.length > 1 && (
                <div className="result-file-list">
                  {batchResults.map((fileResult, index) => (
                    <button
                      key={`${fileResult.fileName}-${index}`}
                      type="button"
                      className={`result-file ${index === selectedResultIndex ? 'result-file--active' : ''}`}
                      onClick={() => setSelectedResultIndex(index)}
                    >
                      <span>{fileResult.fileName}</span>
                      <small>{formatBytes(fileResult.blob.size)}</small>
                    </button>
                  ))}
                </div>
              )}
              <div className="compare-grid">
                <div className="compare-card">
                  <span className="compare-label">Original</span>
                  <div className="compare-image">
                    <img src={previewUrl ?? ''} alt="Original preview" />
                  </div>
                </div>
                <div className="compare-card">
                  <span className="compare-label">Converted</span>
                  <div className="compare-image">
                    <img src={resultUrl ?? ''} alt="Converted preview" />
                  </div>
                </div>
              </div>
              <dl className="meta meta--result">
                <div>
                  <dt>Format</dt>
                  <dd>{FORMATS[result.outputFormat].label}</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>{formatBytes(result.blob.size)}</dd>
                </div>
                <div>
                  <dt>Dimensions</dt>
                  <dd>{result.width} × {result.height}</dd>
                </div>
                <div>
                  <dt>Original size</dt>
                  <dd>{formatBytes(result.originalSize)}</dd>
                </div>
              </dl>
            </section>
          )}
          {getHistory().length > 0 && (
            <section className="panel panel--history">
              <div className="panel__head">
                <h2>Recent Conversions</h2>
              </div>
              <div className="history-list">
                {getHistory().slice(0, 5).map((entry) => (
                  <div key={entry.id} className="history-item">
                    <div className="history-item__info">
                      <strong className="history-item__formats">{entry.fromFormat.toUpperCase()} → {entry.toFormat.toUpperCase()}</strong>
                      <span className="history-item__meta">{entry.fileName} · {formatBytes(entry.outputSize)}</span>
                    </div>
                    <span className="history-item__date">{new Date(entry.timestamp).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
      <input
        ref={addInputRef}
        type="file"
        accept="image/*,.heic,.heif,.tif,.tiff"
        hidden
        multiple
        onChange={(event) => {
          const fileList = event.target.files
          if (!fileList) return
          handleFileSelect(Array.from(fileList), true)
          event.target.value = ''
        }}
      />
    </div>
  )
}
