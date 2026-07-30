import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { saveAuth } from '../lib/auth';
import Logo from '../components/Logo';
import AnimatedLayout from '../components/AnimatedLayout';
import { Lock, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      saveAuth(res.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedLayout className="vibrant-bg min-h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-[440px] py-12">

        {/* Brand Header */}
        <div className="flex justify-center mb-10">
          <Logo size="md" href="/" />
        </div>

        {/* Card */}
        <div className="auth-card">

          {/* Card Header */}
          <div className="px-10 pt-10 pb-8 border-b border-white/[0.04] text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3 text-center">
              Welcome back
            </h1>
            <p className="text-slate-400 text-[15px] leading-relaxed font-normal text-center max-w-sm mx-auto">
              Sign in to access your AI resume analytics dashboard
            </p>
          </div>

          {/* Card Body */}
          <div className="px-10 py-9">

            {error && (
              <div className="mb-7 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="text-rose-400 text-sm font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label htmlFor="email" className="form-label">Work Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                  placeholder="recruiter@company.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="form-label">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input pr-12"
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-[15px] tracking-wide"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Card Footer */}
          <div className="px-10 py-6 border-t border-white/[0.05] bg-white/[0.018] text-center">
            <p className="text-[13px] font-normal text-slate-500 leading-relaxed">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors underline underline-offset-2 decoration-blue-400/40"
              >
                Create a free account
              </Link>
            </p>
          </div>
        </div>

        {/* Trust note */}
        <p className="text-center text-[12px] text-zinc-600 mt-7 leading-relaxed font-medium">
          Protected by enterprise-grade JWT encryption
        </p>
      </div>
    </AnimatedLayout>
  );
}
