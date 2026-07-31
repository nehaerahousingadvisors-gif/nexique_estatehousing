'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const NAVY = '#1a2744';
const NAVY_DARK = '#131e36';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close on scroll
    const handleScroll = () => setIsMobileMenuOpen(false);

    // Close on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header ref={menuRef} className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
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

          <div className="hidden md:flex items-center gap-3">
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
          </div>

          {/* Mobile Menu Button */}
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
              className="w-full block text-center py-3 text-white rounded-xl font-semibold text-sm transition-colors mt-2"
              style={{ backgroundColor: NAVY }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Post Property
            </Link>
            <Link
              href="/consultation"
              className="flex items-center justify-center text-white px-5 py-3 rounded-full font-medium transition-colors mt-2"
              style={{ backgroundColor: NAVY }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Free Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
