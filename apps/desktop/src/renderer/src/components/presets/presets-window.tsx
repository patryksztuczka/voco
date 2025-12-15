import { useState, useEffect } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { Button } from '../ui'
import { PresetCard, type Preset } from './preset-card'
import { PresetForm } from './preset-form'

export const PresetsWindow = () => {
  const [presets, setPresets] = useState<Preset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null)

  // Load presets from database on mount
  useEffect(() => {
    const loadPresets = async () => {
      try {
        const data = await window.api.db.getPresets()
        setPresets(data)
      } catch (error) {
        console.error('Failed to load presets:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPresets()
  }, [])

  const handleAddNew = () => {
    setEditingPreset(null)
    setShowForm(true)
  }

  const handleEdit = (preset: Preset) => {
    setEditingPreset(preset)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await window.api.db.deletePreset(id)
      setPresets((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error('Failed to delete preset:', error)
    }
  }

  const handleSave = async (data: { name: string; prompt: string }) => {
    try {
      if (editingPreset) {
        // Update existing
        const updated = await window.api.db.updatePreset(editingPreset.id, data)
        setPresets((prev) => prev.map((p) => (p.id === editingPreset.id ? updated : p)))
      } else {
        // Create new
        const created = await window.api.db.createPreset(data)
        setPresets((prev) => [...prev, created])
      }
      setShowForm(false)
      setEditingPreset(null)
    } catch (error) {
      console.error('Failed to save preset:', error)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingPreset(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with drag region */}
      <header className="shrink-0 px-4 pt-3 pb-2 border-b border-border app-drag-region">
        <h1 className="text-base font-semibold text-text-primary text-center">Presets</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Add button */}
        <div className="mb-4">
          <Button onClick={handleAddNew} icon={<Plus className="w-4 h-4" />}>
            New Preset
          </Button>
        </div>

        {/* Presets grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-text-muted">Loading...</p>
          </div>
        ) : presets.length === 0 ? (
          <EmptyState onAdd={handleAddNew} />
        ) : (
          <div className="grid gap-3">
            {presets.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <PresetForm preset={editingPreset} onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  )
}

const EmptyState = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center px-4">
      <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-4">
        <Sparkles className="w-6 h-6 text-text-muted" />
      </div>
      <h3 className="text-sm font-medium text-text-primary mb-1">No presets yet</h3>
      <p className="text-xs text-text-muted mb-4">
        Create presets to transform your transcriptions with AI
      </p>
      <Button onClick={onAdd} variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
        Create your first preset
      </Button>
    </div>
  )
}
