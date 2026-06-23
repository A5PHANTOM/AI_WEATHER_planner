import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Activity, Sparkles, Loader2 } from 'lucide-react'

const ACTIVITIES = [
  'Cricket', 'Football', 'Running', 'Cycling',
  'Trekking', 'Beach Trip', 'Picnic', 'Outdoor Event',
]

const DATES = ['Today', 'Tomorrow']

export default function InputForm({ onAnalyze, loading }) {
  const [location, setLocation] = useState('')
  const [activity, setActivity] = useState('')
  const [date, setDate] = useState('Today')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (location.trim() && activity) {
      onAnalyze(location.trim(), activity, date)
    }
  }

  const ripple = (e) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const circle = document.createElement('span')
    const size = Math.max(rect.width, rect.height)
    circle.style.cssText = `
      position: absolute; border-radius: 50%;
      width: ${size}px; height: ${size}px;
      background: rgba(255,255,255,0.3);
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
      pointer-events: none;
      animation: rippleAnim 0.6s ease-out forwards;
    `
    btn.appendChild(circle)
    setTimeout(() => circle.remove(), 600)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="mx-auto max-w-6xl px-4"
    >
      <style>{`
        @keyframes rippleAnim {
          to { transform: scale(4); opacity: 0; }
        }
      `}</style>
      <form
        onSubmit={handleSubmit}
        className="glass rounded-lg p-4 sm:p-5"
      >
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.9fr_0.8fr]">
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase text-slate-400">Location</span>
            <div className="relative">
              <MapPin
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-200/70"
              />
              <input
                type="text"
                placeholder="Mumbai, London, New York..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="field h-12 pl-12 pr-4 placeholder:text-slate-500"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-medium uppercase text-slate-400">Activity</span>
            <div className="relative">
              <Activity
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sky-200/70"
              />
              <input
                type="text"
                list="activity-suggestions"
                placeholder="Running, gardening, photography..."
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                maxLength={80}
                required
                className="field h-12 pl-12 pr-4 placeholder:text-slate-500"
              />
              <datalist id="activity-suggestions">
                {ACTIVITIES.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-medium uppercase text-slate-400">Forecast</span>
            <div className="grid h-12 grid-cols-2 rounded-lg border border-white/10 bg-white/[0.045] p-1">
              {DATES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDate(d)}
                  className={`rounded-md text-sm font-semibold transition-all duration-300 ${
                    date === d
                      ? 'bg-white text-slate-950 shadow-lg shadow-sky-950/20'
                      : 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </label>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={ripple}
          className="btn-primary mt-4 flex h-[52px] w-full items-center justify-center gap-2 px-5 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
        >
          {loading ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={22} />
              Generate Intelligence
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}
