'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

type LookingTo = 'Sell' | 'Rent / Lease';
type PropertyCategory = 'Residential' | 'Commercial';
type ResidentialType =
  | 'Flat/Apartment' | 'Independent House / Villa' | 'Builder Floor'
  | 'Plot / Land' | '1 RK/ Studio Apartment' | 'Serviced Apartment'
  | 'Farmhouse' | 'Other';
type Furnishing = 'Furnished' | 'Semi-furnished' | 'Un-furnished';
type AvailabilityStatus = 'Ready to move' | 'Under construction';
type PriceUnit = 'Total Price' | 'Per sq.ft.' | 'Per sq.m.' | 'Per sq.yd.';
type MaintenanceUnit = 'Monthly' | 'Yearly';
type BookingUnit = 'Fixed' | 'Percentage';

const PRIMARY = '#1a2744';

const steps = [
  { id: 1, label: 'Basic Details', stepNum: 'Step 1' },
  { id: 2, label: 'Location Details', stepNum: 'Step 2' },
  { id: 3, label: 'Property Profile', stepNum: 'Step 3' },
  { id: 4, label: 'Photos, Videos & Voice-over', stepNum: 'Step 4' },
  { id: 5, label: 'Pricing & Others', stepNum: 'Step 5' },
];

const residentialTypes: ResidentialType[] = [
  'Flat/Apartment', 'Independent House / Villa', 'Builder Floor',
  'Plot / Land', '1 RK/ Studio Apartment', 'Serviced Apartment', 'Farmhouse', 'Other',
];
const commercialTypes = [
  'Office Space', 'Retail / Shop', 'Commercial Land', 'Warehouse', 'Industrial Building', 'Other',
];

// ─── Step 4: Photos, Videos & Voice-over ──────────────────────────────────────
function Step4MediaUpload({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [voiceOver, setVoiceOver] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const canContinue = photos.length > 0 && videos.length > 0;

  const handleContinue = () => {
    if (!canContinue) { setShowErrors(true); return; }
    onContinue();
  };

  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const voiceRef = useRef<HTMLInputElement>(null);

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPhotos(prev => [...prev, ...Array.from(e.target.files!)]);
  };
  const handleVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setVideos(prev => [...prev, ...Array.from(e.target.files!)]);
  };
  const handleVoice = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setVoiceOver(e.target.files[0]);
  };

  const removePhoto = (i: number) => setPhotos(p => p.filter((_, idx) => idx !== i));
  const removeVideo = (i: number) => setVideos(p => p.filter((_, idx) => idx !== i));

  return (
    <>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <h2 className="text-2xl font-bold text-slate-800 mb-1">Photos, Videos & Voice-over</h2>
      <p className="text-sm text-gray-500 mb-8">Step 4 of 5 — Add media to attract more buyers</p>

      {/* Photos */}
      <div className="mb-8 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-slate-800">Photos</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Max 25 photos</span>
          <span className="text-red-500 text-sm font-bold">*</span>
        </div>
        <p className="text-xs text-gray-400 mb-1">JPG, PNG up to 10MB each. Properties with photos get 5x more inquiries.</p>
        {showErrors && photos.length === 0 && (
          <p className="text-xs text-red-500 mb-3">At least 1 photo is required</p>
        )}
        {!(showErrors && photos.length === 0) && <div className="mb-3" />}

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
          {photos.map((f, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
              <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
              <button onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80">
                ✕
              </button>
            </div>
          ))}
          {photos.length < 25 && (
            <button onClick={() => photoRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center gap-1 transition-colors"
              style={{ borderColor: `${PRIMARY}60` }}>
              <svg className="w-6 h-6" fill="none" stroke={PRIMARY} strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs font-medium" style={{ color: PRIMARY }}>Add Photo</span>
            </button>
          )}
        </div>
        <input ref={photoRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
        <button onClick={() => photoRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
          style={{ borderColor: PRIMARY, color: PRIMARY }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Upload Photos ({photos.length}/25)
        </button>
      </div>

      {/* Videos */}
      <div className="mb-8 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-slate-800">Videos</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Max 3 videos</span>
          <span className="text-red-500 text-sm font-bold">*</span>
        </div>
        <p className="text-xs text-gray-400 mb-1">MP4, MOV up to 50MB each. Videos boost engagement by 3x.</p>
        {showErrors && videos.length === 0 && (
          <p className="text-xs text-red-500 mb-3">At least 1 video is required</p>
        )}
        {!(showErrors && videos.length === 0) && <div className="mb-3" />}

        <div className="flex flex-wrap gap-3 mb-3">
          {videos.map((f, i) => (
            <div key={i} className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.369A1 1 0 0121 8.535v6.93a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-slate-700 max-w-[120px] truncate">{f.name}</span>
              <button onClick={() => removeVideo(i)} className="text-gray-400 hover:text-gray-600 text-xs ml-1">✕</button>
            </div>
          ))}
        </div>
        <input ref={videoRef} type="file" accept="video/*" multiple className="hidden" onChange={handleVideos} />
        {videos.length < 3 && (
          <button onClick={() => videoRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
            style={{ borderColor: PRIMARY, color: PRIMARY }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.369A1 1 0 0121 8.535v6.93a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Upload Videos ({videos.length}/3)
          </button>
        )}
      </div>

      {/* Voice-over */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-slate-800">Voice-over</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">Record or upload an audio description. MP3, WAV up to 5MB.</p>

        {voiceOver ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 max-w-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke={PRIMARY} strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="text-xs text-slate-700 flex-1 truncate">{voiceOver.name}</span>
            <button onClick={() => setVoiceOver(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <button onClick={() => voiceRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
              style={{ borderColor: PRIMARY, color: PRIMARY }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Audio
            </button>
            <button
              onClick={() => setRecording(r => !r)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
              style={{ borderColor: recording ? '#ef4444' : '#d1d5db', color: recording ? '#ef4444' : '#64748b', backgroundColor: recording ? '#fef2f2' : 'white' }}>
              <svg className="w-4 h-4" fill={recording ? '#ef4444' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10a7 7 0 0014 0M12 19v3M9 22h6" />
              </svg>
              {recording ? 'Stop Recording' : 'Record Audio'}
            </button>
          </div>
        )}
        <input ref={voiceRef} type="file" accept="audio/*" className="hidden" onChange={handleVoice} />
      </div>

      <button onClick={handleContinue}
        className="px-8 py-2.5 rounded-md text-white font-semibold text-sm transition-all"
        style={{ backgroundColor: canContinue ? PRIMARY : '#9ca3af', cursor: canContinue ? 'pointer' : 'not-allowed', opacity: canContinue ? 1 : 0.6 }}>
        Continue
      </button>
    </>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width="70" height="70" className="-rotate-90">
      <circle cx="35" cy="35" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
      <circle cx="35" cy="35" r={r} fill="none" stroke={PRIMARY} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
    </svg>
  );
}

// Number selector circles (1,2,3,4...)
function NumSelector({ label, value, options, onChange, addOther }: {
  label: string; value: number | null; options: number[];
  onChange: (v: number) => void; addOther?: boolean;
}) {
  const [showInput, setShowInput] = useState(false);
  const [customVal, setCustomVal] = useState('');

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setCustomVal(v);
    const num = parseInt(v);
    if (!isNaN(num) && num > 0) onChange(num);
  };

  const handleClose = () => {
    setShowInput(false);
    setCustomVal('');
    // reset to null only if the current value was a custom one
    if (value !== null && !options.includes(value)) onChange(null as unknown as number);
  };

  const isCustomActive = value !== null && !options.includes(value);

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-slate-800 mb-3">{label}</p>
      <div className="flex items-center gap-3 flex-wrap">
        {options.map((n) => (
          <button
            key={n}
            onClick={() => { onChange(n); setShowInput(false); setCustomVal(''); }}
            className="w-11 h-11 rounded-full border-2 text-sm font-semibold transition-all"
            style={{
              borderColor: value === n ? PRIMARY : '#d1d5db',
              backgroundColor: value === n ? `${PRIMARY}15` : 'white',
              color: value === n ? PRIMARY : '#64748b',
            }}
          >
            {n}
          </button>
        ))}

        {/* Pill input — shown after Add other clicked */}
        {addOther && showInput && (
          <>
            <div className="relative">
              <input
                type="number"
                min={1}
                value={customVal}
                onChange={handleCustomChange}
                autoFocus
                placeholder="Enter no."
                className="h-11 rounded-full border-2 text-sm font-medium outline-none transition-all text-center"
                style={{
                  width: '120px',
                  borderColor: isCustomActive ? PRIMARY : '#d1d5db',
                  backgroundColor: 'white',
                  color: isCustomActive ? PRIMARY : '#9ca3af',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                }}
              />
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-base leading-none"
            >
              ✕
            </button>
          </>
        )}

        {/* Add other link */}
        {addOther && !showInput && (
          <button
            className="text-sm font-semibold"
            style={{ color: PRIMARY }}
            onClick={() => setShowInput(true)}
          >
            + Add other
          </button>
        )}
      </div>
    </div>
  );
}

// Counter (minus / count / plus)
function Counter({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-slate-700 w-36">{label}</span>
      <button onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>
      <span className="text-sm font-semibold text-slate-800 w-4 text-center">{value}</span>
      <button onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

// ─── Helper: format number in Indian price words ──────────────────────────────
function formatIndianPrice(amount: number): string {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  if (amount >= 100000) return `${(amount / 100000).toFixed(2).replace(/\.?0+$/, '')} Lac`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1).replace(/\.?0+$/, '')} Thousand`;
  return amount.toLocaleString('en-IN');
}

export default function PostPropertyPage() {
  // Step 1
  const [currentStep, setCurrentStep] = useState(1);
  const [lookingTo, setLookingTo] = useState<LookingTo | ''>('');
  const [propertyCategory, setPropertyCategory] = useState<PropertyCategory>('Residential');
  const [selectedType, setSelectedType] = useState<ResidentialType | string>('');

  // Step 2
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [cityFocused, setCityFocused] = useState(false);
  const [localityFocused, setLocalityFocused] = useState(false);
  const [houseNoFocused, setHouseNoFocused] = useState(false);

  // Step 3
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  const [balconies, setBalconies] = useState<number | null>(null);
  const [plotArea, setPlotArea] = useState('');
  const [plotUnit, setPlotUnit] = useState('sq.ft.');
  const [carpetArea, setCarpetArea] = useState('');
  const [showCarpet, setShowCarpet] = useState(false);
  const [builtUpArea, setBuiltUpArea] = useState('');
  const [showBuiltUp, setShowBuiltUp] = useState(false);
  const [furnishing, setFurnishing] = useState<Furnishing | ''>('');
  const [coveredParking, setCoveredParking] = useState(0);
  const [openParking, setOpenParking] = useState(0);
  const [totalFloors, setTotalFloors] = useState('');
  const [availability, setAvailability] = useState<AvailabilityStatus | ''>('');
  const [showStep3Errors, setShowStep3Errors] = useState(false);

  // Step 5 — Pricing & Others
  const [expectedPrice, setExpectedPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState<PriceUnit>('Total Price');
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [allInclusive, setAllInclusive] = useState(false);
  const [taxExcluded, setTaxExcluded] = useState(false);
  const [maintenanceCharge, setMaintenanceCharge] = useState('');
  const [maintenanceUnit, setMaintenanceUnit] = useState<MaintenanceUnit>('Monthly');
  const [bookingAmount, setBookingAmount] = useState('');
  const [bookingUnit, setBookingUnit] = useState<BookingUnit>('Fixed');
  const [showStep5Errors, setShowStep5Errors] = useState(false);

  const score = currentStep === 5 ? 100 : currentStep === 4 ? 80 : currentStep === 3 ? 60 : currentStep === 2 ? 45 : selectedType ? 32 : lookingTo ? 16 : 13;
  const canContinueStep1 = selectedType !== '';
  const canContinueStep2 = city.trim() !== '';
  const canContinueStep3 = availability !== '';
  const step1Subtitle = selectedType ? `${selectedType} for ${lookingTo || 'Sale'}` : null;

  const handleContinue = () => {
    if (currentStep === 1 && canContinueStep1) { setCurrentStep(2); }
    else if (currentStep === 2 && canContinueStep2) { setCurrentStep(3); }
    else if (currentStep === 3) {
      if (!canContinueStep3) { setShowStep3Errors(true); return; }
      setCurrentStep(4);
    } else if (currentStep < steps.length) { setCurrentStep(s => s + 1); }
  };

  const types = propertyCategory === 'Residential' ? residentialTypes : commercialTypes;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3.5">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar — sticky */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-6 lg:sticky lg:top-20">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <ul className="space-y-1">
              {steps.map((step, idx) => {
                const isActive = step.id === currentStep;
                const isDone = step.id < currentStep;
                return (
                  <li key={step.id} className="relative">
                    {idx < steps.length - 1 && (
                      <div className="absolute left-[11px] top-7 w-0.5 h-9"
                        style={{ backgroundColor: isDone ? PRIMARY : '#e5e7eb' }} />
                    )}
                    <div className="flex items-start gap-3 py-1.5">
                      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 relative z-10 transition-colors"
                        style={{ borderColor: isActive || isDone ? PRIMARY : '#d1d5db', backgroundColor: isActive || isDone ? PRIMARY : 'white' }}>
                        {isDone ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isActive ? 'white' : '#d1d5db' }} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-tight" style={{ color: isActive || isDone ? '#1e293b' : '#94a3b8' }}>
                          {step.label}
                        </p>
                        {isDone ? (
                          <p className="text-xs mt-0.5">
                            {step.id === 1 && step1Subtitle && (
                              <span className="text-gray-500 mr-1">{step1Subtitle}</span>
                            )}
                            <button className="font-semibold" style={{ color: PRIMARY }} onClick={() => setCurrentStep(step.id)}>Edit</button>
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-0.5">{step.stepNum}</p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <ProgressRing percent={score} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-bold text-slate-800">{score}%</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">Property Score</p>
                <p className="text-xs text-gray-500 leading-snug mt-1">Better your property score, greater your visibility</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-8 min-h-[400px]">

          {/* Step 1 */}
          {currentStep === 1 && (
            <>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back,</h1>
              <p className="text-xl font-semibold text-slate-800 mb-8">Fill out basic details</p>
              <div className="mb-7">
                <p className="text-sm font-semibold text-slate-700 mb-3">I'm looking to</p>
                <div className="flex flex-wrap gap-2">
                  {(['Sell', 'Rent / Lease'] as LookingTo[]).map((opt) => (
                    <button key={opt} onClick={() => setLookingTo(opt)}
                      className="px-5 py-2 rounded-md border text-sm font-medium transition-colors"
                      style={{ borderColor: lookingTo === opt ? PRIMARY : '#d1d5db', backgroundColor: lookingTo === opt ? PRIMARY : 'white', color: lookingTo === opt ? 'white' : '#64748b' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <p className="text-sm font-semibold text-slate-700 mb-3">What kind of property do you have?</p>
                <div className="flex gap-6 mb-4">
                  {(['Residential', 'Commercial'] as PropertyCategory[]).map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer" onClick={() => { setPropertyCategory(cat); setSelectedType(''); }}>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{ borderColor: propertyCategory === cat ? PRIMARY : '#d1d5db', backgroundColor: propertyCategory === cat ? PRIMARY : 'white' }}>
                        {propertyCategory === cat && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-medium" style={{ color: propertyCategory === cat ? '#1e293b' : '#64748b' }}>{cat}</span>
                    </label>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <button key={type} onClick={() => setSelectedType(type)}
                      className="px-4 py-2 rounded-md border text-sm font-medium transition-colors"
                      style={{ borderColor: selectedType === type ? PRIMARY : '#d1d5db', backgroundColor: selectedType === type ? PRIMARY : 'white', color: selectedType === type ? 'white' : '#64748b' }}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleContinue} disabled={!canContinueStep1}
                className="px-8 py-2.5 rounded-md text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: canContinueStep1 ? PRIMARY : '#9ca3af' }}>
                Continue
              </button>
            </>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <>
              <button onClick={() => setCurrentStep(1)} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Where is your property located?</h2>
              <p className="text-sm text-gray-500 mb-8">An accurate location helps you connect with the right buyers</p>
              <div className="space-y-5 max-w-lg">
                {[
                  { label: 'City', value: city, set: setCity, focused: cityFocused, setFocused: setCityFocused },
                  { label: 'Locality / Area', value: locality, set: setLocality, focused: localityFocused, setFocused: setLocalityFocused },
                  { label: 'House No. / Building (Optional)', value: houseNo, set: setHouseNo, focused: houseNoFocused, setFocused: setHouseNoFocused },
                ].map(({ label, value, set, focused, setFocused }) => (
                  <div key={label} className="relative">
                    <label className="absolute left-3 transition-all duration-200 pointer-events-none"
                      style={{ top: focused || value ? '6px' : '50%', transform: focused || value ? 'translateY(0) scale(0.8)' : 'translateY(-50%)', transformOrigin: 'left', fontSize: focused || value ? '11px' : '14px', color: focused ? PRIMARY : '#9ca3af' }}>
                      {label}
                    </label>
                    <input type="text" value={value} onChange={(e) => set(e.target.value)}
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      className="w-full pt-5 pb-2 px-3 rounded-md border text-sm text-slate-800 outline-none bg-white transition-colors"
                      style={{ borderColor: focused ? PRIMARY : '#d1d5db', borderWidth: focused ? '2px' : '1px' }} />
                  </div>
                ))}
              </div>
              <button onClick={handleContinue} disabled={!canContinueStep2}
                className="mt-8 px-8 py-2.5 rounded-md text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: canContinueStep2 ? PRIMARY : '#9ca3af' }}>
                Continue
              </button>
            </>
          )}

          {/* Step 3: Property Profile */}
          {currentStep === 3 && (
            <>
              <button onClick={() => setCurrentStep(2)} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Tell us about your property</h2>

              {/* Add Room Details */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-5">Add Room Details</h3>
                <NumSelector label="No. of Bedrooms" value={bedrooms} options={[1, 2, 3, 4]} onChange={setBedrooms} addOther />
                <NumSelector label="No. of Bathrooms" value={bathrooms} options={[1, 2, 3, 4]} onChange={setBathrooms} addOther />
                <div className="mb-6">
                  <p className="text-sm font-semibold text-slate-800 mb-3">Balconies</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {[0, 1, 2, 3].map((n) => (
                      <button key={n} onClick={() => setBalconies(n)}
                        className="px-5 py-2 rounded-full border text-sm font-medium transition-all"
                        style={{ borderColor: balconies === n ? PRIMARY : '#d1d5db', backgroundColor: balconies === n ? `${PRIMARY}15` : 'white', color: balconies === n ? PRIMARY : '#64748b' }}>
                        {n}
                      </button>
                    ))}
                    <button className="px-5 py-2 rounded-full border text-sm font-medium border-gray-300 text-gray-600 hover:bg-gray-50">
                      More than 3
                    </button>
                  </div>
                  {showStep3Errors && balconies === null && (
                    <p className="text-xs text-red-500 mt-2">Please specify balcony count</p>
                  )}
                </div>
              </div>

              {/* Add Area Details */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-800">Add Area Details</h3>
                  <button className="w-5 h-5 rounded-full border border-gray-400 text-xs text-gray-500 flex items-center justify-center">?</button>
                  {showStep3Errors && !plotArea && (
                    <span className="text-red-500 text-lg">&#9888;</span>
                  )}
                </div>
                {showStep3Errors && !plotArea && (
                  <p className="text-xs text-red-500 mb-3">Atleast one area type mandatory</p>
                )}
                <div className="border border-gray-300 rounded-md overflow-hidden max-w-sm mb-3 flex">
                  <input type="number" value={plotArea} onChange={(e) => setPlotArea(e.target.value)}
                    placeholder="Plot Area"
                    className="flex-1 px-3 py-2.5 text-sm text-slate-700 outline-none"
                    style={{ borderRight: '1px solid #d1d5db' }} />
                  <select value={plotUnit} onChange={(e) => setPlotUnit(e.target.value)}
                    className="px-3 py-2.5 text-sm text-slate-700 bg-white outline-none border-0">
                    <option>sq.ft.</option>
                    <option>sq.m.</option>
                    <option>sq.yd.</option>
                    <option>acres</option>
                  </select>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {!showCarpet && (
                    <button onClick={() => setShowCarpet(true)} className="text-sm font-medium" style={{ color: PRIMARY }}>+ Carpet Area</button>
                  )}
                  {showCarpet && (
                    <div className="border border-gray-300 rounded-md overflow-hidden max-w-sm flex w-full sm:w-auto">
                      <input type="number" value={carpetArea} onChange={(e) => setCarpetArea(e.target.value)}
                        placeholder="Carpet Area"
                        className="flex-1 px-3 py-2.5 text-sm text-slate-700 outline-none"
                        style={{ borderRight: '1px solid #d1d5db' }} />
                      <select className="px-3 py-2.5 text-sm text-slate-700 bg-white outline-none border-0">
                        <option>sq.ft.</option><option>sq.m.</option>
                      </select>
                    </div>
                  )}
                  {!showBuiltUp && (
                    <button onClick={() => setShowBuiltUp(true)} className="text-sm font-medium" style={{ color: PRIMARY }}>+ Built-up Area</button>
                  )}
                  {showBuiltUp && (
                    <div className="border border-gray-300 rounded-md overflow-hidden max-w-sm flex w-full sm:w-auto">
                      <input type="number" value={builtUpArea} onChange={(e) => setBuiltUpArea(e.target.value)}
                        placeholder="Built-up Area"
                        className="flex-1 px-3 py-2.5 text-sm text-slate-700 outline-none"
                        style={{ borderRight: '1px solid #d1d5db' }} />
                      <select className="px-3 py-2.5 text-sm text-slate-700 bg-white outline-none border-0">
                        <option>sq.ft.</option><option>sq.m.</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Furnishing */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Furnishing</h3>
                  <span className="text-sm text-gray-400 italic">(Optional)</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(['Furnished', 'Semi-furnished', 'Un-furnished'] as Furnishing[]).map((f) => (
                    <button key={f} onClick={() => setFurnishing(furnishing === f ? '' : f)}
                      className="px-5 py-2 rounded-full border text-sm font-medium transition-colors"
                      style={{ borderColor: furnishing === f ? PRIMARY : '#d1d5db', backgroundColor: furnishing === f ? `${PRIMARY}15` : 'white', color: furnishing === f ? PRIMARY : '#64748b' }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reserved Parking */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Reserved Parking</h3>
                  <span className="text-sm text-gray-400 italic">(Optional)</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Counter label="Covered Parking" value={coveredParking} onChange={setCoveredParking} />
                  <Counter label="Open Parking" value={openParking} onChange={setOpenParking} />
                </div>
              </div>

              {/* Floor Details */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Floor Details</h3>
                <p className="text-sm text-gray-400 mb-4">Total no of floors and your floor details</p>
                <div className="max-w-xs border border-gray-300 rounded-md">
                  <input type="number" value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)}
                    placeholder="Total Floors"
                    className="w-full px-3 py-3 text-sm text-slate-700 outline-none bg-white rounded-md" />
                </div>
              </div>

              {/* Availability Status */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-800">Availability Status</h3>
                  {showStep3Errors && !availability && (
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">!</span>
                  )}
                </div>
                {showStep3Errors && !availability && (
                  <p className="text-xs text-red-500 mb-3">Please select the availability status</p>
                )}
                <div className="flex flex-wrap gap-3 mt-3">
                  {(['Ready to move', 'Under construction'] as AvailabilityStatus[]).map((s) => (
                    <button key={s} onClick={() => setAvailability(s)}
                      className="px-5 py-2 rounded-full border text-sm font-medium transition-colors"
                      style={{ borderColor: availability === s ? PRIMARY : '#d1d5db', backgroundColor: availability === s ? `${PRIMARY}15` : 'white', color: availability === s ? PRIMARY : '#64748b' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleContinue}
                className="px-8 py-2.5 rounded-md text-white font-semibold text-sm"
                style={{ backgroundColor: PRIMARY }}>
                Continue
              </button>
            </>
          )}

          {/* Step 4: Photos, Videos & Voice-over */}
          {currentStep === 4 && (
            <Step4MediaUpload onBack={() => setCurrentStep(3)} onContinue={() => setCurrentStep(5)} />
          )}

          {/* Step 5 — Pricing & Others */}
          {currentStep === 5 && (
            <>
              <button onClick={() => setCurrentStep(4)} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Pricing & Others</h2>
              <p className="text-sm text-gray-500 mb-8">Step 5 of 5 — Almost done! Add pricing details</p>

              {/* Expected Price */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-800">Expected Price</h3>
                  <span className="text-red-500 text-sm font-bold">*</span>
                </div>
                {showStep5Errors && !expectedPrice && (
                  <p className="text-xs text-red-500 mb-3">Please enter the expected price</p>
                )}

                {/* Price input + unit toggle */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4 max-w-lg">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(e.target.value)}
                      placeholder="Enter price"
                      className="w-full pl-7 pr-3 py-3 rounded-md border text-sm text-slate-800 outline-none transition-colors bg-white"
                      style={{ borderColor: showStep5Errors && !expectedPrice ? '#ef4444' : expectedPrice ? PRIMARY : '#d1d5db', borderWidth: expectedPrice ? '2px' : '1px' }}
                    />
                  </div>
                  <select
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value as PriceUnit)}
                    className="px-3 py-3 rounded-md border text-sm text-slate-700 bg-white outline-none"
                    style={{ borderColor: '#d1d5db' }}
                  >
                    <option>Total Price</option>
                    <option>Per sq.ft.</option>
                    <option>Per sq.m.</option>
                    <option>Per sq.yd.</option>
                  </select>
                </div>

                {/* Price display in words */}
                {expectedPrice && Number(expectedPrice) > 0 && (
                  <p className="text-xs mb-4" style={{ color: PRIMARY }}>
                    ₹ {formatIndianPrice(Number(expectedPrice))}
                  </p>
                )}

                {/* Checkboxes */}
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: 'Price Negotiable', value: priceNegotiable, set: setPriceNegotiable },
                    { label: 'All inclusive price', value: allInclusive, set: setAllInclusive },
                    { label: 'Tax & Govt. charges excluded', value: taxExcluded, set: setTaxExcluded },
                  ].map(({ label, value, set }) => (
                    <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
                      <div
                        onClick={() => set(!value)}
                        className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{ borderColor: value ? PRIMARY : '#d1d5db', backgroundColor: value ? PRIMARY : 'white' }}
                      >
                        {value && (
                          <svg className="w-3 h-3" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Maintenance Charge */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-800">Maintenance Charge</h3>
                  <span className="text-sm text-gray-400 italic">(Optional)</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">Society maintenance charges paid by the buyer / tenant</p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={maintenanceCharge}
                      onChange={(e) => setMaintenanceCharge(e.target.value)}
                      placeholder="Amount"
                      className="w-full pl-7 pr-3 py-3 rounded-md border text-sm text-slate-800 outline-none bg-white transition-colors"
                      style={{ borderColor: maintenanceCharge ? PRIMARY : '#d1d5db', borderWidth: maintenanceCharge ? '2px' : '1px' }}
                    />
                  </div>
                  <div className="flex rounded-md border overflow-hidden" style={{ borderColor: '#d1d5db' }}>
                    {(['Monthly', 'Yearly'] as MaintenanceUnit[]).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setMaintenanceUnit(opt)}
                        className="px-4 py-2 text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: maintenanceUnit === opt ? PRIMARY : 'white',
                          color: maintenanceUnit === opt ? 'white' : '#64748b',
                          borderRight: opt === 'Monthly' ? '1px solid #d1d5db' : 'none',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Amount */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-800">Booking / Token Amount</h3>
                  <span className="text-sm text-gray-400 italic">(Optional)</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">Amount required to book this property</p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                      {bookingUnit === 'Percentage' ? '%' : '₹'}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={bookingAmount}
                      onChange={(e) => setBookingAmount(e.target.value)}
                      placeholder={bookingUnit === 'Percentage' ? 'e.g. 5' : 'Amount'}
                      className="w-full pl-7 pr-3 py-3 rounded-md border text-sm text-slate-800 outline-none bg-white transition-colors"
                      style={{ borderColor: bookingAmount ? PRIMARY : '#d1d5db', borderWidth: bookingAmount ? '2px' : '1px' }}
                    />
                  </div>
                  <div className="flex rounded-md border overflow-hidden" style={{ borderColor: '#d1d5db' }}>
                    {(['Fixed', 'Percentage'] as BookingUnit[]).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setBookingUnit(opt)}
                        className="px-4 py-2 text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: bookingUnit === opt ? PRIMARY : 'white',
                          color: bookingUnit === opt ? 'white' : '#64748b',
                          borderRight: opt === 'Fixed' ? '1px solid #d1d5db' : 'none',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={() => {
                  if (!expectedPrice) { setShowStep5Errors(true); return; }
                  alert('Property submitted successfully!');
                }}
                className="px-8 py-2.5 rounded-md text-white font-semibold text-sm transition-all"
                style={{ backgroundColor: PRIMARY }}
              >
                Submit Property
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer help */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        <div className="bg-gray-100 rounded-lg p-5 border border-gray-200 flex items-start gap-3">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-0.5">Need help?</p>
            <p className="text-xs text-gray-500">
              You can email us at{' '}
              <a href="mailto:info@neha.com" className="hover:underline" style={{ color: PRIMARY }}>info@neha.com</a>
              {' '}or call us at <span className="font-semibold text-gray-700">1800 41 99099</span> (IND Toll-Free)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
