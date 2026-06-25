import { motion } from 'framer-motion'

const SEVERITY_COLORS = {
  low: { bg: 'bg-green-500/20', text: 'text-green-300', bar: 'bg-green-400' },
  moderate: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', bar: 'bg-yellow-400' },
  high: { bg: 'bg-orange-500/20', text: 'text-orange-300', bar: 'bg-orange-400' },
  extreme: { bg: 'bg-red-500/20', text: 'text-red-300', bar: 'bg-red-400' },
}

export default function RiskBreakdownCard({ breakdown }) {
  if (!breakdown || breakdown.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-lg p-5"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Risk Breakdown</h3>
      <div className="space-y-3">
        {breakdown.map((factor, i) => {
          const colors = SEVERITY_COLORS[factor.severity] || SEVERITY_COLORS.moderate
          return (
            <motion.div
              key={factor.factor}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <div className="mb-1 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {factor.severity}
                  </span>
                  <span className="text-white/80">{factor.factor}</span>
                </div>
                <span className="text-muted">{factor.value}{factor.factor === 'Temperature' ? '\u00b0C' : factor.factor === 'Wind' || factor.factor === 'Wind Gusts' ? ' m/s' : ''}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className={`h-full rounded-full ${colors.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.score}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                />
              </div>
              <div className="mt-0.5 flex justify-between text-xs text-muted">
                <span>Score: {Math.round(factor.score)}</span>
                <span>Weight: {(factor.weight * 100).toFixed(0)}%</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
