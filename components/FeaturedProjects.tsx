'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import ProjectDetail from './ProjectDetail';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type FProject = {
  id: number;
  firestoreId?: string;
  name: string;
  location: string;
  /** Raw location fields for filtering */
  city?: string;
  locality?: string;
  projectLocation?: string;
  /** "Sell" | "Rent / Lease" — from lookingTo field */
  purpose?: string;
  price: string;
  category: string;
  isExclusive: boolean;
  image: string;
  heroImage: string;
  status: string;
  launchYear: string;
  developer: string;
  reraNumber: string;
  overview: string;
  details: { label: string; value: string }[];
  amenitiesImage: string;
  amenitiesCaption: string;
  locationHighlights: string[];
  configurations: string[];
  amenities: string[];
  mediaGallery?: { id: number; type: 'image' | 'video'; url: string; thumbnail?: string; caption?: string }[];
};

const categories = ['All', 'Residential', 'Commercial', 'Plots'];

function toProject(docId: string, d: Record<string, any>, i: number): FProject {
  const photos: string[] = d.photos || [];
  const image = d.image || d.imageUrl || d.heroImage || photos[0]
    || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop';
  const heroImage = d.heroImage || photos[0] || image;
  let price = 'Price on Request';
  if (d.expectedPrice && Number(d.expectedPrice) > 0) {
    const a = Number(d.expectedPrice);
    price = a >= 10000000 ? `₹${(a / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr onwards`
      : a >= 100000 ? `₹${(a / 100000).toFixed(2).replace(/\.?0+$/, '')} Lac onwards`
      : `₹${a.toLocaleString('en-IN')} onwards`;
  } else if (d.price) price = d.price;
  // Determine category — check both propertyCategory AND propertyType to handle
  // all cases from the post-property form (Commercial checkbox + sub-type)
  const catRaw = d.propertyCategory || d.category || '';
  const typeRaw = (d.propertyType || d.selectedType || '').toLowerCase();
  const cat = catRaw === 'Commercial' || typeRaw === 'commercial'
      || ['office space', 'retail / shop', 'retail/shop', 'commercial land',
          'warehouse', 'industrial building', 'other'].some(t => typeRaw.includes(t.toLowerCase()))
    ? 'Commercial'
    : typeRaw.includes('plot')
    ? 'Plots'
    : catRaw || 'Residential';

  const locationStr = (d.projectLocation || d.location || `${d.locality || ''}, ${d.city || 'NCR'}`).replace(/^, |, $/, '');

  return {
    id: i, firestoreId: docId,
    name: d.projectName || d.name || `Property in ${d.city || 'NCR'}`,
    location: locationStr,
    city: d.city || '',
    locality: d.locality || '',
    projectLocation: d.projectLocation || '',
    purpose: d.lookingTo || '',
    price, category: cat, isExclusive: false, image, heroImage,
    status: d.availability || d.status || 'Ready to Move',
    launchYear: d.launchYear || String(new Date().getFullYear()),
    developer: d.developer || d.developerName || '',
    reraNumber: d.reraNumber || '',
    overview: d.overview || `A property in ${d.city || 'NCR'}.`,
    details: d.details?.length ? d.details : [
      { label: 'Inventory Type', value: d.inventoryType || '' },
      { label: 'Project', value: d.projectName || '' },
      { label: 'Developer', value: d.developer || '' },
      { label: 'Location', value: d.projectLocation || d.location || '' },
      { label: 'RERA Number', value: d.reraNumber || '' },
      { label: 'Status', value: d.availability || d.status || '' },
    ].filter(x => x.value),
    amenitiesImage: photos[photos.length - 1] || heroImage,
    amenitiesCaption: 'Property Amenities',
    locationHighlights: d.connectivityHighlights || d.locationHighlights || [],
    configurations: Array.isArray(d.configurations) ? d.configurations : d.bedrooms ? [`${d.bedrooms} BHK`] : [],
    amenities: Array.isArray(d.amenities) ? d.amenities : [],
    mediaGallery: d.mediaGallery?.length ? d.mediaGallery : [
      ...photos.map((url: string, j: number) => ({ id: j + 1, type: 'image' as const, url, caption: `Photo ${j + 1}` })),
      ...(Array.isArray(d.videos) ? d.videos : []).map((url: string, j: number) => ({ id: photos.length + j + 1, type: 'video' as const, url, caption: `Video ${j + 1}` })),
    ],
  };
}

const LOCS = ['Noida Expressway', 'Greater Noida', 'Central Noida', 'Yamuna Expressway'];

/* ─── CommercialFilterBar ──────────────────────────────────────────────────
   Row 1: PURPOSE buttons (Lease / Sale)
   Row 2: SELECT LOCATION grid — slides in when a purpose is chosen
──────────────────────────────────────────────────────────────────────────── */
function CommercialFilterBar({
  purpose, onPurpose,
  location, onLocation,
}: {
  purpose: 'Lease' | 'Sale' | null;
  onPurpose: (p: 'Lease' | 'Sale') => void;
  location: string | null;
  onLocation: (l: string) => void;
}) {
  return (
    <div style={{ padding: '4px 0 24px', animation: 'slideDown .18s ease' }}>

      {/* ── Row 1: PURPOSE ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 12, fontWeight: 700, color: '#94a3b8',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: 4,
        }}>
          Purpose:
        </span>

        {(['Lease', 'Sale'] as const).map(p => (
          <button
            key={p}
            onClick={() => onPurpose(p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 22px', borderRadius: 999,
              border: `2px solid ${purpose === p ? '#1a2744' : '#e2e8f0'}`,
              background: purpose === p ? '#1a2744' : '#fff',
              color: purpose === p ? '#fff' : '#1a2744',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              boxShadow: purpose === p ? '0 2px 8px rgba(26,39,68,0.18)' : 'none',
              transition: 'all .15s',
            }}
          >
            {p === 'Lease' ? (
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            ) : (
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
            )}
            {p}
          </button>
        ))}
      </div>

      {/* ── Row 2: SELECT LOCATION — only when a purpose is picked ── */}
      {purpose && (
        <div style={{ marginTop: 20, animation: 'slideDown .18s ease' }}>
          <p style={{
            margin: '0 0 12px', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b9bb4',
          }}>
            Select Location
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
          }}>
            {LOCS.map(l => (
              <button
                key={l}
                onClick={() => onLocation(l)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '14px 18px', borderRadius: 12, cursor: 'pointer',
                  border: `2px solid ${location === l ? '#1a2744' : '#e2e8f0'}`,
                  background: location === l ? '#eef1f8' : '#fff',
                  color: location === l ? '#1a2744' : '#334155',
                  fontWeight: 600, fontSize: 14,
                  transition: 'all .15s',
                  textAlign: 'left',
                }}
              >
                <svg
                  width="17" height="17" fill="none"
                  stroke={location === l ? '#1a2744' : '#94a3b8'}
                  strokeWidth="1.8" viewBox="0 0 24 24"
                  style={{ flexShrink: 0 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

interface FeaturedProjectsProps {
  /** Location string coming from ContinueBrowsing (e.g. "Greater Noida") */
  externalLocation?: string | null;
  /** Called when the user clears the location inside this component */
  onExternalLocationClear?: () => void;
}

/* ─── FeaturedProjects ─────────────────────────────────────────────────── */
export default function FeaturedProjects({
  externalLocation = null,
  onExternalLocationClear,
}: FeaturedProjectsProps) {
  const [selectedCategory,   setSelectedCategory]   = useState('All');
  const [selectedProject,    setSelectedProject]    = useState<FProject | null>(null);
  const [commercialPurpose,  setCommercialPurpose]  = useState<'Lease' | 'Sale' | null>(null);
  const [commercialLocation, setCommercialLocation] = useState<string | null>(null);
  const [projects,           setProjects]           = useState<FProject[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, 'properties')));
        const list = snap.docs
          .sort((a, b) => (b.data().createdAt?.toMillis?.() ?? 0) - (a.data().createdAt?.toMillis?.() ?? 0))
          .slice(0, 16)
          .map((d, i) => toProject(d.id, d.data() as Record<string, any>, 10000 + i));
        setProjects(list);
      } catch (e) { console.error('FeaturedProjects fetch:', e); }
    })();
  }, []);

  /**
   * Location keyword map — each button label maps to keywords that appear in
   * the city / locality / projectLocation / location fields saved to Firestore.
   */
  const LOC_KEYWORDS: Record<string, string[]> = {
    'Noida Expressway':   ['noida expressway', 'noida exp', 'sector 128', 'sector 132', 'sector 137', 'sector 143', 'sector 150'],
    'Greater Noida':      ['greater noida', 'greater noida west', 'gnida'],
    'Central Noida':      ['central noida', 'sector 18', 'sector 62', 'sector 63', 'sector 15', 'noida city centre'],
    'Yamuna Expressway':  ['yamuna expressway', 'yamuna exp', 'jewar', 'agra'],
  };

  /** Return true if a project's location fields match the selected button label */
  function matchesLocation(p: FProject, label: string): boolean {
    const haystack = [p.location, p.city, p.locality, p.projectLocation]
      .join(' ').toLowerCase();
    // 1. Direct label keyword match
    if (LOC_KEYWORDS[label]?.some(kw => haystack.includes(kw))) return true;
    // 2. Fallback: label words individually (e.g. "Greater Noida")
    return label.toLowerCase().split(' ').every(word => haystack.includes(word));
  }

  // The active location filter: externalLocation (from ContinueBrowsing) takes
  // priority; inside Commercial tab the commercialLocation pill can override it.
  const activeLocationFilter =
    selectedCategory === 'Commercial' && commercialLocation
      ? commercialLocation
      : externalLocation || null;

  const filtered = projects.filter(p => {
    // ── Category filter ──────────────────────────────────────────────────
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

    // ── Commercial sub-filters (only when Commercial tab is active) ──────
    if (selectedCategory === 'Commercial') {
      // Purpose filter: "Lease" button → match "Rent / Lease" or "Rent" or "Lease"
      //                 "Sale" button  → match "Sell" or "Sale"
      if (commercialPurpose) {
        const purposeLC = (p.purpose || '').toLowerCase();
        if (commercialPurpose === 'Lease' && !purposeLC.includes('rent') && !purposeLC.includes('lease')) return false;
        if (commercialPurpose === 'Sale'  && !purposeLC.includes('sell') && !purposeLC.includes('sale'))  return false;
      }
    }

    // ── Location filter — applies to ALL tabs ────────────────────────────
    if (activeLocationFilter && !matchesLocation(p, activeLocationFilter)) return false;

    return true;
  });
 
  /*
    KEY CHANGE: return a React fragment <>...</>
    CommercialModal is rendered AFTER </section>, as a sibling.
    This means it has NO parent with overflow:hidden, transform, or any
    stacking context that would break position:fixed.
  */
  return (
    <>
      <section id="featured-projects" className="w-full pt-4 pb-12 md:pt-6 md:pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-widest mb-1.5 md:mb-2" style={{ color: '#C4A35A' }}>
                CURATED PORTFOLIO
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">Featured Projects</h2>
              <p className="text-slate-600 mt-2 max-w-lg text-sm md:text-base">
                Hand-picked, RERA-approved residential &amp; commercial projects from India&apos;s most trusted developers.
              </p>
              {/* Active location pill — shown when an external location is active */}
              {externalLocation && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: '#eef1f8', color: '#1a2744', border: '1.5px solid #1a2744' }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {externalLocation}
                    <button
                      onClick={() => onExternalLocationClear?.()}
                      className="ml-1 hover:opacity-70 transition-opacity"
                      aria-label="Clear location filter"
                    >
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 mt-6 md:mt-0 bg-slate-100 p-1 rounded-full overflow-x-auto w-full sm:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (cat !== 'Commercial') {
                      setCommercialPurpose(null);
                      setCommercialLocation(null);
                    }
                  }}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Inline Lease / Sale filter — only when Commercial tab is active */}
          {selectedCategory === 'Commercial' && (
            <CommercialFilterBar
              purpose={commercialPurpose}
              onPurpose={p => { setCommercialPurpose(p); setCommercialLocation(null); }}
              location={commercialLocation}
              onLocation={setCommercialLocation}
            />
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
                <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-base font-semibold text-slate-500">No projects found</p>
                <p className="text-sm mt-1">
                  {activeLocationFilter
                    ? `No properties available in "${activeLocationFilter}" for the selected filters.`
                    : 'No properties match the selected filters.'}
                </p>
                {(activeLocationFilter || commercialPurpose) && (
                  <button
                    onClick={() => {
                      onExternalLocationClear?.();
                      setCommercialPurpose(null);
                      setCommercialLocation(null);
                    }}
                    className="mt-4 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                    style={{ background: '#1a2744', color: '#fff' }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              filtered.map(project => (
              <div
                key={project.id}
                className="group relative bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative h-52 sm:h-64">
                  <Image
                    src={project.image} alt={project.name} fill
                    sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {project.isExclusive && (
                    <div className="absolute top-3 -left-7 transform -rotate-45 text-white font-bold uppercase tracking-wider"
                      style={{ backgroundColor: '#C4A35A', padding: '3px 40px', fontSize: 10 }}>
                      Exclusive
                    </div>
                  )}
                  {project.category === 'Commercial' ? (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 font-semibold px-3 py-1 rounded-full text-xs shadow">
                      Commercial
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 font-medium px-2.5 py-1 rounded-full text-xs">
                      {project.category}
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">{project.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 mb-3">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate text-sm">{project.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">Starting at</p>
                      <p className="text-sm md:text-base font-bold text-slate-900">{project.price}</p>
                    </div>
                    <a
                      href={`https://wa.me/919667394175?text=${encodeURIComponent(`Hi, I'm interested in ${project.name} at ${project.location}. Please share more details.`)}`}
                      target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: '#25D366' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1ebe5d')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#25D366')}
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.476-.884-.785-1.48-1.75-1.653-2.047-.173-.298-.018-.46.13-.608.135-.135.298-.347.446-.52.149-.173.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.488-.5-.67-.51-.172-.01-.371-.015-.57-.015-.198 0-.52.074-.792.371-.27.296-1.029 1.008-1.029 2.455 0 1.447 1.054 2.848 1.2 3.045.149.198 2.096 3.2 5.077 4.487.712.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.041-1.37l-.36-.213-3.641.96 1.01-3.549-.235-.374a9.86 9.86 0 01-1.54-5.215c-.024-5.45 4.44-9.885 9.901-9.885 2.64 0 5.122 1.03 6.982 2.892a9.825 9.825 0 012.88 6.978c0 5.459-4.44 9.89-9.883 9.89z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>

          {/* ── Show More button ── */}
          <div className="flex justify-center mt-10 md:mt-12">
            <a
              href="/projects"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-lg active:scale-95"
              style={{ background: '#1a2744', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#2d3f6e')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1a2744')}
            >
              Show More Properties
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {selectedProject && <ProjectDetail project={selectedProject as any} onClose={() => setSelectedProject(null)} />}
    </>
  );
}
