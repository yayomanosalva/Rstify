import { loginSchema } from '@/features/auth/schemas/authSchema';
import type { LoginInput } from '@/features/auth/schemas/authSchema';
import { type FieldApi, useForm } from '@tanstack/react-form';
import type React from 'react';
import { useAuth } from '../context/AuthContext';

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();

  const form = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const validatedData = loginSchema.parse(value);
        await login(validatedData);
      } catch (error) {
        console.error('Login error:', error);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto bg-white rounded p-8">
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="email">
          {(field: FieldApi<LoginInput, 'email'>) => (
            <div>
              <label className="block mb-1">Email</label>
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="email"
                className="w-full p-2 border rounded"
                disabled={isLoading}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field: FieldApi<LoginInput, 'password'>) => (
            <div>
              <label className="block mb-1">Password</label>
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="password"
                className="w-full p-2 border rounded"
                disabled={isLoading}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground p-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};
