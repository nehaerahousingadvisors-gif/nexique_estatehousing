'use client';

export default function CTASection() {
  return (
    <section className="w-full py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-6 md:p-8 relative overflow-hidden" style={{ backgroundColor: '#1a2744' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C4A35A]/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[#C4A35A] text-xs uppercase tracking-widest mb-2">ARE YOU SEARCHING FOR A PROJECT?</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Get a <span className="text-[#C4A35A]">Free Consultation</span> today
              </h2>
              <p className="text-slate-300 text-sm mb-6">
                Dream home, profitable commercial space, or future-ready investment — we list only RERA-approved & builder-trusted projects.
              </p>
              <a
                href="tel:+919711444460"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C4A35A] hover:bg-[#b3944f] text-slate-900 font-semibold rounded-full transition-colors"
              >
                Talk to an Expert
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
                  label: 'CALL US', value: '+91 96673 94175',
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                  label: 'EMAIL', value: 'info@nexiqueestate.com',
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 border border-white/20">
                  <div className="w-10 h-10 bg-[#C4A35A]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#C4A35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                  </div>
                  <div>
                    <p className="text-slate-200 text-xs uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-white font-medium text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
