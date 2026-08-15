import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { User, Lock, Shield, CheckCircle2, Building } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getUser } from '../lib/auth';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function SettingsPage() {
  const user = getUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'workspace'>('profile');
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async () => {
    await new Promise(res => setTimeout(res, 800));
    setSuccessMsg('Password updated successfully.');
    reset();
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <AppLayout>
      <div className="w-full max-w-4xl mx-auto space-y-8 pb-16">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Workspace Settings</h1>
          <p className="text-xs text-text-muted mt-1">Manage user account credentials, security parameters, and workspace preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-60 flex-shrink-0">
            <nav className="flex flex-col gap-1.5 font-semibold text-xs">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'profile' ? 'bg-accent-soft border border-accent/35 text-[var(--color-accent-strong)]' : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                <User className="w-4 h-4 text-[var(--color-accent-strong)]" /> User Profile
              </button>

              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'security' ? 'bg-accent-soft border border-accent/35 text-[var(--color-accent-strong)]' : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                <Shield className="w-4 h-4 text-[var(--color-success)]" /> Security & Auth
              </button>

              <button 
                onClick={() => setActiveTab('workspace')}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'workspace' ? 'bg-accent-soft border border-accent/35 text-[var(--color-accent-strong)]' : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                <Building className="w-4 h-4 text-purple-500" /> Enterprise Workspace
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-text-primary">{user?.fullName || 'Enterprise Member'}</h2>
                    <p className="text-xs text-text-muted">{user?.email || 'member@workspace.com'}</p>
                    <span className="badge badge-emerald mt-2">Workspace Administrator</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="profileName" className="form-label">Display Name</label>
                    <input id="profileName" name="profileName" type="text" defaultValue={user?.fullName || ''} className="form-input text-xs" />
                  </div>
                  <div>
                    <label htmlFor="profileEmail" className="form-label">Email Address</label>
                    <input id="profileEmail" name="profileEmail" type="email" defaultValue={user?.email || ''} className="form-input text-xs" disabled />
                  </div>
                  <div className="pt-2">
                    <button className="btn-primary py-2.5 px-5 text-xs font-bold shadow-md shadow-accent/20">
                      Save Profile Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-success-soft)] border border-[color:var(--color-success)]/25 flex items-center justify-center text-[var(--color-success)]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Change Account Password</h2>
                    <p className="text-xs text-text-muted">Update your workspace authorization password.</p>
                  </div>
                </div>

                {successMsg && (
                  <div className="p-3.5 rounded-xl bg-[var(--color-success-soft)] border border-[color:var(--color-success)]/30 flex items-center gap-2.5 text-[var(--color-success)] text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> {successMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                  <div>
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input id="currentPassword" type="password" {...register('currentPassword')} className="form-input text-xs" placeholder="••••••••••••" />
                    {errors.currentPassword && <span className="text-[11px] text-[var(--color-danger)] font-semibold mt-1 block">{errors.currentPassword.message as string}</span>}
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input id="newPassword" type="password" {...register('newPassword')} className="form-input text-xs" placeholder="••••••••••••" />
                    {errors.newPassword && <span className="text-[11px] text-[var(--color-danger)] font-semibold mt-1 block">{errors.newPassword.message as string}</span>}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input id="confirmPassword" type="password" {...register('confirmPassword')} className="form-input text-xs" placeholder="••••••••••••" />
                    {errors.confirmPassword && <span className="text-[11px] text-[var(--color-danger)] font-semibold mt-1 block">{errors.confirmPassword.message as string}</span>}
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={isSubmitting} className="btn-primary py-2.5 px-6 text-xs font-bold cursor-pointer">
                      {isSubmitting ? 'Updating Password...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'workspace' && (
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Enterprise Plan</h2>
                    <p className="text-xs text-text-muted">Resumify AI Pro Plan Active</p>
                  </div>
                  <span className="badge badge-emerald">Unlimited Inferences</span>
                </div>
                <div className="p-4 rounded-xl bg-raised border border-border space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Groq LLM Engine Throughput</span>
                    <span className="text-[var(--color-success)] font-bold font-mono">High Priority</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">PostgreSQL DB Encryption</span>
                    <span className="text-[var(--color-accent-strong)] font-bold font-mono">256-bit AES</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

