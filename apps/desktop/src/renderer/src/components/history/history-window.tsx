import { useState, useMemo, useEffect } from 'react'
import { Mic } from 'lucide-react'
import { HistorySearch } from './history-search'
import { HistoryItem, type TranscriptionRecord } from './history-item'
import { DateGroup } from './date-group'
import { formatDateGroup } from './utils'

export const HistoryWindow = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [records, setRecords] = useState<TranscriptionRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load transcriptions from database on mount
  useEffect(() => {
    const loadTranscriptions = async () => {
      try {
        const data = await window.api.db.getTranscriptions()
        // Convert ISO strings to Date objects
        const transcriptions = data.map((record) => ({
          ...record,
          timestamp: new Date(record.timestamp),
          duration: record.duration ?? undefined
        }))
        setRecords(transcriptions)
      } catch (error) {
        console.error('Failed to load transcriptions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTranscriptions()
  }, [])

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records
    const query = searchQuery.toLowerCase()
    return records.filter((record) => record.text.toLowerCase().includes(query))
  }, [records, searchQuery])

  const groupedRecords = useMemo(() => {
    const groups = new Map<string, TranscriptionRecord[]>()

    filteredRecords.forEach((record) => {
      const groupLabel = formatDateGroup(record.timestamp)
      const existing = groups.get(groupLabel) || []
      groups.set(groupLabel, [...existing, record])
    })

    return groups
  }, [filteredRecords])

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  const handleDelete = async (id: string) => {
    try {
      await window.api.db.deleteTranscription(id)
      setRecords((prev) => prev.filter((r) => r.id !== id))
    } catch (error) {
      console.error('Failed to delete transcription:', error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with drag region */}
      <header className="shrink-0 px-4 pt-3 pb-2 border-b border-border app-drag-region">
        <h1 className="text-base font-semibold text-text-primary text-center">History</h1>
      </header>

      {/* Search */}
      <div className="shrink-0 p-4 border-b border-border">
        <HistorySearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-text-muted">Loading...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <EmptyState hasSearch={searchQuery.length > 0} />
        ) : (
          <div className="space-y-6">
            {Array.from(groupedRecords.entries()).map(([label, items]) => (
              <DateGroup key={label} label={label}>
                {items.map((record) => (
                  <HistoryItem
                    key={record.id}
                    record={record}
                    onCopy={handleCopy}
                    onDelete={handleDelete}
                  />
                ))}
              </DateGroup>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const EmptyState = ({ hasSearch }: { hasSearch: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-4">
        <Mic className="w-6 h-6 text-text-muted" />
      </div>
      {hasSearch ? (
        <>
          <h3 className="text-sm font-medium text-text-primary mb-1">No results found</h3>
          <p className="text-xs text-text-muted">Try adjusting your search query</p>
        </>
      ) : (
        <>
          <h3 className="text-sm font-medium text-text-primary mb-1">No transcriptions yet</h3>
          <p className="text-xs text-text-muted">
            Press{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-[10px]">
              ⌘⇧V
            </kbd>{' '}
            to start recording
          </p>
        </>
      )}
    </div>
  )
}
