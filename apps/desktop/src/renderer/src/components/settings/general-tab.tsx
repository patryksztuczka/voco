import { useState, type ChangeEvent } from 'react'
import { Toggle, Select } from '../ui'

const transcriptionProviders = [
  { value: 'openai-whisper', label: 'OpenAI Whisper' },
  { value: 'groq-whisper', label: 'Groq Whisper' },
  { value: 'local', label: 'Local (coming soon)' }
]

// TODO: Replace with actual microphone list from system
const mockMicrophones = [
  { value: 'default', label: 'System Default' },
  { value: 'macbook-mic', label: 'MacBook Pro Microphone' },
  { value: 'airpods', label: 'AirPods Pro' },
  { value: 'external', label: 'External USB Microphone' }
]

export const GeneralTab = () => {
  const [startAtLogin, setStartAtLogin] = useState(true)
  const [autoPaste, setAutoPaste] = useState(true)
  const [playSound, setPlaySound] = useState(true)
  const [provider, setProvider] = useState('openai-whisper')
  const [microphone, setMicrophone] = useState('default')

  const handleStartAtLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStartAtLogin(e.target.checked)
  }

  const handleAutoPasteChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAutoPaste(e.target.checked)
  }

  const handlePlaySoundChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlaySound(e.target.checked)
  }

  const handleProviderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setProvider(e.target.value)
  }

  const handleMicrophoneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMicrophone(e.target.value)
  }

  return (
    <div className="space-y-6">
      {/* Keyboard Shortcut */}
      <div className="space-y-2">
        <label className="block text-sm text-text-secondary">Keyboard Shortcut</label>
        <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
          <div className="flex items-center gap-1.5 font-mono text-sm">
            <kbd className="px-2 py-1 rounded bg-background border border-border text-xs">⌘</kbd>
            <kbd className="px-2 py-1 rounded bg-background border border-border text-xs">⇧</kbd>
            <kbd className="px-2 py-1 rounded bg-background border border-border text-xs">V</kbd>
          </div>
          <button className="text-xs text-text-muted hover:text-text-primary transition-colors">
            Change
          </button>
        </div>
      </div>

      {/* Microphone Selection */}
      <Select
        label="Microphone"
        options={mockMicrophones}
        value={microphone}
        onChange={handleMicrophoneChange}
      />

      {/* Provider Selection */}
      <Select
        label="Transcription Provider"
        options={transcriptionProviders}
        value={provider}
        onChange={handleProviderChange}
      />

      {/* Toggles */}
      <div className="space-y-4">
        <Toggle label="Start at login" checked={startAtLogin} onChange={handleStartAtLoginChange} />
        <Toggle
          label="Auto-paste transcription"
          checked={autoPaste}
          onChange={handleAutoPasteChange}
        />
        <Toggle
          label="Play sound on complete"
          checked={playSound}
          onChange={handlePlaySoundChange}
        />
      </div>
    </div>
  )
}
