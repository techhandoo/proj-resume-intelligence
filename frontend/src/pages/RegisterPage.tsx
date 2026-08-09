import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/api';
import { saveAuth, isAuthenticated } from '../lib/auth';
import AnimatedLayout from '../components/AnimatedLayout';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ui/ThemeToggle';
import { AlertCircle, Eye, EyeOff, Loader2, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

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

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password', '');
  const passLength = passwordValue.length;

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
        setError('Network Error: Unable to reach authentication server.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please verify your details.');
      }
    }
  };

  return (
    <AnimatedLayout className="min-h-screen bg-background bg-mesh-pattern flex flex-col items-center justify-center p-6 relative">
      
      <ThemeToggle className="absolute top-5 right-5" />

      {/* Ambient Radial Spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--color-success)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8">
        <Logo size="lg" href="/" />
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[420px] glass-card p-8 sm:p-10 shadow-2xl relative z-10">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">Create an account</h1>
          <p className="text-xs text-[var(--color-text-muted)]">Get started with Resumify AI Intelligence platform.</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-[var(--color-danger-soft)] border border-[color:var(--color-danger)]/25 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
            <p className="text-[var(--color-danger)] text-xs font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <div className="relative">
              <input
                id="fullName"
                type="text"
                {...register('fullName')}
                className={`form-input pl-10 ${errors.fullName ? 'border-[color:var(--color-danger)] focus:border-[color:var(--color-danger)]' : ''}`}
                placeholder="Jane Doe"
                autoComplete="name"
                disabled={isSubmitting}
              />
              <User className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.fullName && <p className="mt-1.5 text-[11px] text-[var(--color-danger)] font-medium">{errors.fullName.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="form-label">Work Email</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`form-input pl-10 ${errors.email ? 'border-[color:var(--color-danger)] focus:border-[color:var(--color-danger)]' : ''}`}
                placeholder="jane@company.com"
                autoComplete="email"
                disabled={isSubmitting}
              />
              <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <p className="mt-1.5 text-[11px] text-[var(--color-danger)] font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`form-input pl-10 pr-10 ${errors.password ? 'border-[color:var(--color-danger)] focus:border-[color:var(--color-danger)]' : ''}`}
                placeholder="••••••••••••"
                autoComplete="new-password"
                disabled={isSubmitting}
              />
              <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength Meter Bar */}
            {passLength > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex-1 h-1.5 bg-subtle rounded-full overflow-hidden flex gap-0.5">
                  <div className={`h-full flex-1 ${passLength >= 2 ? (passLength >= 8 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-rose-500'}`} />
                  <div className={`h-full flex-1 ${passLength >= 6 ? (passLength >= 10 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-subtle'}`} />
                  <div className={`h-full flex-1 ${passLength >= 10 ? 'bg-emerald-500' : 'bg-subtle'}`} />
                </div>
                <span className="text-[10px] font-mono text-text-muted">
                  {passLength >= 10 ? 'Strong' : passLength >= 6 ? 'Fair' : 'Weak'}
                </span>
              </div>
            )}
            {errors.password && <p className="mt-1.5 text-[11px] text-[var(--color-danger)] font-medium">{errors.password.message}</p>}
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 text-xs font-bold shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating Workspace Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center gap-2 text-[11px] text-text-muted justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-success)]" /> Enterprise 256-bit SSL Encrypted Workspace
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-[var(--color-text-subtle)]">
        Already have a workspace?{' '}
        <Link to="/login" className="text-[var(--color-text-secondary)] font-semibold hover:text-[var(--color-text-primary)] hover:underline transition-colors">
          Sign in
        </Link>
      </p>
    </AnimatedLayout>
  );
}

