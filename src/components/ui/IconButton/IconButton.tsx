import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
}

export function IconButton({ title, className, children, ...props }: IconButtonProps) {
  return (
    <button
      title={title}
      aria-label={title}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded text-[var(--text-dim)] transition-colors hover:bg-[var(--bg-elev)] hover:text-[var(--text-muted)] disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
