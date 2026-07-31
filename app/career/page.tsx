'use client';

import { useState } from 'react';

export default function CareerPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: '',
    experience: '',
    message: '',
  });

  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Accelerated Growth',
      description: 'Clear progression paths and incentives led career growth.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Innovative Culture',
      description: 'Modern tools, learning programs and a collaborative team.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Wellness First',
      description: 'Health benefits, flexible policies and a supportive environment.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: 'Premium Portfolio',
      description: 'Work on India\'s most exciting RERA-approved projects.'
    }
  ];

  const jobOpenings = [
    {
      title: 'Sales Consultant',
      type: 'Full-time',
      location: 'Noida'
    },
    {
      title: 'Channel Partner Manager',
      type: 'Full-time',
      location: 'Delhi NCR'
    },
    {
      title: 'Marketing Executive',
      type: 'Full-time',
      location: 'Noida'
    },
    {
      title: 'Tele-Caller',
      type: 'Full-time',
      location: 'Noida'
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Application submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="w-full py-20 relative overflow-hidden" style={{ backgroundColor: '#1a2744' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: '#243156' }}></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#243156' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-[#C4A35A] text-xs uppercase tracking-widest mb-2">CAREERS</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Submit Your Resume
          </h1>
          <p className="text-slate-300 max-w-2xl">
            At Ram Empire India, success begins with the right opportunities. Join us for a career journey where your ambitions align with endless possibilities for growth and achievement.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-16 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white" style={{ backgroundColor: '#1a2744' }}>
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings & Application Form Section */}
      <section className="w-full py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Job Openings */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#1a2744' }}>CURRENT OPENINGS</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">We're hiring across roles</h2>
              
              <div className="space-y-3">
                {jobOpenings.map((job, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1a2744')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                  >
                    <div>
                      <h3 className="font-bold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-600">{job.type} · {job.location}</p>
                    </div>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1a2744' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Apply Now</h3>
              <p className="text-slate-600 text-sm mb-6">Fill in your details and upload your CV.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      FIRST NAME *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter here"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none transition-all"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#1a2744'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      LAST NAME *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter here"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none transition-all"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#1a2744'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter here"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none transition-all"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#1a2744'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      PHONE *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter here"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none transition-all"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#1a2744'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="designation" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      DESIGNATION APPLIED FOR
                    </label>
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="Enter here"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none transition-all"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#1a2744'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    />
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      EXPERIENCE (YEARS)
                    </label>
                    <input
                      type="text"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Enter here"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none transition-all"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#1a2744'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label htmlFor="resume" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    UPLOAD RESUME
                  </label>
                  <div className="w-full px-4 py-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center cursor-pointer transition-colors" onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1a2744')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}>
                    <svg className="w-6 h-6 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-slate-500">Choose PDF / DOCX</p>
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter here"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-all resize-vertical"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2 shadow-lg"
                  style={{ backgroundColor: '#1a2744' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#131e36')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a2744')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Application 
                </button> 
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}