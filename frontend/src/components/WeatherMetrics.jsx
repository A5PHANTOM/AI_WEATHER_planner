import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Thermometer, Droplets, Wind, Umbrella, SunDim,
} from 'lucide-react'

function CountUp({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1000
    const step = Math.max(1, Math.floor(value / (duration / 16)))
    const timer = setInterval(() => {
      start += step
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  )
}

const METRICS_CONFIG = [
  { key: 'temperature', label: 'Temperature', icon: Thermometer, suffix: '°C', color: 'from-orange-400 to-red-500' },
  { key: 'humidity', label: 'Humidity', icon: Droplets, suffix: '%', color: 'from-blue-400 to-cyan-500' },
  { key: 'wind_speed', label: 'Wind Speed', icon: Wind, suffix: ' m/s', color: 'from-teal-400 to-emerald-500' },
  { key: 'rain_probability', label: 'Rain Probability', icon: Umbrella, suffix: '%', color: 'from-sky-400 to-indigo-500' },
  { key: 'uv_index', label: 'UV Index', icon: SunDim, suffix: '', color: 'from-yellow-400 to-orange-500' },
]

export default function WeatherMetrics({ weather }) {
  if (!weather) return null

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto px-4 mt-6"
    >
      {METRICS_CONFIG.map(({ key, label, icon: Icon, suffix, color }) => {
        let val = weather[key]
        if (val === undefined || val === null) return null
        val = Math.round(val)
        return (
          <motion.div
            key={key}
            variants={item}
            whileHover={{ scale: 1.04, y: -4 }}
            className="glass rounded-2xl p-4 text-center glass-hover"
          >
            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${color} mb-2`}>
              <Icon size={18} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-white">
              <CountUp value={val} suffix={suffix} />
            </div>
            <div className="text-xs text-muted mt-0.5 uppercase tracking-wider">
              {label}
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
