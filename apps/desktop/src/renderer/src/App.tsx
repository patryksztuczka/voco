import { useState } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router'
import { History, Settings, Mic, Sparkles } from 'lucide-react'
import { HistoryWindow } from './components/history'
import { SettingsWindow } from './components/settings'
import { PresetsWindow } from './components/presets'
import { RecordingIsland } from './components/island'
import { clsx } from 'clsx'

export const App = () => {
  const [islandVisible, setIslandVisible] = useState(false)

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
          <NavLink
            to="/history"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-background text-text-primary'
                  : 'text-text-muted hover:text-text-primary'
              )
            }
          >
            <History className="w-4 h-4" />
            History
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-background text-text-primary'
                  : 'text-text-muted hover:text-text-primary'
              )
            }
          >
            <Settings className="w-4 h-4" />
            Settings
          </NavLink>
          <NavLink
            to="/presets"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-background text-text-primary'
                  : 'text-text-muted hover:text-text-primary'
              )
            }
          >
            <Sparkles className="w-4 h-4" />
            Presets
          </NavLink>
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
        <Routes>
          <Route path="/" element={<Navigate to="/history" replace />} />
          <Route path="/history" element={<HistoryWindow />} />
          <Route path="/settings" element={<SettingsWindow />} />
          <Route path="/presets" element={<PresetsWindow />} />
        </Routes>
      </div>

      {/* Recording Island */}
      <RecordingIsland visible={islandVisible} onClose={handleCloseIsland} />
    </div>
  )
}
