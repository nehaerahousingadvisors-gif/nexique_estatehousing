'use client';

import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectDetail from '@/components/ProjectDetail';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type MediaItem = {
  id: number;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
};

type Project = {
  id: number;
  firestoreId?: string;
  name: string;
  location: string;
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
  mediaGallery?: MediaItem[];
};

const categories = ['All', 'Residential', 'Commercial', 'Plots', 'Luxury Residential'];

// ── Helper: map a Firestore doc to the Project shape ─────────────────────────
function firestoreDocToProject(docId: string, data: Record<string, any>, startId: number): Project {
  const photos: string[] = data.photos || [];
  const image = data.image || data.imageUrl || data.heroImage || photos[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop';
  const heroImage = data.heroImage || data.imageUrl || photos[0] || image;

  // Build price string
  let price = 'Price on Request';
  if (data.expectedPrice && Number(data.expectedPrice) > 0) {
    const amt = Number(data.expectedPrice);
    const formatted = amt >= 10000000
      ? `₹${(amt / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr onwards`
      : amt >= 100000
        ? `₹${(amt / 100000).toFixed(2).replace(/\.?0+$/, '')} Lac onwards`
        : `₹${amt.toLocaleString('en-IN')} onwards`;
    price = formatted;
  } else if (data.price) {
    price = data.price;
  }

  // Determine category
  const cat = data.propertyCategory === 'Commercial' ? 'Commercial'
    : data.propertyType?.toLowerCase().includes('plot') ? 'Plots'
    : data.category || 'Residential';

  return {
    id: startId,
    firestoreId: docId,
    name: data.projectName || data.name || `${data.propertyType || 'Property'} in ${data.locality || data.city || 'NCR'}`,
    location: data.projectLocation || data.location || `${data.locality || ''}, ${data.city || 'NCR'}`.replace(/^, |, $/, ''),
    price,
    category: cat,
    isExclusive: false,
    image,
    heroImage,
    status: data.availability || data.status || 'Ready to Move',
    launchYear: data.launchYear || new Date().getFullYear().toString(),
    developer: data.developer || data.developerName || '',
    reraNumber: data.reraNumber || '',
    overview: data.overview || `A ${data.propertyType || 'property'} in ${data.city || 'NCR'}.`,
    details: data.details?.length ? data.details : [
      { label: 'Inventory Type', value: data.inventoryType || data.propertyType || '' },
      { label: 'Project', value: data.projectName || '' },
      { label: 'Developer', value: data.developer || '' },
      { label: 'Location', value: data.projectLocation || data.location || '' },
      { label: 'Project Land Area', value: data.landArea || '' },
      { label: 'Total Towers', value: data.totalTowers || '' },
      { label: 'Total Residences', value: data.totalResidences || '' },
      { label: 'RERA Number', value: data.reraNumber || '' },
      { label: 'Status', value: data.availability || data.status || '' },
    ].filter(d => d.value),
    amenitiesImage: photos[photos.length - 1] || heroImage,
    amenitiesCaption: 'Property Amenities',
    locationHighlights: data.connectivityHighlights || data.locationHighlights || [],
    configurations: Array.isArray(data.configurations) ? data.configurations : (data.bedrooms ? [`${data.bedrooms} BHK`] : []),
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    mediaGallery: data.mediaGallery?.length ? data.mediaGallery : [
      ...photos.map((url: string, i: number) => ({
        id: i + 1, type: 'image' as const, url, caption: `Photo ${i + 1}`,
      })),
      ...(Array.isArray(data.videos) ? data.videos : []).map((url: string, i: number) => ({
        id: photos.length + i + 1, type: 'video' as const, url, caption: `Video ${i + 1}`,
      })),
    ],
  };
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <svg className="animate-spin w-10 h-10" viewBox="0 0 24 24" fill="none" style={{ color: '#1a2744' }}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [firestoreProjects, setFirestoreProjects] = useState<Project[]>([]);
  const [loadingFirestore, setLoadingFirestore] = useState(true);

  // Fetch from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'properties'));
        const snapshot = await getDocs(q);
        const fetched: Project[] = snapshot.docs
          .sort((a, b) => {
            const aTime = a.data().createdAt?.toMillis?.() ?? 0;
            const bTime = b.data().createdAt?.toMillis?.() ?? 0;
            return bTime - aTime;
          })
          .map((doc, i) =>
            firestoreDocToProject(doc.id, doc.data() as Record<string, any>, 10000 + i)
          );
        setFirestoreProjects(fetched);
      } catch (err) {
        console.error('Failed to fetch from Firestore:', err);
      } finally {
        setLoadingFirestore(false);
      }
    };
    fetchProjects();
  }, []);

  // Only Firestore projects
  const allProjects = firestoreProjects;

  // Apply search filters from URL params
  useEffect(() => {
    const urlCategory = searchParams.get('type');
    if (urlCategory) {
      if (categories.includes(urlCategory)) {
        setSelectedCategory(urlCategory);
      } else if (urlCategory.toLowerCase().includes('residential')) {
        setSelectedCategory('Residential');
      } else if (urlCategory.toLowerCase().includes('commercial')) {
        setSelectedCategory('Commercial');
      }
    }
  }, [searchParams]);

  // Filter projects based on selected category and search params
  const filteredProjects = allProjects.filter(project => {
    // Category filter
    if (selectedCategory !== 'All' && project.category !== selectedCategory) {
      return false;
    }

    // Search query (q param) - search in name, location, developer
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        project.name.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query) ||
        project.developer.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Location filter
    const locationParam = searchParams.get('location');
    if (locationParam) {
      if (!project.location.toLowerCase().includes(locationParam.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 relative overflow-hidden" style={{ backgroundColor: '#1a2744' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: '#243156' }}></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#243156' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-[#C4A35A] text-[10px] sm:text-xs uppercase tracking-widest mb-1.5 md:mb-2">OUR PORTFOLIO</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl md:text-5xl font-bold text-white mb-2 md:mb-3">
            Premium Real Estate Projects
          </h1>
          <p className="text-slate-200 max-w-2xl text-sm md:text-base">
            Explore our curated selection of RERA-approved residential, commercial, and plot projects across Delhi NCR.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="w-full py-12 md:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          <div className="flex items-center gap-1.5 md:gap-2 mb-8 md:mb-12 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-2 md:px-5 md:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'text-white shadow-md'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
                style={selectedCategory === category ? { backgroundColor: '#1a2744' } : {}}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
            {loadingFirestore && firestoreProjects.length === 0 && (
              <div className="col-span-full flex justify-center items-center py-12">
                <svg className="animate-spin w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none" style={{ color: '#1a2744' }}>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-slate-500 text-sm">Loading projects...</span>
              </div>
            )}
            {filteredProjects.map(project => (
              <div 
                key={project.id} 
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProject(project)} 
              >
                {/* Image */}
                <div className="relative h-52 sm:h-64 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Exclusive Badge */}
                  {project.isExclusive && (
                    <div className="absolute top-3 -left-7 transform -rotate-45 text-white font-bold uppercase tracking-wider" style={{ backgroundColor: '#C4A35A', padding: '3px 40px', fontSize: '10px' }}>
                      Exclusive
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 font-medium px-2.5 py-1 rounded-full text-xs">
                    {project.category}
                  </div>
                  {/* Status Badge */}
                  <div className="absolute bottom-3 left-3 backdrop-blur-sm text-white font-medium px-2.5 py-1 rounded-full text-[10px]" style={{ backgroundColor: 'rgba(26,39,68,0.9)' }}>
                    {project.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-5">
                  <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 transition-colors" style={{}} onMouseEnter={e => (e.currentTarget.style.color = '#1a2744')} onMouseLeave={e => (e.currentTarget.style.color = '')}>{project.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 mb-1.5 md:mb-2">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate text-xs sm:text-sm">{project.location}</span>
                  </div>
                  <p className="text-slate-500 text-[10px] sm:text-xs mb-2.5 md:mb-3">by {project.developer}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400">Starting at</p>
                      <p className="text-sm md:text-base font-bold text-slate-900">{project.price}</p>
                    </div>
                    <a
                      href={`https://wa.me/919667394175?text=${encodeURIComponent(`Hi, I'm interested in ${project.name} at ${project.location}. Please share more details.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-colors"
                      style={{ backgroundColor: '#25D366' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1ebe5d')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#25D366')}
                      title="Chat on WhatsApp"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.476-.884-.785-1.48-1.75-1.653-2.047-.173-.298-.018-.46.13-.608.135-.135.298-.347.446-.52.149-.173.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.488-.5-.67-.51-.172-.01-.371-.015-.57-.015-.198 0-.52.074-.792.371-.27.296-1.029 1.008-1.029 2.455 0 1.447 1.054 2.848 1.2 3.045.149.198 2.096 3.2 5.077 4.487.712.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.041-1.37l-.36-.213-3.641.96 1.01-3.549-.235-.374a9.86 9.86 0 01-1.54-5.215c-.024-5.45 4.44-9.885 9.901-9.885 2.64 0 5.122 1.03 6.982 2.892a9.825 9.825 0 012.88 6.978c0 5.459-4.44 9.89-9.883 9.89z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12 md:py-20">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">No projects found</h3>
              <p className="text-slate-600 text-sm md:text-base">Please try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetail 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
}