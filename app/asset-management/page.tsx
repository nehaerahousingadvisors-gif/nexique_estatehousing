'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import AboutSection from './AboutSection';

const NAVY = '#1a2744';
const GOLD = '#C4A35A';
const GREEN = '#166534';

export default function AssetManagementPage() {
  const benefitsRef = useRef<HTMLElement>(null);
  const [selectedPlan, setSelectedPlan] = useState<number>(1);

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

      {/* ── Services Included ───────────────────────────────────────────── */}
      <section id="services" className="w-full py-14 md:py-20 relative overflow-hidden" style={{ backgroundColor: '#fdf8f0' }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full" style={{ backgroundColor: `${GOLD}15` }} />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full" style={{ backgroundColor: `${GOLD}10` }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4" style={{ color: NAVY, letterSpacing: '0.02em' }}>
              SERVICES <span style={{ color: GOLD }}>INCLUDED</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-0.5 w-20 md:w-28" style={{ backgroundColor: GOLD }} />
              <svg className="w-6 h-6 md:w-8 md:h-8" fill={GOLD} viewBox="0 0 24 24">
                <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
              </svg>
              <div className="h-0.5 w-20 md:w-28" style={{ backgroundColor: GOLD }} />
            </div>
            <p className="text-gray-500 text-base md:text-lg max-w-3xl mx-auto">
              Our comprehensive property asset management services cover every aspect of your investment, ensuring maximum returns with complete peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {/* 01 Complete Property Asset Management */}
            <div className="relative bg-white rounded-2xl border-2 p-6 md:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-xl md:text-2xl font-black" style={{ color: GOLD }}>01</span>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: NAVY }}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 16.5c1.5-1.5 3.5-2 5.5-1.5M14 15c1.5-0.5 3.5 0 5.5 1.5M12 12c-2 0-3.5 1-3.5 2.5M15.5 14.5c0-1.5-1.5-2.5-3.5-2.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c-4 0-7.5-2.5-9-6 1.5-3.5 5-6 9-6s7.5 2.5 9 6c-1.5 3.5-5 6-9 6z" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-1" style={{ color: NAVY }}>
                      Complete Property<br />Asset Management
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  We professionally manage your residential and commercial properties from start to finish, ensuring your investment remains secure, profitable, and hassle-free.
                </p>
              </div>
            </div>

            {/* 02 Residential & Commercial Property Management */}
            <div className="relative bg-white rounded-2xl border-2 p-6 md:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-xl md:text-2xl font-black" style={{ color: GOLD }}>02</span>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: NAVY }}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0-14a1 1 0 011-1h2a1 1 0 011 1v4m-6 0a1 1 0 011-1h2a1 1 0 011 1m-6 2h6m-6 4h6" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-3" style={{ color: NAVY }}>
                      Residential & Commercial<br />Property Management
                    </h3>
                  </div>
                </div>
                <p className="text-sm md:text-base font-semibold mb-3" style={{ color: NAVY }}>We manage:</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {['Apartments', 'Retail Shops', 'Villas', 'Commercial Buildings', 'Independent Houses', 'Warehouses', 'Builder Floors', 'Industrial Units', 'Office Spaces', 'Investment Portfolios'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: GOLD }} />
                      <span className="text-sm md:text-base text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 03 Exclusive Property Marketing */}
            <div className="relative bg-white rounded-2xl border-2 p-6 md:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-xl md:text-2xl font-black" style={{ color: GOLD }}>03</span>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: NAVY }}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 7.5l3-3M15.5 7.5l-3-3M18.5 10.5h.01" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-3" style={{ color: NAVY }}>
                      Exclusive Property<br />Marketing
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                  Your property receives priority marketing. Every buyer or tenant approaching Nexique Estate Housing Advisors is first introduced to your property before any other available properties.
                </p>
                <p className="text-sm md:text-base font-bold mb-3" style={{ color: NAVY }}>Marketing includes:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Premium Digital Marketing', icon: '📱' },
                    { label: 'Social Media Marketing', icon: '💬' },
                    { label: 'Real Estate Portals', icon: '🏠' },
                    { label: 'Channel Partner Network', icon: '🤝' },
                    { label: 'Corporate Leasing Network', icon: '🏢' },
                    { label: 'Broker Network', icon: '👥' },
                    { label: 'Investor Network', icon: '💼' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-xs md:text-sm font-semibold" style={{ color: NAVY }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 04 Leasing Management */}
            <div className="relative bg-white rounded-2xl border-2 p-6 md:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-xl md:text-2xl font-black" style={{ color: GOLD }}>04</span>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: NAVY }}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 19v-6a2 2 0 00-2-2h-1.5M12 8l3-3 3 3M15 5v10M17.5 11h.01" />
                      <circle cx="7.5" cy="10.5" r="0.5" fill={GOLD} />
                      <circle cx="7.5" cy="12.5" r="0.5" fill={GOLD} />
                      <circle cx="7.5" cy="14.5" r="0.5" fill={GOLD} />
                    </svg>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-3" style={{ color: NAVY }}>
                      Leasing Management
                    </h3>
                  </div>
                </div>
                <p className="text-sm md:text-base font-semibold mb-3" style={{ color: NAVY }}>Complete leasing assistance including:</p>
                <ul className="space-y-2.5">
                  {['Tenant Search', 'Property Showings', 'Rent Negotiation', 'Documentation', 'Lease Agreement Coordination', 'Move-in Coordination', 'Lease Renewal Assistance'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: GOLD }}>
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="white" strokeWidth={3.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm md:text-base text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 05 Property Sale Management */}
            <div className="relative bg-white rounded-2xl border-2 p-6 md:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-xl md:text-2xl font-black" style={{ color: GOLD }}>05</span>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: NAVY }}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l1.5 4L18 7.5l-4 2L15.5 14 12 11.5 8.5 14l1.5-4.5-4-2 4.5-1.5z" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-3" style={{ color: NAVY }}>
                      Property Sale<br />Management
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                  We handle your complete sale process, including:
                </p>
                <ul className="space-y-2.5">
                  {['Property Marketing', 'Buyer Screening', 'Site Visits', 'Price Negotiation', 'Documentation Assistance', 'Sale Coordination', 'Registration Support (where applicable)'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: GOLD }}>
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="white" strokeWidth={3.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm md:text-base text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 06 Tenant Due Diligence */}
            <div className="relative bg-white rounded-2xl border-2 p-6 md:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-xl md:text-2xl font-black" style={{ color: GOLD }}>06</span>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: NAVY }}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      <circle cx="12" cy="11" r="2.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 16.5c1.2-1.5 3-2.5 4.5-2.5s3.3 1 4.5 2.5" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-3" style={{ color: NAVY }}>
                      Tenant Due Diligence
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                  Every tenant undergoes a complete verification process before occupying your property. This includes:
                </p>
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {['KYC Verification', 'Previous Landlord Reference Check', 'Identity Verification', 'Background Verification', 'Employment Verification', 'Police Verification Assistance', 'Income Verification', 'Document Authentication', 'Address Verification'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: GOLD }}>
                        <svg className="w-2 h-2 text-white" fill="none" stroke="white" strokeWidth={4} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs md:text-sm text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: `${GOLD}12` }}>
                  <p className="text-sm md:text-base font-semibold italic text-center" style={{ color: NAVY }}>
                    🛡️ Your hard-earned property is entrusted only to verified and responsible occupants.
                  </p>
                </div>
              </div>
            </div>

            {/* 07 Dedicated Property Asset Manager */}
            <div className="relative bg-white rounded-2xl border-2 p-6 md:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 md:col-span-1" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-xl md:text-2xl font-black" style={{ color: GOLD }}>07</span>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: NAVY }}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="3.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 20v-2a4 4 0 014-4h6a4 4 0 014 4v2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5h.01M18 7h.01M12 4h.01M6 7h.01M9 5h.01" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-3" style={{ color: NAVY }}>
                      Dedicated Property<br />Asset Manager
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                  Every enrolled client is assigned a dedicated Property Asset Manager. Your manager will:
                </p>
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {[
                    'Handle all tenant communication',
                    'Coordinate vendors',
                    'Coordinate with buyers',
                    'Manage documentation',
                    'Manage maintenance',
                    'Provide regular updates',
                    'Schedule inspections',
                    'Assist during lease renewals',
                    'Handle complaints',
                    'Support property sales',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: GOLD }} />
                      <span className="text-xs md:text-sm text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: `${GOLD}12` }}>
                  <p className="text-sm md:text-lg font-bold text-center leading-tight" style={{ color: NAVY }}>
                    One dedicated professional.<br />One point of contact.
                  </p>
                </div>
              </div>
            </div>

            {/* 08 Complete Tenant Management */}
            <div className="relative bg-white rounded-2xl border-2 p-6 md:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 md:col-span-1" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-xl md:text-2xl font-black" style={{ color: GOLD }}>08</span>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: NAVY }}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <circle cx="9" cy="8" r="2.5" />
                      <circle cx="17" cy="9" r="2" />
                      <circle cx="13" cy="7" r="2.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-1a4 4 0 014-4h10a4 4 0 014 4v1" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 15h.01M5 18h14M6 15h12M7 16h10" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-3" style={{ color: NAVY }}>
                      Complete Tenant<br />Management
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                  We manage all day-to-day tenant matters, including:
                </p>
                <ul className="space-y-2.5">
                  {[
                    'Complaint Resolution',
                    'Maintenance Requests',
                    'Follow-ups',
                    'Tenant Coordination',
                    'Lease Renewals',
                    'Communication on the owner’s behalf',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: GOLD }}>
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="white" strokeWidth={3.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm md:text-base text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: `${GOLD}12` }}>
                  <p className="text-sm md:text-base font-semibold italic text-center leading-relaxed" style={{ color: NAVY }}>
                    You stay worry-free while we handle the operational responsibilities.
                  </p>
                </div>
              </div>
            </div>

            {/* 09 Monthly Property Inspection */}
            <div className="relative bg-white rounded-2xl border-2 p-6 md:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 md:col-span-1" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-xl md:text-2xl font-black" style={{ color: GOLD }}>09</span>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: NAVY }}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 9l1 1 2-2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 12l1 1 2-2M10 15l1 1 2-2" />
                      <circle cx="18" cy="8" r="2.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9.5l3 3" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-3" style={{ color: NAVY }}>
                      Monthly Property<br />Inspection
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                  Our team visits every managed property to:
                </p>
                <ul className="space-y-2.5">
                  {[
                    'Inspect cleanliness',
                    'Monitor property condition',
                    'Check for damages',
                    'Ensure proper tenant upkeep',
                    'Identify preventive maintenance needs',
                    'Protect the long-term value of your asset',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: GOLD }} />
                      <span className="text-sm md:text-base text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 10 Monthly Deep Cleaning */}
            <div className="relative bg-white rounded-2xl border-2 p-6 md:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-xl md:text-2xl font-black" style={{ color: GOLD }}>10</span>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: NAVY }}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21l-4-4 4-4 4 4-4 4zM15 21V5m0 16l4-4-4-4 4-4M15 5a3 3 0 100 6M9 14v.01" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l1 1 2-2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8l.01.01M7 11l.01.01M10 8l.01.01M13 11l.01.01M16 8l.01.01M19 11l.01.01" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-3" style={{ color: NAVY }}>
                      Monthly Deep<br />Cleaning
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Professional monthly deep cleaning helps maintain hygiene, appearance, and property value.
                </p>
              </div>
            </div>

            {/* 11 Weekly Updates */}
            <div className="relative bg-white rounded-2xl border-2 p-6 md:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-xl md:text-2xl font-black" style={{ color: GOLD }}>11</span>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: NAVY }}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M8 3v4M16 3v4M8 14h.01M11 14h.01M14 14h.01M8 17h.01M11 17h.01M14 17h.01" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-3" style={{ color: NAVY }}>
                      Weekly Updates
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Transparency is at the heart of our service. You&rsquo;ll receive weekly updates covering key activities and next steps.
                </p>
              </div>
            </div>

            {/* 12 Secure Key Management */}
            <div className="relative bg-white rounded-2xl border-2 p-6 md:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-xl md:text-2xl font-black" style={{ color: GOLD }}>12</span>
                </div>
              </div>
              <div className="pt-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: NAVY }}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <circle cx="8" cy="15" r="3.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.85 12.15L19 4m0 0h3m-3 0v3m-1.5-1.5l.7-.7" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 7.5l1.5-1.5M14 13h3m-3 3h3M14 17h3" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-3" style={{ color: NAVY }}>
                      Secure Key<br />Management
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  We maintain secure key storage and controlled access so only authorised representatives and verified prospects can access your property.
                </p>
              </div>
            </div>
          </div>

          {/* Cards 13, 14, 15 — Wider 3-column layout (no gap between sections) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7 mt-5 md:mt-8">
            {/* 13 Vendor Coordination */}
            <div className="relative bg-white rounded-2xl border-2 p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-lg md:text-xl font-black" style={{ color: GOLD }}>13</span>
                </div>
              </div>
              <div className="pt-6 md:pt-7">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-md self-start" style={{ backgroundColor: NAVY }}>
                    <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <circle cx="9" cy="8" r="2.5" />
                      <circle cx="17" cy="8" r="2.5" />
                      <circle cx="13" cy="16" r="2.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 9.5l1.5 5M15 9.5l-1.5 5M5 20c0-1.5 1.5-3 4-3M19 20c0-1.5-1.5-3-4-3" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16h10M5 13h2M17 13h2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-extrabold leading-tight mb-2" style={{ color: NAVY }}>
                      Vendor Coordination
                    </h3>
                    <p className="text-xs md:text-sm font-semibold mb-2.5" style={{ color: NAVY }}>
                      We coordinate trusted professionals for:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 md:gap-2 mb-3">
                      {[
                        'Plumbing',
                        'AC Services',
                        'Electrical Work',
                        'Pest Control',
                        'Carpentry',
                        'Cleaning Services',
                        'Painting',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: GOLD }} />
                          <span className="text-[11px] md:text-xs text-gray-700 font-medium leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] md:text-xs italic font-medium text-center mt-3 pt-2.5" style={{ color: NAVY, borderTop: `1.5px dashed ${GOLD}40` }}>
                      (Third-party vendor charges are extra.)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 14 Documentation Assistance */}
            <div className="relative bg-white rounded-2xl border-2 p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-lg md:text-xl font-black" style={{ color: GOLD }}>14</span>
                </div>
              </div>
              <div className="pt-6 md:pt-7">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-md self-start" style={{ backgroundColor: NAVY }}>
                    <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 13h12M6 17h8" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-extrabold leading-tight mb-2" style={{ color: NAVY }}>
                      Documentation Assistance
                    </h3>
                    <p className="text-xs md:text-sm font-semibold mb-2.5" style={{ color: NAVY }}>
                      Support for:
                    </p>
                    <ul className="space-y-1.5 md:space-y-2">
                      {[
                        'Lease Agreements',
                        'Sale Documentation',
                        'Property Records',
                        'Tenant Documentation',
                        'Verification Documents',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${GOLD}20`, border: `1px solid ${GOLD}60` }}>
                            <svg className="w-2 h-2 md:w-2.5 md:h-2.5" fill="none" stroke={GOLD} strokeWidth={2.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-[11px] md:text-xs font-bold text-gray-700 leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 15 Investment Advisory */}
            <div className="relative bg-white rounded-2xl border-2 p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5" style={{ borderColor: `${GOLD}40` }}>
              <div className="absolute -top-4 left-5">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: NAVY }}>
                  <span className="text-lg md:text-xl font-black" style={{ color: GOLD }}>15</span>
                </div>
              </div>
              <div className="pt-6 md:pt-7">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-md self-start" style={{ backgroundColor: NAVY }}>
                    <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21V13M12 21V7M17 21v-6" strokeWidth={2.2} />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18" strokeWidth={2} />
                      <rect x="5" y="14" width="4" height="7" rx="0.5" fill={GOLD} fillOpacity="0.25" />
                      <rect x="10" y="8" width="4" height="13" rx="0.5" fill={GOLD} fillOpacity="0.4" />
                      <rect x="15" y="15.5" width="4" height="5.5" rx="0.5" fill={GOLD} fillOpacity="0.25" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l5-6 4 4 5-7" strokeWidth={2.2} />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 3h4v4" strokeWidth={2.2} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-extrabold leading-tight mb-2" style={{ color: NAVY }}>
                      Investment Advisory
                    </h3>
                    <p className="text-xs md:text-sm font-semibold mb-2.5" style={{ color: NAVY }}>
                      Helping property owners:
                    </p>
                    <ul className="space-y-1.5 md:space-y-2">
                      {[
                        'Maximise rental income',
                        'Plan property sales',
                        'Improve occupancy',
                        'Make informed investment decisions',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 p-2 rounded-lg transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: `${GOLD}10` }}>
                          <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: GOLD }} />
                          <span className="text-[11px] md:text-xs font-bold leading-snug" style={{ color: NAVY }}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <div className="relative mx-auto w-full sm:w-[480px] md:w-[620px] mb-0 md:-mb-4 z-10">
              <div
                className="relative flex items-center justify-center gap-3 py-4 px-6 md:px-8 whitespace-nowrap"
                style={{
                  backgroundColor: NAVY,
                  clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)',
                }}
              >
                <svg className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0" fill={GOLD} viewBox="0 0 24 24">
                  <path d="M7 21V3h10v18H7zm2-2h2v-2H9v2zm4 0h2v-2h-2v2zm-4-4h2v-2H9v2zm4 0h2v-2h-2v2zm-4-4h2V9H9v2zm4 0h2V9h-2v2zm-4-4h2V5H9v2zm4 0h2V5h-2v2z" />
                </svg>
                <span className="text-xl md:text-3xl font-extrabold uppercase tracking-wider" style={{ color: GOLD }}>
                  Properties FOR LEASING
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-8 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Office Spaces - COMMERCIAL LEASING */}
                <div data-slide="left" className="rounded-2xl border border-slate-200 p-5 md:p-6 bg-white relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                    <div className="px-5 py-1.5 rounded-full text-xs md:text-sm font-extrabold uppercase tracking-widest" style={{ backgroundColor: NAVY, color: GOLD }}>
                      Commercial Leasing
                    </div>
                  </div>
                  <div className="flex items-start gap-4 mb-5 mt-3">
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

                {/* Residential Properties - RESIDENTIAL LEASING */}
                <div data-slide="right" className="rounded-2xl border border-slate-200 p-5 md:p-6 bg-white relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                    <div className="px-5 py-1.5 rounded-full text-xs md:text-sm font-extrabold uppercase tracking-widest" style={{ backgroundColor: GOLD, color: NAVY }}>
                      Residential Leasing
                    </div>
                  </div>
                  <div className="flex items-start gap-4 mb-5 mt-3">
                    <div
                      className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: NAVY }}
                    >
                      <svg className="w-7 h-7 md:w-8 md:h-8" fill={GOLD} viewBox="0 0 24 24">
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-base md:text-lg font-extrabold uppercase tracking-wide mb-1" style={{ color: NAVY }}>
                        Residential Properties / Apartments &amp; Villas
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

      {/* ── Pricing Plans ────────────────────────────────────────────────── */}
      <section className="w-full py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-0.5 w-20 md:w-28" style={{ backgroundColor: GOLD }} />
              <svg className="w-5 h-5 md:w-6 md:h-6" fill={GOLD} viewBox="0 0 24 24">
                <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
              </svg>
              <div className="h-0.5 w-20 md:w-28" style={{ backgroundColor: GOLD }} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3" style={{ color: NAVY }}>
              OUR PROPERTY
            </h2>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5" style={{ color: GOLD }}>
              ASSET MANAGEMENT PLANS
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Choose the perfect plan for seamless property management<br />
              and maximum returns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
            {[
              {
                name: 'Monthly Plan',
                price: '₹24,999',
                popular: false,
                icon: (
                  <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M8 3v4M16 3v4M8 14h3M13 14h3M8 18h3M13 18h3" />
                  </svg>
                ),
                features: [
                  'Property Maintenance',
                  'Tenant Management',
                  'Rent Collection',
                  'Financial Reporting',
                  '24/7 Support',
                ],
              },
              {
                name: 'Quarterly Plan',
                price: '₹79,990',
                popular: true,
                icon: (
                  <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M8 3v4M16 3v4M7 14h.01M10 14h.01M13 14h.01M16 14h.01M7 17h.01M10 17h.01M13 17h.01M16 17h.01" />
                  </svg>
                ),
                features: [
                  'Property Maintenance',
                  'Tenant Management',
                  'Rent Collection',
                  'Financial Reporting',
                  '24/7 Support',
                ],
              },
              {
                name: 'Half-Yearly Plan',
                price: '₹1,10,000',
                popular: false,
                icon: (
                  <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M8 3v4M16 3v4M7 14h2M11 14h2M15 14h2M7 17h2M11 17h2M15 17h2" />
                  </svg>
                ),
                features: [
                  'Property Maintenance',
                  'Tenant Management',
                  'Rent Collection',
                  'Financial Reporting',
                  '24/7 Support',
                ],
              },
              {
                name: 'Yearly Plan',
                price: '₹1,99,000',
                popular: false,
                icon: (
                  <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M8 3v4M16 3v4" />
                    <circle cx="16.5" cy="15.5" r="2.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 14v2l1.5 1M7 14h2M10 14h2M7 17h2M10 17h2" />
                  </svg>
                ),
                features: [
                  'Property Maintenance',
                  'Tenant Management',
                  'Rent Collection',
                  'Financial Reporting',
                  '24/7 Support',
                ],
              },
            ].map((plan, idx) => {
              const isSelected = selectedPlan === idx;
              return (
              <div
                key={idx}
                onClick={() => setSelectedPlan(idx)}
                className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 md:p-7 flex flex-col cursor-pointer ${
                  isSelected
                    ? 'ring-4 ring-offset-4 transform scale-[1.02]'
                    : plan.popular
                    ? 'ring-2 md:ring-3 ring-offset-2'
                    : 'border border-slate-100 hover:border-slate-200'
                }`}
                style={
                  isSelected
                    ? { boxShadow: `0 0 0 4px ${GOLD}, 0 25px 50px -12px rgba(26,39,68,0.25)`, transform: 'scale(1.02)' }
                    : plan.popular
                    ? { boxShadow: `0 0 0 2px ${GOLD}, 0 20px 40px -10px rgba(26,39,68,0.15)` }
                    : {}
                }
              >
                {plan.popular && (
                  <div
                    className="absolute -top-0 -right-0 overflow-hidden w-32 h-32 rounded-tr-3xl pointer-events-none"
                    style={{}}
                  >
                    <div
                      className="absolute text-white text-xs font-bold uppercase tracking-wider py-1.5 shadow-md"
                      style={{
                        backgroundColor: GOLD,
                        transform: 'rotate(45deg)',
                        top: '18px',
                        right: '-28px',
                        width: '140px',
                        textAlign: 'center',
                        letterSpacing: '0.1em',
                      }}
                    >
                      ✦ POPULAR
                    </div>
                  </div>
                )}

                <div className="absolute top-3 right-3 md:top-4 md:right-4">
                  <div
                    className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                      isSelected ? 'border-transparent' : ''
                    }`}
                    style={{
                      backgroundColor: isSelected ? GOLD : 'transparent',
                      borderColor: isSelected ? GOLD : '#cbd5e1',
                    }}
                  >
                    {isSelected && (
                      <svg
                        className="w-2.5 h-2.5 md:w-3 md:h-3 text-white"
                        fill="none"
                        stroke="white"
                        strokeWidth={4}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center text-center mb-5">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-4 shadow-md transition-all duration-300"
                    style={{
                      backgroundColor: isSelected ? GOLD : NAVY,
                      boxShadow: isSelected ? `0 0 0 3px ${GOLD}40` : undefined,
                    }}
                  >
                    {plan.icon}
                  </div>
                  <h3
                    className="text-lg md:text-xl font-bold mb-3"
                    style={{ color: NAVY }}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
                    <svg className="w-3.5 h-3.5" fill={GOLD} viewBox="0 0 24 24">
                      <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
                    </svg>
                    <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
                  </div>
                  <div
                    className="text-3xl md:text-4xl font-extrabold mt-3 transition-all duration-300"
                    style={{ color: isSelected ? NAVY : GOLD }}
                  >
                    {plan.price}
                  </div>
                </div>

                <div
                  className="border-t border-dashed mb-5 pt-5"
                  style={{ borderColor: `${GOLD}50` }}
                >
                  <ul className="space-y-3">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: GOLD }}
                        >
                          <svg
                            className="w-2.5 h-2.5 md:w-3 md:h-3 text-white"
                            fill="none"
                            stroke="white"
                            strokeWidth={3.5}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span
                          className="text-sm md:text-base font-medium leading-snug"
                          style={{ color: NAVY }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(idx);
                    }}
                    className={`w-full py-3 md:py-3.5 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${
                      isSelected || plan.popular
                        ? 'text-white hover:opacity-90'
                        : 'border-2 hover:bg-opacity-5'
                    }`}
                    style={
                      isSelected
                        ? { backgroundColor: NAVY, color: 'white' }
                        : plan.popular
                        ? { backgroundColor: GOLD, color: NAVY }
                        : { borderColor: GOLD, color: NAVY }
                    }
                  >
                    {isSelected ? '✓ SELECTED' : 'CHOOSE PLAN'}
                  </button>
                </div>
              </div>
            );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-slate-200 bg-white shadow-sm">
              <svg className="w-5 h-5" fill={GOLD} viewBox="0 0 24 24">
                <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
              </svg>
              <span className="text-sm md:text-base font-medium" style={{ color: NAVY }}>
                Reliable Management. Maximum Returns. Complete Peace of Mind.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Promise ──────────────────────────────────────────────────── */}
      <section className="w-full py-8 md:py-10 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-lg" style={{ backgroundColor: '#f8f9fb' }}>

            {/* Background diagonal navy shape with city image */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block" style={{ backgroundColor: NAVY, clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000&auto=format&fit=crop"
                  alt="City skyline"
                  className="w-full h-full object-cover opacity-40"
                />
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left content */}
              <div className="p-6 md:p-8 lg:p-10">
                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-extrabold mb-1.5 leading-tight">
                  <span style={{ color: NAVY }}>OUR </span>
                  <span style={{ color: GOLD }}>PROMISE</span>
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-0.5 w-12" style={{ backgroundColor: NAVY }} />
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: GOLD }} />
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: GOLD }} />
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: GOLD }} />
                  </div>
                </div>

                {/* Quote box */}
                <div className="relative border-l-4 rounded-r-xl px-4 py-3 mb-4 bg-white shadow-sm" style={{ borderColor: GOLD }}>
                  <svg className="absolute -top-2.5 -left-1.5 w-6 h-6 opacity-80" fill={GOLD} viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-slate-700 text-sm md:text-base leading-relaxed pl-3">
                    Your property deserves more than occasional brokerage—it deserves{' '}
                    <strong style={{ color: NAVY }}>professional asset management.</strong>
                  </p>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-5">
                  At Nexique Estate Housing Advisors, we are committed to protecting your investment, increasing occupancy, reducing vacancies, maintaining your property&apos;s condition, and delivering a seamless ownership experience through transparency, professionalism, and accountability.
                </p>

                {/* 5 Promise Icons */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {[
                    {
                      label: 'PROTECTING YOUR INVESTMENT',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      ),
                    },
                    {
                      label: 'INCREASING OCCUPANCY',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      ),
                    },
                    {
                      label: 'REDUCING VACANCIES',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      ),
                    },
                    {
                      label: "MAINTAINING YOUR PROPERTY'S CONDITION",
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ),
                    },
                    {
                      label: 'SEAMLESS OWNERSHIP EXPERIENCE',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ),
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center gap-1.5">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow flex-shrink-0"
                        style={{ backgroundColor: NAVY }}
                      >
                        {item.icon}
                      </div>
                      <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-wide leading-tight" style={{ color: NAVY }}>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — city image on mobile */}
              <div className="lg:hidden relative h-44 overflow-hidden rounded-b-2xl">
                <img
                  src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000&auto=format&fit=crop"
                  alt="City skyline"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${NAVY}80, transparent)` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="w-full py-14 md:py-20 bg-white">
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
