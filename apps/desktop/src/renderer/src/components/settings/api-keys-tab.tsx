import { useState, type ChangeEvent } from 'react'
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'

interface ApiKeyInputProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  optional?: boolean
}

const ApiKeyInput = ({ label, placeholder, value, onChange, optional }: ApiKeyInputProps) => {
  const [visible, setVisible] = useState(false)
  const hasValue = value.length > 0

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleToggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm">
        <span className="text-text-secondary">{label}</span>
        {optional && <span className="text-xs text-text-muted">(optional)</span>}
      </label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          placeholder={placeholder || 'Enter API key...'}
          value={value}
          onChange={handleChange}
          className={clsx(
            'w-full h-10 px-3 pr-20 rounded-lg font-mono text-sm',
            'bg-surface border border-border',
            'text-text-primary placeholder:text-text-muted',
            'transition-colors',
            'focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus'
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {hasValue && (
            <span className="flex items-center gap-1 text-xs text-success">
              <Check className="w-3.5 h-3.5" />
            </span>
          )}
          <button
            type="button"
            onClick={handleToggleVisibility}
            className="p-1.5 rounded text-text-muted hover:text-text-primary transition-colors"
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

export const ApiKeysTab = () => {
  const [openaiKey, setOpenaiKey] = useState('')
  const [anthropicKey, setAnthropicKey] = useState('')
  const [groqKey, setGroqKey] = useState('')

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-border">
        <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
        <p className="text-xs text-text-secondary leading-relaxed">
          API keys are stored securely on your device using the system keychain. They are never sent
          anywhere except to the respective API providers.
        </p>
      </div>

      {/* API Keys */}
      <ApiKeyInput
        label="OpenAI API Key"
        placeholder="sk-..."
        value={openaiKey}
        onChange={setOpenaiKey}
      />

      <ApiKeyInput
        label="Anthropic API Key"
        placeholder="sk-ant-..."
        value={anthropicKey}
        onChange={setAnthropicKey}
        optional
      />

      <ApiKeyInput
        label="Groq API Key"
        placeholder="gsk_..."
        value={groqKey}
        onChange={setGroqKey}
        optional
      />
    </div>
  )
}

