import { useCallback, useRef, useState } from 'react'
import { formatBytes } from '../lib/formats'

interface DropZoneProps {
  onFileSelect: (files: File[]) => void
  disabled?: boolean
}

export function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback(
    (fileList: FileList | File[] | undefined) => {
      if (disabled || !fileList || fileList.length === 0) return
      const files = Array.isArray(fileList) ? fileList : Array.from(fileList)
      onFileSelect(files)
    },
    [disabled, onFileSelect],
  )

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setDragging(false)
      handleFile(event.dataTransfer.files)
    },
    [handleFile],
  )

  return (
    <div
      className={`dropzone${dragging ? ' dropzone--active' : ''}${disabled ? ' dropzone--disabled' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif,.tif,.tiff"
        hidden
        multiple
        onChange={(e) => handleFile(e.target.files ?? undefined)}
      />
      <div className="dropzone__icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="20" r="3" fill="currentColor" />
          <path d="M6 32l10-10 8 8 6-6 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p className="dropzone__title">Drag images here or click to select files</p>
      <p className="dropzone__hint">Supports files up to {formatBytes(50 * 1024 * 1024)}.</p>
      <p className="dropzone__formats">JPEG · PNG · WebP · AVIF · GIF · BMP · HEIC · HEIF · TIFF · ICO · SVG</p>
    </div>
  )
}
