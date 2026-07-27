import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { saveAuth } from '../lib/auth';
import Logo from '../components/Logo';

function getPasswordStrength(password: string) {
  const checks = [
    { label: 'At least 6 characters',    passed: password.length >= 6 },
    { label: 'Contains uppercase letter', passed: /[A-Z]/.test(password) },
    { label: 'Contains a number',         passed: /[0-9]/.test(password) },
    { label: 'Has special character',     passed: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.passed).length;
  const levels = [
    { label: 'Too weak',  color: 'text-rose-400',    barColor: 'bg-rose-500' },
    { label: 'Weak',      color: 'text-orange-400',  barColor: 'bg-orange-500' },
    { label: 'Fair',      color: 'text-amber-400',   barColor: 'bg-amber-400' },
    { label: 'Good',      color: 'text-blue-400',    barColor: 'bg-blue-500' },
    { label: 'Strong',    color: 'text-emerald-400', barColor: 'bg-emerald-500' },
  ];
  return { score, ...levels[score], checks };
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [touched, setTouched]     = useState({ fullName: false, email: false, password: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { fullName, email, password });
      saveAuth(res.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength   = useMemo(() => getPasswordStrength(password), [password]);
  const nameValid  = fullName.trim().length >= 2;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passValid  = password.length >= 6;
  const formValid  = nameValid && emailValid && passValid;

  const fieldBorder = (isValid: boolean, isTouched: boolean) =>
    isTouched ? (isValid ? 'border-emerald-500/40 focus:border-emerald-500/60' : 'border-rose-500/40 focus:border-rose-500/60') : '';

  return (
    <div className="vibrant-bg min-h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      <div className="vibrant-overlay" />
      <div className="hero-glow" />
      <div className="hero-glow-secondary" />

      <div className="relative z-10 w-full max-w-[540px] py-12">

        {/* Brand Header */}
        <div className="flex justify-center mb-10">
          <Logo size="md" href="/" />
        </div>

        {/* Card */}
        <div className="auth-card">

          {/* Card Header */}
          <div className="px-10 pt-10 pb-8 border-b border-white/[0.06] text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl mx-auto mb-5">
              ✨
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3 text-center">
              Create your account
            </h1>
            <p className="text-slate-400 text-[15px] leading-relaxed font-normal text-center max-w-sm mx-auto">
              Get started with AI-powered resume intelligence — completely free
            </p>
          </div>

          {/* Card Body */}
          <div className="px-10 py-9">

            {error && (
              <div className="mb-7 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                <span className="text-rose-400 text-[18px] leading-none flex-shrink-0 mt-0.5">⚠</span>
                <p className="text-rose-400 text-sm font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Full Name */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="fullName" className="form-label mb-0">Full Name</label>
                  {touched.fullName && (
                    <span className={`text-[11px] font-semibold ${nameValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {nameValid ? '✓ Looks good' : 'Min. 2 characters'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                    required
                    className={`form-input pr-10 ${fieldBorder(nameValid, touched.fullName)}`}
                    placeholder="Sarah Jenkins"
                    autoComplete="name"
                  />
                  {touched.fullName && (
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold ${nameValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {nameValid ? '✓' : '✗'}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Your display name — first and last name recommended
                </p>
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="email" className="form-label mb-0">Work Email</label>
                  {touched.email && (
                    <span className={`text-[11px] font-semibold ${emailValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {emailValid ? '✓ Valid email' : 'Invalid format'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    required
                    className={`form-input pr-10 ${fieldBorder(emailValid, touched.email)}`}
                    placeholder="sarah@company.com"
                    autoComplete="email"
                  />
                  {touched.email && (
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold ${emailValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {emailValid ? '✓' : '✗'}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Format: name@company.com — used to sign in
                </p>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="form-label mb-0">Password</label>
                  {password.length > 0 && (
                    <span className={`text-[11px] font-bold ${strength.color}`}>{strength.label}</span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    required
                    minLength={6}
                    className={`form-input pr-12 ${fieldBorder(passValid, touched.password)}`}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <div className="mt-3 space-y-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-400 ${
                            i < strength.score ? strength.barColor : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                      {strength.checks.map((check) => (
                        <div key={check.label} className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${check.passed ? 'text-emerald-400' : 'text-slate-600'}`}>
                            {check.passed ? '✓' : '○'}
                          </span>
                          <span className={`text-[12px] leading-relaxed ${check.passed ? 'text-slate-300' : 'text-slate-500'}`}>
                            {check.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!password && (
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    Min. 6 characters — mix letters, numbers &amp; symbols for best security
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !formValid}
                  className="btn-primary w-full py-4 text-[15px] tracking-wide"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Card Footer */}
          <div className="px-10 py-6 border-t border-white/[0.05] bg-white/[0.018] text-center">
            <p className="text-[13px] font-normal text-slate-500 leading-relaxed">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors underline underline-offset-2 decoration-blue-400/40"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[12px] text-slate-600 mt-7 leading-relaxed">
          By registering, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
