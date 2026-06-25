import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MessageCircle, Sparkles } from 'lucide-react'
import { followUp } from '../services/api.js'

const EXAMPLES = [
  'What if I go at 6 PM?',
  'Is it safe for kids?',
  'What should I wear?',
  'Compare this with Pune',
]

export default function FollowUpInput({ context, onResult }) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return
    setLoading(true)
    const q = question.trim()
    setHistory((prev) => [...prev, { role: 'user', text: q }])
    setQuestion('')
    try {
      const data = await followUp(q, context)
      const responseText = data.message || data.type || 'Got it! Check the results above.'
      setHistory((prev) => [...prev, { role: 'assistant', text: responseText }])
      if (onResult) onResult(data)
    } catch {
      setHistory((prev) => [...prev, { role: 'assistant', text: 'Sorry, I could not process that. Try rephrasing.' }])
    } finally {
      setLoading(false)
    }
  }

  if (!context) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="mx-auto mt-6 max-w-6xl px-4"
    >
      <div className="glass rounded-lg p-5">
        <div className="mb-3 flex items-center gap-2">
          <MessageCircle size={18} className="text-sky-200" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Ask a Follow-Up</h3>
        </div>

        {history.length === 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => { setQuestion(ex); setHistory([{ role: 'assistant', text: 'Ask away!' }]) }}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-sky-300/30 hover:bg-sky-300/10 hover:text-sky-200"
              >
                <Sparkles size={12} className="mr-1 inline" />
                {ex}
              </button>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <div className="mb-4 max-h-48 space-y-2 overflow-y-auto rounded-lg bg-black/20 p-3">
            {history.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-sky-500/20 text-sky-100'
                    : 'bg-white/[0.06] text-white/80'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask a question about this plan..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="field h-10 flex-1 px-4 text-sm placeholder:text-slate-500"
          />
          <motion.button
            type="submit"
            disabled={loading || !question.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-200 transition-colors hover:bg-sky-500/30 disabled:opacity-40"
          >
            <Send size={16} />
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}
