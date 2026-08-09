import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/api';
import { saveAuth, isAuthenticated } from '../lib/auth';
import AnimatedLayout from '../components/AnimatedLayout';
import { Command, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (data: RegisterFormValues) => {
    setError('');
    try {
      const res = await api.post('/auth/register', data);
      saveAuth(res.data);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.message === 'Network Error') {
        setError('Network Error: Cannot reach the backend. If on Vercel, check VITE_API_BASE_URL and CORS.');
      } else if (err.response?.status === 404) {
        setError('404 Not Found: The API endpoint does not exist on this domain.');
      } else if (err.response?.status >= 500) {
        setError(`Server Error (${err.response.status}): The backend might be waking up or crashing.`);
      } else {
        const status = err.response?.status ? ` (${err.response.status})` : '';
        setError(err.response?.data?.message || `Registration failed${status}. Please try again.`);
      }
    }
  };

  return (
    <AnimatedLayout className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4">
      
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
          <Command className="w-5 h-5 text-black" />
        </div>
        <span className="text-lg font-semibold text-zinc-100 tracking-tight">Resumify Inc.</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-[400px] glass-card p-8">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-zinc-100 mb-1">Create an account</h1>
          <p className="text-[13px] text-zinc-400">Get started with Resumify AI completely free.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="text-rose-500 text-[13px] font-medium leading-snug">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              id="fullName"
              type="text"
              {...register('fullName')}
              className={`form-input ${errors.fullName ? 'border-rose-500 focus:border-rose-500' : ''}`}
              placeholder="Jane Doe"
              autoComplete="name"
              disabled={isSubmitting}
            />
            {errors.fullName && <p className="mt-1.5 text-[12px] text-rose-500">{errors.fullName.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="form-label">Work Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`form-input ${errors.email ? 'border-rose-500 focus:border-rose-500' : ''}`}
              placeholder="jane@company.com"
              autoComplete="email"
              disabled={isSubmitting}
            />
            {errors.email && <p className="mt-1.5 text-[12px] text-rose-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`form-input pr-10 ${errors.password ? 'border-rose-500 focus:border-rose-500' : ''}`}
                placeholder="••••••••••••"
                autoComplete="new-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-[12px] text-rose-500">{errors.password.message}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-2.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-8 text-[13px] text-zinc-500">
        Already have an account?{' '}
        <Link to="/login" className="text-zinc-200 hover:text-white hover:underline transition-colors">
          Sign in
        </Link>
      </p>
    </AnimatedLayout>
  );
}
