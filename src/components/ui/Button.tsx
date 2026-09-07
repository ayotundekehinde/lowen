import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  block?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-ring disabled:opacity-40 disabled:pointer-events-none select-none active:scale-[0.98]';

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-black hover:bg-accent-soft shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]',
  secondary:
    'bg-elevated text-ink hover:bg-hover border border-line',
  outline:
    'border border-line-strong text-ink-soft hover:text-ink hover:border-ink-faint',
  ghost: 'text-ink-soft hover:text-ink hover:bg-elevated',
  danger: 'bg-danger/90 text-white hover:bg-danger',
};

const sizes: Record<Size, string> = {
  sm: 'text-xs px-3 h-8',
  md: 'text-sm px-4 h-10',
  lg: 'text-base px-6 h-12',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  block,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        block && 'w-full',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
