import { MapPin, RefreshCw, ExternalLink, AlertCircle, Loader } from 'lucide-react'
import { useGeolocation } from '@/hooks/useGeolocation'

interface GPSStatusProps {
  compact?: boolean
  onLocationUpdate?: (lat: number, lng: number) => void
}

export function GPSStatus({ compact = false, onLocationUpdate }: GPSStatusProps) {
  const { latitude, longitude, accuracy, loading, error, fetchLocation, getMapsLink } = useGeolocation()

  // Notify parent when location updates
  if (latitude && longitude && onLocationUpdate) {
    onLocationUpdate(latitude, longitude)
  }

  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 100,
          background: loading
            ? 'rgba(255, 215, 0, 0.08)'
            : error
            ? 'rgba(255, 30, 30, 0.1)'
            : 'rgba(0, 230, 118, 0.1)',
          border: `1px solid ${loading ? 'rgba(255,215,0,0.3)' : error ? 'rgba(255,30,30,0.3)' : 'rgba(0,230,118,0.3)'}`,
          fontSize: 12,
          fontWeight: 600,
          color: loading ? '#FFD700' : error ? '#FF5252' : '#00E676',
          cursor: 'pointer',
        }}
        onClick={fetchLocation}
        title={error || (latitude ? `${latitude.toFixed(5)}, ${longitude?.toFixed(5)}` : 'Carregando...')}
      >
        {loading ? (
          <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} />
        ) : (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: error ? '#FF5252' : '#00E676',
              animation: error ? 'none' : 'blink-dot 1.5s ease-in-out infinite',
            }}
          />
        )}
        <MapPin size={12} />
        <span>
          {loading ? 'GPS...' : error ? 'GPS Erro' : latitude ? 'GPS Ativo' : 'GPS'}
        </span>
      </div>
    )
  }

  const mapsLink = getMapsLink()

  return (
    <div className="card-dark" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={18} color="#FFD700" />
          <span style={{ fontWeight: 700, fontSize: 15, color: '#F5F5F5' }}>
            Localização GPS
          </span>
        </div>
        <button
          onClick={fetchLocation}
          disabled={loading}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            color: '#B0B0B0',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            padding: '4px 8px',
            borderRadius: 6,
            transition: 'color 0.2s',
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Atualizar
        </button>
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#FFD700' }}>
          <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 14 }}>Buscando sua localização...</span>
        </div>
      )}

      {error && !loading && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: 'rgba(255, 30, 30, 0.1)',
            border: '1px solid rgba(255, 30, 30, 0.3)',
            borderRadius: 8,
            color: '#FF5252',
            fontSize: 13,
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {latitude && longitude && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#00E676',
                boxShadow: '0 0 8px rgba(0, 230, 118, 0.6)',
                animation: 'blink-dot 1.5s ease-in-out infinite',
              }}
            />
            <span style={{ color: '#00E676', fontWeight: 600, fontSize: 13 }}>
              Localização capturada com sucesso
            </span>
          </div>

          {/* Coordinates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div
              style={{
                background: 'rgba(255, 215, 0, 0.06)',
                border: '1px solid rgba(255, 215, 0, 0.15)',
                borderRadius: 8,
                padding: '10px 14px',
              }}
            >
              <div style={{ fontSize: 11, color: '#6B6B6B', marginBottom: 4 }}>LATITUDE</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#FFD700', fontFamily: 'monospace' }}>
                {latitude.toFixed(6)}°
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255, 215, 0, 0.06)',
                border: '1px solid rgba(255, 215, 0, 0.15)',
                borderRadius: 8,
                padding: '10px 14px',
              }}
            >
              <div style={{ fontSize: 11, color: '#6B6B6B', marginBottom: 4 }}>LONGITUDE</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#FFD700', fontFamily: 'monospace' }}>
                {longitude.toFixed(6)}°
              </div>
            </div>
          </div>

          {/* Accuracy */}
          {accuracy && (
            <div style={{ fontSize: 12, color: '#6B6B6B' }}>
              Precisão: ±{Math.round(accuracy)}m
            </div>
          )}

          {/* Maps link */}
          {mapsLink && (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: '#448AFF',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              <ExternalLink size={13} />
              Ver no Google Maps
            </a>
          )}
        </div>
      )}
    </div>
  )
}
