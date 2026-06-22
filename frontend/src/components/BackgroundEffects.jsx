import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
        ctx.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}

function Blob({ className, color, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
      style={{ background: color }}
      animate={{
        x: [0, 60, -40, 30, 0],
        y: [0, -50, 40, -30, 0],
        scale: [1, 1.2, 0.9, 1.1, 1],
      }}
      transition={{
        duration: 12 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}

function Aurora() {
  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-[500px] opacity-[0.04] pointer-events-none"
      style={{
        background:
          'linear-gradient(180deg, #00E5FF 0%, #7C3AED 40%, transparent 100%)',
        filter: 'blur(60px)',
      }}
      animate={{ opacity: [0.03, 0.06, 0.03] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <Aurora />
      <Blob
        className="top-[-100px] left-[-100px] w-[500px] h-[500px]"
        color="radial-gradient(circle, #00E5FF, transparent)"
      />
      <Blob
        className="bottom-[-150px] right-[-100px] w-[600px] h-[600px]"
        color="radial-gradient(circle, #7C3AED, transparent)"
        delay={3}
      />
      <Blob
        className="top-[40%] right-[20%] w-[400px] h-[400px]"
        color="radial-gradient(circle, #00E5FF, transparent)"
        delay={6}
      />
      <Particles />
    </div>
  )
}
