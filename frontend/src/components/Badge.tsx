import { PropsWithChildren } from 'react';

type BadgeVariant = 'default' | 'altitude' | 'torra' | 'success' | 'warning' | 'error';

interface BadgeProps extends PropsWithChildren {
  variant?: BadgeVariant;
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-gold text-text font-semibold',
    altitude: 'bg-espresso text-cream text-xs font-mono',
    torra: 'bg-arabica text-cream text-xs',
    success: 'bg-emerald-600 text-white',
    warning: 'bg-amber-600 text-white',
    error: 'bg-rose-600 text-white',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${variants[variant]}`}>
      {children}
    </span>
  );
}
