'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const saveUserToFirestore = async (user: { uid: string; displayName: string | null; email: string | null }) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: user.displayName || '',
        email: user.email || '',
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch { /* Non-critical */ }
  };
  const handleGoogleSignup = async () => {
    setError(''); setSocialLoading('google');
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await saveUserToFirestore(result.user);
      router.push('/');
    } catch (err: unknown) {
      const e = err as { code?: string };
      if (e.code !== 'auth/popup-closed-by-user') setError('Google sign-in failed. Please try again.');
    } finally { setSocialLoading(''); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update display name
      try {
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });
      } catch {
        // Non-critical — ignore if profile update fails
      }

      // 3. Save extra user data to Firestore (non-blocking)
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          firstName,
          lastName,
          displayName: `${firstName} ${lastName}`,
          email,
          createdAt: serverTimestamp(),
        });
      } catch {
        // Firestore write failed but auth succeeded — still redirect
        console.warn('Firestore write failed, but auth succeeded');
      }

      // Auth success — redirect regardless of Firestore result
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => router.push('/'), 1500);

    } catch (err: unknown) {
      // Only Auth errors reach here
      const firebaseError = err as { code?: string };
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in.');
      } else if (firebaseError.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (firebaseError.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-12"
      style={{ backgroundColor: '#1a2744' }}
    >
      <div className="w-full max-w-md" suppressHydrationWarning>

        {/* Heading */}
        <h1 className="text-white text-2xl font-bold text-center mb-1">Sign Up Account</h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Enter your personal data to create your account.
        </p>

        {/* Social Buttons — always visible */}
        <div className="space-y-3 mb-5">
          {/* Sign Up with Email */}
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-80 border"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }}
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Sign Up with Email
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={!!socialLoading}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-800 text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-60"
            style={{ backgroundColor: '#ffffff' }}
          >
            {socialLoading === 'google' ? <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
            : <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
            Continue with Google
          </button>
        </div>

        {/* Email Form — shown only when Sign Up with Email clicked */}
        {showEmailForm && (
          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3">
                {success}
              </div>
            )}

            {/* First Name + Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="eg. John"
                  required
                  suppressHydrationWarning
                  className="w-full px-4 py-3 rounded-xl text-sm text-gray-300 outline-none placeholder-gray-600 transition-colors"
                  style={{ backgroundColor: '#243156', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#C4A35A')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="eg. Francisco"
                  required
                  suppressHydrationWarning
                  className="w-full px-4 py-3 rounded-xl text-sm text-gray-300 outline-none placeholder-gray-600 transition-colors"
                  style={{ backgroundColor: '#243156', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#C4A35A')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="eg. johnfrans@gmail.com"
                required
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-xl text-sm text-gray-300 outline-none placeholder-gray-600 transition-colors"
                style={{ backgroundColor: '#243156', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#C4A35A')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={8}
                  suppressHydrationWarning
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-gray-300 outline-none placeholder-gray-600 transition-colors"
                  style={{ backgroundColor: '#243156', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#C4A35A')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-gray-600 text-xs mt-1.5">Must be at least 8 characters.</p>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-gray-900 text-sm transition-all hover:opacity-90 active:scale-95 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#ffffff' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Sign Up'}
            </button>
          </form>
        )}

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-white font-bold hover:underline">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}
