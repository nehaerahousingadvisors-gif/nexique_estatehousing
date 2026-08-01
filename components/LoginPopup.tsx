'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPopup() {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Show popup after 1 second on first visit
    const dismissed = sessionStorage.getItem('loginPopupDismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('loginPopupDismissed', 'true');
    setShow(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dismiss();
    router.push('/login');
  };

  const handleSignup = () => {
    dismiss();
    router.push('/register');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Popup Card */}
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
        style={{ minHeight: '520px' }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop)',
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }} />

        {/* Skip button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:bg-white/20"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
        >
          Skip
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Content */}
        <div className="relative z-10 px-7 pt-10 pb-8">
          <h2 className="text-white text-3xl font-bold mb-1">Login</h2>
          <p className="text-white/80 text-sm mb-8">Welcome back please login to your account</p>

          <form onSubmit={handleLogin} className="space-y-4" suppressHydrationWarning>
            {/* Username */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="User Name"
                suppressHydrationWarning
                className="flex-1 bg-transparent text-white placeholder-white/60 text-sm outline-none"
              />
              <svg className="w-5 h-5 text-white/60 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            {/* Password */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                suppressHydrationWarning
                className="flex-1 bg-transparent text-white placeholder-white/60 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/60 hover:text-white/90 flex-shrink-0"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2.5 cursor-pointer w-fit">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  backgroundColor: rememberMe ? '#1a2744' : 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.4)',
                }}
              >
                {rememberMe && (
                  <svg className="w-3 h-3" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-white/80 text-sm">Remember me</span>
            </label>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90 active:scale-95 mt-2"
              style={{
                background: 'linear-gradient(135deg, #1a2744 0%, #243156 100%)',
                boxShadow: '0 4px 20px rgba(26,39,68,0.5)',
              }}
            >
              Login
            </button>
          </form>

          {/* Signup link */}
          <p className="text-center text-white/70 text-sm mt-5">
            Don&apos;t have an account?{' '}
            <button
              onClick={handleSignup}
              className="text-white font-bold hover:underline"
            >
              Signup
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
