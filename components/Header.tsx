'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const NAVY = '#1a2744';
const NAVY_DARK = '#131e36';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsMobileMenuOpen(false);
      setUserDropdownOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUserDropdownOpen(false);
  };

  // Get initials from display name or email
  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  return (
    <header ref={menuRef} className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center -ml-3">
            <Link href="/" className="flex items-center">
              <Image
                src="/neha-logo.png"
                alt="NEHA - New Era Housing Advisors"
                width={200}
                height={200}
                className="h-12 sm:h-16 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 font-medium transition-colors hover:text-[#1a2744]">Home</Link>
            <Link href="/projects" className="text-gray-700 font-medium transition-colors hover:text-[#1a2744] flex items-center">
              Projects
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <Link href="/about" className="text-gray-700 font-medium transition-colors hover:text-[#1a2744]">About</Link>
            <Link href="/testimonials" className="text-gray-700 font-medium transition-colors hover:text-[#1a2744]">Testimonials</Link>
            <Link href="/contact" className="text-gray-700 font-medium transition-colors hover:text-[#1a2744]">Contact</Link>
            <Link href="/career" className="text-gray-700 font-medium transition-colors hover:text-[#1a2744]">Career</Link>
          </nav>

          {/* Desktop Right Buttons */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <Link
              href="/post-property"
              className="px-5 py-2.5 text-white rounded-xl font-semibold text-sm transition-colors"
              style={{ backgroundColor: NAVY }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = NAVY_DARK)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = NAVY)}
            >
              Post Property
            </Link>
            <Link
              href="/consultation"
              className="flex items-center text-white px-5 py-2.5 rounded-full font-medium transition-colors"
              style={{ backgroundColor: NAVY }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = NAVY_DARK)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = NAVY)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Free Consultation
            </Link>

            {/* Login / User Avatar */}
            {!authLoading && (
              !user ? (
                /* Not logged in — show Login button */
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all"
                  style={{ borderColor: NAVY, color: NAVY }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = NAVY; }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Login
                </Link>
              ) : (
                /* Logged in — show avatar with dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 rounded-full transition-all hover:opacity-90"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
                      style={{ backgroundColor: NAVY }}
                    >
                      {getInitials()}
                    </div>
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                      {/* User info */}
                      <div className="px-4 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ backgroundColor: NAVY }}
                          >
                            {getInitials()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user.displayName || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-2">
                        <Link
                          href="/post-property"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Post Property
                        </Link>
                        <Link
                          href="/projects"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          My Properties
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block py-2 text-gray-700 font-medium hover:text-[#1a2744]" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/projects" className="block py-2 text-gray-700 font-medium hover:text-[#1a2744]" onClick={() => setIsMobileMenuOpen(false)}>Projects</Link>
            <Link href="/about" className="block py-2 text-gray-700 font-medium hover:text-[#1a2744]" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link href="/testimonials" className="block py-2 text-gray-700 font-medium hover:text-[#1a2744]" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</Link>
            <Link href="/contact" className="block py-2 text-gray-700 font-medium hover:text-[#1a2744]" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <Link href="/career" className="block py-2 text-gray-700 font-medium hover:text-[#1a2744]" onClick={() => setIsMobileMenuOpen(false)}>Career</Link>
            <Link
              href="/post-property"
              className="w-full block text-center py-3 text-white rounded-xl font-semibold text-sm mt-2"
              style={{ backgroundColor: NAVY }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Post Property
            </Link>
            <Link
              href="/consultation"
              className="flex items-center justify-center text-white px-5 py-3 rounded-full font-medium mt-2"
              style={{ backgroundColor: NAVY }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Free Consultation
            </Link>

            {/* Mobile Login / User */}
            {!authLoading && (
              !user ? (
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border mt-2"
                  style={{ borderColor: NAVY, color: NAVY }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Login
                </Link>
              ) : (
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <div className="flex items-center gap-3 py-2 mb-2">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: NAVY }}>
                      {getInitials()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border border-red-300 text-red-500 mt-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
