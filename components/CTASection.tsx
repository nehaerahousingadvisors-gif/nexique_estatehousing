'use client';

import { useEffect, useRef, useState } from 'react';

const GOLD = '#C4A35A';
const NAVY = '#1a2744';

export default function CTASection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const [visible,   setVisible]   = useState(false);
  const [btnHover,  setBtnHover]  = useState(false);
  const [card0Hover, setCard0Hover] = useState(false);
  const [card1Hover, setCard1Hover] = useState(false);

  /* ── Scroll trigger ──────────────────────────────────────────────── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const contacts = [
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
      label: 'CALL US', value: '+91 96673 94175', href: 'tel:+919667394175',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
      label: 'EMAIL', value: 'info@nexiqueestate.com', href: 'mailto:info@nexiqueestate.com',
    },
  ];
  const cardHovers = [card0Hover, card1Hover];
  const cardSetters = [setCard0Hover, setCard1Hover];

  return (
    <section className="w-full py-10 bg-slate-50" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl p-6 md:p-10 relative overflow-hidden"
          style={{
            backgroundColor: NAVY,
            boxShadow: visible ? '0 32px 80px rgba(26,39,68,0.30)' : '0 0 0 rgba(0,0,0,0)',
            transition: 'box-shadow 0.8s ease',
          }}
        >
          {/* ── Animated background blobs ─────────────────────────────── */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 260, height: 260,
            borderRadius: '50%',
            background: `${GOLD}18`,
            filter: 'blur(48px)',
            animation: 'ctaBlob1 6s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -40, left: '30%',
            width: 180, height: 180,
            borderRadius: '50%',
            background: `${GOLD}10`,
            filter: 'blur(36px)',
            animation: 'ctaBlob2 8s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          {/* Subtle grid dots */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(${GOLD}22 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
            opacity: 0.35,
            pointerEvents: 'none',
          }} />

          {/* ── Content grid ──────────────────────────────────────────── */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            {/* LEFT — slides in from left */}
            <div style={{
              opacity:    visible ? 1 : 0,
              transform:  visible ? 'translateX(0)' : 'translateX(-48px)',
              transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
            }}>
              <p style={{
                color: GOLD, fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8,
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.6s ease 0.35s',
              }}>
                ARE YOU SEARCHING FOR A PROJECT?
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Get a{' '}
                <span style={{
                  color: GOLD,
                  display: 'inline-block',
                  animation: visible ? 'shimmer 3s ease-in-out infinite' : 'none',
                }}>
                  Free Consultation
                </span>
                {' '}today
              </h2>

              <p className="text-slate-300 text-sm mb-6">
                Dream home, profitable commercial space, or future-ready investment — we list only RERA-approved &amp; builder-trusted projects.
              </p>

              {/* CTA Button with pulse ring */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {/* Pulse ring */}
                {!btnHover && (
                  <span style={{
                    position: 'absolute', inset: -4,
                    borderRadius: 999,
                    border: `2px solid ${GOLD}`,
                    animation: 'ctaPulse 2s ease-out infinite',
                    pointerEvents: 'none',
                  }} />
                )}
                <a
                  href="tel:+919667394175"
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 28px',
                    background: btnHover ? '#b3944f' : GOLD,
                    color: NAVY,
                    fontWeight: 700, fontSize: 14,
                    borderRadius: 999,
                    textDecoration: 'none',
                    transform: btnHover ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: btnHover ? `0 8px 28px ${GOLD}55` : `0 4px 16px ${GOLD}33`,
                    transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  Talk to an Expert
                  <svg
                    style={{
                      width: 16, height: 16,
                      transform: btnHover ? 'translateX(4px)' : 'translateX(0)',
                      transition: 'transform 0.2s',
                    }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* RIGHT — slides in from right */}
            <div
              className="space-y-3"
              style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? 'translateX(0)' : 'translateX(48px)',
                transition: 'opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s',
              }}
            >
              {contacts.map(({ icon, label, value, href }, i) => (
                <a
                  key={label}
                  href={href}
                  onMouseEnter={() => cardSetters[i](true)}
                  onMouseLeave={() => cardSetters[i](false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '14px 18px',
                    borderRadius: 14,
                    border: `1.5px solid ${cardHovers[i] ? GOLD : 'rgba(255,255,255,0.18)'}`,
                    background: cardHovers[i] ? 'rgba(196,163,90,0.12)' : 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)',
                    textDecoration: 'none',
                    transform: cardHovers[i] ? 'translateX(6px)' : 'translateX(0)',
                    boxShadow: cardHovers[i] ? `0 8px 24px rgba(196,163,90,0.15)` : 'none',
                    transition: 'all 0.22s ease',
                    opacity: visible ? 1 : 0,
                    transitionDelay: `${0.4 + i * 0.12}s`,
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: cardHovers[i] ? `${GOLD}30` : `${GOLD}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background 0.22s',
                  }}>
                    <svg
                      style={{
                        width: 20, height: 20, color: GOLD,
                        transform: cardHovers[i] ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.22s',
                      }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      {icon}
                    </svg>
                  </div>
                  <div>
                    <p style={{
                      color: 'rgba(226,232,240,0.7)', fontSize: 10,
                      fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', marginBottom: 2,
                    }}>
                      {label}
                    </p>
                    <p style={{
                      color: cardHovers[i] ? GOLD : '#ffffff',
                      fontWeight: 600, fontSize: 14,
                      transition: 'color 0.22s',
                    }}>
                      {value}
                    </p>
                  </div>
                  {/* Arrow indicator */}
                  <svg
                    style={{
                      width: 16, height: 16, marginLeft: 'auto', flexShrink: 0,
                      color: GOLD,
                      opacity: cardHovers[i] ? 1 : 0,
                      transform: cardHovers[i] ? 'translateX(0)' : 'translateX(-6px)',
                      transition: 'opacity 0.2s, transform 0.2s',
                    }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyframes ───────────────────────────────────────────────── */}
      <style>{`
        @keyframes ctaPulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          70%  { transform: scale(1.18); opacity: 0;   }
          100% { transform: scale(1.18); opacity: 0;   }
        }
        @keyframes ctaBlob1 {
          0%,100% { transform: translate(0, 0) scale(1);       }
          50%     { transform: translate(-20px, 14px) scale(1.1); }
        }
        @keyframes ctaBlob2 {
          0%,100% { transform: translate(0, 0) scale(1);      }
          50%     { transform: translate(16px, -12px) scale(1.08); }
        }
        @keyframes shimmer {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.75; }
        }
      `}</style>
    </section>
  );
}
