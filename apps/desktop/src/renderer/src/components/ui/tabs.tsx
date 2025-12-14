import { clsx } from 'clsx'
import { createContext, useContext, useState, type ReactNode } from 'react'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

const useTabs = () => {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tabs components must be used within <Tabs>')
  return context
}

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
}

export const Tabs = ({ defaultValue, children, className }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

export const TabsList = ({ children, className }: TabsListProps) => {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1 p-1 rounded-lg bg-surface border border-border',
        className
      )}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

export const TabsTrigger = ({ value, children, className }: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = useTabs()
  const isActive = activeTab === value

  const handleClick = () => {
    setActiveTab(value)
  }

  return (
    <button
      onClick={handleClick}
      className={clsx(
        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-border-focus',
        isActive
          ? 'bg-background text-text-primary'
          : 'text-text-secondary hover:text-text-primary',
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

export const TabsContent = ({ value, children, className }: TabsContentProps) => {
  const { activeTab } = useTabs()

  if (activeTab !== value) return null

  return <div className={className}>{children}</div>
}
