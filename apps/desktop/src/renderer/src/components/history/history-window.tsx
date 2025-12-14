import { useState, useMemo } from 'react'
import { Mic } from 'lucide-react'
import { HistorySearch } from './history-search'
import { HistoryItem, type TranscriptionRecord } from './history-item'
import { DateGroup } from './date-group'
import { formatDateGroup } from './utils'

// Mock data for development
const mockRecords: TranscriptionRecord[] = [
  {
    id: '1',
    text: 'Remember to buy groceries and pick up the dry cleaning after work today',
    timestamp: new Date(),
    duration: 5
  },
  {
    id: '2',
    text: 'Send the quarterly report to the marketing team before the meeting',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    duration: 4
  },
  {
    id: '3',
    text: 'Schedule a call with the design team to discuss the new landing page mockups',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    duration: 6
  },
  {
    id: '4',
    text: 'Review the pull request for the authentication feature and leave feedback',
    timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
    duration: 5
  },
  {
    id: '5',
    text: 'Book flight tickets for the conference next month',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    duration: 3
  }
]

export const HistoryWindow = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [records, setRecords] = useState<TranscriptionRecord[]>(mockRecords)

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

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
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
        {filteredRecords.length === 0 ? (
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
