import { AlertTriangle } from 'lucide-react'

interface SOSButtonProps {
  onClick: () => void
  size?: 'sm' | 'md' | 'lg'
}

export function SOSButton({ onClick, size = 'lg' }: SOSButtonProps) {
  const sizes = {
    sm: { outer: 120, inner: 90, fontSize: '1.4rem', iconSize: 24 },
    md: { outer: 160, inner: 120, fontSize: '1.8rem', iconSize: 32 },
    lg: { outer: 220, inner: 170, fontSize: '2.4rem', iconSize: 44 },
  }
  const s = sizes[size]

  return (
    <div className="flex items-center justify-center">
      {/* Outer pulse rings */}
      <div style={{ position: 'relative', width: s.outer, height: s.outer }}>
        {/* Ring 3 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(255, 30, 30, 0.15)',
            animation: 'radar-ping 2.4s ease-out infinite',
            animationDelay: '0s',
          }}
        />
        {/* Ring 2 */}
        <div
          style={{
            position: 'absolute',
            inset: '10px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 30, 30, 0.25)',
            animation: 'radar-ping 2.4s ease-out infinite',
            animationDelay: '0.8s',
          }}
        />
        {/* Ring 1 */}
        <div
          style={{
            position: 'absolute',
            inset: '20px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 30, 30, 0.4)',
            animation: 'radar-ping 2.4s ease-out infinite',
            animationDelay: '1.6s',
          }}
        />

        {/* Main button */}
        <button
          onClick={onClick}
          style={{
            position: 'absolute',
            inset: `${(s.outer - s.inner) / 2}px`,
            width: s.inner,
            height: s.inner,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #FF3333, #CC0000)',
            border: '4px solid rgba(255, 80, 80, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            cursor: 'pointer',
            animation: 'pulse-sos 2s ease-in-out infinite',
            boxShadow: '0 0 40px rgba(255, 30, 30, 0.6), 0 8px 32px rgba(0,0,0,0.5)',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={e => {
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.95)'
          }}
          onMouseUp={e => {
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
          }}
          aria-label="Botão de SOS - Abrir chamado de emergência"
        >
          <AlertTriangle
            size={s.iconSize}
            color="white"
            strokeWidth={2.5}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
          />
          <span
            style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: s.fontSize,
              color: 'white',
              letterSpacing: '0.1em',
              lineHeight: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.4)',
            }}
          >
            SOS
          </span>
        </button>
      </div>
    </div>
  )
}
