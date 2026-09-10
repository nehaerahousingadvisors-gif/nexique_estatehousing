'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';

const PRIMARY = '#1a2744';

interface EditUnit {
  id: string;
  unitNo: string; floor: string; type: string; size: string;
  price: string; status: string; facing: string; remarks: string;
  overview: string; meetingRooms: string; cabins: string; maxSeats: string;
  imageUrls: string[];   // already-uploaded URLs from Firebase
  videoUrls: string[];
  imageFiles: File[];    // new files to upload
  videoFiles: File[];    // new video files to upload
}

interface PropertyForm {
  name: string;
  location: string;
  price: string;
  category: string;
  status: string;
  developer: string;
  launchYear: string;
  overview: string;
  configurations: string;
  amenities: string;
  locationHighlights: string;
  locationOverview: string;
  image: string;
  imageUrl: string;
  reraNumber: string;
  area: string;
  ownerName: string;
  ownerEmail: string;
  ownerContact: string;
  [key: string]: string;
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const propertyId = params?.id;

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [sourceCollection, setSourceCollection] = useState<string>('');

  // ── Units state ────────────────────────────────────────────────────────────
  const [units, setUnits] = useState<EditUnit[]>([]);

  const addUnit = () => setUnits(prev => [...prev, {
    id: Date.now().toString(),
    unitNo: '', floor: '', type: '', size: '', price: '',
    status: 'Available', facing: '', remarks: '', overview: '',
    meetingRooms: '', cabins: '', maxSeats: '', imageUrls: [], videoUrls: [], imageFiles: [], videoFiles: [],
  }]);
  const removeUnit = (id: string) => setUnits(prev => prev.filter(u => u.id !== id));
  const updateUnit = (id: string, field: keyof EditUnit, value: string) =>
    setUnits(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
  const addUnitImages = (id: string, files: File[]) =>
    setUnits(prev => prev.map(u => u.id === id ? { ...u, imageFiles: [...u.imageFiles, ...files] } : u));
  const removeUnitImageFile = (id: string, idx: number) =>
    setUnits(prev => prev.map(u => u.id === id ? { ...u, imageFiles: u.imageFiles.filter((_, i) => i !== idx) } : u));
  const removeUnitImageUrl = (id: string, idx: number) =>
    setUnits(prev => prev.map(u => u.id === id ? { ...u, imageUrls: u.imageUrls.filter((_, i) => i !== idx) } : u));

  const addUnitVideos = (id: string, files: File[]) =>
    setUnits(prev => prev.map(u => u.id === id ? { ...u, videoFiles: [...u.videoFiles, ...files] } : u));
  const removeUnitVideoFile = (id: string, idx: number) =>
    setUnits(prev => prev.map(u => u.id === id ? { ...u, videoFiles: u.videoFiles.filter((_, i) => i !== idx) } : u));
  const removeUnitVideoUrl = (id: string, idx: number) =>
    setUnits(prev => prev.map(u => u.id === id ? { ...u, videoUrls: u.videoUrls.filter((_, i) => i !== idx) } : u));

  const [formData, setFormData] = useState<PropertyForm>({
    name: '',
    location: '',
    price: '',
    category: 'Residential',
    status: 'Ready to move',
    developer: '',
    launchYear: '',
    overview: '',
    configurations: '',
    amenities: '',
    locationHighlights: '',
    locationOverview: '',
    image: '',
    imageUrl: '',
    reraNumber: '',
    area: '',
    ownerName: '',
    ownerEmail: '',
    ownerContact: '',
  });

  // Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) {
        router.push('/login');
      }
    });
    return () => unsub();
  }, [router]);

  // Fetch property data
  useEffect(() => {
    if (!user || !propertyId) return;

    const fetchProperty = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const collections = ['properties', 'project', 'projects'];
        let found = null;
        let colName = '';

        for (const col of collections) {
          try {
            const d = await getDoc(doc(db, col, propertyId));
            if (d.exists()) {
              found = { id: d.id, ...(d.data() as Record<string, any>) };
              colName = col;
              break;
            }
          } catch {
            // Collection may not exist
          }
        }

        if (!found) {
          setNotFound(true);
          return;
        }

        setSourceCollection(colName);

        // Populate form fields
        const data = found as any;

        // Helper: extract value from details array by label
        const fromDetails = (label: string): string => {
          if (!Array.isArray(data.details)) return '';
          const item = data.details.find(
            (d: any) => d.label?.toLowerCase() === label.toLowerCase()
          );
          return item?.value || '';
        };

        // Firebase se data aane ke baad console mein print karo — debugging ke liye
        console.log('Fetched property data:', JSON.stringify(data, null, 2));

        setFormData({
          // name: projectName pehle try karo, phir name, phir title
          name: data.projectName || data.name || data.title || '',
          location: data.projectLocation || data.location || data.address || fromDetails('location') || '',
          price: data.price || data.priceRange || data.startingPrice || '',
          category: data.category || data.propertyCategory || data.type || data.propertyType || 'Residential',
          status: data.status || data.availability || fromDetails('status') || 'Ready to move',
          developer: data.developerName || data.developer || data.builder || fromDetails('developer') || '',
          launchYear: data.launchYear || data.launchDate || data.LaunchDate || fromDetails('launch year') || '',
          overview: data.overview || data.propertyOverview || data.locationOverview || data.description || data.highlights || '',
          configurations: Array.isArray(data.configurations)
            ? data.configurations.join(', ')
            : (data.configurations || ''),
          amenities: Array.isArray(data.amenities)
            ? data.amenities.join(', ')
            : (data.amenities || ''),
          locationHighlights: Array.isArray(data.locationHighlights)
            ? data.locationHighlights.join('\n')
            : Array.isArray(data.connectivityHighlights)
            ? data.connectivityHighlights.join('\n')
            : (data.locationAdvantages || data.locationHighlights || ''),
          locationOverview: data.locationOverview || '',
          image: data.image || data.imageUrl || data.heroImage || (Array.isArray(data.photos) && data.photos[0]) || '',
          imageUrl: data.imageUrl || data.image || '',
          reraNumber: data.reraNumber || data.RERA || fromDetails('rera number') || '',
          area: data.landArea || data.area || data.projectLandArea || fromDetails('project land area') || '',
          ownerName: data.owner?.name || '',
          ownerEmail: data.owner?.email || '',
          ownerContact: data.owner?.contact || '',
        });

        // Load existing units
        if (Array.isArray(data.units)) {
          setUnits(data.units.map((u: any, i: number) => ({
            id: u.id || String(i),
            unitNo: u.unitNo || '', floor: u.floor || '', type: u.type || '',
            size: u.size || '', price: u.price || '', status: u.status || 'Available',
            facing: u.facing || '', remarks: u.remarks || '', overview: u.overview || '',
            meetingRooms: u.meetingRooms || '', cabins: u.cabins || '', maxSeats: u.maxSeats || '',
            imageUrls: Array.isArray(u.imageUrls) ? u.imageUrls : [],
            videoUrls: Array.isArray(u.videoUrls) ? u.videoUrls : [],
            imageFiles: [],
            videoFiles: [],
          })));
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError('Failed to load property. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [user, propertyId]);

  const updateField = (field: keyof PropertyForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !sourceCollection) return;

    setError('');
    setSaving(true);
    setSaveSuccess(false);

    try {
      // Convert comma-separated strings to arrays
      const configurationsArr = formData.configurations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const amenitiesArr = formData.amenities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const locationHighlightsArr = formData.locationHighlights
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

      // Build details array (same structure as post-property saves)
      const detailsArr = [
        { label: 'Developer', value: formData.developer },
        { label: 'Location', value: formData.location },
        { label: 'Project Land Area', value: formData.area },
        { label: 'RERA Number', value: formData.reraNumber },
        { label: 'Launch Year', value: formData.launchYear },
        { label: 'Status', value: formData.status },
      ].filter((d) => d.value && d.value.trim() !== '');

      const updateData: Record<string, any> = {
        // Both name AND projectName update karo (post-property dono use karta hai)
        name: formData.name,
        projectName: formData.name,
        location: formData.location,
        projectLocation: formData.location,
        price: formData.price,
        category: formData.category,
        propertyCategory: formData.category,
        status: formData.status,
        availability: formData.status,
        developer: formData.developer,
        developerName: formData.developer,
        launchYear: formData.launchYear,
        overview: formData.overview,
        propertyOverview: formData.overview,
        reraNumber: formData.reraNumber,
        area: formData.area,
        landArea: formData.area,
        image: formData.image,
        imageUrl: formData.image,
        heroImage: formData.image,
        configurations: configurationsArr,
        amenities: amenitiesArr,
        locationHighlights: locationHighlightsArr,
        connectivityHighlights: locationHighlightsArr,
        locationOverview: formData.locationOverview.trim(),
        details: detailsArr,
        // ── Units ──────────────────────────────────────────────────────────
        units: await Promise.all(units.map(async ({ id, imageFiles, videoFiles, ...rest }) => {
          const newImgUrls: string[] = [];
          const newVidUrls: string[] = [];
          for (const file of imageFiles) {
            try {
              const storageRef = ref(storage, `properties/${propertyId}/units/${id}/${Date.now()}_${file.name.replace(/\s+/g,'_')}`);
              await new Promise<void>((resolve, reject) => {
                const task = uploadBytesResumable(storageRef, file);
                task.on('state_changed', null, reject, async () => {
                  newImgUrls.push(await getDownloadURL(task.snapshot.ref));
                  resolve();
                });
              });
            } catch { /* skip failed */ }
          }
          for (const file of videoFiles) {
            try {
              const storageRef = ref(storage, `properties/${propertyId}/units/${id}/videos/${Date.now()}_${file.name.replace(/\s+/g,'_')}`);
              await new Promise<void>((resolve, reject) => {
                const task = uploadBytesResumable(storageRef, file);
                task.on('state_changed', null, reject, async () => {
                  newVidUrls.push(await getDownloadURL(task.snapshot.ref));
                  resolve();
                });
              });
            } catch { /* skip failed */ }
          }
          return {
            ...rest,
            price: rest.price && /^\d+$/.test(rest.price.replace(/,/g, ''))
              ? `₹${Number(rest.price.replace(/,/g, '')).toLocaleString('en-IN')} onwards`
              : rest.price,
            imageUrls: [...rest.imageUrls, ...newImgUrls],
            videoUrls: [...rest.videoUrls, ...newVidUrls],
          };
        })),
        totalUnits: units.length,
        availableUnits: units.filter(u => u.status === 'Available').length,
        hasUnits: units.length > 0,
        owner: {
          name: formData.ownerName,
          email: formData.ownerEmail,
          contact: formData.ownerContact,
        },
      };

      console.log('Saving to Firestore:', sourceCollection, propertyId, updateData);
      await updateDoc(doc(db, sourceCollection, propertyId), updateData);
      console.log('Saved successfully!');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving property:', err);
      const msg = err?.message || 'Failed to save changes.';
      const code = err?.code || '';
      if (code === 'permission-denied') {
        setError('❌ Firebase Permission Denied — Firebase Console → Firestore → Rules mein yeh set karo: allow read, write: if request.auth != null;');
      } else if (code === 'unauthenticated') {
        setError('❌ Not logged in — Please login again and retry.');
      } else {
        setError(`❌ Save failed (${code || 'unknown'}): ${msg}`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-800" />
        <p className="text-slate-600 font-medium">Loading property details...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 p-8 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
        >
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Property Not Found</h2>
        <p className="text-slate-600 max-w-md">
          The property you're trying to edit doesn't exist or has been removed.
        </p>
        <Link
          href="/my-properties"
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow-md"
          style={{ backgroundColor: PRIMARY }}
        >
          ← Back to My Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <section className="w-full py-10 md:py-14 relative overflow-hidden" style={{ backgroundColor: PRIMARY }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/my-properties"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Properties
          </Link>
          <p className="text-[#C4A35A] text-xs sm:text-sm uppercase tracking-widest mb-2">EDIT LISTING</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            {formData.name || 'Edit Property'}
          </h1>
          <p className="text-slate-200 max-w-2xl text-sm md:text-base">
            Update your property details below. All changes will be saved instantly.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="w-full py-10 md:py-14 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success / Error Alerts */}
          {saveSuccess && (
            <div
              className="mb-6 px-5 py-4 rounded-2xl text-sm font-medium text-green-800 flex items-center gap-3 shadow-sm"
              style={{ backgroundColor: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}
            >
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Property updated successfully! Changes are live now.
            </div>
          )}
          {error && (
            <div
              className="mb-6 px-5 py-4 rounded-2xl text-sm font-medium text-red-700 flex items-center gap-3 shadow-sm"
              style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Property Image Preview */}
            {formData.image && (
              <div className="mb-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Current Image Preview</h3>
                <div className="relative w-full max-w-md h-64 rounded-2xl overflow-hidden border border-slate-200">
                  <Image
                    src={formData.image}
                    alt={formData.name || 'Property'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            )}

            {/* Section 1: Basic Details */}
            <div className="bg-white rounded-3xl p-6 md:p-8 mb-6 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Basic Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Property Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="e.g. Godrej Riverine"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  />
                </div>
                {/* Developer */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Developer / Builder</label>
                  <input
                    type="text"
                    value={formData.developer}
                    onChange={(e) => updateField('developer', e.target.value)}
                    placeholder="e.g. Godrej Properties"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  />
                </div>
                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="e.g. Sector 44, Noida"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  />
                </div>
                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    placeholder="e.g. ₹1.2 Cr onwards or Price on Request"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  />
                </div>
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Luxury Residential">Luxury Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Plots">Plots</option>
                  </select>
                </div>
                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => updateField('status', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  >
                    <option value="Ready to move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Inventory Available">Inventory Available</option>
                    <option value="Ready to Register">Ready to Register</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
                {/* Launch Year */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Launch Year / Date</label>
                  <input
                    type="text"
                    value={formData.launchYear}
                    onChange={(e) => updateField('launchYear', e.target.value)}
                    placeholder="e.g. 2024 or 2030"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  />
                </div>
                {/* RERA Number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">RERA Number</label>
                  <input
                    type="text"
                    value={formData.reraNumber}
                    onChange={(e) => updateField('reraNumber', e.target.value)}
                    placeholder="e.g. UPRERAPRJ123456/2024"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  />
                </div>
                {/* Area / Land Area */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Project Land Area</label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => updateField('area', e.target.value)}
                    placeholder="e.g. 4acer or Approx. 5 Acres"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  />
                </div>
                {/* Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => updateField('image', e.target.value)}
                    placeholder="https://... (direct image link)"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Owner / Contact Info */}
            <div className="bg-white rounded-3xl p-6 md:p-8 mb-6 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Owner / Contact Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Owner Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Owner / Agent Name
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => updateField('ownerName', e.target.value)}
                    placeholder="e.g. nexiqueestate"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  />
                </div>
                {/* Owner Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => updateField('ownerEmail', e.target.value)}
                    placeholder="e.g. info@nexiqueestate.com"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  />
                </div>
                {/* Owner Contact */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.ownerContact}
                    onChange={(e) => updateField('ownerContact', e.target.value)}
                    placeholder="e.g. +91 96673 94175"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Details */}
            <div className="bg-white rounded-3xl p-6 md:p-8 mb-6 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Property Details</h2>
              <div className="space-y-5">
                {/* Overview */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Overview / Description / Highlights
                  </label>
                  <textarea
                    rows={5}
                    value={formData.overview}
                    onChange={(e) => updateField('overview', e.target.value)}
                    placeholder="Describe the property, its architecture, USPs, etc."
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white resize-none"
                  />
                </div>
                {/* Configurations */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Configurations (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.configurations}
                    onChange={(e) => updateField('configurations', e.target.value)}
                    placeholder="e.g. 2 BHK, 3 BHK, 4 BHK"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white"
                  />
                  <p className="text-xs text-slate-400 mt-1">Separate each with a comma</p>
                </div>
                {/* Amenities */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Amenities (comma-separated)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.amenities}
                    onChange={(e) => updateField('amenities', e.target.value)}
                    placeholder="e.g. Swimming Pool, Gym, Clubhouse, Kids Play Area, etc."
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white resize-none"
                  />
                </div>
                {/* Location Overview */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location & Connectivity Overview
                  </label>
                  <textarea
                    rows={4}
                    value={formData.locationOverview}
                    onChange={(e) => updateField('locationOverview', e.target.value)}
                    placeholder="e.g. Located in the heart of Noida's commercial hub with easy access to metro and expressway..."
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white resize-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">Ye text website pe "Location That Continues To Drive Demand" section mein dikhega</p>
                </div>
                {/* Location Highlights */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location Highlights / Advantages (one per line or comma-separated)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.locationHighlights}
                    onChange={(e) => updateField('locationHighlights', e.target.value)}
                    placeholder={
                      'Metro Station - 2 KM\nNear Schools & Hospitals\nHighway Access'
                    }
                    className="w-full px-4 py-3.5 rounded-2xl text-sm text-slate-800 outline-none border border-slate-200 focus:border-slate-500 transition-colors bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* ── Units / Inventory ─────────────────────────────────────── */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Units / Inventory</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Add or edit individual units of this project</p>
                  </div>
                  <button type="button" onClick={addUnit}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: PRIMARY }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Unit
                  </button>
                </div>
              </div>

              <div className="px-8 py-6 space-y-5">
                {units.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
                    <svg className="w-10 h-10 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
                    </svg>
                    <p className="text-sm text-slate-400">No units yet — click "Add Unit" to add</p>
                  </div>
                ) : (
                  units.map((unit, idx) => (
                    <div key={unit.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-slate-700 text-sm">Unit {idx + 1}</span>
                        <button type="button" onClick={() => removeUnit(unit.id)}
                          className="text-xs text-red-400 hover:text-red-600 font-semibold flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Remove
                        </button>
                      </div>

                      {/* Fields grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {([
                          { key: 'unitNo',       label: 'Unit No.',         ph: 'e.g. A-101' },
                          { key: 'floor',        label: 'Floor',            ph: 'e.g. 4th Floor' },
                          { key: 'type',         label: 'Type',             ph: 'e.g. Office Space' },
                          { key: 'size',         label: 'Size',             ph: 'e.g. 800 sq.ft.' },
                          { key: 'price',        label: 'Price',            ph: 'e.g. ₹50,000' },
                          { key: 'facing',       label: 'Facing',           ph: 'e.g. East' },
                          { key: 'meetingRooms', label: 'Meeting Rooms',    ph: 'e.g. 2' },
                          { key: 'cabins',       label: 'Cabins',           ph: 'e.g. 3' },
                          { key: 'maxSeats',     label: 'Max Seats',        ph: 'e.g. 50' },
                        ] as { key: keyof EditUnit; label: string; ph: string }[]).map(({ key, label, ph }) => (
                          <div key={key}>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
                            <input type="text" value={unit[key] as string}
                              onChange={e => updateUnit(unit.id, key, e.target.value)}
                              placeholder={ph}
                              className="w-full px-3 py-2 rounded-xl border text-sm text-slate-800 outline-none bg-white transition-colors"
                              style={{ borderColor: (unit[key] as string) ? PRIMARY : '#e2e8f0' }} />
                          </div>
                        ))}

                        {/* Status */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                          <select value={unit.status} onChange={e => updateUnit(unit.id, 'status', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border text-sm text-slate-800 outline-none bg-white"
                            style={{ borderColor: PRIMARY }}>
                            <option>Available</option>
                            <option>Booked</option>
                            <option>Sold</option>
                          </select>
                        </div>

                        {/* Remarks */}
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Remarks</label>
                          <input type="text" value={unit.remarks}
                            onChange={e => updateUnit(unit.id, 'remarks', e.target.value)}
                            placeholder="e.g. Corner unit, sea facing"
                            className="w-full px-3 py-2 rounded-xl border text-sm text-slate-800 outline-none bg-white transition-colors"
                            style={{ borderColor: unit.remarks ? PRIMARY : '#e2e8f0' }} />
                        </div>

                        {/* Overview */}
                        <div className="col-span-2 sm:col-span-3">
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Unit Overview</label>
                          <textarea rows={3} value={unit.overview}
                            onChange={e => updateUnit(unit.id, 'overview', e.target.value)}
                            placeholder="Describe this unit..."
                            className="w-full px-3 py-2 rounded-xl border text-sm text-slate-800 outline-none bg-white resize-none transition-colors"
                            style={{ borderColor: unit.overview ? PRIMARY : '#e2e8f0' }} />
                        </div>
                      </div>

                      {/* Images */}
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Unit Photos</label>

                        {/* Existing URLs */}
                        {unit.imageUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {unit.imageUrls.map((url, ii) => (
                              <div key={ii} className="relative group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt="" className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
                                <button type="button" onClick={() => removeUnitImageUrl(unit.id, ii)}
                                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* New file uploads */}
                        {unit.imageFiles.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {unit.imageFiles.map((f, ii) => (
                              <div key={ii} className="relative group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 object-cover rounded-xl border-2 border-dashed border-blue-300" />
                                <button type="button" onClick={() => removeUnitImageFile(unit.id, ii)}
                                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                                <span className="absolute bottom-0 left-0 right-0 text-center text-[8px] text-blue-600 bg-white/80 rounded-b-xl">new</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-xl cursor-pointer hover:bg-white transition-colors w-fit"
                          style={{ borderColor: '#e2e8f0' }}>
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-xs text-slate-500 font-medium">Add Photos</span>
                          <input type="file" accept="image/*" multiple className="hidden"
                            onChange={e => e.target.files && addUnitImages(unit.id, Array.from(e.target.files))} />
                        </label>
                      </div>

                      {/* Videos */}
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Unit Videos</label>

                        {/* Existing video URLs */}
                        {unit.videoUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {unit.videoUrls.map((url, ii) => (
                              <div key={ii} className="relative group flex items-center gap-1.5 bg-slate-100 rounded-xl px-3 py-2">
                                <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                                <span className="text-xs text-slate-600 max-w-[120px] truncate">Video {ii + 1}</span>
                                <button type="button" onClick={() => removeUnitVideoUrl(unit.id, ii)}
                                  className="text-red-400 hover:text-red-600 text-xs ml-1">✕</button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* New video files */}
                        {unit.videoFiles.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {unit.videoFiles.map((f, ii) => (
                              <div key={ii} className="relative flex items-center gap-1.5 bg-blue-50 border border-dashed border-blue-300 rounded-xl px-3 py-2">
                                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                                <span className="text-xs text-blue-600 max-w-[120px] truncate">{f.name}</span>
                                <span className="text-[8px] text-blue-400 bg-blue-100 px-1 rounded">new</span>
                                <button type="button" onClick={() => removeUnitVideoFile(unit.id, ii)}
                                  className="text-red-400 hover:text-red-600 text-xs ml-1">✕</button>
                              </div>
                            ))}
                          </div>
                        )}

                        <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-xl cursor-pointer hover:bg-white transition-colors w-fit"
                          style={{ borderColor: '#e2e8f0' }}>
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-slate-500 font-medium">Add Videos</span>
                          <input type="file" accept="video/*" multiple className="hidden"
                            onChange={e => e.target.files && addUnitVideos(unit.id, Array.from(e.target.files))} />
                        </label>
                      </div>
                    </div>
                  ))
                )}
                {units.length > 0 && (
                  <p className="text-xs text-slate-400 text-right">{units.length} unit{units.length > 1 ? 's' : ''}</p>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-8">
              <Link
                href="/my-properties"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-semibold text-slate-700 transition-all hover:bg-slate-100 border border-slate-200 text-center text-sm"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-md text-sm"
                style={{ backgroundColor: PRIMARY }}
              >
                {saving ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
