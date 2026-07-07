interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'blue' | 'gray';
}

const sizeClasses = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
const colorClasses = {
  white: 'border-white/30 border-t-white',
  blue: 'border-blue-200 border-t-blue-600',
  gray: 'border-gray-200 border-t-gray-500',
};

export default function LoadingSpinner({ size = 'md', color = 'blue' }: LoadingSpinnerProps) {
  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} border-2 rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
