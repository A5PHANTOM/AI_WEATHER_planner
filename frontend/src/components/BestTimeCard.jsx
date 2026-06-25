import { motion } from 'framer-motion'
import { Clock, CalendarDays } from 'lucide-react'

export default function BestTimeCard({ bestTime, bestDay }) {
  if (!bestTime && !bestDay) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-lg p-5"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Best Timing</h3>
      <div className="space-y-4">
        {bestTime && (
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-300/10">
              <Clock size={20} className="text-sky-200" />
            </div>
            <div>
              <div className="text-sm text-muted">Best Time Window</div>
              <div className="text-lg font-semibold text-white">{bestTime.label}</div>
              {bestTime.risk_score !== undefined && (
                <div className="text-xs text-muted">Risk score: {bestTime.risk_score}/100</div>
              )}
            </div>
          </div>
        )}
        {bestDay && (
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-300/10">
              <CalendarDays size={20} className="text-emerald-200" />
            </div>
            <div>
              <div className="text-sm text-muted">Best Day</div>
              <div className="text-lg font-semibold text-white">{bestDay.date}</div>
              <div className="flex gap-2 text-xs text-muted">
                <span>Risk: {bestDay.risk_score}/100</span>
                {bestDay.description && <span>- {bestDay.description}</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
