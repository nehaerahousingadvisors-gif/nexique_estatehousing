'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface Property {
  id: string;
  name?: string;
  location?: string;
  price?: string;
  category?: string;
  image?: string;
  imageUrl?: string;
  status?: string;
  createdAt?: any;
  userId?: string;
  [key: string]: any;
}

export default function MyProperties() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  // Fetch user's properties
  useEffect(() => {
    if (!user) return;
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Check both 'properties' and 'project' collections (as per user's Firestore)
        const collections = ['properties', 'project', 'projects'];
        let foundProperties: Property[] = [];

        for (const col of collections) {
          try {
            const q = query(collection(db, col), where('userId', '==', user.uid));
            const snapshot = await getDocs(q);
            const results = snapshot.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Record<string, any>),
            }));
            foundProperties = [...foundProperties, ...results];
          } catch (err) {
            // Collection may not exist
          }
        }

        // If no results with userId, check if maybe they're stored under email or name
        if (foundProperties.length === 0) {
          for (const col of collections) {
            try {
              const snapshot = await getDocs(collection(db, col));
              const all = snapshot.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Record<string, any>),
              }));
              // Try to match by any user identifier
              const matched = all.filter((p: any) => {
                if (p.userEmail && user.email && p.userEmail.toLowerCase() === user.email.toLowerCase()) return true;
                if (p.createdBy && user.email && p.createdBy.toLowerCase() === user.email.toLowerCase()) return true;
                if (p.ownerId && p.ownerId === user.uid) return true;
                return false;
              });
              foundProperties = [...foundProperties, ...matched];
            } catch (err) {
              // Ignore
            }
          }
        }

        setProperties(foundProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }
    setDeletingId(id);
    try {
      const collections = ['properties', 'project', 'projects'];
      for (const col of collections) {
        try {
          await deleteDoc(doc(db, col, id));
        } catch {
          // May not exist in this collection
        }
      }
      setProperties((prev) => prev.filter((p) => p.id !== id));
      alert('Property deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete property. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getImage = (p: Property) => {
    return p.image || p.imageUrl || p.heroImage || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop';
  };
  const getName = (p: Property) => {
    return p.name || p.title || p.projectName || 'Unnamed Property';
  };
  const getLocation = (p: Property) => {
    return p.location || p.address || p.city || 'Location not specified';
  };
  const getPrice = (p: Property) => {
    return p.price || p.priceRange || p.startingPrice || 'Price on Request';
  };
  const getCategory = (p: Property) => {
    return p.category || p.type || p.propertyType || 'Residential';
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <section className="w-full py-10 md:py-16 relative overflow-hidden" style={{ backgroundColor: '#1a2744' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-[#C4A35A] text-xs sm:text-sm uppercase tracking-widest mb-2">DASHBOARD</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">My Properties</h1>
          <p className="text-slate-200 max-w-2xl text-sm md:text-base">
            Manage your listed properties. Edit details, update pricing, or remove listings.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full py-10 md:py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats + Add New */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 px-5 py-3 shadow-sm">
                <p className="text-xs text-slate-500 mb-1">Total Listings</p>
                <p className="text-2xl font-bold text-slate-900">{properties.length}</p>
              </div>
            </div>
            <Link
              href="/post-property"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: '#1a2744' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add New Property
            </Link>
          </div>

          {/* Empty State */}
          {!loading && properties.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(26,39,68,0.08)' }}
              >
                <svg className="w-10 h-10" style={{ color: '#1a2744' }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No properties listed yet</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                Start by posting your first property to reach thousands of potential buyers and tenants.
              </p>
              <Link
                href="/post-property"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: '#1a2744' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Post Your First Property
              </Link>
            </div>
          )}

          {/* Properties Grid */}
          {properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-52 sm:h-56 overflow-hidden">
                    <Image
                      src={getImage(property)}
                      alt={getName(property)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-700 font-medium px-2.5 py-1 rounded-full text-xs shadow-sm">
                      {getCategory(property)}
                    </div>
                    {/* Status Badge */}
                    {property.status && (
                      <div className="absolute bottom-3 left-3 backdrop-blur-sm text-white font-medium px-2.5 py-1 rounded-full text-[10px]"
                        style={{ backgroundColor: 'rgba(26,39,68,0.9)' }}>
                        {property.status}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-slate-700 transition-colors">
                      {getName(property)}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-500 mb-1.5">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate text-xs sm:text-sm line-clamp-1">{getLocation(property)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400">Starting at</p>
                        <p className="text-sm sm:text-base font-bold text-slate-900">{getPrice(property)}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-5">
                      <Link
                        href={`/edit-property/${property.id}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-white font-semibold text-xs sm:text-sm transition-all hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: '#1a2744' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(property.id)}
                        disabled={deletingId === property.id}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all hover:bg-red-50 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ color: '#dc2626', border: '1px solid #fecaca', backgroundColor: deletingId === property.id ? '#fef2f2' : 'white' }}
                      >
                        {deletingId === property.id ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Deleting
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
