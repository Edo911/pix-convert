import { OUTPUT_FORMATS, type ImageFormat } from '../lib/formats'

interface FormatSelectorProps {
  value: ImageFormat
  onChange: (format: ImageFormat) => void
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  const options = OUTPUT_FORMATS

  return (
    <div className="field">
      <label htmlFor="output-format">Output format</label>
      <select
        id="output-format"
        value={value}
        onChange={(e) => onChange(e.target.value as ImageFormat)}
      >
        {options.map((format) => (
          <option key={format.id} value={format.id}>
            {format.label}
            {format.lossy ? ' (lossy)' : ' (lossless)'}
          </option>
        ))}
      </select>
    </div>
  )
}

