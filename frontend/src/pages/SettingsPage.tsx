import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { User, Lock, Shield, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('security');
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async () => {
    // Dummy submit
    await new Promise(res => setTimeout(res, 1000));
    setSuccessMsg('Password updated successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <AppLayout>
      <div className="w-full max-w-4xl mx-auto pb-16 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-6">Settings</h1>
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-3 py-2 text-[14px] font-medium rounded-md transition-colors ${
                activeTab === 'profile' ? 'bg-[#171717] text-zinc-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#171717]'
              }`}
            >
              <User className="w-4 h-4" /> Profile
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-3 py-2 text-[14px] font-medium rounded-md transition-colors ${
                activeTab === 'security' ? 'bg-[#171717] text-zinc-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#171717]'
              }`}
            >
              <Shield className="w-4 h-4" /> Security
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'security' && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded bg-[#171717] border border-[#1f1f22] flex items-center justify-center">
                  <Lock className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-zinc-100">Change Password</h2>
                  <p className="text-[13px] text-zinc-500">Update your account password securely.</p>
                </div>
              </div>

              {successMsg && (
                <div className="mb-6 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <div>
                  <label className="form-label">Current Password</label>
                  <input type="password" {...register('currentPassword')} className="form-input" />
                  {errors.currentPassword && <span className="text-xs text-rose-400 mt-1 block">{errors.currentPassword.message as string}</span>}
                </div>
                <div>
                  <label className="form-label">New Password</label>
                  <input type="password" {...register('newPassword')} className="form-input" />
                  {errors.newPassword && <span className="text-xs text-rose-400 mt-1 block">{errors.newPassword.message as string}</span>}
                </div>
                <div>
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" {...register('confirmPassword')} className="form-input" />
                  {errors.confirmPassword && <span className="text-xs text-rose-400 mt-1 block">{errors.confirmPassword.message as string}</span>}
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={isSubmitting} className="btn-primary px-6 py-2">
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="glass-card p-6">
              <h2 className="text-[16px] font-semibold text-zinc-100 mb-4">Profile Details</h2>
              <p className="text-[13px] text-zinc-500">Profile management is coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
