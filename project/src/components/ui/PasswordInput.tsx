import { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  showStrength?: boolean;
}

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-400' };
  if (score === 3) return { score, label: 'Fair', color: 'bg-yellow-400' };
  if (score === 4) return { score, label: 'Good', color: 'bg-blue-400' };
  return { score, label: 'Strong', color: 'bg-green-500' };
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({
    label,
    name,
    value,
    onChange,
    onBlur,
    error,
    placeholder = 'Enter your password',
    required,
    showStrength = false,
  }, ref) {
    const [visible, setVisible] = useState(false);
    const strength = showStrength ? getStrength(value) : null;

    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-800">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Lock className="w-4 h-4" />
          </span>
          <input
            ref={ref}
            type={visible ? 'text' : 'password'}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            className={`
              w-full pl-10 pr-10 py-3 border rounded-xl text-sm text-gray-800 placeholder-gray-400 transition
              focus:outline-none focus:ring-2 focus:border-blue-400
              ${error
                ? 'border-red-400 bg-red-50 focus:ring-red-200'
                : 'border-gray-200 bg-white focus:ring-blue-200'
              }
            `}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {showStrength && value && strength && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength.score ? strength.color : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs font-medium ${
              strength.score <= 2 ? 'text-red-500' :
              strength.score === 3 ? 'text-yellow-600' :
              strength.score === 4 ? 'text-blue-600' : 'text-green-600'
            }`}>
              Password strength: {strength.label}
            </p>
          </div>
        )}

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

export default PasswordInput;
