import type { ButtonHTMLAttributes, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100 active:scale-[0.98]',
  secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
  ghost: 'bg-transparent text-blue-600 hover:bg-blue-50',
};

export default function Button({
  children,
  loading = false,
  variant = 'primary',
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1
        disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? <LoadingSpinner size="sm" color={variant === 'primary' ? 'white' : 'blue'} /> : icon}
      {children}
    </button>
  );
}
