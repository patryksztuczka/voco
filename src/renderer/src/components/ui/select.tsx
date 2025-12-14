import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'
import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  label?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, label, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="block text-sm text-text-secondary">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            className={clsx(
              'w-full h-10 px-3 pr-10 rounded-lg appearance-none',
              'bg-surface border border-border',
              'text-text-primary',
              'transition-colors cursor-pointer',
              'focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>
      </div>
    )
  }
)

Select.displayName = 'Select'
