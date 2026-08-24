'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, User } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';

const ADMIN_EMAILS = [
  'info@nexiqueestate.com',
  'admin@nexiqueestate.com',
  'nehaerhousingadvisors@gmail.com',
];

const PRIMARY = '#1a2744';

const AMENITY_LIST = [
  'Clubhouse & Lounge', 'Swimming Pool', 'Landscaped Gardens', 'Modern Gym',
  'Indoor Games', 'Kids Play Area', '24x7 Security', 'Power Back-up',
  'Lift', 'Visitor Parking', 'Jogging Track', 'EV Charging',
  'CCTV', 'Intercom', 'Concierge', 'Sports Court',
];

export default function AddProjectPage() {
  const router = useRouter();
  const [user,        setUser]        = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin,     setIsAdmin]     = useState(false);

  // ── Form fields ──────────────────────────────────────────────────────────
  const [name,         setName]         = useState('');
  const [category,     setCategory]     = useState<'Residential' | 'Commercial' | 'Plots' | 'Luxury Residential'>('Residential');
  const [location,     setLocation]     = useState('');
  const [city,         setCity]         = useState('');
  const [developer,    setDeveloper]    = useState('');
  const [price,        setPrice]        = useState('');
  const [status,       setStatus]       = useState<'Ready to Move' | 'Under Construction' | 'New Launch'>('Ready to Move');
  const [reraNo,       setReraNo]       = useState('');
  const [landArea,     setLandArea]     = useState('');
  const [totalTowers,  setTotalTowers]  = useState('');
  const [totalRes,     setTotalRes]     = useState('');
  const [overview,     setOverview]     = useState('');
  const [configs,      setConfigs]      = useState<string[]>([]);
  const [amenities,    setAmenities]    = useState<string[]>([]);
  const [highlights,   setHighlights]   = useState(['', '', '']);

  // ── Photo upload ─────────────────────────────────────────────────────────
  const [photos,       setPhotos]       = useState<File[]>([]);
  const photoRef = useRef<HTMLInputElement>(null);

  // ── Submit state ─────────────────────────────────────────────────────────
  const [submitting,   setSubmitting]   = useState(false);
  const [progress,     setProgress]     = useState('');
  const [errors,       setErrors]       = useState<Record<string, string>>({});

  // ── Auth guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) { router.push('/login'); return; }
      setIsAdmin(ADMIN_EMAILS.map(e => e.toLowerCase()).includes(u.email?.toLowerCase() ?? ''));
    });
  }, [router]);

  // ── Photo helpers ────────────────────────────────────────────────────────
  const handlePhotoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPhotos(prev => [...prev, ...Array.from(e.target.files!)].slice(0, 20));
  };
  const removePhoto = (i: number) => setPhotos(p => p.filter((_, idx) => idx !== i));

  // ── Upload single file ───────────────────────────────────────────────────
  const uploadFile = (file: File, path: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const task = uploadBytesResumable(ref(storage, path), file);
      task.on('state_changed', null,
        reject,
        async () => { try { resolve(await getDownloadURL(task.snapshot.ref)); } catch(e) { reject(e); } }
      );
    });

  // ── Config toggle ────────────────────────────────────────────────────────
  const toggleConfig = (c: string) =>
    setConfigs(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const toggleAmenity = (a: string) =>
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    if (!name.trim())     errs.name     = 'Project name is required';
    if (!location.trim()) errs.location = 'Location is required';
    if (!price.trim())    errs.price    = 'Price is required';
    if (photos.length === 0) errs.photos = 'At least 1 photo is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    try {
      // Upload photos
      setProgress('Uploading photos…');
      const photoUrls: string[] = [];
      for (let i = 0; i < photos.length; i++) {
        setProgress(`Uploading photo ${i + 1} of ${photos.length}…`);
        const url = await uploadFile(photos[i], `admin-projects/${Date.now()}-photo${i}-${photos[i].name.replace(/\s+/g, '_')}`);
        photoUrls.push(url);
      }

      setProgress('Saving to database…');
      const priceNum = Number(price.replace(/[^0-9.]/g, ''));
      const priceStr = priceNum >= 10000000
        ? `₹${(priceNum / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr onwards`
        : priceNum >= 100000
        ? `₹${(priceNum / 100000).toFixed(2).replace(/\.?0+$/, '')} Lac onwards`
        : price;

      await addDoc(collection(db, 'properties'), {
        // Identification
        source:        'admin',
        // Display
        projectName:   name.trim(),
        name:          name.trim(),
        category,
        propertyCategory: category === 'Commercial' ? 'Commercial' : 'Residential',
        propertyType:  category,
        location:      location.trim(),
        projectLocation: location.trim(),
        city:          city.trim(),
        developer:     developer.trim(),
        developerName: developer.trim(),
        // Price
        expectedPrice: priceNum || '',
        price:         priceStr,
        // Status
        availability:  status,
        status,
        reraNumber:    reraNo.trim(),
        // Project details
        landArea:      landArea.trim(),
        totalTowers:   totalTowers.trim(),
        totalResidences: totalRes.trim(),
        overview:      overview.trim(),
        configurations: configs,
        amenities,
        locationHighlights: highlights.filter(h => h.trim()),
        connectivityHighlights: highlights.filter(h => h.trim()),
        // Media
        photos:        photoUrls,
        image:         photoUrls[0] ?? '',
        imageUrl:      photoUrls[0] ?? '',
        heroImage:     photoUrls[0] ?? '',
        amenitiesImage: photoUrls[photoUrls.length - 1] ?? photoUrls[0] ?? '',
        amenitiesCaption: 'Property Amenities',
        mediaGallery:  photoUrls.map((url, i) => ({ id: i + 1, type: 'image', url, caption: `Photo ${i + 1}` })),
        // Meta
        createdAt:     serverTimestamp(),
        updatedAt:     serverTimestamp(),
      });

      alert('✅ Project added successfully! It will now appear on the home page.');
      router.push('/admin');
    } catch (err: any) {
      console.error(err);
      alert('❌ Failed to save: ' + (err?.message ?? 'Unknown error'));
    } finally {
      setSubmitting(false);
      setProgress('');
    }
  };

  // ── Guards ───────────────────────────────────────────────────────────────
  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24" fill="none" style={{ color: PRIMARY }}>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500">Access denied.</p>
    </div>
  );

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-slate-400 hover:text-slate-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <span className="text-sm font-bold text-slate-800">Add Curated Project</span>
          </div>
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
            Will appear on Home Page
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">

          {/* ── Basic Info ─────────────────────────────────────────────── */}
          <section>
            <h2 className="text-base font-bold text-slate-700 mb-5 pb-2 border-b border-slate-100">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Project Name <span className="text-red-400">*</span>
                </label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Advant Navis Business Park"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 outline-none transition-colors"
                  style={{ borderColor: errors.name ? '#ef4444' : name ? PRIMARY : '#e2e8f0', borderWidth: name ? 2 : 1 }} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value as typeof category)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-700 bg-white outline-none"
                  style={{ borderColor: '#e2e8f0' }}>
                  {['Residential', 'Commercial', 'Plots', 'Luxury Residential'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as typeof status)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-700 bg-white outline-none"
                  style={{ borderColor: '#e2e8f0' }}>
                  {['Ready to Move', 'Under Construction', 'New Launch'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Location / Address <span className="text-red-400">*</span>
                </label>
                <input value={location} onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Sector 142, Noida Expressway"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 outline-none transition-colors"
                  style={{ borderColor: errors.location ? '#ef4444' : location ? PRIMARY : '#e2e8f0', borderWidth: location ? 2 : 1 }} />
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">City</label>
                <input value={city} onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Noida"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 outline-none transition-colors"
                  style={{ borderColor: city ? PRIMARY : '#e2e8f0', borderWidth: city ? 2 : 1 }} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Developer / Builder</label>
                <input value={developer} onChange={e => setDeveloper(e.target.value)}
                  placeholder="e.g. Advant India Ltd."
                  className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 outline-none transition-colors"
                  style={{ borderColor: developer ? PRIMARY : '#e2e8f0', borderWidth: developer ? 2 : 1 }} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Starting Price <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                  <input value={price} onChange={e => setPrice(e.target.value)}
                    placeholder="e.g. 5000000"
                    type="number"
                    className="w-full pl-7 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 outline-none transition-colors"
                    style={{ borderColor: errors.price ? '#ef4444' : price ? PRIMARY : '#e2e8f0', borderWidth: price ? 2 : 1 }} />
                </div>
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                {price && Number(price) > 0 && (
                  <p className="text-xs mt-1" style={{ color: PRIMARY }}>
                    {Number(price) >= 10000000
                      ? `₹${(Number(price) / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr`
                      : Number(price) >= 100000
                      ? `₹${(Number(price) / 100000).toFixed(2).replace(/\.?0+$/, '')} Lac`
                      : `₹${Number(price).toLocaleString('en-IN')}`}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">RERA Number</label>
                <input value={reraNo} onChange={e => setReraNo(e.target.value)}
                  placeholder="e.g. UPRERAPRJ123456/2024"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 outline-none"
                  style={{ borderColor: '#e2e8f0' }} />
              </div>
            </div>
          </section>

          {/* ── Project Details ──────────────────────────────────────── */}
          <section>
            <h2 className="text-base font-bold text-slate-700 mb-5 pb-2 border-b border-slate-100">Project Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {[
                { label: 'Land Area',       value: landArea,    set: setLandArea,    placeholder: 'e.g. 5 acres' },
                { label: 'Total Towers',    value: totalTowers, set: setTotalTowers, placeholder: 'e.g. 4 towers' },
                { label: 'Total Residences',value: totalRes,    set: setTotalRes,    placeholder: 'e.g. 500 units' },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 outline-none"
                    style={{ borderColor: '#e2e8f0' }} />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Overview / Description</label>
              <textarea value={overview} onChange={e => setOverview(e.target.value)}
                placeholder="Describe the project — key highlights, USPs, surroundings…"
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 outline-none resize-none"
                style={{ borderColor: overview ? PRIMARY : '#e2e8f0', borderWidth: overview ? 2 : 1 }} />
            </div>
          </section>

          {/* ── Configurations ──────────────────────────────────────── */}
          <section>
            <h2 className="text-base font-bold text-slate-700 mb-5 pb-2 border-b border-slate-100">Configurations</h2>
            <div className="flex flex-wrap gap-2">
              {['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Studio', 'Villa', 'Penthouse', 'Office', 'Retail', 'Plot'].map(c => (
                <button key={c} onClick={() => toggleConfig(c)}
                  className="px-4 py-1.5 rounded-full border text-xs font-semibold transition-all"
                  style={{
                    borderColor:     configs.includes(c) ? PRIMARY : '#e2e8f0',
                    backgroundColor: configs.includes(c) ? PRIMARY : 'white',
                    color:           configs.includes(c) ? '#fff'   : '#64748b',
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </section>

          {/* ── Amenities ────────────────────────────────────────────── */}
          <section>
            <h2 className="text-base font-bold text-slate-700 mb-5 pb-2 border-b border-slate-100">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITY_LIST.map(a => (
                <label key={a} className="flex items-center gap-2 cursor-pointer group">
                  <div onClick={() => toggleAmenity(a)}
                    className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ borderColor: amenities.includes(a) ? PRIMARY : '#d1d5db', backgroundColor: amenities.includes(a) ? PRIMARY : 'white' }}>
                    {amenities.includes(a) && (
                      <svg className="w-3 h-3" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-800">{a}</span>
                </label>
              ))}
            </div>
          </section>

          {/* ── Location Highlights ──────────────────────────────────── */}
          <section>
            <h2 className="text-base font-bold text-slate-700 mb-5 pb-2 border-b border-slate-100">Connectivity Highlights</h2>
            <div className="space-y-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-slate-300 text-sm">•</span>
                  <input value={h} onChange={e => { const u = [...highlights]; u[i] = e.target.value; setHighlights(u); }}
                    placeholder={`e.g. Metro Station – ${i === 0 ? '500m' : i === 1 ? '5 km' : '10 km'}`}
                    className="flex-1 px-4 py-2 rounded-xl border text-sm text-slate-800 outline-none"
                    style={{ borderColor: h ? PRIMARY : '#e2e8f0', borderWidth: h ? 2 : 1 }} />
                  {highlights.length > 1 && (
                    <button onClick={() => setHighlights(p => p.filter((_, idx) => idx !== i))}
                      className="text-slate-300 hover:text-red-400 transition-colors">✕</button>
                  )}
                </div>
              ))}
              <button onClick={() => setHighlights(p => [...p, ''])}
                className="text-xs font-semibold mt-1" style={{ color: PRIMARY }}>
                + Add more
              </button>
            </div>
          </section>

          {/* ── Photos ────────────────────────────────────────────────── */}
          <section>
            <h2 className="text-base font-bold text-slate-700 mb-1 pb-0 border-b-0">
              Photos <span className="text-red-400">*</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">First photo becomes the cover image. Max 20 photos.</p>
            {errors.photos && <p className="text-xs text-red-500 mb-3">{errors.photos}</p>}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
              {photos.map((f, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-50">
                  <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded-full">Cover</span>
                  )}
                  <button onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80">
                    ✕
                  </button>
                </div>
              ))}
              {photos.length < 20 && (
                <button onClick={() => photoRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 flex flex-col items-center justify-center gap-1 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke={PRIMARY} strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: PRIMARY }}>Add</span>
                </button>
              )}
            </div>
            <input ref={photoRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoPick} />
          </section>

          {/* ── Submit ──────────────────────────────────────────────── */}
          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold text-white transition-all disabled:opacity-70"
              style={{ background: PRIMARY }}
            >
              {submitting && (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {submitting ? (progress || 'Saving…') : 'Publish to Home Page'}
            </button>
            <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
              Cancel
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
