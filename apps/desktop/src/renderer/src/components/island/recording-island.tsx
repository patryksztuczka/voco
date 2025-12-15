import { useState, useEffect, useCallback } from 'react'
import { Loader2, Check, X } from 'lucide-react'
import { clsx } from 'clsx'
import { Waveform } from './waveform'
import { RecordingIndicator } from './recording-indicator'
import { useAudioRecorder } from '../../hooks'
import { transcribeAudio } from '../../services'

type IslandState = 'idle' | 'recording' | 'processing' | 'complete' | 'error'

interface RecordingIslandProps {
  visible: boolean
  onClose?: () => void
  onTranscriptionComplete?: (text: string) => void
}

export const RecordingIsland = ({
  visible,
  onClose,
  onTranscriptionComplete
}: RecordingIslandProps) => {
  const [state, setState] = useState<IslandState>('idle')
  const [duration, setDuration] = useState(0)
  const [transcription, setTranscription] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { isRecording, startRecording, stopRecording, cancelRecording } = useAudioRecorder()

  // Start recording when island becomes visible
  useEffect(() => {
    if (visible && state === 'idle') {
      setState('recording')
      setDuration(0)
      setTranscription('')
      setErrorMessage('')
      startRecording()
    } else if (!visible) {
      setState('idle')
    }
  }, [visible, state, startRecording])

  // Timer for recording duration
  useEffect(() => {
    if (state !== 'recording') return

    const interval = setInterval(() => {
      setDuration((d) => d + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [state])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStopRecording = useCallback(async () => {
    setState('processing')
    const recordingDuration = duration

    try {
      const audioData = await stopRecording()

      if (!audioData) {
        throw new Error('No audio data recorded')
      }

      console.log(`Audio recorded: ${audioData.byteLength} bytes`)

      const result = await transcribeAudio(audioData)

      setTranscription(result.text)
      setState('complete')

      // Save to database
      try {
        await window.api.db.createTranscription(result.text, recordingDuration)
      } catch (dbError) {
        console.error('Failed to save transcription to database:', dbError)
      }

      // Copy to clipboard
      await navigator.clipboard.writeText(result.text)

      // Notify parent
      onTranscriptionComplete?.(result.text)

      // Auto-close after showing result
      setTimeout(() => {
        onClose?.()
      }, 2000)
    } catch (err) {
      console.error('Transcription error:', err)
      setErrorMessage(err instanceof Error ? err.message : 'Transcription failed')
      setState('error')

      // Auto-close after error
      setTimeout(() => {
        onClose?.()
      }, 3000)
    }
  }, [stopRecording, onClose, onTranscriptionComplete, duration])

  const handleCancel = useCallback(() => {
    cancelRecording()
    setState('idle')
    onClose?.()
  }, [cancelRecording, onClose])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-8 flex justify-center z-50 pointer-events-none">
      <div
        className={clsx(
          'pointer-events-auto',
          'px-5 py-3 rounded-2xl',
          'bg-surface/95 backdrop-blur-xl',
          'border border-border',
          'shadow-2xl shadow-black/50',
          'animate-in slide-in-from-bottom-4 fade-in duration-200'
        )}
        style={{ minWidth: 320, maxWidth: 400 }}
      >
        {/* Recording state */}
        {state === 'recording' && (
          <div className="flex items-center gap-4">
            <RecordingIndicator isRecording={isRecording} />

            <div className="flex-1">
              <Waveform isRecording={isRecording} />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary font-mono tabular-nums">
                {formatDuration(duration)}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleCancel}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-background transition-colors"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleStopRecording}
                  className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Processing state */}
        {state === 'processing' && (
          <div className="flex items-center justify-center gap-3 py-1">
            <Loader2 className="w-4 h-4 text-text-secondary animate-spin" />
            <span className="text-sm text-text-secondary">Transcribing...</span>
          </div>
        )}

        {/* Complete state */}
        {state === 'complete' && (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-success" />
            </div>
            <p className="text-sm text-text-primary truncate flex-1">{transcription}</p>
          </div>
        )}

        {/* Error state */}
        {state === 'error' && (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <X className="w-3.5 h-3.5 text-accent" />
            </div>
            <p className="text-sm text-accent truncate flex-1">
              {errorMessage || 'Failed to transcribe. Please try again.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
