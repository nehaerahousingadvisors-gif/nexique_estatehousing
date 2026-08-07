'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Singleton provider to avoid re-creating
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Helper: Translate Firebase error codes to user-friendly + fix steps
const getGoogleAuthErrorMessage = (err: any): { title: string; fix?: string; debugInfo?: string } => {
  const code = err?.code || '';
  const msg = (err?.message || '').toString();
  const rawInfo = `[DEBUG] Code: ${code || 'unknown'} | Message: ${msg || 'unknown'}`;

  switch (code) {
    case 'auth/popup-closed-by-user':
      return {
        title: 'Sign-in cancelled. You closed the popup before completing sign-in.',
        debugInfo: rawInfo,
      };
    case 'auth/popup-blocked':
      return {
        title: '🔒 Google sign-in popup was blocked by your browser.',
        fix: '👉 Fix: Please allow popups for this website, or click again — redirect mode will auto-start.',
        debugInfo: rawInfo,
      };
    case 'auth/cancelled-popup-request':
      return {
        title: 'Multiple sign-in attempts detected. Please try again once.',
        debugInfo: rawInfo,
      };
    case 'auth/operation-not-allowed':
    case 'auth/operation-not-supported-in-this-environment':
      return {
        title: '❌ Google Sign-In is NOT ENABLED in your Firebase project!',
        fix:
          '👉 FIX STEPS (MOST COMMON ISSUE):\n' +
          '1. Go to Firebase Console → Build → Authentication → Sign-in method\n' +
          '2. Find "Google" → Click "Enable" → Select project support email → SAVE\n' +
          '3. Go to "Authorized domains" tab → Add "localhost" + your production domain',
        debugInfo: rawInfo,
      };
    case 'auth/invalid-api-key':
    case 'auth/app-not-authorized':
    case 'auth/unauthorized-domain':
      return {
        title: `❌ This domain/app is not authorized for Google sign-in (${code})`,
        fix:
          '👉 FIX: Go to Firebase Console → Authentication → Settings → Authorized domains\n' +
          '   Add "localhost" (for development) and your production domain name.',
        debugInfo: rawInfo,
      };
    case 'auth/network-request-failed':
      return {
        title: '🌐 Network error. Please check your internet connection.',
        fix: '👉 Turn off any VPN / ad-blockers temporarily and try again.',
        debugInfo: rawInfo,
      };
    case 'auth/web-storage-unsupported':
      return {
        title: 'Browser storage/cookies are disabled.',
        fix: '👉 Fix: Enable cookies and localStorage in browser settings, or turn off incognito/private mode.',
        debugInfo: rawInfo,
      };
    case 'auth/account-exists-with-different-credential':
      return {
        title: 'An account with this email already exists (signed up differently).',
        fix: '👉 Please log in with your original method (email/password) instead.',
        debugInfo: rawInfo,
      };
    case 'auth/user-disabled':
      return {
        title: 'This account has been disabled. Please contact support.',
        debugInfo: rawInfo,
      };
    case 'auth/configuration-not-found':
    case 'auth/invalid-oauth-client-id':
      return {
        title: '❌ Firebase OAuth configuration not found.',
        fix:
          '👉 FIX: In Firebase Console → Authentication → Sign-in method → Google → Enable\n' +
          '   Then click "Save" (even if it looks enabled). This creates the OAuth client ID.',
        debugInfo: rawInfo,
      };
    default:
      return {
        title: `⚠️ Google login encountered an issue.`,
        fix:
          '👉 What to do:\n' +
          '   1. Refresh the page and try again\n' +
          '   2. Popup may have been blocked — try again, redirect mode will auto-enable\n' +
          '   3. Still stuck? Share the [DEBUG] info below with the team.',
        debugInfo: rawInfo,
      };
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [useRedirect, setUseRedirect] = useState(false);

  // ─── Handle redirect result on page load ────────────────────────────────
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log('✅ Google redirect login success:', result.user.email);
          router.push('/');
        }
      } catch (err: any) {
        const msg = (err?.message || '').toLowerCase();
        const isStorageGlitch =
          msg.includes('database is closing') ||
          msg.includes('indexeddb') ||
          msg.includes('internal') ||
          !err?.code;

        if (!isStorageGlitch) {
          const info = getGoogleAuthErrorMessage(err);
          setError(info.title + (info.fix ? `\n${info.fix}` : ''));
        } else {
          console.warn('Firebase storage glitch on load (non-critical):', err?.message);
        }
      }
    };
    handleRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (
        firebaseError.code === 'auth/user-not-found' ||
        firebaseError.code === 'auth/wrong-password' ||
        firebaseError.code === 'auth/invalid-credential'
      ) {
        setError('Invalid email or password. Please try again.');
      } else if (firebaseError.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (firebaseError.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    console.log('🔵 Starting Google login...');
    try {
      if (useRedirect) {
        console.log('→ Using signInWithRedirect method...');
        await signInWithRedirect(auth, googleProvider);
        return; // Will resume after redirect
      }

      console.log('→ Using signInWithPopup method...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google login success:', result.user.email);
      router.push('/');
    } catch (err: any) {
      console.error('❌ Google login error:', err);
      const info = getGoogleAuthErrorMessage(err);

      // If popup blocked, auto-enable redirect AND auto-retry for better UX
      if (err?.code === 'auth/popup-blocked') {
        setUseRedirect(true);
        setTimeout(() => {
          console.log('→ Auto-retrying Google login with redirect mode (popup was blocked)...');
          setError('🔒 Popup blocked! Retrying with redirect mode... (you will be redirected to Google shortly)');
          signInWithRedirect(auth, googleProvider).catch((e) => console.error('Redirect also failed:', e));
        }, 500);
      }

      // Display full error with fix steps + debug info
      const parts = [info.title];
      if (info.fix) parts.push('', info.fix);
      if (info.debugInfo) parts.push('', info.debugInfo);
      setError(parts.join('\n'));

      // Alert immediately for the most common config issues
      if (err?.code === 'auth/operation-not-allowed' || err?.code === 'auth/configuration-not-found') {
        alert(
          '❌ Google Sign-In Config Missing!\n\n' +
          '👉 STEP-BY-STEP FIX:\n' +
          '1. Open Firebase Console → Your Project\n' +
          '2. Go to Build → Authentication → Sign-in method\n' +
          '3. Find "Google" provider → Click "Enable" toggle\n' +
          '4. Choose a "Project support email" (dropdown) → Click SAVE\n' +
          '5. Go to "Authorized domains" → Add "localhost" (if missing)\n\n' +
          'After these steps, refresh this page and try again!'
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-4 md:py-6" style={{ backgroundColor: '#131d35' }}>
      <div className="w-full max-w-3xl">
        <div className="w-full max-w-xl mx-auto">
          {/* Tab Switcher */}
          <div className="flex items-center p-1 rounded-2xl mb-4 md:mb-5 bg-gray-100">
            <Link
              href="/login"
              className="flex-1 py-2.5 md:py-3 rounded-xl font-semibold text-base text-center text-white shadow-md"
              style={{ backgroundColor: '#131d35' }}
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="flex-1 py-2.5 md:py-3 rounded-xl font-semibold text-base text-center transition-all text-gray-600 hover:text-gray-900"
            >
              Sign Up
            </Link>
          </div>

          {/* Dark Card */}
          <div className="rounded-3xl p-5 md:p-7 border border-white/10" style={{ backgroundColor: '#1a2744' }}>
            {/* Heading */}
            <div className="mb-5">
              <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-3 hover:underline transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1">Hello!</h1>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Welcome Back</h2>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-200 border border-red-300/40 bg-red-900/30 whitespace-pre-wrap leading-relaxed select-text">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Email */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  required
                  className="w-full px-5 py-3.5 rounded-2xl text-base text-gray-800 placeholder-gray-500 outline-none border-2 border-transparent focus:border-blue-400 transition-colors bg-gray-100"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-5 py-3.5 rounded-2xl text-base text-gray-800 placeholder-gray-500 outline-none border-2 border-transparent focus:border-blue-400 transition-colors bg-gray-100 pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-right pt-0 pb-0.5">
                <Link href="#" className="text-sm text-gray-300 hover:text-white hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>

              {/* Log In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl font-bold text-gray-900 text-lg transition-all hover:shadow-2xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed bg-white mt-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Log In'
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center gap-5 my-5">
              <div className="flex-1 h-px bg-white/15"></div>
              <span className="text-sm text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px bg-white/15"></div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full py-3.5 rounded-2xl font-semibold text-gray-100 text-lg transition-all border-2 border-white/15 hover:bg-white/5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 bg-white/5"
            >
              {googleLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Sign up Link */}
            <p className="text-center text-sm md:text-base text-gray-300 mt-5">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-400 font-bold hover:underline hover:text-blue-300 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
