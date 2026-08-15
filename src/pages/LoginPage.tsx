import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Sparkles, Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    // Simulasi Proses Login / Autentikasi
    setTimeout(() => {
      setIsLoading(false);

      if (email === 'admin@eduai.com' && password === 'admin123') {
        const adminUser: UserProfile = {
          id: '1',
          name: 'Super Admin',
          email: 'admin@eduai.com',
          role: 'admin',
          isActive: true,
          createdAt: '2026-01-01',
        };
        onLoginSuccess(adminUser);
      } else if (email === 'guru@eduai.com' && password === 'guru123') {
        const guruUser: UserProfile = {
          id: '2',
          name: 'Budi Santoso, S.Pd',
          email: 'guru@eduai.com',
          role: 'guru',
          schoolName: 'SMP Negeri 1 Yogyakarta',
          isActive: true,
          expiresAt: '2026-12-31',
          createdAt: '2026-02-15',
        };
        onLoginSuccess(guruUser);
      } else {
        setErrorMessage('Email atau password yang Anda masukkan salah.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-800 antialiased">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl space-y-6">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30 mb-2">
            <Sparkles className="w-7 h-7" />
          </div>
          {/* NAMA APLIKASI DIUBAH DI SINI */}
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">AKSIKU</h1>
          <p className="text-xs font-semibold text-slate-500">
            Masuk untuk mengakses Super App Pendidikan
          </p>
        </div>

        {/* Alert Error */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs font-bold text-center animate-in fade-in">
            {errorMessage}
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Email
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sekolah.sch.id"
                className="w-full pl-10 pr-4 py-3 text-xs font-semibold rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          {/* Input Password + Toggle Visibility */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 absolute left-3.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 text-xs font-semibold rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-slate-50/50 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 transition"
                title={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 uppercase tracking-wider mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Memproses...' : 'Masuk ke Aplikasi'}</span>
          </button>
        </form>

        {/* Teks Demo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400 space-y-0.5 font-medium">
            <p><strong>Demo Admin:</strong> admin@eduai.com | admin123</p>
            <p><strong>Demo Guru:</strong> guru@eduai.com | guru123</p>
          </div>
        )}

      </div>
    </div>
  );
};