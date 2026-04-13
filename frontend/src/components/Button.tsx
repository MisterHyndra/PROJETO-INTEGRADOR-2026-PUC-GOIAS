import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function Button({ children, variant = 'primary', className = '', size = 'md', ...props }: ButtonProps) {
  const baseStyles = 'font-semibold rounded transition-all duration-200 font-sans';
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-espresso text-cream hover:bg-arabica shadow-md hover:shadow-lg',
    secondary: 'bg-arabica text-cream hover:bg-espresso shadow-md hover:shadow-lg',
    outline: 'border-2 border-espresso text-espresso hover:bg-espresso hover:text-cream',
    gold: 'bg-gold text-text hover:opacity-90 shadow-md hover:shadow-lg',
  };

  return (
    <button className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
