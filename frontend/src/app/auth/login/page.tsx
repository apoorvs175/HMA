'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, Loader2, User, ChevronDown } from 'lucide-react';
import api from '@/lib/api';

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      router.push(`/${res.data.user.role}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/Loginbackground.png")',
          imageRendering: 'crisp-edges'
        }}
      />
      <div className="absolute inset-0 z-10 bg-black/30" />

      <div className="w-full max-w-md relative z-20 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl mb-6 border border-white/20 transition-all hover:scale-105">
            <Building2 size={48} className="text-white" />
          </div>
          <div className="-mt-4">
            <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">My Hostel</h1>
            <p className="text-white/80 font-medium mt-2 text-lg drop-shadow-lg">Secure Login to Your Dashboard</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-10 space-y-8 border border-white/20 -mt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white/90 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  required
                  className="block w-full h-14 pl-12 pr-4 py-2 border border-white/10 rounded-2xl bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/10 transition-all text-lg"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-white/90 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  required
                  className="block w-full h-14 pl-12 pr-4 py-2 border border-white/10 rounded-2xl bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/10 transition-all text-lg"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-white/90 uppercase tracking-widest ml-1">Your Role</label>
              <div className="relative group">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" />
                <select
                  className="block w-full h-14 pl-12 pr-10 py-2 text-lg border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/10 rounded-2xl appearance-none font-medium cursor-pointer transition-all shadow-inner [&>option]:bg-slate-900 [&>option]:text-white"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="admin">System Admin</option>
                  <option value="owner">Hostel Owner</option>
                  <option value="warden">Hostel Warden</option>
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none transition-transform group-focus-within:rotate-180" />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 backdrop-blur-md text-red-100 text-sm font-bold rounded-2xl flex items-center gap-3 border border-red-500/30 animate-shake">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-white text-slate-900 font-black text-lg rounded-2xl shadow-[0_10px_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_25px_-5px_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-white/40 mt-10 font-medium tracking-wide uppercase">
          © {new Date().getFullYear()} My Hostel. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
