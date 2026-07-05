const STORAGE_KEY = 'pixconvert-history'

export interface HistoryEntry {
  id: string
  fromFormat: string
  toFormat: string
  inputSize: number
  outputSize: number
  width: number
  height: number
  fileName: string
  timestamp: number
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return []
}

export function addToHistory(entry: HistoryEntry) {
  const history = getHistory()
  history.unshift(entry)
  if (history.length > 20) history.length = 20
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch { /* ignore */ }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
}
