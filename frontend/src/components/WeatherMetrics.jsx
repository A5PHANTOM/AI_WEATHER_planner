import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Thermometer, Droplets, Wind, Umbrella, SunDim, Gauge, CloudSun } from 'lucide-react'

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
      if (start >= value) { setDisplay(value); clearInterval(timer) }
      else { setDisplay(start) }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])
  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>
}

function getCurrentMetrics(weatherSummary) {
  if (!weatherSummary || !weatherSummary.current) return []
  const c = weatherSummary.current
  const aqi = weatherSummary.aqi
  const daily = weatherSummary.daily?.[0]

  const items = [
    { key: 'temperature', label: 'Temperature', icon: Thermometer, value: c.temperature, suffix: '\u00b0C', color: 'text-amber-200', bg: 'bg-amber-300/10' },
    { key: 'humidity', label: 'Humidity', icon: Droplets, value: c.humidity, suffix: '%', color: 'text-sky-200', bg: 'bg-sky-300/10' },
    { key: 'wind_speed', label: 'Wind', icon: Wind, value: c.wind_speed, suffix: ' m/s', color: 'text-teal-200', bg: 'bg-teal-300/10' },
  ]

  if (daily && daily.precipitation_probability_max !== undefined) {
    items.push({ key: 'rain', label: 'Rain Chance', icon: Umbrella, value: daily.precipitation_probability_max, suffix: '%', color: 'text-indigo-200', bg: 'bg-indigo-300/10' })
  }

  items.push({ key: 'uv', label: 'UV Index', icon: SunDim, value: c.uv_index, suffix: '', color: 'text-orange-200', bg: 'bg-orange-300/10' })

  if (aqi && aqi.european_aqi !== null && aqi.european_aqi !== undefined) {
    items.push({ key: 'aqi', label: 'AQI', icon: Gauge, value: aqi.european_aqi, suffix: '', color: 'text-emerald-200', bg: 'bg-emerald-300/10' })
  }

  items.push({ key: 'feels_like', label: 'Feels Like', icon: CloudSun, value: c.feels_like, suffix: '\u00b0C', color: 'text-rose-200', bg: 'bg-rose-300/10' })

  return items
}

export default function WeatherMetrics({ weatherSummary }) {
  if (!weatherSummary || !weatherSummary.current) return null

  const metrics = getCurrentMetrics(weatherSummary)

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  }
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {metrics.map(({ key, label, icon: Icon, value, suffix, color, bg }) => {
        const val = Math.round(value)
        return (
          <motion.div key={key} variants={item} whileHover={{ scale: 1.04, y: -4 }} className="glass glass-hover rounded-lg p-4">
            <div className="mb-5 flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-white/25" />
            </div>
            <div className="text-2xl font-semibold text-white">
              <CountUp value={val} suffix={suffix} />
            </div>
            <div className="mt-1 text-xs text-muted">{label}</div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
