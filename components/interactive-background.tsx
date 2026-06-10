'use client'

import { useEffect, useRef } from 'react'

export function InteractiveBackground() {
  const glowRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // start centered
    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 3 }
    current.current = { ...target.current }

    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      // ease toward the cursor for a smooth trailing glow
      current.current.x += (target.current.x - current.current.x) * 0.08
      current.current.y += (target.current.y - current.current.y) * 0.08

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* base grid texture */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage:
            'radial-gradient(circle at 50% 30%, black, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(circle at 50% 30%, black, transparent 80%)',
        }}
      />

      {/* cursor-following neon glow */}
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{
          marginLeft: '-18rem',
          marginTop: '-18rem',
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}
