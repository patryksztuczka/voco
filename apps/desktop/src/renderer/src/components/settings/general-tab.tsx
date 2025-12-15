import { useState, type ChangeEvent } from 'react'
import { Toggle } from '../ui'

export const GeneralTab = () => {
  const [startAtLogin, setStartAtLogin] = useState(true)
  const [playSound, setPlaySound] = useState(true)

  const handleStartAtLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStartAtLogin(e.target.checked)
  }

  const handlePlaySoundChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlaySound(e.target.checked)
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

      {/* Toggles */}
      <div className="flex flex-col gap-4">
        <Toggle label="Start at login" checked={startAtLogin} onChange={handleStartAtLoginChange} />
        <Toggle
          label="Play sound on complete"
          checked={playSound}
          onChange={handlePlaySoundChange}
        />
      </div>
    </div>
  )
}
