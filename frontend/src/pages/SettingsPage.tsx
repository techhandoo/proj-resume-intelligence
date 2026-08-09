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
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Workspace Settings</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage user account credentials, security parameters, and workspace preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-60 flex-shrink-0">
            <nav className="flex flex-col gap-1.5 font-semibold text-xs">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'profile' ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300' : 'text-zinc-400 hover:text-white hover:bg-[#121215]'
                }`}
              >
                <User className="w-4 h-4 text-blue-400" /> User Profile
              </button>

              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'security' ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300' : 'text-zinc-400 hover:text-white hover:bg-[#121215]'
                }`}
              >
                <Shield className="w-4 h-4 text-emerald-400" /> Security & Auth
              </button>

              <button 
                onClick={() => setActiveTab('workspace')}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'workspace' ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300' : 'text-zinc-400 hover:text-white hover:bg-[#121215]'
                }`}
              >
                <Building className="w-4 h-4 text-purple-400" /> Enterprise Workspace
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-[#1c1c21]">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">{user?.fullName || 'Enterprise Member'}</h2>
                    <p className="text-xs text-zinc-400">{user?.email || 'member@workspace.com'}</p>
                    <span className="badge badge-emerald mt-2">Workspace Administrator</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="form-label">Display Name</label>
                    <input type="text" defaultValue={user?.fullName || ''} className="form-input text-xs" />
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input type="email" defaultValue={user?.email || ''} className="form-input text-xs" disabled />
                  </div>
                  <div className="pt-2">
                    <button className="btn-primary py-2.5 px-5 text-xs font-bold shadow-md shadow-blue-500/20">
                      Save Profile Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#1c1c21]">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Change Account Password</h2>
                    <p className="text-xs text-zinc-400">Update your workspace authorization password.</p>
                  </div>
                </div>

                {successMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2.5 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> {successMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                  <div>
                    <label className="form-label">Current Password</label>
                    <input type="password" {...register('currentPassword')} className="form-input text-xs" placeholder="••••••••••••" />
                    {errors.currentPassword && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.currentPassword.message as string}</span>}
                  </div>
                  <div>
                    <label className="form-label">New Password</label>
                    <input type="password" {...register('newPassword')} className="form-input text-xs" placeholder="••••••••••••" />
                    {errors.newPassword && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.newPassword.message as string}</span>}
                  </div>
                  <div>
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" {...register('confirmPassword')} className="form-input text-xs" placeholder="••••••••••••" />
                    {errors.confirmPassword && <span className="text-[11px] text-rose-400 font-semibold mt-1 block">{errors.confirmPassword.message as string}</span>}
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
                <div className="flex items-center justify-between pb-4 border-b border-[#1c1c21]">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Enterprise Plan</h2>
                    <p className="text-xs text-zinc-400">Resumify AI Pro Plan Active</p>
                  </div>
                  <span className="badge badge-emerald">Unlimited Inferences</span>
                </div>
                <div className="p-4 rounded-xl bg-[#08080b] border border-white/5 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Groq LLM Engine Throughput</span>
                    <span className="text-emerald-400 font-bold font-mono">High Priority</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">PostgreSQL DB Encryption</span>
                    <span className="text-blue-400 font-bold font-mono">256-bit AES</span>
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

