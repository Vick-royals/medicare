import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, icon, rightElement, hint, className = '', ...props }, ref) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-800">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            {...props}
            className={`
              w-full py-3 border rounded-xl text-sm text-gray-800 placeholder-gray-400 transition
              focus:outline-none focus:ring-2 focus:border-blue-400
              ${icon ? 'pl-10' : 'pl-4'}
              ${rightElement ? 'pr-10' : 'pr-4'}
              ${error
                ? 'border-red-400 bg-red-50 focus:ring-red-200'
                : 'border-gray-200 bg-white focus:ring-blue-200'
              }
              ${className}
            `}
          />
          {rightElement && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {rightElement}
            </span>
          )}
        </div>
        {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

export default Input;
