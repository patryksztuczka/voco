import { Mic, ExternalLink } from 'lucide-react'
import { Button } from '../ui'

export const AboutTab = () => {
  const version = '1.0.0'

  const handleOpenGitHub = () => {
    window.open('https://github.com', '_blank')
  }

  const handleOpenTwitter = () => {
    window.open('https://twitter.com', '_blank')
  }

  return (
    <div className="flex flex-col items-center text-center pt-4">
      {/* Logo */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-4">
        <Mic className="w-8 h-8 text-white" />
      </div>

      {/* App info */}
      <h2 className="text-lg font-semibold text-text-primary">Voco</h2>
      <p className="text-sm text-text-muted mt-0.5">Version {version}</p>

      {/* Description */}
      <p className="text-sm text-text-secondary mt-4 max-w-[280px]">
        Voice-to-text transcription for macOS. Press a shortcut, speak, and your words appear
        anywhere.
      </p>

      {/* Links */}
      <div className="flex items-center gap-2 mt-6">
        <Button
          variant="ghost"
          size="sm"
          icon={<ExternalLink className="w-3.5 h-3.5" />}
          onClick={handleOpenGitHub}
        >
          GitHub
        </Button>
        <Button variant="ghost" size="sm" onClick={handleOpenTwitter}>
          @voco
        </Button>
      </div>

      {/* Footer */}
      <p className="text-xs text-text-muted mt-8">Made with care</p>
    </div>
  )
}

