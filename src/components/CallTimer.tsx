import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface CallTimerProps {
  startTime: Date
}

export function CallTimer({ startTime }: CallTimerProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const hours = Math.floor(elapsed / 3600)
  const minutes = Math.floor((elapsed % 3600) / 60)
  const seconds = elapsed % 60

  const format = (n: number) => n.toString().padStart(2, '0')

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        background: 'rgba(255, 215, 0, 0.08)',
        border: '1px solid rgba(255, 215, 0, 0.25)',
        borderRadius: 8,
        color: '#FFD700',
        fontFamily: 'monospace',
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: '0.05em',
      }}
    >
      <Clock size={16} />
      {hours > 0 ? `${format(hours)}:` : ''}
      {format(minutes)}:{format(seconds)}
    </div>
  )
}
