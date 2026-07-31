'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NAVY = '#1a2744';
const NAVY_DARK = '#131e36';

const tabs = ['Lease/Rent', 'Buy', 'Sell', 'Projects'];
const locations = ['Noida', 'Greater Noida', 'Central Noida', 'Yamuna Expressway'];

const propertyOptions: Record<string, { value: string; label: string }[]> = {
  'Lease/Rent': [
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
  ],
  default: [
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
  ],
};

export default function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Buy');
  const [propertyType, setPropertyType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupStep, setPopupStep] = useState<'type' | 'location'>('type');
  const popupRef = useRef<HTMLDivElement>(null);

  const currentOptions = propertyOptions[activeTab] ?? propertyOptions['default'];

  const handleTabChange = (tab: string) => {
    if (tab === 'Sell') { router.push('/post-property'); return; }
    if (tab === 'Projects') { router.push('/projects'); return; }
    setActiveTab(tab);
    setPropertyType('');
    setSelectedLocation('');
    if (tab === 'Lease/Rent' || tab === 'Buy') {
      setShowPopup(true);
      setPopupStep('type');
    } else {
      setShowPopup(false);
    }
  };

  const handlePropertyTypeSelect = (val: string) => {
    setPropertyType(val);
    setPopupStep('location');
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowPopup(false);
        setPopupStep('type');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center py-12">
        {/* Badge */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#C4A35A' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white text-xs">8th Consistent Award-Winning Year</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-3 md:mb-6 leading-tight">
          Find Your <span style={{ color: '#C4A35A' }}>Dream Projects</span> in Delhi NCR
        </h1>

        <p className="text-gray-300 text-xs sm:text-sm md:text-lg text-center mb-6 md:mb-10 max-w-2xl px-2">
          Search RERA-approved residential & commercial projects for sale, rent, or lease across Noida, Greater Noida, Central Noida & Yamuna Expressway.
        </p>

        {/* Search Box */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-visible relative" ref={popupRef}>

          {/* Tabs */}
          <div className="flex items-center border-b border-gray-100 px-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className="relative flex-shrink-0 px-3 py-3 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                style={{ color: activeTab === tab ? NAVY : '#475569' }}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: NAVY }} />
                )}
              </button>
            ))}
            <div className="ml-auto flex-shrink-0 px-2 py-2">
              <Link
                href="/post-property"
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-white rounded-xl font-semibold transition-colors text-xs sm:text-sm whitespace-nowrap"
                style={{ backgroundColor: NAVY }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = NAVY_DARK)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = NAVY)}
              >
                Post Property
              </Link>
            </div>
          </div>

          {/* Search Row */}
          <div className="flex items-center px-2 py-2 gap-1">
            {activeTab === 'Lease/Rent' && (
              <div className="flex items-center px-2 py-2 border-r border-gray-200 flex-shrink-0">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="bg-transparent text-slate-700 font-semibold outline-none text-xs sm:text-sm cursor-pointer max-w-[90px] sm:max-w-none"
                >
                  {currentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex-1 flex items-center gap-1 px-2 min-w-0">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search "Property in NCR"'
                className="flex-1 bg-transparent text-slate-700 outline-none text-xs sm:text-sm placeholder-gray-400 py-2 min-w-0"
              />
            </div>

            <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
              <button className="p-1.5 rounded-full transition-colors hover:bg-blue-50" style={{ color: NAVY }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="7" strokeDasharray="2 2" />
                </svg>
              </button>
              <button className="p-1.5 rounded-full transition-colors hover:bg-blue-50" style={{ color: NAVY }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="9" y="2" width="6" height="12" rx="3" />
                  <path d="M5 10a7 7 0 0014 0M12 19v3M9 22h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <button
              className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 text-white rounded-xl font-semibold transition-colors text-xs sm:text-sm flex-shrink-0"
              style={{ backgroundColor: NAVY }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = NAVY_DARK)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = NAVY)}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>

          {/* Post Property — mobile */}
          <div className="sm:hidden px-3 pb-3">
            <Link
              href="/post-property"
              className="w-full block text-center py-2.5 text-white rounded-xl font-semibold text-sm"
              style={{ backgroundColor: NAVY }}
            >
              Post Property
            </Link>
          </div>

          {/* Popup */}
          {showPopup && (activeTab === 'Lease/Rent' || activeTab === 'Buy') && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Property Type</p>
                <div className="flex flex-row gap-3 pb-4 border-b border-gray-100">
                  {currentOptions.map((opt) => (
                    <label
                      key={opt.value}
                      onClick={() => handlePropertyTypeSelect(opt.value)}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0"
                        style={{
                          borderColor: propertyType === opt.value ? NAVY : '#d1d5db',
                          backgroundColor: propertyType === opt.value ? NAVY : 'white',
                        }}
                      >
                        {propertyType === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: propertyType === opt.value ? NAVY : '#374151' }}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {popupStep === 'location' && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Select Location</p>
                  <div className="grid grid-cols-2 gap-2">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setSelectedLocation(loc)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left"
                        style={{
                          borderColor: selectedLocation === loc ? NAVY : '#e5e7eb',
                          backgroundColor: selectedLocation === loc ? '#eef0f5' : 'white',
                          color: selectedLocation === loc ? NAVY : '#374151',
                        }}
                      >
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                {popupStep === 'location' && (
                  <button onClick={() => setPopupStep('type')} className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                    ← Back
                  </button>
                )}
                <div className="ml-auto">
                  <button
                    onClick={() => { setShowPopup(false); setPopupStep('type'); }}
                    className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-colors"
                    style={{ backgroundColor: NAVY }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = NAVY_DARK)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = NAVY)}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 md:mt-12 grid grid-cols-3 gap-2 md:gap-6 max-w-3xl w-full">
          {[
            { value: '500+', label: 'Happy Clients' },
            { value: '100%', label: 'RERA Approved' },
            { value: '10+', label: 'Years Experience' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center px-2 py-2.5 md:px-6 md:py-4 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="text-lg md:text-2xl font-bold" style={{ color: '#C4A35A' }}>{value}</div>
              <div className="text-white/80 text-[10px] md:text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
