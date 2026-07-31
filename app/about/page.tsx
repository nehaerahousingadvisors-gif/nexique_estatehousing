'use client';

import Image from 'next/image';

export default function AboutPage() {
  const stats = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      number: '500',
      label: 'PROJECTS COMPLETED'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      number: '2500+',
      label: 'HAPPY CUSTOMERS'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      number: '20',
      label: 'AWARDS RECEIVED'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      number: '10',
      label: 'YEARS IN SERVICE'
    }
  ];

  const team = [
    {
      name: 'John Doe',
      role: 'Senior Consultant',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop'
    },
    {
      name: 'Jane Smith',
      role: 'Property Manager',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop'
    },
    {
      name: 'Mike Johnson',
      role: 'Sales Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'
    },
    {
      name: 'Sarah Wilson',
      role: 'Marketing Head',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="w-full py-20 relative overflow-hidden" style={{ backgroundColor: '#1a2744' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#C4A35A] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C4A35A] rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-[#C4A35A] text-xs uppercase tracking-widest mb-4">A FEW WORDS ABOUT</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Award-Winning Real Estate Company in Noida
          </h1>
          <p className="text-slate-200 text-lg mt-4 max-w-2xl">
            Built on transparency, driven by people, and powered by a decade of trusted deals across Delhi NCR.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="w-full py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 -right-4 -bottom-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl -z-10"></div>
              <div className="relative">
                <Image
                  src="/neha011.jpeg"
                  alt="Ms. Neha Rathee - Director & CEO"
                  width={600}
                  height={700}
                  className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                />
              </div>
            </div>
            
            <div>
              <p className="text-[#C4A35A] text-xs uppercase tracking-widest mb-2">Nexique Estate Housing Advisors FOUNDER</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Ms. Neha Rathee</h2>
              <p className="text-slate-600 text-sm mb-4">CEO & Founder</p>
              <p className="text-slate-600 mb-4">
                Ms. Neha Rathee, Director & CEO of Nexique Estate Housing Advisors (RERA Registered), is a respected leader in the Indian real estate industry. With her vision and expertise, the company has built a strong reputation for delivering trusted residential and commercial real estate solutions.
              </p>
              <p className="text-slate-600 mb-8">
                Under her leadership, Nexique Estate Housing Advisors has emerged as one of the leading real estate consultants in Delhi-NCR, setting new benchmarks in sales performance and customer satisfaction.
              </p>
              
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: '#1a2744' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#131e36')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a2744')}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.176.054 1.856.215 2.408.437a4.907 4.907 0 0 1 1.771 1.153 4.907 4.907 0 0 1 1.153 1.771c.222.552.383 1.232.437 2.408.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.176-.215 1.856-.437 2.408a4.907 4.907 0 0 1-1.153 1.771 4.907 4.907 0 0 1-1.771 1.153c-.552.222-1.232.383-2.408.437-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.176-.054-1.856-.215-2.408-.437a4.907 4.907 0 0 1-1.771-1.153 4.907 4.907 0 0 1-1.153-1.771c-.222-.552-.383-1.232-.437-2.408-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.176.215-1.856.437-2.408a4.907 4.907 0 0 1 1.153-1.771 4.907 4.907 0 0 1 1.771-1.153c.552-.222 1.232-.383 2.408-.437 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.273.058-2.068.233-2.758.494a6.999 6.999 0 0 0-2.536 1.65 6.999 6.999 0 0 0-1.65 2.536c-.261.69-.436 1.485-.494 2.758-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.273.233 2.068.494 2.758a6.999 6.999 0 0 0 1.65 2.536 6.999 6.999 0 0 0 2.536 1.65c.69.261 1.485.436 2.758.494 1.28.058 1.688.072 4.947.072s3.667-.014 3.947.072c1.273-.058 2.068-.233 2.758-.494a6.999 6.999 0 0 0 2.536-1.65 6.999 6.999 0 0 0 1.65-2.536c.261-.69.436-1.485.494-2.758.058-1.28.072-1.688.072-4.947s-.058-3.667-.072-3.947c-.058-1.273-.233-2.068-.494-2.758a6.999 6.999 0 0 0-1.65-2.536 6.999 6.999 0 0 0-2.536-1.65c-.69-.261-1.485-.436-2.758-.494-1.28-.058-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.538-10.655a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: '#1a2744' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#131e36')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a2744')}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: '#1a2744' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#131e36')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a2744')}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a 
                  href="tel:+919711444460"
                  className="ml-4 px-6 py-3 text-white font-semibold rounded-full transition-colors"
                  style={{ backgroundColor: '#1a2744' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#131e36')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a2744')}
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-3xl shadow-lg text-center border border-slate-100"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: '#1a2744' }}>
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">{stat.number}</p>
                <p className="text-slate-500 text-xs uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section — hidden for now */}
    </div>
  );
}
