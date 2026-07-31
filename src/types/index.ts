export type IncidentType =
  | 'accident'
  | 'breakdown'
  | 'fire'
  | 'animal'
  | 'flood'
  | 'robbery'
  | 'medical'
  | 'other'

export interface IncidentFormData {
  name: string
  phone: string
  incidentType: IncidentType
  description: string
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  timestamp: string
}

export interface ChatMessage {
  id: string
  from: 'user' | 'operator' | 'system'
  content: string
  timestamp: string
  type: 'text' | 'system'
}

export const INCIDENT_LABELS: Record<IncidentType, string> = {
  accident: '🚗 Acidente',
  breakdown: '🔧 Pane Mecânica',
  fire: '🔥 Incêndio',
  animal: '🐄 Animal na Pista',
  flood: '🌊 Alagamento',
  robbery: '🚨 Assalto/Segurança',
  medical: '🏥 Emergência Médica',
  other: '❓ Outro',
}

export const INCIDENT_COLORS: Record<IncidentType, string> = {
  accident: '#FF5252',
  breakdown: '#FFD700',
  fire: '#FF6D00',
  animal: '#69F0AE',
  flood: '#448AFF',
  robbery: '#FF1744',
  medical: '#FF4081',
  other: '#B0B0B0',
}
