import { clsx } from 'clsx'
import { Pencil, Trash2, Lock } from 'lucide-react'
import { useState } from 'react'

export interface Preset {
  id: string
  name: string
  prompt: string
  isBuiltin: boolean
}

interface PresetCardProps {
  preset: Preset
  onEdit: (preset: Preset) => void
  onDelete: (id: string) => void
}

export const PresetCard = ({ preset, onEdit, onDelete }: PresetCardProps) => {
  const [showActions, setShowActions] = useState(false)

  const truncatedPrompt =
    preset.prompt.length > 80 ? preset.prompt.slice(0, 80) + '...' : preset.prompt

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(preset)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(preset.id)
  }

  return (
    <div
      className={clsx(
        'relative p-4 rounded-lg transition-colors',
        'bg-surface border border-border hover:border-border-focus'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-text-primary">{preset.name}</h3>
            {preset.isBuiltin && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-hover text-text-muted">
                <Lock className="w-2.5 h-2.5" />
                Built-in
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-text-muted leading-relaxed">{truncatedPrompt}</p>
        </div>

        {showActions && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleEdit}
              className={clsx(
                'p-1.5 rounded-md transition-colors',
                'text-text-muted hover:text-text-primary hover:bg-surface-hover'
              )}
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>

            {!preset.isBuiltin && (
              <button
                onClick={handleDelete}
                className={clsx(
                  'p-1.5 rounded-md transition-colors',
                  'text-text-muted hover:text-accent hover:bg-accent/10'
                )}
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
