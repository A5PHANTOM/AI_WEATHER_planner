import { motion } from 'framer-motion'
import { CloudSun, Gauge, MapPinned, ShieldCheck } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Hero() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-6xl px-4 pt-8 pb-6 sm:pt-10"
    >
      <motion.div variants={item} className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/10">
            <CloudSun size={20} className="text-sky-200" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">WeatherMind AI</div>
            <div className="text-xs text-muted">Outdoor intelligence</div>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-medium text-emerald-100 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          Live forecast engine
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <motion.div
            variants={item}
            className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.07] px-3 py-2 text-sm text-sky-100"
          >
            <ShieldCheck size={16} className="text-teal-200" />
            AI-powered weather decisioning
          </motion.div>

          <motion.h1
            variants={item}
            className="max-w-4xl text-4xl font-semibold leading-[1.06] text-white sm:text-5xl md:text-6xl"
          >
            Plan outdoors with a premium weather command center.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
          >
            WeatherMind turns live forecasts into clear activity guidance, risk scoring, and practical gear recommendations.
          </motion.p>
        </div>

        <motion.div variants={item} className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { icon: MapPinned, label: 'Location', value: 'Global' },
            { icon: Gauge, label: 'Risk', value: '0-100' },
            { icon: ShieldCheck, label: 'Decision', value: 'Instant' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass rounded-lg p-4">
              <Icon size={18} className="mb-3 text-sky-200" />
              <div className="text-lg font-semibold text-white">{value}</div>
              <div className="mt-1 text-xs text-muted">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div variants={item} className="premium-line mt-7 h-px w-full" />
    </motion.div>
  )
}
