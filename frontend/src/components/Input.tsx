import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, placeholder, type = 'text', error = '', ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-espresso mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 border-2 rounded font-sans text-text placeholder-arabica transition-all focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50 ${
          error
            ? 'border-rose-500 focus:border-rose-600'
            : 'border-parchment focus:border-gold'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}
