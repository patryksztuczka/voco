import { clsx } from 'clsx'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, className, checked, ...props }, ref) => {
    return (
      <label className={clsx('inline-flex items-center gap-3 cursor-pointer', className)}>
        <div className="relative">
          <input ref={ref} type="checkbox" className="sr-only peer" checked={checked} {...props} />
          <div
            className={clsx(
              'w-10 h-6 rounded-full transition-colors',
              'bg-border peer-checked:bg-success',
              'peer-focus:ring-2 peer-focus:ring-border-focus peer-focus:ring-offset-2 peer-focus:ring-offset-background',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed'
            )}
          />
          <div
            className={clsx(
              'absolute top-1 left-1 w-4 h-4 rounded-full',
              'bg-text-primary transition-transform',
              'peer-checked:translate-x-4'
            )}
          />
        </div>
        {label && <span className="text-sm text-text-primary">{label}</span>}
      </label>
    )
  }
)

Toggle.displayName = 'Toggle'
