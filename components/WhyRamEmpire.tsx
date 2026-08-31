'use client';

import { useEffect, useRef, useState } from 'react';

const NAVY = '#1a2744';
const GOLD  = '#C4A35A';

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Trusted Real Estate Experts',
    description: 'Transparent, reliable consultation from project search to final possession.',
    stat: '10+',
    statLabel: 'Years',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    title: 'Wide Range of Verified Projects',
    description: 'Curated RERA-approved residential, commercial & plotted projects.',
    stat: '200+',
    statLabel: 'Projects',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'End-to-End Customer Support',
    description: 'Site visits, legal paperwork, loan assistance & after-sales service.',
    stat: '500+',
    statLabel: 'Clients',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: '100% RERA Approved',
    description: 'Every project we list is RERA registered — buy with confidence.',
    stat: '100%',
    statLabel: 'RERA',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Free Consultation',
    description: 'Start your journey with a free expert consultation — no strings attached.',
    stat: '₹0',
    statLabel: 'Cost',
  },
];

/* ── Single animated card ───────────────────────────────────────────────── */
function FeatureCard({
  feature,
  index,
}: {
  feature: typeof features[0];
  index: number;
}) {
  const ref  = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
        transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s, box-shadow 0.25s ease`,
        background: hovered ? NAVY : '#ffffff',
        borderRadius: 16,
        padding: '20px',
        border: `1.5px solid ${hovered ? NAVY : '#e8edf4'}`,
        boxShadow: hovered
          ? '0 20px 48px rgba(26,39,68,0.22)'
          : '0 2px 12px rgba(0,0,0,0.06)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative top-right circle */}
      <div style={{
        position: 'absolute', top: -28, right: -28,
        width: 90, height: 90,
        borderRadius: '50%',
        background: hovered ? 'rgba(196,163,90,0.15)' : 'rgba(26,39,68,0.04)',
        transition: 'background 0.25s',
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <div style={{
        width: 44, height: 44,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
        background: hovered ? GOLD : NAVY,
        color: hovered ? NAVY : GOLD,
        transition: 'background 0.25s, color 0.25s',
        flexShrink: 0,
      }}>
        {feature.icon}
      </div>

      {/* Stat pill */}
      <div style={{
        position: 'absolute', top: 18, right: 18,
        background: hovered ? 'rgba(196,163,90,0.2)' : 'rgba(26,39,68,0.07)',
        borderRadius: 999,
        padding: '2px 10px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        transition: 'background 0.25s',
      }}>
        <span style={{
          fontSize: 13, fontWeight: 800,
          color: hovered ? GOLD : NAVY,
          lineHeight: 1.2,
          transition: 'color 0.25s',
        }}>{feature.stat}</span>
        <span style={{
          fontSize: 9, fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: hovered ? 'rgba(196,163,90,0.8)' : '#94a3b8',
          transition: 'color 0.25s',
        }}>{feature.statLabel}</span>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 15, fontWeight: 700,
        color: hovered ? '#ffffff' : NAVY,
        marginBottom: 6,
        transition: 'color 0.25s',
      }}>
        {feature.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: 12.5, lineHeight: 1.6,
        color: hovered ? 'rgba(255,255,255,0.75)' : '#64748b',
        transition: 'color 0.25s',
        margin: 0,
      }}>
        {feature.description}
      </p>

      {/* Bottom accent line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        height: 3, borderRadius: '0 0 0 16px',
        background: GOLD,
        width: hovered ? '100%' : '0%',
        transition: 'width 0.35s ease',
      }} />
    </div>
  );
}

/* ── Section header with fade-in ────────────────────────────────────────── */
function AnimatedHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="text-center mb-10"
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: GOLD }}>
        WHY Nexique Estate Housing Advisors
      </p>
      <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: NAVY }}>
        The trusted name in Delhi NCR real estate
      </h2>
      <p className="text-slate-600 max-w-2xl mx-auto text-sm">
        Built on transparency, backed by a decade of deals, and powered by people who put your investment first.
      </p>
    </div>
  );
}

/* ── Main section ───────────────────────────────────────────────────────── */
export default function WhyRamEmpire() {
  return (
    <section className="w-full py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
