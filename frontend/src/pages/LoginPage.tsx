import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/api';
import { saveAuth, isAuthenticated } from '../lib/auth';
import AnimatedLayout from '../components/AnimatedLayout';
import Logo from '../components/Logo';
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    setError('');
    try {
      const res = await api.post('/auth/login', data);
      saveAuth(res.data);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message === 'Network Error') {
        setError('Network Error: Cannot reach the backend. Please verify your connection.');
      } else if (err.response?.status === 404) {
        setError('404 Not Found: The authentication API endpoint could not be located.');
      } else if (err.response?.status >= 500) {
        setError(`Server Error (${err.response.status}): The authentication service is temporarily unavailable.`);
      } else {
        setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <AnimatedLayout className="min-h-screen bg-[#030304] bg-mesh-pattern flex flex-col items-center justify-center p-6 relative">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Logo Header */}
      <div className="mb-8">
        <Logo size="lg" href="/" />
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[420px] glass-card p-8 sm:p-10 shadow-2xl relative z-10">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-extrabold text-white tracking-tight mb-2">Welcome back</h1>
          <p className="text-xs text-zinc-400">Enter your workspace credentials to access your account.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="text-rose-400 text-xs font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="form-label">Work Email</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`form-input pl-10 ${errors.email ? 'border-rose-500 focus:border-rose-500' : ''}`}
                placeholder="name@company.com"
                autoComplete="email"
                disabled={isSubmitting}
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <p className="mt-1.5 text-[11px] text-rose-400 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="form-label mb-0">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link has been dispatched to your email.'); }} className="text-[11px] font-semibold text-blue-400 hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`form-input pl-10 pr-10 ${errors.password ? 'border-rose-500 focus:border-rose-500' : ''}`}
                placeholder="••••••••••••"
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-[11px] text-rose-400 font-medium">{errors.password.message}</p>}
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 text-xs font-bold shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Workspace <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-[#1c1c21]" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-[#1c1c21]" />
        </div>

        {/* Demo Fast Login */}
        <button
          type="button"
          onClick={() => {
            setValue('email', 'admin@resumify.io');
            setValue('password', 'password123');
          }}
          className="btn-secondary w-full py-2.5 text-xs font-semibold text-zinc-300"
        >
          Fill Demo Credentials
        </button>
      </div>

      {/* Footer link */}
      <p className="mt-8 text-xs text-zinc-500">
        Don't have a workspace yet?{' '}
        <Link to="/register" className="text-zinc-200 font-semibold hover:text-white hover:underline transition-colors">
          Create an account
        </Link>
      </p>
    </AnimatedLayout>
  );
}

