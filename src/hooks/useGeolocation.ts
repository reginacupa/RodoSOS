import { useState, useEffect, useCallback } from 'react'

export interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  loading: boolean
  error: string | null
  timestamp: number | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false,
    error: null,
    timestamp: null,
  })

  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'GPS não suportado neste dispositivo.' }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
          timestamp: position.timestamp,
        })
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Permissão de localização negada.',
          2: 'Localização não disponível.',
          3: 'Tempo esgotado ao buscar localização.',
        }
        setState(prev => ({
          ...prev,
          loading: false,
          error: messages[err.code] || 'Erro desconhecido ao buscar GPS.',
        }))
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [])

  useEffect(() => {
    fetchLocation()
  }, [fetchLocation])

  const getMapsLink = () => {
    if (state.latitude && state.longitude) {
      return `https://maps.google.com/?q=${state.latitude},${state.longitude}`
    }
    return null
  }

  return { ...state, fetchLocation, getMapsLink }
}
