import { motion } from 'framer-motion'
import { Shuffle } from 'lucide-react'

export default function AlternativeSuggestions({ alternatives }) {
  if (!alternatives || alternatives.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass rounded-lg p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <Shuffle size={18} className="text-teal-200" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Alternatives</h3>
      </div>
      <div className="space-y-2">
        {alternatives.map((alt, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-3"
          >
            <div className="text-sm font-medium text-white">{alt.activity}</div>
            <div className="mt-1 text-xs text-muted">{alt.reason}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
