import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Activity, Calendar, Sparkles, Loader2 } from 'lucide-react'

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
      className="max-w-2xl mx-auto px-4"
    >
      <style>{`
        @keyframes rippleAnim {
          to { transform: scale(4); opacity: 0; }
        }
      `}</style>
      <form
        onSubmit={handleSubmit}
        className="glass rounded-3xl p-6 sm:p-8 space-y-5"
      >
        <div className="relative">
          <MapPin
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="text"
            placeholder="Enter your location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white/5 border border-glassBorder rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Activity
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10"
            />
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full appearance-none bg-white/5 border border-glassBorder rounded-xl pl-12 pr-10 py-3.5 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-300 cursor-pointer"
            >
              <option value="" disabled className="bg-dark text-muted">
                Select activity
              </option>
              {ACTIVITIES.map((a) => (
                <option key={a} value={a} className="bg-dark">
                  {a}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10"
            />
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full appearance-none bg-white/5 border border-glassBorder rounded-xl pl-12 pr-10 py-3.5 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-300 cursor-pointer"
            >
              {DATES.map((d) => (
                <option key={d} value={d} className="bg-dark">
                  {d}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={ripple}
          className="btn-primary w-full py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
