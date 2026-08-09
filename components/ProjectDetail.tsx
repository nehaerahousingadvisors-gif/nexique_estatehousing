'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MediaItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
}

interface Project {
  id: number;
  name: string;
  location: string;
  price: string;
  category: string;
  isExclusive: boolean;
  image: string;
  heroImage: string;
  mediaGallery?: MediaItem[];
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
}

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Use mediaGallery if available, otherwise fall back to heroImage and amenitiesImage
  const mediaGallery = project.mediaGallery && project.mediaGallery.length > 0 
    ? project.mediaGallery 
    : [
        { id: 1, type: 'image' as const, url: project.heroImage },
        { id: 2, type: 'image' as const, url: project.amenitiesImage }
      ];

  // Close modal when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, isFullscreen]);

  // Navigate to previous media
  const goToPrevMedia = () => {
    setSelectedMediaIndex(prev => (prev === 0 ? mediaGallery.length - 1 : prev - 1));
  };

  // Navigate to next media
  const goToNextMedia = () => {
    setSelectedMediaIndex(prev => (prev === mediaGallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Fullscreen Media Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFullscreen(false);
          }}
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          {mediaGallery.length > 1 && (
            <button 
              onClick={goToPrevMedia}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {mediaGallery.length > 1 && (
            <button 
              onClick={goToNextMedia}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Media Display */}
          <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
            {mediaGallery[selectedMediaIndex]?.type === 'image' ? (
              <Image 
                src={mediaGallery[selectedMediaIndex]?.url} 
                alt={mediaGallery[selectedMediaIndex]?.caption || project.name}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            ) : (
              <video
                src={mediaGallery[selectedMediaIndex]?.url}
                className="w-full h-full object-contain"
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            )}
          </div>

          {/* Caption */}
          {mediaGallery[selectedMediaIndex]?.caption && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full">
              <p className="text-white font-medium">{mediaGallery[selectedMediaIndex].caption}</p>
            </div>
          )}
        </div>
      )}

      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto relative shadow-2xl">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Hero Section */}
          <div className="relative">
            {/* Main Media Display with Fullscreen Button */}
            <div className="relative h-[50vh] bg-slate-900 group">
              {mediaGallery[selectedMediaIndex]?.type === 'image' ? (
                <Image 
                  src={mediaGallery[selectedMediaIndex]?.url} 
                  alt={mediaGallery[selectedMediaIndex]?.caption || project.name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <video
                  src={mediaGallery[selectedMediaIndex]?.url}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
              {/* Fullscreen Button */}
              <button 
                onClick={() => setIsFullscreen(true)}
                className="absolute top-4 right-16 z-10 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <p className="text-sm uppercase tracking-widest mb-2" style={{ color: '#C4A35A' }}>{project.category} • {project.location}</p>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{project.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>RERA: {project.reraNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Gallery Thumbnails */}
            {mediaGallery.length > 1 && (
              <div className="bg-slate-50 px-8 md:px-12 py-6 overflow-x-auto border-b border-slate-200">
                <div className="flex gap-3">
                  {mediaGallery.map((media, index) => (
                    <button
                      key={media.id}
                      onClick={() => setSelectedMediaIndex(index)}
                      className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
                        selectedMediaIndex === index 
                          ? 'ring-3 ring-[#C4A35A] scale-105' 
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <div className="w-24 h-20 md:w-28 md:h-24 relative">
                        {media.type === 'image' ? (
                          <Image
                            src={media.thumbnail || media.url}
                            alt={media.caption || 'Media'}
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                        {media.type === 'video' && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                              <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="bg-slate-50 px-8 md:px-12 py-6 border-b border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Current Status</p>
                  <p className="text-sm font-bold text-slate-900">{project.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Launch</p>
                  <p className="text-sm font-bold text-slate-900">{project.launchYear}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Developer</p>
                  <p className="text-sm font-bold text-slate-900">{project.developer}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C4A35A' }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Starting At</p>
                  <p className="text-sm font-bold text-slate-900">{project.price}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="px-8 md:px-12 py-10 bg-slate-50">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#C4A35A' }}>Overview</p>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">{project.overview}</p>
          </div>

          {/* Details Table */}
          <div className="px-8 md:px-12 py-10 border-t border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Project Overview</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
                <tbody>
                  {project.details.map((detail, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="px-6 py-3 font-bold text-slate-900 border-b border-slate-200 w-1/3">{detail.label}</td>
                      <td className="px-6 py-3 text-slate-600 border-b border-slate-200">{detail.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Configurations & Amenities Section */}
          <div className="px-8 md:px-12 py-10 border-t border-slate-200 bg-slate-50">
            {/* Configurations */}
            {project.configurations && project.configurations.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Configurations</h2>
                <div className="flex flex-wrap gap-3">
                  {project.configurations.map((config, index) => (
                    <span 
                      key={index}
                      className="px-5 py-2 bg-slate-900 text-white font-medium rounded-full"
                    >
                      {config}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {project.amenities.map((amenity, index) => (
                    <span 
                      key={index}
                      className="px-5 py-3 bg-slate-200 text-slate-900 font-medium rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Section */}
          <div className="px-8 md:px-12 py-10 border-t border-slate-200">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Location That Continues To Drive Demand</h3>
            <p className="text-slate-600 mb-6">
              {project.location} has consistently remained one of the most desirable residential locations due to its combination of connectivity, established infrastructure and proximity to Delhi. For buyers considering both lifestyle and long-term value, the location of {project.name} remains one of its strongest advantages.
            </p>
            <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Connectivity Highlights</h4>
            <ul className="list-disc list-inside space-y-2">
              {project.locationHighlights.map((highlight, index) => (
                <li key={index} className="text-slate-600">{highlight}</li>
              ))}
            </ul>
          </div>

          {/* Photos & Videos Section */}
          <div className="px-8 md:px-12 py-6 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Photos & Videos</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
              {mediaGallery.map((media, index) => (
                <div
                  key={media.id}
                  className="relative group cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-300"
                  onClick={() => {
                    setSelectedMediaIndex(index);
                    setIsFullscreen(true);
                  }}
                >
                  {media.type === 'image' ? (
                    <div className="aspect-square relative">
                      <Image
                        src={media.url}
                        alt={media.caption || 'Project Photo'}
                        fill
                        sizes="(max-width: 640px) 33vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square relative bg-slate-900">
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-black/70 transition-colors">
                          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  {media.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                      <p className="text-white text-[10px] font-medium truncate">{media.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
