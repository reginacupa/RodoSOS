import type { IncidentType } from '@/types'
import { INCIDENT_LABELS, INCIDENT_COLORS } from '@/types'

interface IncidentBadgeProps {
  type: IncidentType
  size?: 'sm' | 'md'
}

export function IncidentBadge({ type, size = 'md' }: IncidentBadgeProps) {
  const label = INCIDENT_LABELS[type]
  const color = INCIDENT_COLORS[type]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: size === 'sm' ? '3px 8px' : '5px 12px',
        borderRadius: 100,
        fontSize: size === 'sm' ? 12 : 13,
        fontWeight: 600,
        background: `${color}18`,
        color: color,
        border: `1px solid ${color}40`,
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </span>
  )
}
