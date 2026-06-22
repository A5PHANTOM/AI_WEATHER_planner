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
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted">Risk Score</span>
        <span className="font-bold text-white">{score}/100</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
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
            className="glass rounded-lg px-3 py-1.5 text-sm text-white/90"
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
      className="max-w-2xl mx-auto px-4 mt-8"
    >
      <div className="glass rounded-3xl p-6 sm:p-8 space-y-6 glow">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 12,
              delay: 0.2,
            }}
            className={`p-3 rounded-xl ${style.bg} ${style.border} border`}
          >
            <Icon size={28} className={style.color} />
          </motion.div>
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-lg font-bold ${style.color}`}
            >
              {style.label}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-muted"
            >
              AI Decision Analysis
            </motion.p>
          </div>
        </div>

        <RiskBar score={result.risk_score} />

        <div className="flex items-center gap-2 text-sm text-white/80">
          <Clock size={15} className="text-accent" />
          <span className="text-muted">Best Time:</span>
          <span className="font-semibold">{result.best_time}</span>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl p-4 space-y-2"
        >
          <div className="flex items-center gap-2 text-sm text-muted">
            <Lightbulb size={15} />
            <span className="font-medium">Analysis</span>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">
            {result.analysis}
          </p>
        </motion.div>

        <GearList items={result.gear} />
      </div>
    </motion.div>
  )
}
