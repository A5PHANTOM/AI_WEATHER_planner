import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine,
} from 'recharts'

function formatHourLabel(isoTime) {
  try {
    const t = isoTime.split('T')[1]
    const h = parseInt(t.split(':')[0], 10)
    if (h === 0) return '12a'
    if (h < 12) return `${h}a`
    if (h === 12) return '12p'
    return `${h - 12}p`
  } catch { return '' }
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="glass rounded-lg border border-white/15 px-3 py-2 text-sm shadow-xl">
      <div className="text-white/60 text-xs">{d.time?.split('T')[1]?.slice(0, 5) || ''}</div>
      <div className="font-semibold text-white">Risk: {d.risk_score}</div>
      <div className="text-white/70">{d.temperature}\u00b0C · {d.description}</div>
      {d.precipitation_probability > 0 && <div className="text-white/60">Rain: {d.precipitation_probability}%</div>}
    </div>
  )
}

export default function HourlyTimelineChart({ timeline, timeframe }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  if (!timeline || timeline.length === 0) return null

  const data = timeline.map((h) => ({
    ...h,
    label: formatHourLabel(h.time),
  }))

  const maxRisk = Math.max(...data.map((d) => d.risk_score), 30)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass rounded-lg p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Hourly Risk Timeline
        </h3>
        <span className="text-xs text-muted">{timeframe || '24-hour forecast'}</span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 6, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, maxRisk + 10]}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <ReferenceLine y={30} stroke="rgba(34,197,94,0.5)" strokeDasharray="3 3" />
          <ReferenceLine y={60} stroke="rgba(234,179,8,0.5)" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="risk_score"
            stroke="#60a5fa"
            strokeWidth={2}
            fill="url(#riskGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#60a5fa', stroke: '#1e3a5f', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-white/50">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Low</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Moderate</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> High</span>
      </div>
    </motion.div>
  )
}
