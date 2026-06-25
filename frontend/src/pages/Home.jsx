import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import BackgroundEffects from '../components/BackgroundEffects.jsx'
import Hero from '../components/Hero.jsx'
import InputForm from '../components/InputForm.jsx'
import LoadingAnimation from '../components/LoadingAnimation.jsx'
import ResultDashboard from '../components/ResultDashboard.jsx'
import CompareView from '../components/CompareView.jsx'
import { analyzeWeather } from '../services/api.js'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [context, setContext] = useState(null)
  const [showCompare, setShowCompare] = useState(false)

  const handleAnalyze = async (location, activity, date) => {
    setLoading(true)
    setResult(null)
    setShowCompare(false)
    try {
      const data = await analyzeWeather(location, activity, date)
      setResult(data)
      setContext({ location, activity, date })
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Something went wrong.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleCompare = (activity, date) => {
    setShowCompare(true)
    setResult(null)
    setContext((prev) => ({ ...prev, activity, date }))
  }

  return (
    <div className="relative min-h-screen pb-20">
      <BackgroundEffects />
      <div className="relative z-10">
        <Hero />
        <InputForm onAnalyze={handleAnalyze} onCompare={handleCompare} loading={loading} />
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingAnimation />
            </motion.div>
          )}
          {showCompare && !loading && (
            <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CompareView
                activity={context?.activity || ''}
                date={context?.date || 'Today'}
                onBack={() => setShowCompare(false)}
              />
            </motion.div>
          )}
          {result && !loading && !showCompare && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultDashboard
                result={result}
                context={context}
                onFollowUpResult={() => {}}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
