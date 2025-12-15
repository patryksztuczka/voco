import { useState } from 'react'
import { clsx } from 'clsx'
import { X } from 'lucide-react'
import { Button, Input } from '../ui'
import type { Preset } from './preset-card'

interface PresetFormProps {
  preset?: Preset | null
  onSave: (data: { name: string; prompt: string }) => void | Promise<void>
  onCancel: () => void
}

export const PresetForm = ({ preset, onSave, onCancel }: PresetFormProps) => {
  const [name, setName] = useState(preset?.name ?? '')
  const [prompt, setPrompt] = useState(preset?.prompt ?? '')

  const isEditing = !!preset

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !prompt.trim()) return
    onSave({ name: name.trim(), prompt: prompt.trim() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Modal */}
      <div
        className={clsx(
          'relative w-full max-w-md mx-4 p-5 rounded-xl',
          'bg-background border border-border shadow-xl'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">
            {isEditing ? 'Edit Preset' : 'New Preset'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="preset-name"
              className="block text-xs font-medium text-text-secondary mb-1.5"
            >
              Name
            </label>
            <Input
              id="preset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Beautify, Formal, Summarize..."
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="preset-prompt"
              className="block text-xs font-medium text-text-secondary mb-1.5"
            >
              System Prompt
            </label>
            <textarea
              id="preset-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Instructions for the LLM to transform the transcription..."
              rows={4}
              className={clsx(
                'w-full px-3 py-2.5 rounded-lg resize-none',
                'bg-surface border border-border',
                'text-sm text-text-primary placeholder:text-text-muted',
                'transition-colors',
                'focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus'
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!name.trim() || !prompt.trim()}>
              {isEditing ? 'Save Changes' : 'Create Preset'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
