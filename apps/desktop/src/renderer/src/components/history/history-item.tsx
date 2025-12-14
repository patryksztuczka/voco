import { clsx } from 'clsx'
import { Copy, Check, Trash2 } from 'lucide-react'
import { useState } from 'react'

export interface TranscriptionRecord {
  id: string
  text: string
  timestamp: Date
  duration?: number
}

interface HistoryItemProps {
  record: TranscriptionRecord
  onCopy: (text: string) => void
  onDelete: (id: string) => void
}

export const HistoryItem = ({ record, onCopy, onDelete }: HistoryItemProps) => {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCopy(record.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(record.id)
  }

  const handleToggleExpand = () => {
    setExpanded(!expanded)
  }

  const handleMouseEnter = () => {
    setShowDelete(true)
  }

  const handleMouseLeave = () => {
    setShowDelete(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const truncatedText = record.text.length > 60 ? record.text.slice(0, 60) + '...' : record.text

  return (
    <div
      className={clsx(
        'group relative p-3 rounded-lg cursor-pointer transition-colors',
        'bg-surface border border-border hover:border-border-focus'
      )}
      onClick={handleToggleExpand}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={clsx('text-sm text-text-primary', !expanded && 'truncate')}>
            "{expanded ? record.text : truncatedText}"
          </p>
          <p className="mt-1 text-xs text-text-muted">{formatTime(record.timestamp)}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {showDelete && (
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

          <button
            onClick={handleCopy}
            className={clsx(
              'p-1.5 rounded-md transition-colors',
              copied
                ? 'text-success bg-success/10'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
            )}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

