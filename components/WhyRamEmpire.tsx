'use client';

const NAVY = '#1a2744';

export default function WhyRamEmpire() {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Trusted Real Estate Experts',
      description: 'Transparent, reliable consultation from project search to final possession.',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      title: 'Wide Range of Verified Projects',
      description: 'Curated RERA-approved residential, commercial & plotted projects.',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'End-to-End Customer Support',
      description: 'Site visits, legal paperwork, loan assistance & after-sales service.',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: '100% RERA Approved',
      description: 'Every project we list is RERA registered — buy with confidence.',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Free Consultation',
      description: 'Start your journey with a free expert consultation — no strings attached.',
    },
  ];

  return (
    <section className="w-full py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#C4A35A' }}>WHY Nexique Estate Housing Advisors</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: NAVY }}>The trusted name in Delhi NCR real estate</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm">
            Built on transparency, backed by a decade of deals, and powered by people who put your investment first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: NAVY, color: '#C4A35A' }}>
                {feature.icon}
              </div>
              <h3 className="text-base font-bold mb-1.5" style={{ color: NAVY }}>{feature.title}</h3>
              <p className="text-slate-600 text-xs">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
