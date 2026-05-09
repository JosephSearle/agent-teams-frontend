import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost' | 'danger' | 'sage'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  primary: 'primary bg-[var(--accent)] text-[var(--bg)] hover:opacity-90',
  ghost:
    'ghost border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text)]',
  danger: 'danger border border-red-500/40 text-red-400 hover:border-red-500/70 hover:text-red-300',
  sage: 'sage border border-emerald-500/40 text-emerald-400 hover:border-emerald-500/70 hover:text-emerald-300',
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-40',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
