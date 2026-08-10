'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';

const NAVY = '#1a2744';
const GOLD = '#C4A35A';
const GREEN = '#166534';

export default function AssetManagementPage() {
  const benefitsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = benefitsRef.current;
    if (!container) return;

    const elements = container.querySelectorAll<HTMLElement>('[data-slide]');
    elements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      const dir = el.getAttribute('data-slide');
      el.style.transform = dir === 'left' ? 'translateX(-80px)' : 'translateX(80px)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 2) * 0.15}s`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: NAVY, minHeight: '420px' }}
      >
        {/* Background building image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop"
            alt="Property Asset Management"
            fill
            sizes="100vw"
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${NAVY} 45%, transparent 100%)` }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 flex flex-col md:flex-row items-center gap-8">
          {/* Left text */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
              NEXIQUE ESTATE<br />
              <span style={{ color: GOLD }}>HOUSING ADVISORS</span>
            </h1>
            <div className="w-16 h-0.5 mb-4" style={{ backgroundColor: GOLD }} />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white uppercase tracking-widest mb-4">
              Property Asset Management
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-md leading-relaxed">
              We Don&apos;t Just Sell Properties,<br />
              <span style={{ color: GOLD }} className="font-bold">We Manage Your Assets.</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: GOLD, color: '#1a1a1a' }}
              >
                Explore Our Services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border-2 border-white/30 text-white transition-all hover:bg-white/10"
              >
                Contact Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right card */}
          <div className="flex-shrink-0 w-full md:w-72">
            <div className="rounded-2xl p-6 border border-white/20" style={{ backgroundColor: 'rgba(26,39,68,0.85)', backdropFilter: 'blur(10px)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: GOLD }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg uppercase leading-tight mb-3">
                End-to-End Property Management
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                One Partner.<br />Complete Peace of Mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Us ─────────────────────────────────────────────────────── */}
      <AboutSection />

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <ServicesSection />

      {/* ── Brokerage Benefits ────────────────────────────────────────────── */}
      <section ref={benefitsRef} id="benefits" className="w-full py-14 md:py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill={NAVY} />
          </svg>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4" style={{ color: NAVY, letterSpacing: '0.05em' }}>
              BROKERAGE BENEFITS
            </h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-0.5 w-20 md:w-28" style={{ backgroundColor: GOLD }} />
              <svg className="w-6 h-6 md:w-8 md:h-8" fill={GOLD} viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <div className="h-0.5 w-20 md:w-28" style={{ backgroundColor: GOLD }} />
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              At Nexique Estate Housing Advisors, we believe in transparent pricing and<br className="hidden sm:block" />
              greater value for our enrolled clients.
            </p>
          </div>

          {/* ── Commercial Leasing ─────────────────────────────────────── */}
          <div className="relative mb-10 md:mb-14">
            <div className="relative mx-auto w-full sm:w-[360px] md:w-[420px] mb-0 md:-mb-4 z-10">
              <div
                className="relative flex items-center justify-center gap-3 py-4 px-8"
                style={{
                  backgroundColor: NAVY,
                  clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
                }}
              >
                <svg className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0" fill={GOLD} viewBox="0 0 24 24">
                  <path d="M7 21V3h10v18H7zm2-2h2v-2H9v2zm4 0h2v-2h-2v2zm-4-4h2v-2H9v2zm4 0h2v-2h-2v2zm-4-4h2V9H9v2zm4 0h2V9h-2v2zm-4-4h2V5H9v2zm4 0h2V5h-2v2z" />
                </svg>
                <span className="text-xl md:text-2xl font-extrabold uppercase tracking-wider" style={{ color: GOLD }}>
                  Commercial Leasing
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-8 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Office Spaces */}
                <div data-slide="left" className="rounded-2xl border border-slate-200 p-5 md:p-6 bg-white">
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: NAVY }}
                    >
                      <svg className="w-7 h-7 md:w-8 md:h-8" fill={GOLD} viewBox="0 0 24 24">
                        <path d="M7 21V3h10v18H7zm2-2h2v-2H9v2zm4 0h2v-2h-2v2zm-4-4h2v-2H9v2zm4 0h2v-2h-2v2zm-4-4h2V9H9v2zm4 0h2V9h-2v2zm-4-4h2V5H9v2zm4 0h2V5h-2v2z" />
                      </svg>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-base md:text-lg font-extrabold uppercase tracking-wide mb-1" style={{ color: NAVY }}>
                        Office Spaces / Commercial Properties
                      </h3>
                      <div className="h-px bg-slate-200 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center border-r border-slate-200 pr-3">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${GOLD}25` }}
                        >
                          <svg className="w-4 h-4" fill={GOLD} viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <span className="text-sm font-bold" style={{ color: NAVY }}>Regular Clients</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">Brokerage:</p>
                      <p className="text-xl md:text-2xl font-extrabold" style={{ color: NAVY }}>
                        ONE MONTH&apos;S RENT
                      </p>
                    </div>
                    <div className="text-center pl-1">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${GREEN}18` }}
                        >
                          <svg className="w-4 h-4" fill={GREEN} viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <span className="text-sm font-bold" style={{ color: GREEN }}>Enrolled Asset Management Clients</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">Brokerage:</p>
                      <p className="text-xl md:text-2xl font-extrabold" style={{ color: GREEN }}>
                        ONLY 15 DAYS&apos; RENT
                      </p>
                    </div>
                  </div>
                </div>

                {/* Retail Spaces */}
                <div data-slide="right" className="rounded-2xl border border-slate-200 p-5 md:p-6 bg-white">
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: NAVY }}
                    >
                      <svg className="w-7 h-7 md:w-8 md:h-8" fill={GOLD} viewBox="0 0 24 24">
                        <path d="M5 6V4h14v2h2v2l-2 11H5L3 8V6h2zm1 3l1.5 9h9L18 9H6zm1.5 2h9l-1 6h-7l-1-6z" />
                      </svg>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-base md:text-lg font-extrabold uppercase tracking-wide mb-1" style={{ color: NAVY }}>
                        Retail Spaces / Shops
                      </h3>
                      <div className="h-px bg-slate-200 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center border-r border-slate-200 pr-3">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${GOLD}25` }}
                        >
                          <svg className="w-4 h-4" fill={GOLD} viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <span className="text-sm font-bold" style={{ color: NAVY }}>Regular Clients</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">Brokerage:</p>
                      <p className="text-xl md:text-2xl font-extrabold" style={{ color: NAVY }}>
                        20 DAYS&apos; RENT
                      </p>
                    </div>
                    <div className="text-center pl-1">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${GREEN}18` }}
                        >
                          <svg className="w-4 h-4" fill={GREEN} viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <span className="text-sm font-bold" style={{ color: GREEN }}>Enrolled Asset Management Clients</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">Brokerage:</p>
                      <p className="text-xl md:text-2xl font-extrabold" style={{ color: GREEN }}>
                        ONLY 10 DAYS&apos; RENT
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Property Sales ─────────────────────────────────────────── */}
          <div className="relative">
            <div className="relative mx-auto w-full sm:w-[320px] md:w-[380px] mb-0 md:-mb-4 z-10">
              <div
                className="relative flex items-center justify-center gap-3 py-4 px-8"
                style={{
                  backgroundColor: NAVY,
                  clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
                }}
              >
                <svg className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0" fill={GOLD} viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                <span className="text-xl md:text-2xl font-extrabold uppercase tracking-wider" style={{ color: GOLD }}>
                  Property Sales
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-8 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Regular Clients */}
                <div data-slide="left" className="rounded-2xl border border-slate-200 p-6 md:p-8 bg-white relative overflow-hidden">
                  <div className="relative flex items-center gap-5">
                    <div
                      className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: NAVY }}
                    >
                      <svg className="w-7 h-7 md:w-8 md:h-8" fill={GOLD} viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${GOLD}25` }}
                        >
                          <svg className="w-4 h-4" fill={GOLD} viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <span className="text-sm md:text-base font-bold" style={{ color: NAVY }}>Regular Clients</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 mb-1">Brokerage:</p>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="h-px w-6 md:w-10" style={{ backgroundColor: GOLD }} />
                        <p className="text-3xl md:text-5xl font-extrabold" style={{ color: NAVY }}>1%</p>
                        <span className="h-px w-6 md:w-10" style={{ backgroundColor: GOLD }} />
                      </div>
                      <p className="text-xs md:text-sm font-semibold uppercase tracking-wide text-slate-600">
                        Of the Final Sale Value
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enrolled Clients */}
                <div data-slide="right" className="rounded-2xl border border-slate-200 p-6 md:p-8 bg-white relative overflow-hidden">
                  <div className="relative flex items-center gap-5">
                    <div
                      className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center opacity-0 md:opacity-100"
                      style={{ backgroundColor: NAVY }}
                    >
                      <svg className="w-7 h-7 md:w-8 md:h-8 invisible md:visible" fill={GOLD} viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-center md:pr-0 md:pl-0">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${GREEN}18` }}
                        >
                          <svg className="w-4 h-4" fill={GREEN} viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <span className="text-sm md:text-base font-bold" style={{ color: GREEN }}>Enrolled Asset Management Clients</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 mb-1">Brokerage:</p>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="h-px w-6 md:w-10" style={{ backgroundColor: GOLD }} />
                        <p className="text-3xl md:text-5xl font-extrabold" style={{ color: GREEN }}>0.5%</p>
                        <span className="h-px w-6 md:w-10" style={{ backgroundColor: GOLD }} />
                      </div>
                      <p className="text-xs md:text-sm font-semibold uppercase tracking-wide text-slate-600">
                        Of the Final Sale Value
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────────── */}
      <section className="w-full py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4" style={{ color: NAVY, letterSpacing: '0.05em' }}>
              WHY CHOOSE NEXIQUE ESTATE HOUSING ADVISORS?
            </h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-0.5 w-20 md:w-28" style={{ backgroundColor: GOLD }} />
              <svg className="w-6 h-6 md:w-8 md:h-8" fill={GOLD} viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <div className="h-0.5 w-20 md:w-28" style={{ backgroundColor: GOLD }} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              {
                title: 'Property Asset Managers—not just brokers',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
              },
              {
                title: 'Dedicated Property Asset Manager',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="3.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 5.5l1.5 1.5m0 0L21.5 5.5M20 7v2" />
                    <circle cx="18.5" cy="5.5" r="1" />
                  </svg>
                ),
              },
              {
                title: 'Residential & Commercial Expertise',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21V9a1 1 0 011-1h3a1 1 0 011 1v12" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 11h1M17 14h1M17 17h1M17 20h1" />
                  </svg>
                ),
              },
              {
                title: 'Verified & Police-Verified Tenants',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    <circle cx="12" cy="10" r="2.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16.5c1-1 2-2 5-2s4 1 5 2" />
                  </svg>
                ),
              },
              {
                title: 'Complete Tenant Due Diligence',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h2M9 8v.01" />
                    <circle cx="17.5" cy="14.5" r="3.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 14.5l1 1 2-2" />
                  </svg>
                ),
              },
              {
                title: 'Exclusive Property Marketing',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 8l.01 0M18 11l.01 0M18 14l.01 0" />
                  </svg>
                ),
              },
              {
                title: 'Priority Property Promotion',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 19h4v-4M11 15v-2M4 15h2M4 17h2" />
                  </svg>
                ),
              },
              {
                title: 'Weekly Progress Reports',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6m-9 3h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6M9 10h4M8 4v2M16 4v2" />
                    <rect x="9" y="13" width="2" height="2" fill={GOLD} />
                    <rect x="13" y="13" width="2" height="2" fill={GOLD} />
                    <rect x="11" y="15" width="2" height="2" fill={GOLD} />
                  </svg>
                ),
              },
              {
                title: 'Monthly Property Inspections',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    <circle cx="16" cy="15" r="3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.5 19.5L18 17" />
                  </svg>
                ),
              },
              {
                title: 'Monthly Deep Cleaning',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21v-7m0 0V9l5-5 5 5v5M7 14h10M12 4v3m-5 10h10M8 21v-7m8 7v-7M9 11l.5.5M12 10l.5.5M15 11l.5.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6c-.5 1.5-1 2.5-2 3.5" />
                  </svg>
                ),
              },
              {
                title: 'Secure Key Management',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <circle cx="8" cy="15" r="4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.85 12.15L19 4m0 0h3m-3 0v3m2.5-1.5l.7-.7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 7.5l1.5-1.5" />
                  </svg>
                ),
              },
              {
                title: 'Tenant Complaint Resolution',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h14a2 2 0 002-2M3 18a2 2 0 012-2h2m12 2a2 2 0 002-2v-2m-4 2v-1m0 1v1m0 0v1m-8-2v1m0 0v1" />
                    <circle cx="12" cy="10" r="1" fill={GOLD} />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 7.5l1 1M13.5 7.5l-1 1M11 11.5h2" />
                  </svg>
                ),
              },
              {
                title: 'Vendor Coordination',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <circle cx="9" cy="8" r="2.5" />
                    <circle cx="17" cy="8" r="2.5" />
                    <circle cx="13" cy="16" r="2.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 9.5l1.5 5M15 9.5l-1.5 5M5 20c0-1.5 1.5-3 4-3M19 20c0-1.5-1.5-3-4-3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16h10" />
                  </svg>
                ),
              },
              {
                title: 'Documentation Support',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 14h4m0 0l-1.5 1.5M19 14l-1.5-1.5" />
                  </svg>
                ),
              },
              {
                title: 'Investment Advisory',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    <rect x="4" y="15" width="2" height="4" fill={GOLD} />
                    <rect x="7" y="13" width="2" height="6" fill={GOLD} />
                    <rect x="10" y="16" width="2" height="3" fill={GOLD} />
                  </svg>
                ),
              },
              {
                title: 'Lower Brokerage for Enrolled Clients',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 9.5a1.5 1.5 0 013 0c0 .8-.8 1-1.3 1.3s-1.2.5-1.2 1.5M14 15v.01M10 15v.01" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6" />
                    <circle cx="12" cy="12" r="0.5" fill={GOLD} />
                  </svg>
                ),
              },
              {
                title: 'Transparent Communication',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 10.5a.5.5 0 11-1 0 .5.5 0 011 0zM11.5 10.5a.5.5 0 11-1 0 .5.5 0 011 0zM15.5 10.5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                  </svg>
                ),
              },
              {
                title: 'End-to-End Property Management',
                icon: (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.5v-3m0 3h3m-3 0H9m3 0V5.5m0 3a2.5 2.5 0 110 5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 11.5a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v2M15 19v2M9 16.5h6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 5.5c-.5.5-1 1.5-2 2.5" />
                  </svg>
                ),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 p-3 md:p-4 flex flex-col items-center text-center"
              >
                <div className="absolute top-2 left-2 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: GOLD }}>
                  <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="white" strokeWidth={3.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 mt-1" style={{ backgroundColor: NAVY }}>
                  {item.icon}
                </div>
                <h3 className="text-[10px] md:text-[11px] font-normal leading-tight" style={{ color: NAVY }}>
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perfect For ──────────────────────────────────────────────────── */}
      <section className="w-full py-14 md:py-20" style={{ backgroundColor: '#f8f9fb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4" style={{ color: NAVY, letterSpacing: '0.05em' }}>
              PERFECT FOR
            </h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-0.5 w-20 md:w-28" style={{ backgroundColor: GOLD }} />
              <svg className="w-6 h-6 md:w-8 md:h-8" fill={GOLD} viewBox="0 0 24 24">
                <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
              </svg>
              <div className="h-0.5 w-20 md:w-28" style={{ backgroundColor: GOLD }} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              {
                title: 'High Net Worth Individuals (HNIs)',
                icon: (
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="3.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 20v-2a5 5 0 015-5h4a5 5 0 015 5v2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2M4.2 4.2l1.4 1.4M1 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M21 12h-2M18.4 18.4l1.4 1.4" />
                    <circle cx="17" cy="7" r="1" fill={GOLD} />
                  </svg>
                ),
              },
              {
                title: 'Non-Resident Indians (NRIs)',
                icon: (
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20M4 8a10 10 0 0016 0M4 16a10 10 0 0116 0" />
                  </svg>
                ),
              },
              {
                title: 'Busy Professionals',
                icon: (
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <rect x="3" y="7" width="18" height="13" rx="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M12 12v4M10 14h4" />
                  </svg>
                ),
              },
              {
                title: 'Corporate Property Owners',
                icon: (
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-6h3v6" />
                  </svg>
                ),
              },
              {
                title: 'Investors',
                icon: (
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'Families with Multiple Properties',
                icon: (
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    <rect x="14" y="14" width="8" height="7" rx="1" />
                  </svg>
                ),
              },
              {
                title: 'Landlords Living Outside Noida',
                icon: (
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h2M2 10h1M19 7h2M21 10h1M12 2v2" />
                  </svg>
                ),
              },
              {
                title: 'Owners Who Want Passive Rental Income',
                icon: (
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <circle cx="12" cy="12" r="2" fill={GOLD} />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 19l1.5 1.5M5 19l-1.5 1.5" />
                  </svg>
                ),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 p-5 md:p-6 flex flex-col items-center text-center"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: NAVY }}>
                  {item.icon}
                </div>
                <h3 className="text-sm md:text-base font-bold leading-snug" style={{ color: NAVY }}>
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="w-full py-14 md:py-20" style={{ backgroundColor: '#f8f9fb' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: NAVY }}>
            Ready to Maximize Your Property Returns?
          </h2>
          <p className="text-gray-500 text-sm md:text-base mb-8">
            Get a free property management consultation today. No commitment, just expert advice.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: NAVY, color: 'white' }}
            >
              Get Free Consultation
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <a
              href="tel:+919667394175"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm border-2 transition-all hover:bg-white"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +91 96673 94175
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
