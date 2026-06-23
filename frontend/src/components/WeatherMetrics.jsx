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
  { key: 'temperature', label: 'Temperature', icon: Thermometer, suffix: '°C', color: 'text-amber-200', bg: 'bg-amber-300/10' },
  { key: 'humidity', label: 'Humidity', icon: Droplets, suffix: '%', color: 'text-sky-200', bg: 'bg-sky-300/10' },
  { key: 'wind_speed', label: 'Wind Speed', icon: Wind, suffix: ' m/s', color: 'text-teal-200', bg: 'bg-teal-300/10' },
  { key: 'rain_probability', label: 'Rain Chance', icon: Umbrella, suffix: '%', color: 'text-indigo-200', bg: 'bg-indigo-300/10' },
  { key: 'uv_index', label: 'UV Index', icon: SunDim, suffix: '', color: 'text-orange-200', bg: 'bg-orange-300/10' },
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
      className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-5"
    >
      {METRICS_CONFIG.map(({ key, label, icon: Icon, suffix, color, bg }) => {
        let val = weather[key]
        if (val === undefined || val === null) return null
        val = Math.round(val)
        return (
          <motion.div
            key={key}
            variants={item}
            whileHover={{ scale: 1.04, y: -4 }}
            className="glass glass-hover rounded-lg p-4"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-white/25" />
            </div>
            <div className="text-2xl font-semibold text-white">
              <CountUp value={val} suffix={suffix} />
            </div>
            <div className="mt-1 text-xs text-muted">
              {label}
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
