import { useState, useRef, useCallback } from 'react'

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped'

export function useMediaRecorder() {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startRecording = useCallback(async (stream: MediaStream) => {
    try {
      chunksRef.current = []
      setRecordedBlob(null)
      setError(null)
      setRecordingTime(0)

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4'

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        setRecordedBlob(blob)
        setRecordingState('stopped')
        if (timerRef.current) clearInterval(timerRef.current)
      }

      recorder.start(1000)
      setRecordingState('recording')

      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000)
    } catch (err) {
      setError('Não foi possível iniciar a gravação.')
      console.error(err)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [recordingState])

  const downloadRecording = useCallback(() => {
    if (!recordedBlob) return
    const url = URL.createObjectURL(recordedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rodo-sos-gravacao-${new Date().toISOString()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [recordedBlob])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return {
    recordingState,
    recordedBlob,
    recordingTime,
    formattedTime: formatTime(recordingTime),
    error,
    startRecording,
    stopRecording,
    downloadRecording,
  }
}
