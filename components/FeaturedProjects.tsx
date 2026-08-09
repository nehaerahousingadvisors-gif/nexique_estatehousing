'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import ProjectDetail from './ProjectDetail';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Static dummy data - replace with dynamic data later
const projects = [
  {
    id: 1,
    name: 'Vaastu Homes',
    location: 'Siddharth Vihar, Ghaziabad',
    price: 'Price on Request',
    category: 'Residential',
    isExclusive: true,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop',
    status: 'Inventory Available',
    launchYear: '2024',
    developer: 'Vaastu Builders',
    reraNumber: 'UPRERAPRJ123456/2024',
    overview: 'An exclusive luxury residence is currently available in Vaastu Homes, Siddharth Vihar, Ghaziabad. Positioned within one of the city\'s most prestigious residential developments, this premium inventory offers elevated views, enhanced privacy, exceptional natural light and access to world-class amenities.',
    details: [
      { label: 'Inventory Type', value: 'Exclusive Available Residence' },
      { label: 'Project', value: 'Vaastu Homes' },
      { label: 'Developer', value: 'Vaastu Builders' },
      { label: 'Location', value: 'Siddharth Vihar, Ghaziabad' },
      { label: 'Project Land Area', value: 'Approx. 5 Acres' },
      { label: 'Total Towers', value: '3 Towers' },
      { label: 'Total Residences', value: '250 Residences' },
      { label: 'RERA Number', value: 'UPRERAPRJ123456/2024' },
      { label: 'Status', value: 'Inventory Available' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Swimming Pool at Vaastu Homes',
    locationHighlights: [
      'Vaishali Metro Station - 2 KM',
      'Ghaziabad Railway Station - 5 KM',
      'Delhi-Meerut Expressway - 3 KM',
      'Major Schools & Hospitals nearby',
    ],
    configurations: ['2 BHK', '3 BHK', '4 BHK'],
    amenities: ['Clubhouse & lounge', 'Swimming pool', 'Landscaped gardens', 'Modern gym', 'Indoor games', 'Kids play area', '24x7 security', 'Power back-up'],
  },
  {
    id: 2,
    name: 'Godrej Nest',
    location: 'Sector 150, Noida',
    price: '₹1.2 Cr onwards',
    category: 'Residential',
    isExclusive: true,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2000&auto=format&fit=crop',
    status: 'Under Construction',
    launchYear: '2023',
    developer: 'Godrej Properties',
    reraNumber: 'UPRERAPRJ789012/2023',
    overview: 'Godrej Nest in Sector 150 Noida offers premium residential apartments with modern amenities and green surroundings. Perfect for families looking for a serene living experience close to nature.',
    details: [
      { label: 'Inventory Type', value: 'Premium Residences' },
      { label: 'Project', value: 'Godrej Nest' },
      { label: 'Developer', value: 'Godrej Properties' },
      { label: 'Location', value: 'Sector 150, Noida' },
      { label: 'Project Land Area', value: 'Approx. 10 Acres' },
      { label: 'Total Towers', value: '5 Towers' },
      { label: 'Total Residences', value: '400 Residences' },
      { label: 'RERA Number', value: 'UPRERAPRJ789012/2023' },
      { label: 'Status', value: 'Under Construction' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Clubhouse at Godrej Nest',
    locationHighlights: [
      'Noida Sector 148 Metro Station - 2.5 KM',
      'Yamuna Expressway - 1 KM',
      'FNG Expressway - 3 KM',
      'World-class schools nearby',
    ],
    configurations: ['2 BHK', '3 BHK', '4 BHK'],
    amenities: ['Clubhouse & lounge', 'Swimming pool', 'Landscaped gardens', 'Modern gym', 'Indoor games', 'Kids play area', '24x7 security', 'Power back-up'],
  },
  {
    id: 3,
    name: 'Godrej Riverine - Tower 1',
    location: 'Sector 44 Noida',
    price: 'Price On Request',
    category: 'Luxury Residential',
    isExclusive: true,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
    status: 'Inventory Available',
    launchYear: '2024',
    developer: 'Godrej Properties',
    reraNumber: 'UPRERAPRJ763929/11/2024',
    overview: 'An exclusive luxury residence is currently available on the 11th Floor of Tower 1 at Godrej Riverine, Sector 44 Noida. Positioned within one of the city\'s most prestigious residential developments, this premium inventory offers elevated views, enhanced privacy, exceptional natural light and access to world-class amenities.',
    details: [
      { label: 'Inventory Type', value: 'Exclusive Available Residence' },
      { label: 'Project', value: 'Godrej Riverine' },
      { label: 'Developer', value: 'Godrej Properties' },
      { label: 'Location', value: 'Sector 44, Noida' },
      { label: 'Tower', value: 'Tower 1' },
      { label: 'Floor', value: '11th Floor' },
      { label: 'Inventory Area', value: '2616 Sq. ft.' },
      { label: 'Project Land Area', value: 'Approx. 6.5 Acres' },
      { label: 'Total Towers', value: '4 Towers' },
      { label: 'Total Residences', value: '416 Residences' },
      { label: 'Clubhouse', value: 'Club Atlantis - 45,000 Sq. Ft.' },
      { label: 'RERA Number', value: 'UPRERAPRJ763929/11/2024' },
      { label: 'Status', value: 'Inventory Available' },
    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Badminton Court at Godrej Riverine Sector 44 Noida',
    locationHighlights: [
      'Botanical Garden Metro Station - 1.4 KM',
      'Noida Golf Course - 1.5 KM',
      'DND Flyway - 1.9 KM',
      'Sector 18 Market - 3.3 KM',
      'Amity University - 3.6 KM',
    ],
    configurations: ['3 BHK', '4 BHK', '5 BHK', '6 BHK'],
    amenities: ['Clubhouse & lounge', 'Swimming pool', 'Landscaped gardens', 'Modern gym', 'Indoor games', 'Kids play area', '24x7 security', 'Power back-up', 'Badminton court', 'Tennis court', 'Spa & wellness'],
  },
  {
    id: 4,
    name: 'Jacob & Co',
    location: 'Sector 97, Noida',
    price: '₹7.70 Cr onwards',
    category: 'Residential',
    isExclusive: true,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2000&auto=format&fit=crop',
    status: 'Ready to Move',
    launchYear: '2022',
    developer: 'Jacob & Co Realty',
    reraNumber: 'UPRERAPRJ345678/2022',
    overview: 'Jacob & Co in Sector 97 Noida offers ultra-luxury residences with world-class amenities and prime location. Perfect for those seeking the epitome of luxury living in Noida.',
    details: [
      { label: 'Inventory Type', value: 'Ultra-Luxury Residences' },
      { label: 'Project', value: 'Jacob & Co' },
      { label: 'Developer', value: 'Jacob & Co Realty' },
      { label: 'Location', value: 'Sector 97, Noida' },
      { label: 'Project Land Area', value: 'Approx. 12 Acres' },
      { label: 'Total Towers', value: '2 Towers' },
      { label: 'Total Residences', value: '150 Residences' },
      { label: 'RERA Number', value: 'UPRERAPRJ345678/2022' },
      { label: 'Status', value: 'Ready to Move' },

    ],
    amenitiesImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop',
    amenitiesCaption: 'Luxury Spa at Jacob & Co',
    locationHighlights: [
      'Noida Sector 101 Metro Station - 1.8 KM',
      'Delhi-Meerut Expressway - 2.5 KM',
      'FNG Expressway - 4 KM',
      'Premium malls nearby',
    ],
    configurations: ['4 BHK', '5 BHK', '6 BHK', '7 BHK'],
    amenities: ['Clubhouse & lounge', 'Swimming pool', 'Landscaped gardens', 'Modern gym', 'Indoor games', 'Kids play area', '24x7 security', 'Power back-up', 'Spa & wellness', 'Private theatre', 'Rooftop restaurant'],
  },
];

const categories = ['All', 'Residential', 'Commercial', 'Plots'];

type FProject = typeof projects[0] & {
  firestoreId?: string;
  mediaGallery?: { id: number; type: 'image' | 'video'; url: string; thumbnail?: string; caption?: string }[];
};

function firestoreDocToFProject(docId: string, data: Record<string, any>, startId: number): FProject {
  const photos: string[] = data.photos || [];
  const image = data.image || data.imageUrl || data.heroImage || photos[0]
    || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop';
  const heroImage = data.heroImage || photos[0] || image;

  let price = 'Price on Request';
  if (data.expectedPrice && Number(data.expectedPrice) > 0) {
    const amt = Number(data.expectedPrice);
    price = amt >= 10000000
      ? `₹${(amt / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr onwards`
      : amt >= 100000
        ? `₹${(amt / 100000).toFixed(2).replace(/\.?0+$/, '')} Lac onwards`
        : `₹${amt.toLocaleString('en-IN')} onwards`;
  } else if (data.price) {
    price = data.price;
  }

  const cat = data.propertyCategory === 'Commercial' ? 'Commercial'
    : data.propertyType?.toLowerCase().includes('plot') ? 'Plots'
    : data.category || 'Residential';

  return {
    id: startId,
    firestoreId: docId,
    name: data.projectName || data.name || `${data.propertyType || 'Property'} in ${data.city || 'NCR'}`,
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
      { label: 'Inventory Type', value: data.inventoryType || '' },
      { label: 'Project', value: data.projectName || '' },
      { label: 'Developer', value: data.developer || '' },
      { label: 'Location', value: data.projectLocation || data.location || '' },
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

export default function FeaturedProjects() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<FProject | null>(null);
  const [firestoreProjects, setFirestoreProjects] = useState<FProject[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'properties'));
        const snapshot = await getDocs(q);
        const fetched: FProject[] = snapshot.docs
          .sort((a, b) => {
            const aTime = a.data().createdAt?.toMillis?.() ?? 0;
            const bTime = b.data().createdAt?.toMillis?.() ?? 0;
            return bTime - aTime;
          })
          .slice(0, 8)
          .map((doc, i) =>
            firestoreDocToFProject(doc.id, doc.data() as Record<string, any>, 10000 + i)
          );
        setFirestoreProjects(fetched);
      } catch (err) {
        console.error('FeaturedProjects: Firestore fetch failed:', err);
      }
    };
    fetchProjects();
  }, []);

  // Firestore projects first, then hardcoded
  const allProjects: FProject[] = [...firestoreProjects, ...projects];

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'All'
    ? allProjects
    : allProjects.filter(project => project.category === selectedCategory);

  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-widest mb-1.5 md:mb-2" style={{ color: '#C4A35A' }}>CURATED PORTFOLIO</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">Featured Projects</h2>
            <p className="text-slate-600 mt-2 max-w-lg text-sm md:text-base">
              Hand-picked, RERA-approved residential & commercial projects from India's most trusted developers.
            </p>
          </div>
          
          {/* Categories */}
          <div className="flex items-center gap-1.5 md:gap-2 mt-6 md:mt-0 bg-slate-100 p-1 rounded-full overflow-x-auto w-full sm:w-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
              </div>

              {/* Content */}
              <div className="p-4 md:p-5">
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">{project.name}</h3>
                <div className="flex items-center gap-1 text-slate-500 mb-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate text-sm">{project.location}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-wider text-slate-400">Starting at</p>
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
                    <svg className="w-5 h-5 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.476-.884-.785-1.48-1.75-1.653-2.047-.173-.298-.018-.46.13-.608.135-.135.298-.347.446-.52.149-.173.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.488-.5-.67-.51-.172-.01-.371-.015-.57-.015-.198 0-.52.074-.792.371-.27.296-1.029 1.008-1.029 2.455 0 1.447 1.054 2.848 1.2 3.045.149.198 2.096 3.2 5.077 4.487.712.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.041-1.37l-.36-.213-3.641.96 1.01-3.549-.235-.374a9.86 9.86 0 01-1.54-5.215c-.024-5.45 4.44-9.885 9.901-9.885 2.64 0 5.122 1.03 6.982 2.892a9.825 9.825 0 012.88 6.978c0 5.459-4.44 9.89-9.883 9.89z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetail 
          project={selectedProject as any}
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  );
}

