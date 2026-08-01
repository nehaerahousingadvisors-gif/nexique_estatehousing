'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (firebaseError.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (firebaseError.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#1a2744' }}>
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1a2744 0%, #0f1a30 40%, #1a2744 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ backgroundColor: '#cc0000' }} />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-2xl opacity-20" style={{ backgroundColor: '#ff4444' }} />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-72 h-72 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(204,0,0,0.1)', border: '1px solid rgba(204,0,0,0.2)' }}>
            <svg className="w-40 h-40 opacity-60" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="70" r="40" stroke="#cc0000" strokeWidth="3" fill="none"/>
              <circle cx="100" cy="70" r="25" stroke="#ff4444" strokeWidth="2" fill="rgba(204,0,0,0.1)"/>
              <circle cx="88" cy="65" r="6" fill="#cc0000"/>
              <circle cx="112" cy="65" r="6" fill="#cc0000"/>
              <path d="M88 82 Q100 90 112 82" stroke="#cc0000" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <rect x="80" y="115" width="40" height="60" rx="8" stroke="#cc0000" strokeWidth="2" fill="rgba(204,0,0,0.1)"/>
              <rect x="55" y="120" width="20" height="45" rx="6" stroke="#cc0000" strokeWidth="2" fill="rgba(204,0,0,0.1)"/>
              <rect x="125" y="120" width="20" height="45" rx="6" stroke="#cc0000" strokeWidth="2" fill="rgba(204,0,0,0.1)"/>
              <rect x="80" y="175" width="16" height="22" rx="5" stroke="#cc0000" strokeWidth="2" fill="rgba(204,0,0,0.1)"/>
              <rect x="104" y="175" width="16" height="22" rx="5" stroke="#cc0000" strokeWidth="2" fill="rgba(204,0,0,0.1)"/>
              <line x1="60" y1="110" x2="140" y2="110" stroke="#cc0000" strokeWidth="2" strokeDasharray="4 3"/>
              {[...Array(6)].map((_, i) => (
                <circle key={i} cx={70 + i * 12} cy={105} r="2" fill="#ff4444" opacity={0.6} />
              ))}
            </svg>
          </div>
          <p className="text-gray-400 text-sm mt-6 tracking-widest uppercase">Nexique Estate</p>
          <p className="text-gray-600 text-xs mt-1">Your trusted property partner</p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12" style={{ backgroundColor: '#1a2744' }}>
        <div className="w-full max-w-sm">
          <div className="rounded-2xl px-8 py-10"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>

            <h1 className="text-white text-2xl font-bold text-center mb-1">Hello!</h1>
            <h2 className="text-white text-2xl font-bold text-center mb-8">Welcome Back</h2>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300 border border-red-500/30" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                {error}
              </div>
            )}

            <Link href="/" className="flex items-center gap-1 text-gray-400 hover:text-white mb-5 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-lg font-medium">Back</span>
            </Link>

            <form onSubmit={handleSubmit} className="space-y-5" suppressHydrationWarning>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter Email" required suppressHydrationWarning
                className="w-full px-5 py-4 rounded-2xl text-base text-gray-800 font-medium outline-none"
                style={{ backgroundColor: '#e8e8e8', border: 'none' }} />
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••" required suppressHydrationWarning
                  className="w-full px-5 py-4 rounded-2xl text-base text-gray-800 font-medium outline-none pr-12"
                  style={{ backgroundColor: '#e8e8e8', border: 'none' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                  {showPassword
                    ? <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    : <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>}
                </button>
              </div>
              <div className="text-right">
                <Link href="/forgot-password" className="text-gray-400 hover:text-white transition-colors" style={{ fontSize: '1.1rem' }}>Forgot Password?</Link>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl font-semibold text-gray-900 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{ backgroundColor: '#ffffff', fontSize: '1.25rem' }}>
                {loading ? <span className="flex items-center justify-center gap-2"><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Logging in...</span> : 'Log In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-white font-bold hover:underline">Create Account!</Link>
            </p>
          </div>
          <p className="text-center mt-5">
            <Link href="/" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
