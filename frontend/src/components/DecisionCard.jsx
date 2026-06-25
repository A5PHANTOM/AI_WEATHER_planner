import { motion } from 'framer-motion'
import { ShieldCheck, ShieldAlert, ShieldX, Lightbulb } from 'lucide-react'

const DECISION_STYLES = {
  Proceed: {
    icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-500/10',
    border: 'border-green-500/30', bar: 'bg-gradient-to-r from-green-400 to-emerald-500', label: 'Proceed',
  },
  'Proceed with Caution': {
    icon: ShieldAlert, color: 'text-yellow-400', bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30', bar: 'bg-gradient-to-r from-yellow-400 to-orange-500', label: 'Proceed with Caution',
  },
  'Not Recommended': {
    icon: ShieldX, color: 'text-red-400', bg: 'bg-red-500/10',
    border: 'border-red-500/30', bar: 'bg-gradient-to-r from-red-400 to-rose-500', label: 'Not Recommended',
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

function ConfidenceBadge({ score }) {
  if (score === undefined || score === null) return null
  const color = score >= 80 ? 'text-green-300 border-green-500/20 bg-green-500/10'
    : score >= 60 ? 'text-yellow-300 border-yellow-500/20 bg-yellow-500/10'
    : 'text-red-300 border-red-500/20 bg-red-500/10'
  return (
    <div className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${color}`}>
      Confidence: {score}%
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
      className="rounded-lg p-5 sm:p-6"
      style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.105), rgba(255,255,255,0.055))', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.13)' }}
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
              className={`rounded-lg ${style.bg} ${style.border} border p-3`}
            >
              <Icon size={30} className={style.color} />
            </motion.div>
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className={`text-2xl font-semibold ${style.color}`}>
                {style.label}
              </motion.div>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-sm text-muted">
                  {result.weather_summary?.location || 'Weather'} analysis
                </span>
                <ConfidenceBadge score={result.confidence_score} />
              </div>
            </div>
          </div>
          <RiskBar score={result.risk_score} />
        </div>
        <div className="space-y-4">
          {result.explanation && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-muted">
                <Lightbulb size={15} />
                <span className="font-medium">Analysis</span>
              </div>
              <p className="text-sm leading-6 text-white/80">{result.explanation}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
