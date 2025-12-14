import { useState } from 'react'
import { History, Settings, Mic } from 'lucide-react'
import { HistoryWindow } from './components/history'
import { SettingsWindow } from './components/settings'
import { RecordingIsland } from './components/island'
import { clsx } from 'clsx'

type View = 'history' | 'settings'

export const App = () => {
  const [view, setView] = useState<View>('history')
  const [islandVisible, setIslandVisible] = useState(false)

  const handleShowHistory = () => {
    setView('history')
  }

  const handleShowSettings = () => {
    setView('settings')
  }

  const handleToggleIsland = () => {
    setIslandVisible(!islandVisible)
  }

  const handleCloseIsland = () => {
    setIslandVisible(false)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Navigation - temporary for development */}
      <nav className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-border bg-surface">
        <div className="flex items-center gap-1">
          <button
            onClick={handleShowHistory}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
              view === 'history'
                ? 'bg-background text-text-primary'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <History className="w-4 h-4" />
            History
          </button>
          <button
            onClick={handleShowSettings}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
              view === 'settings'
                ? 'bg-background text-text-primary'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Debug: Toggle Island */}
        <button
          onClick={handleToggleIsland}
          className={clsx(
            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            islandVisible ? 'bg-accent text-white' : 'bg-accent/10 text-accent hover:bg-accent/20'
          )}
        >
          <Mic className="w-4 h-4" />
          {islandVisible ? 'Recording...' : 'Start Recording'}
        </button>
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'history' && <HistoryWindow />}
        {view === 'settings' && <SettingsWindow />}
      </div>

      {/* Recording Island */}
      <RecordingIsland visible={islandVisible} onClose={handleCloseIsland} />
    </div>
  )
}
