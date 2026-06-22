import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CloudSun, Brain, ShieldCheck, Trees } from 'lucide-react'

const STEPS = [
  { icon: CloudSun, text: 'Analyzing weather patterns...' },
  { icon: Brain, text: 'Calculating risk score...' },
  { icon: ShieldCheck, text: 'Generating recommendations...' },
  { icon: Trees, text: 'Preparing outdoor intelligence...' },
]

export default function LoadingAnimation() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step >= STEPS.length) return
    const t = setTimeout(() => setStep((s) => s + 1), 1200)
    return () => clearTimeout(t)
  }, [step])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto mt-10 px-4"
    >
      <div className="glass rounded-3xl p-8 space-y-6 text-center">
        <AnimatePresence mode="wait">
          {step < STEPS.length && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4"
            >
              {(() => {
                const Icon = STEPS[step].icon
                return (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Icon size={40} className="text-accent" />
                  </motion.div>
                )
              })()}
              <p className="text-lg font-medium text-white">
                {STEPS[step].text}
              </p>
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= step ? 'bg-accent' : 'bg-white/20'
                    }`}
                    animate={i === step ? { scale: [1, 1.5, 1] } : {}}
                    transition={
                      i === step
                        ? { duration: 1, repeat: Infinity }
                        : {}
                    }
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step >= STEPS.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <CloudSun size={36} className="text-accent" />
            </motion.div>
            <p className="text-white/80">Finalizing intelligence...</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
