import { useState } from 'react'
import { motion } from 'framer-motion'
import { Backpack, CheckCircle2, Circle } from 'lucide-react'

export default function GearChecklist({ gear }) {
  const [checked, setChecked] = useState({})

  if (!gear || gear.length === 0) return null

  const toggle = (i) => {
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass rounded-lg p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <Backpack size={18} className="text-sky-200" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Recommended Gear</h3>
      </div>
      <ul className="space-y-2">
        {gear.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white/[0.06]"
            >
              {checked[i] ? (
                <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-400" />
              ) : (
                <Circle size={18} className="flex-shrink-0 text-slate-500" />
              )}
              <span className={checked[i] ? 'text-white/50 line-through' : 'text-white/90'}>
                {item}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
