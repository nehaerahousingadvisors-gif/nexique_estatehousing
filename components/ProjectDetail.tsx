'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'Available' ? 'bg-green-100 text-green-700' :
    status === 'Booked'    ? 'bg-yellow-100 text-yellow-700' :
                             'bg-red-100 text-red-600';
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${cls}`}>{status}</span>;
}

// ── Unit type ────────────────────────────────────────────────────────────────
interface UnitData {
  unitNo?: string; floor?: string; type?: string; size?: string;
  price?: string; status?: string; facing?: string; remarks?: string;
  overview?: string; meetingRooms?: string; cabins?: string; maxSeats?: string;
  imageUrls?: string[]; videoUrls?: string[];
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }: { images: string[]; index: number; onClose: () => void }) {
  const [current, setCurrent] = useState(index);
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent(c => (c + 1) % images.length);
      if (e.key === 'ArrowLeft')  setCurrent(c => (c - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        onClick={onClose}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          onClick={e => { e.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length); }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div className="relative max-w-4xl max-h-[85vh] w-full mx-16" onClick={e => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current]}
          alt={`Unit photo ${current + 1}`}
          className="w-full h-full max-h-[85vh] object-contain rounded-xl"
        />
        {images.length > 1 && (
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/60 text-xs">
            {current + 1} / {images.length}
          </p>
        )}
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          onClick={e => { e.stopPropagation(); setCurrent(c => (c + 1) % images.length); }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((url, ii) => (
            <button key={ii} onClick={e => { e.stopPropagation(); setCurrent(ii); }}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${ii === current ? 'border-white scale-110' : 'border-white/30 opacity-60'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── UnitInventorySection ──────────────────────────────────────────────────────
function UnitInventorySection({ units, totalUnits, availableUnits }: {
  units: UnitData[];
  totalUnits?: number;
  availableUnits?: number;
}) {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState<Record<number, boolean>>({});

  return (
    <>
      {lightbox && (
        <Lightbox images={lightbox.images} index={lightbox.index} onClose={() => setLightbox(null)} />
      )}

      {/* Video fullscreen modal */}
      {videoModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
          onClick={() => setVideoModal(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={() => setVideoModal(null)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="w-full max-w-3xl mx-4" onClick={e => e.stopPropagation()}>
            <video
              src={videoModal}
              className="w-full rounded-xl"
              autoPlay
              controls
              playsInline
            />
          </div>
        </div>
      )}

      <div className="px-4 sm:px-8 md:px-12 py-6 border-t border-slate-200">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900">Units / Inventory</h3>
            <p className="text-xs text-slate-400 mt-0.5">Available units in this project</p>
          </div>
          <div className="flex gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
              Total: {totalUnits ?? units.length}
            </span>
            {availableUnits !== undefined && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Available: {availableUnits}
              </span>
            )}
          </div>
        </div>

        {/* Unit cards */}
        <div className="space-y-6">
          {units.map((unit, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {/* Always horizontal: photo left, details right */}
              <div className="flex flex-row">

                {/* Left — PHOTOS + VIDEOS */}
                {(unit.imageUrls && unit.imageUrls.length > 0) || (unit.videoUrls && unit.videoUrls.length > 0) ? (
                  <div className="w-24 sm:w-40 md:w-44 flex-shrink-0 border-r border-slate-100">

                    {/* Photos */}
                    {unit.imageUrls && unit.imageUrls.length > 0 && (
                      <>
                        <div className="flex items-center gap-1 px-1.5 pt-1.5 pb-1">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Photos</span>
                          <span className="ml-auto text-[8px] font-bold bg-slate-100 text-slate-500 px-1 py-0.5 rounded-full">
                            {unit.imageUrls.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-0.5 px-1 pb-1.5">
                          {unit.imageUrls.slice(0, 4).map((url, ii) => {
                            const isLast = ii === 3;
                            const remaining = unit.imageUrls!.length - 4;
                            return (
                              <button
                                key={ii}
                                onClick={() => setLightbox({ images: unit.imageUrls!, index: ii })}
                                className="relative rounded overflow-hidden"
                                style={{ aspectRatio: '1 / 1' }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                {isLast && remaining > 0 && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">+{remaining}</span>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* Videos — accordion */}
                    {unit.videoUrls && unit.videoUrls.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setVideoOpen(prev => ({ ...prev, [i]: !prev[i] }))}
                          className="w-full flex items-center gap-1 px-1.5 pt-1 pb-1 border-t border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <svg className="w-2.5 h-2.5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Videos</span>
                          <span className="ml-auto text-[8px] font-bold bg-slate-100 text-slate-500 px-1 py-0.5 rounded-full">
                            {unit.videoUrls.length}
                          </span>
                          <svg
                            className={`w-2.5 h-2.5 text-slate-400 ml-1 transition-transform ${videoOpen[i] ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {videoOpen[i] && (
                          <div className="grid grid-cols-2 gap-0.5 px-1 pb-1.5">
                            {unit.videoUrls.slice(0, 2).map((url, vi) => {
                              const isLast = vi === 1;
                              const remaining = unit.videoUrls!.length - 2;
                              return (
                                <button
                                  key={vi}
                                  onClick={() => setVideoModal(url)}
                                  className="relative rounded overflow-hidden bg-slate-900 group"
                                  style={{ aspectRatio: '1 / 1' }}
                                >
                                  <video src={url} className="w-full h-full object-cover" muted playsInline />
                                  {isLast && remaining > 0 ? (
                                    <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">+{remaining}</span>
                                    </div>
                                  ) : (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/55 transition-colors">
                                      <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-slate-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                      </div>
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-16 sm:w-32 flex-shrink-0 bg-slate-50 flex items-center justify-center border-r border-slate-100">
                    <svg className="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {/* Right — details */}
                <div className="flex-1 p-3 min-w-0">
                  {/* Title + status */}
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {unit.unitNo ? `Unit ${unit.unitNo}` : `Unit ${i + 1}`}
                      </h4>
                      {unit.type && <p className="text-xs text-slate-400 truncate">{unit.type}</p>}
                    </div>
                    <StatusBadge status={unit.status || 'Available'} />
                  </div>

                  {/* Price */}
                  {unit.price && (
                    <div className="mb-2">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">Starting at</p>
                      <p className="text-sm sm:text-base font-black" style={{ color: '#1a2744' }}>
                        {/^\d+$/.test(unit.price.replace(/,/g, ''))
                          ? `₹${Number(unit.price.replace(/,/g, '')).toLocaleString('en-IN')} onwards`
                          : unit.price}
                      </p>
                    </div>
                  )}

                  {/* Info inline tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {([
                      { label: 'Floor', value: unit.floor },
                      { label: 'Size',  value: unit.size  },
                      { label: 'Mtg',   value: unit.meetingRooms },
                      { label: 'Cabin', value: unit.cabins },
                      { label: 'Seats', value: unit.maxSeats },
                      { label: 'Face',  value: unit.facing },
                    ] as { label: string; value?: string }[])
                      .filter(x => x.value)
                      .map(({ label, value }) => (
                        <span key={label} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm text-slate-700">
                          <span className="font-semibold text-slate-500">{label}:</span>{value}
                        </span>
                      ))}
                  </div>

                  {/* Overview */}
                  {unit.overview && (
                    <div className="mt-2 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Overview</p>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{unit.overview}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}



interface MediaItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
}

interface Project {
  id: number;
  firestoreId?: string;
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
  locationOverview?: string;
  configurations: string[];
  amenities: string[];
  units?: {
    unitNo: string;
    floor: string;
    type: string;
    size: string;
    price: string;
    status: string;
    facing: string;
    remarks: string;
    overview?: string;
    meetingRooms?: string;
    cabins?: string;
    maxSeats?: string;
    imageUrls?: string[];
    videoUrls?: string[];
  }[];
  totalUnits?: number;
  availableUnits?: number;
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
            <div
              className="relative h-[28vh] sm:h-[40vh] md:h-[50vh] bg-slate-900 group cursor-pointer"
              onClick={() => setIsFullscreen(true)}
            >
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
                onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
                className="absolute top-4 right-16 z-10 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12 pointer-events-none">
                <p className="text-[10px] sm:text-sm uppercase tracking-widest mb-1 sm:mb-2 truncate text-white">{project.category} • {project.location}</p>
                <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-3 leading-tight">{project.name}</h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white text-xs sm:text-base">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-1">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="px-8 md:px-12 py-8 bg-slate-50">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#C4A35A' }}>Overview</p>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">{project.overview}</p>
          </div>

          {/* Details Table */}
          <div className="px-4 md:px-12 py-8 md:py-10 border-t border-slate-200">
            <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-4 md:mb-6">Project Overview</h2>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <tbody>
                  {project.details.map((detail, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="px-3 md:px-6 py-3 font-bold text-slate-900 border-b border-slate-200 text-sm md:text-base align-top w-2/5 md:w-1/3 break-words">{detail.label}</td>
                      <td className="px-3 md:px-6 py-3 text-slate-600 border-b border-slate-200 text-sm md:text-base break-words">{detail.value}</td>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {project.amenities.map((amenity, index) => (
                    <span 
                      key={index}
                      className="px-3 py-2 bg-slate-200 text-slate-900 font-medium rounded-full text-xs md:text-sm text-center"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Units / Inventory Section */}
          {project.units && project.units.length > 0 && (
            <UnitInventorySection
              units={project.units}
              totalUnits={project.totalUnits}
              availableUnits={project.availableUnits}
            />
          )}

          {/* Location Section */}
          <div className="px-8 md:px-12 py-10 border-t border-slate-200">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Location That Continues To Drive Demand</h3>
            <p className="text-slate-600 mb-6">
              {project.locationOverview
                ? project.locationOverview
                : `${project.location} has consistently remained one of the most desirable residential locations due to its combination of connectivity, established infrastructure and proximity to Delhi. For buyers considering both lifestyle and long-term value, the location of ${project.name} remains one of its strongest advantages.`}
            </p>
            <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Connectivity Highlights</h4>
            <ul className="list-disc list-inside space-y-2">
              {project.locationHighlights.map((highlight, index) => (
                <li key={index} className="text-slate-600">{highlight}</li>
              ))}
            </ul>

            {/* Chat / Call / Share buttons */}
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href={`https://wa.me/919667394175?text=${encodeURIComponent(`Hi, I'm interested in ${project.name} at ${project.location}. Please share more details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#1a2744' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
                Chat
              </a>
              <a
                href="tel:+919667394175"
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all border-2 hover:bg-slate-50"
                style={{ borderColor: '#1a2744', color: '#1a2744' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </a>
              <button
                onClick={() => {
                  const base = typeof window !== 'undefined'
                    ? `${window.location.protocol}//${window.location.host}`
                    : 'https://www.nexiqueestate.com';
                  const shareUrl = project.firestoreId
                    ? `${base}/projects?id=${project.firestoreId}`
                    : `${base}/projects`;
                  if (navigator.share) {
                    navigator.share({ title: project.name, text: `Check out ${project.name} at ${project.location}`, url: shareUrl });
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all border-2 hover:bg-gray-50"
                style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>

            {/* Listed By / Owner Section */}
            {((project as any).owner?.name || (project as any).owner?.contact) && (
              <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Listed By</p>

                {/* Avatar + Name + Role */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold text-slate-600"
                    style={{ backgroundColor: '#EEF0F5' }}>
                    {((project as any).owner?.name as string)?.[0]?.toUpperCase() ?? 'O'}
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">{(project as any).owner.name}</p>
                    <p className="text-sm text-slate-400">Owner</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-3 text-slate-500 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{project.location}</span>
                </div>

                {/* Listed date */}
                <div className="flex items-center gap-2 mb-6 text-slate-500 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Listed on {new Date().toLocaleDateString('en-GB')}</span>
                </div>

                {/* Chat button */}
                <a
                  href={`https://wa.me/919667394175?text=${encodeURIComponent(`Hi, I'm interested in ${project.name} at ${project.location}. Please share more details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#1a2744' }}
                >
                  Chat
                </a>
              </div>
            )}
          </div>

          {/* Photos & Videos Section */}
          {(() => {
            const photos = mediaGallery.filter(m => m.type === 'image');
            const videos = mediaGallery.filter(m => m.type === 'video');
            const MAX_PHOTOS = 4;
            const MAX_VIDEOS = 2;
            const visiblePhotos = photos.slice(0, MAX_PHOTOS);
            const visibleVideos = videos.slice(0, MAX_VIDEOS);
            const extraPhotos = photos.length - MAX_PHOTOS;
            const extraVideos = videos.length - MAX_VIDEOS;

            const renderTile = (media: MediaItem, galleryIndex: number, isLastVisible: boolean, extra: number) => (
              <div
                key={media.id}
                className="relative group cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-300"
                onClick={() => {
                  setSelectedMediaIndex(galleryIndex);
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
                    <video src={media.url} className="w-full h-full object-cover" muted playsInline />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-black/70 transition-colors">
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                {/* +N overlay on the last visible tile when there are more */}
                {isLastVisible && extra > 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                    <span className="text-white text-lg font-bold">+{extra}</span>
                  </div>
                )}
                {!isLastVisible && media.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                    <p className="text-white text-[10px] font-medium truncate">{media.caption}</p>
                  </div>
                )}
              </div>
            );

            return (
              <div className="px-8 md:px-12 py-6 border-t border-slate-200">
                {/* Photos row */}
                {visiblePhotos.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Photos</h2>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {photos.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {visiblePhotos.map((media, i) => {
                        const galleryIndex = mediaGallery.findIndex(m => m.id === media.id);
                        const isLast = i === visiblePhotos.length - 1;
                        return renderTile(media, galleryIndex, isLast, extraPhotos);
                      })}
                    </div>
                  </div>
                )}

                {/* Videos row */}
                {visibleVideos.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Videos</h2>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {videos.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {visibleVideos.map((media, i) => {
                        const galleryIndex = mediaGallery.findIndex(m => m.id === media.id);
                        const isLast = i === visibleVideos.length - 1;
                        return renderTile(media, galleryIndex, isLast, extraVideos);
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}
