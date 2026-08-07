'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const PRIMARY = '#1a2744';

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
  image: string;
  imageUrl: string;
  reraNumber: string;
  area: string;
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
    image: '',
    imageUrl: '',
    reraNumber: '',
    area: '',
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
        setFormData({
          name: data.name || data.title || data.projectName || '',
          location: data.location || data.address || data.city || '',
          price: data.price || data.priceRange || data.startingPrice || '',
          category: data.category || data.type || data.propertyType || 'Residential',
          status: data.status || 'Ready to move',
          developer: data.developer || data.builder || '',
          launchYear: data.launchYear || data.launchDate || data.LaunchDate || '',
          overview: data.overview || data.description || data.highlights || '',
          configurations: Array.isArray(data.configurations) ? data.configurations.join(', ') : (data.configurations || ''),
          amenities: Array.isArray(data.amenities) ? data.amenities.join(', ') : (data.amenities || ''),
          locationHighlights: Array.isArray(data.locationHighlights)
            ? data.locationHighlights.join('\n')
            : (data.locationAdvantages || data.locationHighlights || ''),
          image: data.image || data.imageUrl || data.heroImage || '',
          imageUrl: data.imageUrl || data.image || '',
          reraNumber: data.reraNumber || data.RERA || '',
          area: data.area || data.projectLandArea || '',
        });
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
      // Prepare update data - preserve arrays
      const updateData: Record<string, any> = {};

      if (formData.name) updateData.name = formData.name;
      if (formData.location) updateData.location = formData.location;
      if (formData.price) updateData.price = formData.price;
      if (formData.category) updateData.category = formData.category;
      if (formData.status) updateData.status = formData.status;
      if (formData.developer) updateData.developer = formData.developer;
      if (formData.launchYear) updateData.launchYear = formData.launchYear;
      if (formData.overview) updateData.overview = formData.overview;
      if (formData.reraNumber) updateData.reraNumber = formData.reraNumber;
      if (formData.area) updateData.area = formData.area;
      if (formData.image) {
        updateData.image = formData.image;
        updateData.imageUrl = formData.image;
      }

      // Convert comma-separated strings back to arrays
      if (formData.configurations) {
        updateData.configurations = formData.configurations
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (formData.amenities) {
        updateData.amenities = formData.amenities
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (formData.locationHighlights) {
        updateData.locationHighlights = formData.locationHighlights
          .split(/[,\n]/)
          .map((s) => s.trim())
          .filter(Boolean);
      }

      await updateDoc(doc(db, sourceCollection, propertyId), updateData);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving:', err);
      setError('Failed to save changes. Please try again.');
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

            {/* Section 2: Details */}
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
