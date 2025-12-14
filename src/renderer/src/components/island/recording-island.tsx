import { useState, useEffect, useCallback } from 'react'
import { Loader2, Check, X } from 'lucide-react'
import { clsx } from 'clsx'
import { Waveform } from './waveform'
import { RecordingIndicator } from './recording-indicator'

type IslandState = 'idle' | 'recording' | 'processing' | 'complete' | 'error'

interface RecordingIslandProps {
  visible: boolean
  onClose?: () => void
}

export const RecordingIsland = ({ visible, onClose }: RecordingIslandProps) => {
  const [state, setState] = useState<IslandState>('idle')
  const [duration, setDuration] = useState(0)
  const [transcription, setTranscription] = useState('')

  // Start recording when island becomes visible
  useEffect(() => {
    if (visible) {
      setState('recording')
      setDuration(0)
      setTranscription('')
    } else {
      setState('idle')
    }
  }, [visible])

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

  // Simulate stopping recording and processing
  const handleStopRecording = useCallback(() => {
    setState('processing')

    // Simulate API call delay
    setTimeout(() => {
      setTranscription('This is a sample transcription of what you said...')
      setState('complete')

      // Auto-close after showing result
      setTimeout(() => {
        onClose?.()
      }, 2000)
    }, 1500)
  }, [onClose])

  const handleCancel = useCallback(() => {
    setState('idle')
    onClose?.()
  }, [onClose])

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
            <RecordingIndicator isRecording />

            <div className="flex-1">
              <Waveform isRecording />
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
            <p className="text-sm text-accent">Failed to transcribe. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  )
}
