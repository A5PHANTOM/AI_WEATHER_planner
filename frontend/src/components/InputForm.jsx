import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Activity, Sparkles, Loader2, GitCompare } from 'lucide-react'

const ACTIVITIES = [
  'Running', 'Cycling', 'Cricket', 'Football',
  'Trekking', 'Beach Trip', 'Picnic', 'Outdoor Event',
  'Yoga', 'Photography', 'Gardening', 'Dog Walking',
  'Stargazing', 'Fishing', 'Hiking', 'Camping',
]
const DATES = ['Today', 'Tomorrow', 'Best Day']

export default function InputForm({ onAnalyze, onCompare, loading }) {
  const [location, setLocation] = useState('')
  const [activity, setActivity] = useState('')
  const [date, setDate] = useState('Today')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!location.trim()) errs.location = 'Location is required'
    else if (location.trim().length > 200) errs.location = 'Location is too long'
    if (!activity.trim()) errs.activity = 'Activity is required'
    else if (activity.trim().length < 2) errs.activity = 'Activity must be at least 2 characters'
    else if (activity.trim().length > 100) errs.activity = 'Activity must be 100 characters or fewer'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onAnalyze(location.trim(), activity.trim(), date)
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
      <form onSubmit={handleSubmit} className="glass rounded-lg p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.9fr_0.8fr]">
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase text-slate-400">Location</span>
            <div className="relative">
              <MapPin size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-200/70" />
              <input
                type="text"
                placeholder="Mumbai, London, New York..."
                value={location}
                onChange={(e) => { setLocation(e.target.value); setErrors((prev) => ({ ...prev, location: undefined })) }}
                maxLength={200}
                className={`field h-12 pl-12 pr-4 placeholder:text-slate-500 ${errors.location ? 'border-red-400/50 ring-2 ring-red-400/20' : ''}`}
              />
              {errors.location && <p className="mt-1 text-xs text-red-300">{errors.location}</p>}
            </div>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase text-slate-400">Activity</span>
            <div className="relative">
              <Activity size={18} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sky-200/70" />
              <input
                type="text"
                list="activity-suggestions"
                placeholder="Running, gardening, photography..."
                value={activity}
                onChange={(e) => { setActivity(e.target.value); setErrors((prev) => ({ ...prev, activity: undefined })) }}
                maxLength={100}
                className={`field h-12 pl-12 pr-4 placeholder:text-slate-500 ${errors.activity ? 'border-red-400/50 ring-2 ring-red-400/20' : ''}`}
              />
              <datalist id="activity-suggestions">
                {ACTIVITIES.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
              {errors.activity && <p className="mt-1 text-xs text-red-300">{errors.activity}</p>}
            </div>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase text-slate-400">Forecast</span>
            <div className="grid h-12 grid-cols-3 rounded-lg border border-white/10 bg-white/[0.045] p-1">
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
            {date === 'Best Day' && (
              <p className="mt-1 text-xs text-sky-300">Scans 7 days to find the best day</p>
            )}
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={ripple}
            className="btn-primary flex h-[52px] flex-1 items-center justify-center gap-2 px-5 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
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
          {onCompare && (
            <motion.button
              type="button"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCompare(activity, date)}
              className="flex h-[52px] items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-4 text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.1] disabled:opacity-40"
            >
              <GitCompare size={20} />
              Compare
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  )
}