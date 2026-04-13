import { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-cream rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-parchment ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }: PropsWithChildren) {
  return <div className="mb-4 pb-4 border-b-2 border-arabica">{children}</div>;
}

export function CardTitle({ children }: PropsWithChildren) {
  return <h3 className="text-2xl font-bold text-espresso font-serif">{children}</h3>;
}

export function CardDescription({ children }: PropsWithChildren) {
  return <p className="text-sm text-arabica text-opacity-80">{children}</p>;
}

export function CardContent({ children }: PropsWithChildren) {
  return <div className="space-y-3">{children}</div>;
}
