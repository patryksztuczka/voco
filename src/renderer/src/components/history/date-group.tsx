import type { ReactNode } from 'react'

interface DateGroupProps {
  label: string
  children: ReactNode
}

export const DateGroup = ({ label, children }: DateGroupProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider px-1">{label}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}
