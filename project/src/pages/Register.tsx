import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, User, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validatePassword, extractApiErrors } from '../utils/validation';
import AuthLeftPanel from '../components/AuthLeftPanel';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ defaultValues: { terms: false } });

  const passwordValue = watch('password', '');
  const termsValue = watch('terms', false);

  const onSubmit = async (data: RegisterFormData) => {
    setApiErrors({});
    setGeneralError('');
    try {
      await registerUser({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || undefined,
        password: data.password,
      });
      navigate('/dashboard');
    } catch (err) {
      const extracted = extractApiErrors(err);
      const { _general, ...fieldErrors } = extracted;
      if (_general) setGeneralError(_general);
      setApiErrors(fieldErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 lg:p-8">
      <div className="flex w-full max-w-4xl shadow-2xl rounded-3xl overflow-hidden min-h-[700px]">
        {/* Left panel — hidden on mobile */}
        <div className="hidden lg:flex">
          <AuthLeftPanel
            heading={"Create Your\nAccount"}
            subheading="Join thousands managing their health smarter. Sign up to get started."
          />
        </div>

        {/* Right panel */}
        <div className="flex-1 bg-white rounded-3xl lg:rounded-l-none flex flex-col items-center justify-start px-8 py-10 overflow-y-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-blue-700 text-lg">MediCare</p>
          </div>

          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 flex-shrink-0">
            <User className="w-7 h-7 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-400 text-sm mb-8">Fill in the details below to get started</p>

          <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            {generalError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600 font-medium">{generalError}</p>
              </div>
            )}

            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              required
              icon={<User className="w-4 h-4" />}
              error={errors.name?.message || apiErrors.name}
              {...register('name', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            />

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              required
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message || apiErrors.email}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email address' },
              })}
            />

            {/* Phone */}
            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="Enter your phone number"
              icon={<Phone className="w-4 h-4" />}
              error={errors.phone?.message || apiErrors.phone}
              {...register('phone')}
            />

            {/* Password */}
            <PasswordInput
              label="Password"
              name="password"
              value={passwordValue}
              placeholder="Create a strong password"
              required
              showStrength
              error={errors.password?.message || apiErrors.password}
              onChange={(e) => setValue('password', e.target.value, { shouldValidate: true })}
              {...(() => {
                const { ref, ...rest } = register('password', {
                  required: 'Password is required',
                  validate: (v) => validatePassword(v) ?? true,
                });
                return { onBlur: rest.onBlur };
              })()}
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={watch('confirmPassword', '')}
              placeholder="Re-enter your password"
              required
              error={errors.confirmPassword?.message}
              onChange={(e) => setValue('confirmPassword', e.target.value, { shouldValidate: true })}
              {...(() => {
                const { ref, ...rest } = register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) => v === passwordValue || 'Passwords do not match',
                });
                return { onBlur: rest.onBlur };
              })()}
            />

            {/* Terms */}
            <div className="flex items-start gap-2.5">
              <button
                type="button"
                onClick={() => setValue('terms', !termsValue)}
                className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-colors ${
                  termsValue ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                } ${errors.terms ? 'border-red-400' : ''}`}
              >
                {termsValue && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <input type="hidden" {...register('terms', { validate: (v) => v || 'You must accept the terms to continue' })} />
              <div>
                <p className="text-sm text-gray-500">
                  I agree to the{' '}
                  <button type="button" className="text-blue-600 font-medium hover:underline">Terms of Service</button>
                  {' '}and{' '}
                  <button type="button" className="text-blue-600 font-medium hover:underline">Privacy Policy</button>
                </p>
                {errors.terms && <p className="text-xs text-red-500 font-medium mt-0.5">{errors.terms.message}</p>}
              </div>
            </div>

            <Button type="submit" fullWidth loading={isSubmitting}>
              Create Account
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <Button type="button" variant="secondary" fullWidth icon={<GoogleIcon />}>
              Sign up with Google
            </Button>
            <Button type="button" variant="secondary" fullWidth icon={<AppleIcon />}>
              Sign up with Apple
            </Button>

            <p className="text-center text-sm text-gray-500 pb-2">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
