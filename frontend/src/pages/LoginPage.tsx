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
import { useToast } from '../components/ui/Toast';
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  
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
        setError('Network Error: Cannot reach backend API. Please verify server connection.');
      } else if (err.response?.status === 404) {
        setError('404 Not Found: Authentication endpoint unavailable.');
      } else if (err.response?.status >= 500) {
        setError(`Server Error (${err.response.status}): Authentication service temporary error.`);
      } else {
        setError('Invalid email or password. If you do not have an account yet, please register below.');
      }
    }
  };

  const handleInstantDemoLogin = async () => {
    setError('');
    setDemoLoading(true);
    const demoData = {
      email: 'admin@resumify.io',
      password: 'password123',
    };
    setValue('email', demoData.email, { shouldValidate: true });
    setValue('password', demoData.password, { shouldValidate: true });

    try {
      // First attempt to log in
      const res = await api.post('/auth/login', demoData);
      saveAuth(res.data);
      navigate('/dashboard');
    } catch (err: any) {
      // If demo user does not exist in DB yet, auto-register demo user
      try {
        const regRes = await api.post('/auth/register', {
          fullName: 'Enterprise Demo Admin',
          email: demoData.email,
          password: demoData.password,
        });
        saveAuth(regRes.data);
        navigate('/dashboard');
      } catch (regErr: any) {
        setError(regErr.response?.data?.message || 'Failed to initialize demo session. Please try registering an account.');
      }
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <AnimatedLayout className="min-h-screen bg-background bg-mesh-pattern flex flex-col items-center justify-center p-6 relative">
      
      <ThemeToggle className="absolute top-5 right-5" />

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Logo Header */}
      <div className="mb-8">
        <Logo size="lg" href="/" />
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[420px] glass-card p-8 sm:p-10 shadow-2xl relative z-10">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">Welcome back</h1>
          <p className="text-xs text-[var(--color-text-muted)]">Enter your workspace credentials to access your account.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-[var(--color-danger-soft)] border border-[color:var(--color-danger)]/25 flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
              <p className="text-[var(--color-danger)] text-xs font-semibold leading-relaxed">{error}</p>
            </div>
          <Link to="/register" className="text-[11px] font-bold text-[var(--color-accent-strong)] hover:underline self-end">
            Create New Account →
          </Link>
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
                className={`form-input pl-10 ${errors.email ? 'border-[color:var(--color-danger)] focus:border-[color:var(--color-danger)]' : ''}`}
                placeholder="name@company.com"
                autoComplete="email"
                disabled={isSubmitting || demoLoading}
              />
              <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <p className="mt-1.5 text-[11px] text-[var(--color-danger)] font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="form-label mb-0">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); toast('info', 'Password reset link sent', 'If an account exists for this email, a reset link is on its way.'); }} className="text-[11px] font-semibold text-[var(--color-accent-strong)] hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`form-input pl-10 pr-10 ${errors.password ? 'border-[color:var(--color-danger)] focus:border-[color:var(--color-danger)]' : ''}`}
                placeholder="••••••••••••"
                autoComplete="current-password"
                disabled={isSubmitting || demoLoading}
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
            {errors.password && <p className="mt-1.5 text-[11px] text-[var(--color-danger)] font-medium">{errors.password.message}</p>}
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting || demoLoading}
              className="btn-primary w-full py-3 text-xs font-bold shadow-lg shadow-accent/10 cursor-pointer disabled:opacity-50"
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
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Demo Fast Login */}
        <button
          type="button"
          onClick={handleInstantDemoLogin}
          disabled={isSubmitting || demoLoading}
          className="btn-secondary w-full py-2.5 text-xs font-semibold text-text-primary border-accent/35 bg-accent-soft hover:bg-accent-soft transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {demoLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-accent-strong)]" />
              Initializing Demo Session...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent-strong)]" />
              One-Click Instant Demo Login
            </>
          )}
        </button>
      </div>

      {/* Footer link */}
      <p className="mt-8 text-xs text-[var(--color-text-subtle)]">
        Don't have a workspace yet?{' '}
        <Link to="/register" className="text-[var(--color-text-secondary)] font-semibold hover:text-[var(--color-text-primary)] hover:underline transition-colors">
          Create an account
        </Link>
      </p>
    </AnimatedLayout>
  );
}


