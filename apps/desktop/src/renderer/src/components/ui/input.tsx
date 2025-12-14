import { clsx } from 'clsx'
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, className, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full h-10 px-3 rounded-lg',
            'bg-surface border border-border',
            'text-text-primary placeholder:text-text-muted',
            'transition-colors',
            'focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            icon && 'pl-10',
            error && 'border-accent',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-accent">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
