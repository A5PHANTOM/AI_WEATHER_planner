import { motion } from 'framer-motion'
import {
  ShieldCheck, ShieldAlert, ShieldX, Clock, Lightbulb, Backpack,
} from 'lucide-react'

const DECISION_STYLES = {
  Proceed: {
    icon: ShieldCheck,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    bar: 'bg-gradient-to-r from-green-400 to-emerald-500',
    label: 'Proceed',
  },
  'Proceed with Caution': {
    icon: ShieldAlert,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    bar: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    label: 'Proceed with Caution',
  },
  'Not Recommended': {
    icon: ShieldX,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    bar: 'bg-gradient-to-r from-red-400 to-rose-500',
    label: 'Not Recommended',
  },
}

function RiskBar({ score }) {
  const hue = 120 - score * 1.2
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted">Risk Score</span>
        <span className="font-bold text-white">{score}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `hsl(${hue}, 80%, 50%)` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function GearList({ items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Backpack size={15} />
        <span className="font-medium">Recommended Gear</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <motion.span
            key={item}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="rounded-md border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-white/90"
          >
            {item}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

export default function DecisionCard({ result }) {
  if (!result) return null

  const style = DECISION_STYLES[result.decision] || DECISION_STYLES['Not Recommended']
  const Icon = style.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto mt-8 max-w-6xl px-4"
    >
      <div className="glass glow rounded-lg p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 12,
                  delay: 0.2,
                }}
                className={`rounded-lg ${style.bg} ${style.border} border p-3`}
              >
                <Icon size={30} className={style.color} />
              </motion.div>
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-2xl font-semibold ${style.color}`}
                >
                  {style.label}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-1 text-sm text-muted"
                >
                  AI decision analysis
                </motion.p>
              </div>
            </div>

            <RiskBar score={result.risk_score} />

            <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
              <div className="mb-1 flex items-center gap-2 text-sm text-slate-300">
                <Clock size={15} className="text-sky-200" />
                Best Time
              </div>
              <div className="text-lg font-semibold text-white">{result.best_time}</div>
            </div>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="rounded-lg border border-white/10 bg-white/[0.055] p-4"
            >
              <div className="mb-3 flex items-center gap-2 text-sm text-muted">
                <Lightbulb size={15} />
                <span className="font-medium">Analysis</span>
              </div>
              <p className="text-sm leading-6 text-white/80">
                {result.analysis}
              </p>
            </motion.div>
            <GearList items={result.gear} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
