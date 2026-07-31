import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, User, Phone, MapPin, FileText, Mic, MicOff,
  Send, ChevronDown, AlertCircle, Loader, CheckCircle2
} from 'lucide-react'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { GPSStatus } from '@/components/GPSStatus'
import type { IncidentType, IncidentFormData } from '@/types'
import { INCIDENT_LABELS } from '@/types'

export function NewCall() {
  const navigate = useNavigate()
  const { latitude, longitude, accuracy } = useGeolocation()
  const { transcript, isListening, isSupported, startListening, stopListening, clearTranscript } = useSpeechRecognition()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    incidentType: '' as IncidentType | '',
    description: '',
  })
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Format phone number
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.name.trim()) errs.name = 'Nome é obrigatório'
    if (!formData.phone.replace(/\D/g, '') || formData.phone.replace(/\D/g, '').length < 10)
      errs.phone = 'Telefone inválido'
    if (!formData.incidentType) errs.incidentType = 'Selecione o tipo de ocorrência'
    if (!latitude || !longitude) errs.location = 'Aguarde a captura de localização'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitting(true)

    const callData: IncidentFormData = {
      name: formData.name,
      phone: formData.phone,
      incidentType: formData.incidentType as IncidentType,
      description: formData.description || transcript,
      latitude,
      longitude,
      accuracy,
      timestamp: new Date().toISOString(),
    }

    // Simulate API call
    await new Promise(r => setTimeout(r, 1800))
    setSubmitting(false)
    setSubmitted(true)

    // Navigate to attendance room
    setTimeout(() => {
      navigate('/atendimento', { state: { callData } })
    }, 1200)
  }

  const toggleVoice = () => {
    if (isListening) stopListening()
    else startListening()
  }

  const incidentTypes = Object.entries(INCIDENT_LABELS) as [IncidentType, string][]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--asphalt-900)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'rgba(13, 13, 13, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '8px',
            cursor: 'pointer',
            color: '#B0B0B0',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.2s',
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 20,
              letterSpacing: '0.1em',
              color: '#F5F5F5',
              lineHeight: 1,
            }}
          >
            ABRIR CHAMADO
          </h1>
          <p style={{ fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>
            Preencha as informações abaixo
          </p>
        </div>

        {/* Emergency badge */}
        <div style={{ marginLeft: 'auto' }}>
          <div className="badge badge-red" style={{ animation: 'blink-dot 2s ease-in-out infinite' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF1E1E' }} />
            EMERGÊNCIA
          </div>
        </div>
      </div>

      {/* Road stripe */}
      <div
        style={{
          height: 4,
          background: 'repeating-linear-gradient(90deg, #FFD700 0px, #FFD700 40px, transparent 40px, transparent 68px)',
          opacity: 0.7,
        }}
      />

      {/* Form */}
      <div
        style={{
          flex: 1,
          maxWidth: 640,
          width: '100%',
          margin: '0 auto',
          padding: '32px 24px 60px',
        }}
      >
        {submitted ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              padding: 48,
              animation: 'slide-in-up 0.4s ease-out',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'rgba(0, 230, 118, 0.15)',
                border: '2px solid rgba(0, 230, 118, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse-yellow 2s ease-in-out infinite',
              }}
            >
              <CheckCircle2 size={36} color="#00E676" />
            </div>
            <h2
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 28,
                letterSpacing: '0.08em',
                color: '#00E676',
              }}
            >
              Chamado Registrado!
            </h2>
            <p style={{ color: '#B0B0B0', textAlign: 'center', fontSize: 14 }}>
              Conectando você à central de atendimento...
            </p>
            <Loader size={20} color="#FFD700" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Section: Personal info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionHeader icon={<User size={16} color="#FFD700" />} title="Seus Dados" />

              {/* Name */}
              <div>
                <label style={labelStyle}>Nome Completo *</label>
                <input
                  className="input-dark"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  style={errors.name ? { borderColor: '#FF5252' } : {}}
                />
                {errors.name && <ErrorMsg msg={errors.name} />}
              </div>

              {/* Phone */}
              <div>
                <label style={labelStyle}>Número de Celular *</label>
                <div style={{ position: 'relative' }}>
                  <Phone
                    size={16}
                    color="#6B6B6B"
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    className="input-dark"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: formatPhone(e.target.value) }))}
                    style={{
                      paddingLeft: 40,
                      ...(errors.phone ? { borderColor: '#FF5252' } : {}),
                    }}
                  />
                </div>
                {errors.phone && <ErrorMsg msg={errors.phone} />}
              </div>
            </div>

            {/* Section: Location */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionHeader icon={<MapPin size={16} color="#FFD700" />} title="Localização" />
              <GPSStatus />
              {errors.location && <ErrorMsg msg={errors.location} />}
            </div>

            {/* Section: Incident type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionHeader icon={<AlertCircle size={16} color="#FFD700" />} title="Tipo de Ocorrência *" />

              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowTypeDropdown(d => !d)}
                  style={{
                    width: '100%',
                    background: '#1C1C1C',
                    border: `1.5px solid ${errors.incidentType ? '#FF5252' : showTypeDropdown ? '#FFD700' : '#2E2E2E'}`,
                    borderRadius: 8,
                    padding: '12px 16px',
                    color: formData.incidentType ? '#F5F5F5' : '#6B6B6B',
                    fontSize: 15,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <span>
                    {formData.incidentType
                      ? INCIDENT_LABELS[formData.incidentType]
                      : 'Selecione o tipo de emergência'}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: showTypeDropdown ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s',
                      color: '#6B6B6B',
                    }}
                  />
                </button>

                {showTypeDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: 4,
                      background: '#1C1C1C',
                      border: '1.5px solid rgba(255, 215, 0, 0.3)',
                      borderRadius: 8,
                      overflow: 'hidden',
                      zIndex: 20,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                      animation: 'slide-in-up 0.2s ease-out',
                    }}
                  >
                    {incidentTypes.map(([type, label]) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setFormData(p => ({ ...p, incidentType: type }))
                          setShowTypeDropdown(false)
                          setErrors(p => ({ ...p, incidentType: '' }))
                        }}
                        style={{
                          width: '100%',
                          background: formData.incidentType === type ? 'rgba(255,215,0,0.08)' : 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          padding: '12px 16px',
                          color: formData.incidentType === type ? '#FFD700' : '#B0B0B0',
                          fontSize: 14,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s, color 0.15s',
                        }}
                        onMouseEnter={e => {
                          ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,215,0,0.05)'
                          ;(e.currentTarget as HTMLElement).style.color = '#F5F5F5'
                        }}
                        onMouseLeave={e => {
                          ;(e.currentTarget as HTMLElement).style.background =
                            formData.incidentType === type ? 'rgba(255,215,0,0.08)' : 'transparent'
                          ;(e.currentTarget as HTMLElement).style.color =
                            formData.incidentType === type ? '#FFD700' : '#B0B0B0'
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.incidentType && <ErrorMsg msg={errors.incidentType} />}
            </div>

            {/* Section: Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionHeader icon={<FileText size={16} color="#FFD700" />} title="Descrição da Ocorrência" />

              <div>
                {/* Voice input toggle */}
                {isSupported && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <button
                      type="button"
                      onClick={toggleVoice}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 14px',
                        borderRadius: 100,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        background: isListening
                          ? 'rgba(255, 30, 30, 0.2)'
                          : 'rgba(255, 215, 0, 0.1)',
                        color: isListening ? '#FF5252' : '#FFD700',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: isListening
                          ? 'rgba(255, 30, 30, 0.4)'
                          : 'rgba(255, 215, 0, 0.3)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {isListening ? (
                        <>
                          <MicOff size={13} />
                          Parar gravação
                          <span className="rec-dot" />
                        </>
                      ) : (
                        <>
                          <Mic size={13} />
                          Gravar por voz
                        </>
                      )}
                    </button>

                    {transcript && (
                      <button
                        type="button"
                        onClick={clearTranscript}
                        style={{
                          fontSize: 11,
                          color: '#6B6B6B',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                )}

                <textarea
                  className="input-dark"
                  placeholder="Descreva o que aconteceu... (opcional)"
                  rows={4}
                  value={formData.description || transcript}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  style={{ resize: 'vertical', lineHeight: 1.6 }}
                />

                {isListening && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 8,
                      fontSize: 12,
                      color: '#FF5252',
                    }}
                  >
                    <span className="rec-dot" />
                    Ouvindo... fale agora
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 12,
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                background: submitting
                  ? 'rgba(255, 215, 0, 0.3)'
                  : 'var(--yellow-vivid)',
                color: '#0D0D0D',
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'all 0.2s',
                boxShadow: submitting ? 'none' : '0 4px 20px rgba(255, 215, 0, 0.3)',
              }}
            >
              {submitting ? (
                <>
                  <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Enviando chamado...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Abrir Chamado de Emergência
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// Helpers
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 7,
          background: 'rgba(255, 215, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', letterSpacing: '0.05em' }}>
        {title}
      </h2>
      <div
        style={{
          flex: 1,
          height: 1,
          background: 'rgba(255,255,255,0.06)',
          marginLeft: 8,
        }}
      />
    </div>
  )
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
        fontSize: 12,
        color: '#FF5252',
      }}
    >
      <AlertCircle size={12} />
      {msg}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#B0B0B0',
  marginBottom: 8,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
}
