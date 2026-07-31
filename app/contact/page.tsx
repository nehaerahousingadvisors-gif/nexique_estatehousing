'use client';

import { useState } from 'react';

const NAVY = '#1a2744';
const NAVY_DARK = '#131e36';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="w-full py-16 relative overflow-hidden" style={{ backgroundColor: NAVY }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#C4A35A] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C4A35A] rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-[#C4A35A] text-xs uppercase tracking-widest mb-2">GET IN TOUCH</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Let's Discuss Your Spaces</h1>
          <p className="text-slate-300 max-w-2xl">
            New Era Housing Advisors helps you buy, sell, and invest in premium properties with expert advice and trusted service across India.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Details */}
            <div>
              <p className="text-[#C4A35A] text-xs uppercase tracking-widest mb-2">GET IN TOUCH</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Contact Details</h2>

              <div className="space-y-4 mb-8">
                {/* Address */}
                <div className="flex items-start gap-4 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: NAVY }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">ADDRESS</h3>
                    <p className="text-slate-600 text-sm">
                      315, Anthurium Office Spaces, Tower A, Sector-73, Uttar pradesh, 201301
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: NAVY }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">CALL US</h3>
                    <p className="text-slate-600 text-sm">+91 96673 94175</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: NAVY }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">EMAIL US</h3>
                    <p className="text-slate-600 text-sm">info@nexiqueestate.com</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mb-8">
                {[0, 1, 2].map((i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: NAVY }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = NAVY_DARK)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = NAVY)}
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5z" />
                    </svg>
                  </a>
                ))}
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Free Consultation', 'Budget Quotations', 'Premium Projects', 'Budget Friendly Projects'].map((item) => (
                  <div key={item} className="flex items-center gap-2 p-3 bg-slate-100 rounded-full">
                    <svg className="w-5 h-5 text-[#C4A35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Send us a message</h2>
              <p className="text-slate-600 text-sm mb-6">We'll respond within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      YOUR NAME <span className="text-[#C4A35A]">*</span>
                    </label>
                    <input
                      type="text" id="name" name="name"
                      value={formData.name} onChange={handleChange}
                      placeholder="Enter here"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none transition-all"
                      style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
                      onFocus={e => { e.currentTarget.style.borderColor = NAVY; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      EMAIL <span className="text-[#C4A35A]">*</span>
                    </label>
                    <input
                      type="email" id="email" name="email"
                      value={formData.email} onChange={handleChange}
                      placeholder="Enter here"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none transition-all"
                      onFocus={e => { e.currentTarget.style.borderColor = NAVY; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      PHONE NO
                    </label>
                    <input
                      type="tel" id="phone" name="phone"
                      value={formData.phone} onChange={handleChange}
                      placeholder="Enter 10-digit phone number"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none transition-all"
                      onFocus={e => { e.currentTarget.style.borderColor = NAVY; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    />
                  </div>
                  <div>
                    <label htmlFor="propertyType" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      PROPERTY TYPE
                    </label>
                    <select
                      id="propertyType" name="propertyType"
                      value={formData.propertyType} onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none transition-all"
                      onFocus={e => { e.currentTarget.style.borderColor = NAVY; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                      <option value="">Select</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="plots">Plots</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    YOUR MESSAGE <span className="text-[#C4A35A]">*</span>
                  </label>
                  <textarea
                    id="message" name="message"
                    value={formData.message} onChange={handleChange}
                    placeholder="Enter here" rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none transition-all resize-vertical"
                    onFocus={e => { e.currentTarget.style.borderColor = NAVY; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2 shadow-lg"
                  style={{ backgroundColor: NAVY }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = NAVY_DARK)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = NAVY)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
