import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import BackgroundEffects from '../components/BackgroundEffects.jsx'
import Hero from '../components/Hero.jsx'
import InputForm from '../components/InputForm.jsx'
import LoadingAnimation from '../components/LoadingAnimation.jsx'
import WeatherMetrics from '../components/WeatherMetrics.jsx'
import DecisionCard from '../components/DecisionCard.jsx'
import { analyzeWeather } from '../services/api.js'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [weather, setWeather] = useState(null)

  const handleAnalyze = async (location, activity, date) => {
    setLoading(true)
    setResult(null)
    setWeather(null)

    try {
      const data = await analyzeWeather(location, activity, date)
      setResult(data)
      setWeather(data.weather)
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Something went wrong. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen pb-20">
      <BackgroundEffects />

      <div className="relative z-10">
        <Hero />

        <InputForm onAnalyze={handleAnalyze} loading={loading} />

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingAnimation />
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <WeatherMetrics weather={weather} />
              <DecisionCard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
