const STORAGE_KEY = 'pixconvert-stats'

interface Stats {
  convertedCount: number
  firstUse: string
}

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { convertedCount: 0, firstUse: new Date().toISOString() }
}

function saveStats(stats: Stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function getConversionCount(): number {
  return loadStats().convertedCount
}

export function incrementConversionCount(): number {
  const stats = loadStats()
  stats.convertedCount += 1
  saveStats(stats)
  return stats.convertedCount
}
