import { useNavigate } from 'react-router-dom'
import { Phone, AlertTriangle, Info, ChevronRight, Shield, Zap, Clock } from 'lucide-react'
import { SOSButton } from '@/components/SOSButton'
import { GPSStatus } from '@/components/GPSStatus'

export function Home() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--asphalt-900)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Highway road stripes background */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: 'repeating-linear-gradient(90deg, #FFD700 0px, #FFD700 60px, transparent 60px, transparent 100px)',
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'var(--yellow-vivid)',
          opacity: 0.8,
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(255,30,30,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'radial-gradient(circle at 35% 35%, #FF3333, #AA0000)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(255, 30, 30, 0.5)',
            }}
          >
            <AlertTriangle size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 22,
                letterSpacing: '0.12em',
                color: '#F5F5F5',
                lineHeight: 1,
              }}
            >
              RODO
              <span style={{ color: '#FFD700', animation: 'glow-yellow 3s ease-in-out infinite' }}>
                SOS
              </span>
            </div>
            <div style={{ fontSize: 10, color: '#6B6B6B', letterSpacing: '0.15em' }}>
              EMERGÊNCIAS RODOVIÁRIAS
            </div>
          </div>
        </div>

        {/* Top right: GPS compact */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <GPSStatus compact />
          <button
            onClick={() => navigate('/info')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '6px 8px',
              cursor: 'pointer',
              color: '#B0B0B0',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Info size={18} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          gap: 48,
        }}
      >
        {/* Hero section */}
        <div style={{ textAlign: 'center', animation: 'slide-in-up 0.5s ease-out' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 14px',
              background: 'rgba(255, 30, 30, 0.12)',
              border: '1px solid rgba(255, 30, 30, 0.3)',
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 700,
              color: '#FF5252',
              letterSpacing: '0.15em',
              marginBottom: 20,
            }}
          >
            ⚡ CENTRAL DE EMERGÊNCIA 24H
          </div>

          <h1
            style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 'clamp(3rem, 10vw, 5.5rem)',
              lineHeight: 0.9,
              letterSpacing: '0.05em',
              marginBottom: 16,
            }}
          >
            <span style={{ color: '#F5F5F5', display: 'block' }}>EMERGÊNCIA</span>
            <span style={{ color: '#FFD700', display: 'block', animation: 'glow-yellow 3s ease-in-out infinite' }}>
              NA RODOVIA?
            </span>
          </h1>

          <p
            style={{
              fontSize: 16,
              color: '#B0B0B0',
              maxWidth: 360,
              lineHeight: 1.6,
            }}
          >
            Pressione o botão SOS para abrir um chamado imediato com nossa central de atendimento.
          </p>
        </div>

        {/* SOS Button */}
        <div style={{ animation: 'slide-in-up 0.6s ease-out 0.1s both' }}>
          <SOSButton onClick={() => navigate('/chamado')} size="lg" />
          <p
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontSize: 13,
              color: '#6B6B6B',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Toque para acionar
          </p>
        </div>

        {/* Quick actions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            width: '100%',
            maxWidth: 480,
            animation: 'slide-in-up 0.6s ease-out 0.2s both',
          }}
        >
          <button
            onClick={() => navigate('/chamado')}
            className="card-dark"
            style={{
              padding: '16px',
              cursor: 'pointer',
              border: 'none',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'border-color 0.2s, background 0.2s',
              borderRadius: 12,
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 215, 0, 0.3)'
              ;(e.currentTarget as HTMLElement).style.background = '#1C1C1C'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#2E2E2E'
              ;(e.currentTarget as HTMLElement).style.background = '#141414'
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(255, 215, 0, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={18} color="#FFD700" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F5F5F5', marginBottom: 3 }}>
                Abrir Chamado
              </div>
              <div style={{ fontSize: 11, color: '#6B6B6B' }}>Registrar ocorrência</div>
            </div>
            <ChevronRight size={14} color="#3D3D3D" style={{ alignSelf: 'flex-end' }} />
          </button>

          <a
            href="tel:190"
            className="card-dark"
            style={{
              padding: '16px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'border-color 0.2s, background 0.2s',
              borderRadius: 12,
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 30, 30, 0.3)'
              ;(e.currentTarget as HTMLElement).style.background = '#1C1C1C'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#2E2E2E'
              ;(e.currentTarget as HTMLElement).style.background = '#141414'
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(255, 30, 30, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Phone size={18} color="#FF5252" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F5F5F5', marginBottom: 3 }}>
                Ligar 190
              </div>
              <div style={{ fontSize: 11, color: '#6B6B6B' }}>Polícia Rodoviária</div>
            </div>
            <ChevronRight size={14} color="#3D3D3D" style={{ alignSelf: 'flex-end' }} />
          </a>

          <a
            href="tel:192"
            className="card-dark"
            style={{
              padding: '16px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'border-color 0.2s, background 0.2s',
              borderRadius: 12,
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 80, 80, 0.3)'
              ;(e.currentTarget as HTMLElement).style.background = '#1C1C1C'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#2E2E2E'
              ;(e.currentTarget as HTMLElement).style.background = '#141414'
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(255, 65, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={18} color="#FF4081" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F5F5F5', marginBottom: 3 }}>
                SAMU 192
              </div>
              <div style={{ fontSize: 11, color: '#6B6B6B' }}>Ambulância</div>
            </div>
            <ChevronRight size={14} color="#3D3D3D" style={{ alignSelf: 'flex-end' }} />
          </a>

          <button
            onClick={() => navigate('/chamado')}
            className="card-dark"
            style={{
              padding: '16px',
              cursor: 'pointer',
              border: 'none',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'border-color 0.2s, background 0.2s',
              borderRadius: 12,
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(68, 138, 255, 0.3)'
              ;(e.currentTarget as HTMLElement).style.background = '#1C1C1C'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#2E2E2E'
              ;(e.currentTarget as HTMLElement).style.background = '#141414'
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(68, 138, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={18} color="#448AFF" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F5F5F5', marginBottom: 3 }}>
                Histórico
              </div>
              <div style={{ fontSize: 11, color: '#6B6B6B' }}>Meus chamados</div>
            </div>
            <ChevronRight size={14} color="#3D3D3D" style={{ alignSelf: 'flex-end' }} />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '16px 24px 28px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <p style={{ fontSize: 11, color: '#3D3D3D', letterSpacing: '0.1em' }}>
          RODO SOS © 2025 — SISTEMA DE EMERGÊNCIAS RODOVIÁRIAS
        </p>
      </footer>
    </div>
  )
}
