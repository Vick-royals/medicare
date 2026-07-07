export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Must contain at least one number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Must contain at least one special character';
  return null;
}

export function extractApiErrors(error: unknown): Record<string, string> {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    const data = (error.response as { data: { errors?: Record<string, string>; message?: string } }).data;
    if (data?.errors) return data.errors;
    if (data?.message) return { _general: data.message };
  }
  return { _general: 'Something went wrong. Please try again.' };
}
