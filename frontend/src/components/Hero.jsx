import { motion } from 'framer-motion'
import { CloudSun } from 'lucide-react'

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
      className="text-center pt-20 pb-10 px-4"
    >
      <motion.div variants={item} className="mb-6">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-muted">
          <CloudSun size={16} className="text-accent" />
          AI-Powered Weather Intelligence
        </div>
      </motion.div>

      <motion.h1
        variants={item}
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-4"
      >
        <span className="text-gradient">WeatherMind</span>
        <span className="text-white"> AI</span>
      </motion.h1>

      <motion.p
        variants={item}
        className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
      >
        Make smarter outdoor decisions using AI-powered weather intelligence.
      </motion.p>
    </motion.div>
  )
}
