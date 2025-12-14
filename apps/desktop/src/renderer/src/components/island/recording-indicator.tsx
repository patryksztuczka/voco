import { clsx } from 'clsx'

interface RecordingIndicatorProps {
  isRecording: boolean
}

export const RecordingIndicator = ({ isRecording }: RecordingIndicatorProps) => {
  return (
    <div className="relative flex items-center justify-center w-3 h-3">
      {/* Pulsing ring */}
      {isRecording && <div className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />}
      {/* Solid dot */}
      <div
        className={clsx(
          'w-2.5 h-2.5 rounded-full transition-colors',
          isRecording ? 'bg-accent' : 'bg-text-muted'
        )}
      />
    </div>
  )
}
