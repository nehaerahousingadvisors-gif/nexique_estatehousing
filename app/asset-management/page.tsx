import Link from 'next/link';
import Image from 'next/image';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';

const NAVY = '#1a2744';
const GOLD = '#C4A35A';

const process = [
  { step: '01', title: 'Free Consultation', desc: 'We understand your property, goals, and requirements.' },
  { step: '02', title: 'Property Onboarding', desc: 'Documentation, inspection, and listing your property.' },
  { step: '03', title: 'Active Management', desc: 'Tenant placement, rent collection, and maintenance.' },
  { step: '04', title: 'Monthly Reporting', desc: 'Detailed financial and operational reports delivered to you.' },
];

export default function AssetManagementPage() {
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

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section className="w-full py-14 md:py-20" style={{ backgroundColor: NAVY }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: GOLD }}>HOW IT WORKS</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Simple 4-Step Process</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map(({ step, title, desc }) => (
              <div key={step} className="relative text-center px-4 py-6 rounded-2xl border border-white/10 bg-white/5">
                <div className="text-4xl font-extrabold mb-3 opacity-20 text-white">{step}</div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────────── */}
      <section className="w-full py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: GOLD }}>WHY NEXIQUE ESTATE</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5" style={{ color: NAVY }}>
                Your Property, Our Priority
              </h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6">
                We treat your property like our own. With 10+ years of experience managing residential and commercial assets across Delhi NCR, we deliver unmatched transparency, reliability, and returns.
              </p>
              <ul className="space-y-3">
                {[
                  'RERA registered & legally compliant',
                  'Dedicated relationship manager',
                  'Zero hidden charges',
                  'Real-time updates via WhatsApp & email',
                  'Pan-Delhi NCR coverage',
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${GOLD}25` }}>
                      <svg className="w-3 h-3" fill="none" stroke={GOLD} strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-72 md:h-96 shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop"
                alt="Property Management"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
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
