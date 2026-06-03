'use client'
import { useState, useEffect } from 'react'
import AnimatedBackground from '@/components/background'

export default function MouseTracker() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0">
        <AnimatedBackground mousePosition={mousePosition} />
      </div>
    </div>
  )
}
