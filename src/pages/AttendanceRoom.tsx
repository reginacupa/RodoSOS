import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Download,
  Circle, Send, MapPin, User, AlertTriangle,
  MessageSquare, Camera, Maximize2
} from 'lucide-react'
import { CallTimer } from '@/components/CallTimer'
import { IncidentBadge } from '@/components/IncidentBadge'
import { useMediaRecorder } from '@/hooks/useMediaRecorder'
import type { ChatMessage, IncidentFormData } from '@/types'

const OPERATOR_MESSAGES = [
  'Central RodoSOS, em que posso ajudar?',
  'Recebemos seu chamado. Por favor, descreva a situação.',
  'Entendido. Já estamos enviando equipe de socorro para sua localização.',
  'Por favor, mantenha a calma. A equipe chegará em breve.',
  'Você está em local seguro? Afaste-se da pista se possível.',
  'Confirmamos a localização. Equipe a caminho — ETA estimado: 8 minutos.',
]

export function AttendanceRoom() {
  const location = useLocation()
  const navigate = useNavigate()
  const callData = location.state?.callData as IncidentFormData | undefined

  const [startTime] = useState(new Date())
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      from: 'system',
      content: '🔗 Conexão estabelecida com a Central RodoSOS',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'system',
    },
  ])
  const [inputText, setInputText] = useState('')
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'video'>('chat')
  const [operatorTyping, setOperatorTyping] = useState(false)
  const [operatorMsgIndex, setOperatorMsgIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const msgIdRef = useRef(1)

  const { recordingState, formattedTime, startRecording, stopRecording, downloadRecording } = useMediaRecorder()

  // Start camera on mount
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.warn('Camera/mic not available:', err)
        setCameraOn(false)
      }
    }
    initMedia()

    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  // Operator typing simulation
  useEffect(() => {
    const delay = setTimeout(() => {
      if (operatorMsgIndex < OPERATOR_MESSAGES.length) {
        setOperatorTyping(true)
        const msgDelay = setTimeout(() => {
          setOperatorTyping(false)
          addMessage('operator', OPERATOR_MESSAGES[operatorMsgIndex])
          setOperatorMsgIndex(i => i + 1)
        }, 2000)
        return () => clearTimeout(msgDelay)
      }
    }, operatorMsgIndex === 0 ? 1500 : 8000)

    return () => clearTimeout(delay)
  }, [operatorMsgIndex])

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, operatorTyping])

  const addMessage = (from: ChatMessage['from'], content: string) => {
    const msg: ChatMessage = {
      id: String(msgIdRef.current++),
      from,
      content,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    }
    setMessages(prev => [...prev, msg])
  }

  const sendMessage = () => {
    if (!inputText.trim()) return
    addMessage('user', inputText.trim())
    setInputText('')

    // Simulate operator reply
    if (operatorMsgIndex < OPERATOR_MESSAGES.length) {
      setOperatorTyping(true)
      setTimeout(() => {
        setOperatorTyping(false)
        addMessage('operator', OPERATOR_MESSAGES[operatorMsgIndex])
        setOperatorMsgIndex(i => i + 1)
      }, 2000)
    }
  }

  const toggleRecording = useCallback(async () => {
    if (recordingState === 'recording') {
      stopRecording()
      setIsRecording(false)
    } else if (streamRef.current) {
      await startRecording(streamRef.current)
      setIsRecording(true)
      addMessage('user', '📹 Iniciou gravação de vídeo')
    }
  }, [recordingState, startRecording, stopRecording])

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setCameraOn(videoTrack.enabled)
      }
    }
  }

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setMicOn(audioTrack.enabled)
      }
    }
  }

  const endCall = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    if (recordingState === 'recording') stopRecording()
    navigate('/')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080808',
        display: 'flex',
        flexDirection: 'column',
        color: '#F5F5F5',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '14px 20px',
          background: '#0D0D0D',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* Left: call info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              background: 'radial-gradient(circle, #FF3333, #AA0000)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(255,30,30,0.5)',
              animation: 'pulse-sos 2s ease-in-out infinite',
            }}
          >
            <AlertTriangle size={18} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F5F5F5' }}>
              Central RodoSOS
            </div>
            <div style={{ fontSize: 11, color: '#00E676', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#00E676',
                  display: 'inline-block',
                  animation: 'blink-dot 1.5s ease-in-out infinite',
                }}
              />
              Em atendimento
            </div>
          </div>
        </div>

        {/* Call info badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {callData?.incidentType && <IncidentBadge type={callData.incidentType} size="sm" />}

          {callData?.latitude && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                color: '#FFD700',
                padding: '3px 8px',
                background: 'rgba(255,215,0,0.08)',
                borderRadius: 100,
                border: '1px solid rgba(255,215,0,0.2)',
              }}
            >
              <MapPin size={10} />
              GPS Ativo
            </div>
          )}

          {callData?.name && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                color: '#B0B0B0',
                padding: '3px 8px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 100,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <User size={10} />
              {callData.name.split(' ')[0]}
            </div>
          )}
        </div>

        <CallTimer startTime={startTime} />
      </header>

      {/* Road stripe */}
      <div
        style={{
          height: 3,
          background: 'repeating-linear-gradient(90deg, #FFD700 0px, #FFD700 30px, transparent 30px, transparent 54px)',
          opacity: 0.5,
        }}
      />

      {/* Mobile tabs */}
      <div
        style={{
          display: 'flex',
          background: '#0D0D0D',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {(['chat', 'video'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab ? '#FFD700' : 'transparent'}`,
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              color: activeTab === tab ? '#FFD700' : '#6B6B6B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            {tab === 'chat' ? <MessageSquare size={15} /> : <Camera size={15} />}
            {tab === 'chat' ? 'Chat' : 'Vídeo'}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Desktop: side by side | Mobile: tabs */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          {/* Chat panel */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              minWidth: 0,
              ...(activeTab === 'video' ? { display: 'none' } : {}),
            }}
            className="chat-panel"
          >
            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {messages.map(msg => (
                <ChatBubble key={msg.id} message={msg} />
              ))}

              {operatorTyping && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    animation: 'slide-in-up 0.2s ease-out',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#1C1C1C',
                      border: '1px solid rgba(255,215,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                    }}
                  >
                    👤
                  </div>
                  <div
                    style={{
                      padding: '10px 14px',
                      background: '#1C1C1C',
                      borderRadius: '12px 12px 12px 2px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      gap: 5,
                      alignItems: 'center',
                    }}
                  >
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#FFD700',
                          display: 'inline-block',
                          animation: `blink-dot 1.2s ease-in-out infinite`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat input */}
            <div
              style={{
                padding: '14px 16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: '#0D0D0D',
                display: 'flex',
                gap: 10,
              }}
            >
              <input
                type="text"
                className="input-dark"
                placeholder="Digite uma mensagem..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                style={{ flex: 1, padding: '10px 14px' }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: '10px 16px',
                  background: '#FFD700',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  color: '#0D0D0D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                <Send size={17} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Video panel */}
          <div
            style={{
              width: activeTab === 'chat' ? 0 : '100%',
              display: activeTab === 'video' ? 'flex' : 'none',
              flexDirection: 'column',
              background: '#080808',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Video feeds */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                padding: 16,
                gap: 12,
              }}
            >
              {/* Operator placeholder */}
              <div
                style={{
                  flex: 1,
                  background: '#141414',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Grid pattern */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px)',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: '#1C1C1C',
                    border: '2px solid rgba(255,215,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                  }}
                >
                  👤
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F5' }}>
                    Operador Central RodoSOS
                  </div>
                  <div style={{ fontSize: 12, color: '#FFD700', marginTop: 4 }}>
                    🟢 Conectado • Câmera aguardando
                  </div>
                </div>

                {/* Recording indicator overlay */}
                {isRecording && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                    }}
                  >
                    <div className="rec-indicator">
                      <div className="rec-dot" />
                      REC {formattedTime}
                    </div>
                  </div>
                )}

                {/* Fullscreen button */}
                <button
                  onClick={() => setFullscreen(f => !f)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 6,
                    padding: '5px',
                    cursor: 'pointer',
                    color: '#B0B0B0',
                    display: 'flex',
                  }}
                >
                  <Maximize2 size={14} />
                </button>
              </div>

              {/* Local camera (PiP) */}
              <div
                style={{
                  height: 120,
                  background: '#0D0D0D',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scaleX(-1)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      color: '#6B6B6B',
                    }}
                  >
                    <VideoOff size={20} />
                    <span style={{ fontSize: 11 }}>Câmera desligada</span>
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 6,
                    left: 8,
                    fontSize: 10,
                    color: '#B0B0B0',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  Você
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls bar */}
        <div
          style={{
            padding: '16px 20px',
            background: '#0D0D0D',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Media controls */}
          <div style={{ display: 'flex', gap: 10 }}>
            <ControlBtn
              icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
              label={micOn ? 'Mudo' : 'Ativar Mic'}
              active={micOn}
              onClick={toggleMic}
              color={micOn ? undefined : '#FF5252'}
            />
            <ControlBtn
              icon={cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
              label={cameraOn ? 'Câmera Off' : 'Câmera On'}
              active={cameraOn}
              onClick={() => { toggleCamera(); setActiveTab('video') }}
              color={cameraOn ? undefined : '#FF5252'}
            />
          </div>

          {/* Recording controls */}
          <div style={{ display: 'flex', gap: 10 }}>
            <ControlBtn
              icon={<Circle size={18} fill={isRecording ? '#FF1E1E' : 'none'} />}
              label={isRecording ? `Parar (${formattedTime})` : 'Gravar Vídeo'}
              active={isRecording}
              onClick={toggleRecording}
              color={isRecording ? '#FF5252' : undefined}
              highlight={isRecording}
            />
            {recordingState === 'stopped' && (
              <ControlBtn
                icon={<Download size={18} />}
                label="Baixar"
                active={false}
                onClick={downloadRecording}
                color="#00E676"
              />
            )}
          </div>

          {/* End call */}
          <button
            onClick={endCall}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: '#CC0000',
              border: 'none',
              borderRadius: 100,
              cursor: 'pointer',
              color: 'white',
              fontWeight: 700,
              fontSize: 13,
              transition: 'all 0.2s',
              boxShadow: '0 0 16px rgba(200, 0, 0, 0.4)',
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.background = '#FF1E1E'
              ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.background = '#CC0000'
              ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
            }}
          >
            <PhoneOff size={16} />
            Encerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// Chat bubble
function ChatBubble({ message }: { message: ChatMessage }) {
  if (message.type === 'system') {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '6px 14px',
          background: 'rgba(255,215,0,0.06)',
          border: '1px solid rgba(255,215,0,0.15)',
          borderRadius: 100,
          fontSize: 11,
          color: '#FFD700',
          alignSelf: 'center',
          maxWidth: '80%',
        }}
      >
        {message.content}
      </div>
    )
  }

  const isUser = message.from === 'user'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: 8,
        alignItems: 'flex-end',
        animation: 'slide-in-up 0.25s ease-out',
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#1C1C1C',
            border: '1px solid rgba(255,215,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          👤
        </div>
      )}

      <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: 3, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        {!isUser && (
          <span style={{ fontSize: 10, color: '#6B6B6B', paddingLeft: 4 }}>
            Operador Central
          </span>
        )}
        <div
          style={{
            padding: '10px 14px',
            background: isUser
              ? 'rgba(255, 215, 0, 0.12)'
              : '#1C1C1C',
            border: isUser
              ? '1px solid rgba(255, 215, 0, 0.25)'
              : '1px solid rgba(255,255,255,0.07)',
            borderRadius: isUser
              ? '12px 12px 2px 12px'
              : '12px 12px 12px 2px',
            fontSize: 14,
            color: '#F5F5F5',
            lineHeight: 1.5,
          }}
        >
          {message.content}
        </div>
        <span style={{ fontSize: 10, color: '#3D3D3D', paddingLeft: 4, paddingRight: 4 }}>
          {message.timestamp}
        </span>
      </div>
    </div>
  )
}

// Control button
function ControlBtn({
  icon, label, active, onClick, color, highlight
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  color?: string
  highlight?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '8px 14px',
        background: highlight
          ? 'rgba(255, 30, 30, 0.15)'
          : active
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(255,255,255,0.03)',
        border: highlight
          ? '1px solid rgba(255, 30, 30, 0.4)'
          : active
          ? '1px solid rgba(255,255,255,0.1)'
          : '1px solid rgba(255,255,255,0.05)',
        borderRadius: 10,
        cursor: 'pointer',
        color: color || (active ? '#F5F5F5' : '#6B6B6B'),
        transition: 'all 0.2s',
        minWidth: 60,
      }}
    >
      {icon}
      <span style={{ fontSize: 10, whiteSpace: 'nowrap' }}>{label}</span>
    </button>
  )
}
