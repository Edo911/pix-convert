import { OUTPUT_FORMATS, type ImageFormat } from '../lib/formats'

interface FormatSelectorProps {
  value: ImageFormat
  onChange: (format: ImageFormat) => void
  inputFormat: ImageFormat | null
}

export function FormatSelector({ value, onChange, inputFormat }: FormatSelectorProps) {
  const options = OUTPUT_FORMATS.filter((format) => format.id !== inputFormat)

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

