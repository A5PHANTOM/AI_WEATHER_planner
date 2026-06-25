import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'

export default function SafetyWarningsCard({ warnings }) {
  if (!warnings || warnings.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-lg p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <ShieldAlert size={18} className="text-amber-300" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Safety Warnings</h3>
      </div>
      <ul className="space-y-2">
        {warnings.map((warning, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-start gap-2 rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2 text-sm text-amber-200"
          >
            <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
            {warning}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
