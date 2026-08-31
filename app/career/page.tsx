'use client';

import { useState, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

const PRIMARY = '#1a2744';

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
  const [resumeFile,    setResumeFile]    = useState<File | null>(null);
  const [uploading,     setUploading]     = useState(false);
  const [uploadPct,     setUploadPct]     = useState(0);
  const [submitted,     setSubmitted]     = useState(false);
  const [error,         setError]         = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setUploadPct(0);

    try {
      let resumeUrl = '';
      let resumeName = '';

      // ── Upload resume to Firebase Storage ───────────────────────
      if (resumeFile) {
        resumeName = resumeFile.name;
        const storageRef = ref(
          storage,
          `careers/${Date.now()}_${resumeFile.name.replace(/\s+/g, '_')}`,
        );
        await new Promise<void>((resolve, reject) => {
          const task = uploadBytesResumable(storageRef, resumeFile);
          task.on(
            'state_changed',
            snap => setUploadPct(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
            reject,
            async () => {
              resumeUrl = await getDownloadURL(task.snapshot.ref);
              resolve();
            },
          );
        });
      }

      // ── Save application to Firestore ────────────────────────────
      await addDoc(collection(db, 'careers'), {
        firstName:   formData.firstName.trim(),
        lastName:    formData.lastName.trim(),
        email:       formData.email.trim(),
        phone:       formData.phone.trim(),
        designation: formData.designation.trim(),
        experience:  formData.experience.trim(),
        message:     formData.message.trim(),
        resumeUrl,
        resumeName,
        createdAt:   new Date().toISOString(),
        status:      'new',
      });

      // ── Send email notification to info@nexiqueestate.com ────────
      try {
        await fetch('/api/career-apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName:   formData.firstName.trim(),
            lastName:    formData.lastName.trim(),
            email:       formData.email.trim(),
            phone:       formData.phone.trim(),
            designation: formData.designation.trim(),
            experience:  formData.experience.trim(),
            message:     formData.message.trim(),
            resumeUrl,
            resumeName,
          }),
        });
      } catch (emailErr) {
        // Email failure should not block success — application is already saved
        console.warn('Email notification failed:', emailErr);
      }

      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', designation: '', experience: '', message: '' });
      setResumeFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('Career form error:', err);
      setError(
        err?.code === 'permission-denied'
          ? 'Permission denied. Please contact us at info@nexiqueestate.com'
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
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

                {/* Success */}
                {submitted && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-green-800">Application submitted successfully!</p>
                      <p className="text-xs text-green-600 mt-0.5">We'll review your application and get back to you soon.</p>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
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
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    UPLOAD RESUME
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-6 bg-slate-50 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all"
                    style={{ borderColor: resumeFile ? PRIMARY : '#e2e8f0' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = PRIMARY)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = resumeFile ? PRIMARY : '#e2e8f0')}
                  >
                    {resumeFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke={PRIMARY} strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="text-left">
                          <p className="text-sm font-semibold" style={{ color: PRIMARY }}>{resumeFile.name}</p>
                          <p className="text-xs text-slate-400">{(resumeFile.size / 1024).toFixed(0)} KB · Click to change</p>
                        </div>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-slate-500">Choose PDF / DOCX</p>
                        <p className="text-xs text-slate-400 mt-1">Max 10MB</p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                      onChange={handleFileChange}
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
                  disabled={uploading}
                  className="w-full py-4 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: PRIMARY }}
                  onMouseEnter={e => { if (!uploading) (e.currentTarget.style.backgroundColor = '#131e36'); }}
                  onMouseLeave={e => { if (!uploading) (e.currentTarget.style.backgroundColor = PRIMARY); }}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {uploadPct > 0 && uploadPct < 100
                        ? `Uploading resume... ${uploadPct}%`
                        : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Application
                    </>
                  )}
                </button> 
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}