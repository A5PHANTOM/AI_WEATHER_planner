import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, ArrowLeft, GitCompare, MapPin, Loader2 } from 'lucide-react'
import { compareLocations } from '../services/api.js'

const DECISION_COLORS = {
  Proceed: 'text-green-400 bg-green-500/10 border-green-500/30',
  'Proceed with Caution': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'Not Recommended': 'text-red-400 bg-red-500/10 border-red-500/30',
}

export default function CompareView({ activity, date, onBack }) {
  const [locations, setLocations] = useState(['', ''])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const addLocation = () => {
    if (locations.length < 5) setLocations([...locations, ''])
  }

  const removeLocation = (i) => {
    if (locations.length > 2) setLocations(locations.filter((_, idx) => idx !== i))
  }

  const updateLocation = (i, val) => {
    const next = [...locations]
    next[i] = val
    setLocations(next)
  }

  const handleCompare = async (e) => {
    e.preventDefault()
    const filled = locations.filter((l) => l.trim())
    if (filled.length < 2) {
      setError('Enter at least two locations')
      return
    }
    setLoading(true)
    setError('')
    setResults(null)
    try {
      const data = await compareLocations(filled, activity, date)
      setResults(data.locations || [])
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Comparison failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto max-w-6xl px-4"
    >
      <div className="glass rounded-lg p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare size={20} className="text-sky-200" />
            <h2 className="text-lg font-semibold text-white">Compare Locations</h2>
          </div>
          {onBack && (
            <button type="button" onClick={onBack} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-white/[0.08] hover:text-white">
              <ArrowLeft size={16} /> Back
            </button>
          )}
        </div>

        <form onSubmit={handleCompare} className="space-y-3">
          {locations.map((loc, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-sm font-semibold text-sky-200">
                {i + 1}
              </div>
              <div className="relative flex-1">
                <MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sky-200/60" />
                <input
                  type="text"
                  placeholder="Mumbai, Lonavala, Delhi..."
                  value={loc}
                  onChange={(e) => updateLocation(i, e.target.value)}
                  className="field h-10 w-full pl-9 pr-4 text-sm placeholder:text-slate-500"
                />
              </div>
              {locations.length > 2 && (
                <button type="button" onClick={() => removeLocation(i)} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-300 hover:bg-red-500/10">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-2">
            {locations.length < 5 && (
              <button type="button" onClick={addLocation} className="flex items-center gap-1 rounded-lg border border-dashed border-white/15 px-3 py-2 text-xs text-muted transition-colors hover:border-white/30 hover:text-white">
                <Plus size={14} /> Add location
              </button>
            )}
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Comparing...</>
            ) : (
              <><GitCompare size={18} /> Compare Locations</>
            )}
          </motion.button>
        </form>

        {results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Ranked Results</h3>
            {results.map((r, i) => {
              const colors = DECISION_COLORS[r.decision] || DECISION_COLORS['Not Recommended']
              return (
                <motion.div
                  key={r.location}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-lg border p-4 ${r.error ? 'border-red-500/20 bg-red-500/5' : 'border-white/10 bg-white/[0.04]'}`}
                >
                  {r.error ? (
                    <div className="flex items-center gap-2 text-sm text-red-300">
                      <span className="font-medium">{r.location}</span>
                      <span>- {r.error}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] text-sm font-bold text-sky-200">
                          #{i + 1}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{r.location}</div>
                          <div className="text-xs text-muted">
                            {r.current?.temperature || '-'}\u00b0C
                            {r.country ? ` · ${r.country}` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${colors}`}>
                          {r.decision}
                        </div>
                        <div className="mt-1 text-xs text-muted">Risk: {r.risk_score}/100</div>
                      </div>
                    </div>
                  )}
                  {r.best_time && !r.error && (
                    <div className="mt-2 border-t border-white/[0.06] pt-2 text-xs text-muted">
                      Best: {r.best_time.label}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
