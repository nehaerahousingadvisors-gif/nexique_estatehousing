'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import {
  collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// ── ADMIN EMAIL WHITELIST ─────────────────────────────────────────────────────
// Add any email that should have admin access
const ADMIN_EMAILS = [
  'info@nexiqueestate.com',
  'admin@nexiqueestate.com',
  'nehaerhousingadvisors@gmail.com',
];

const PRIMARY = '#1a2744';

type Property = {
  id: string;
  name: string;
  location: string;
  price: string;
  category: string;
  image: string;
  source?: string;
  status?: string;
  developer?: string;
  createdAt?: any;
  featured?: boolean;
};

function formatPrice(p: any): string {
  if (!p) return 'N/A';
  if (typeof p === 'string') return p;
  const n = Number(p);
  if (isNaN(n) || n === 0) return 'N/A';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2).replace(/\.?0+$/, '')} Lac`;
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function AdminPage() {
  const router = useRouter();
  const [user,         setUser]         = useState<User | null>(null);
  const [authLoading,  setAuthLoading]  = useState(true);
  const [isAdmin,      setIsAdmin]      = useState(false);

  const [properties,   setProperties]   = useState<Property[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [activeTab,    setActiveTab]    = useState<'curated' | 'user'>('curated');
  const [deleting,     setDeleting]     = useState<string | null>(null);
  const [toggling,     setToggling]     = useState<string | null>(null);
  const [searchQ,      setSearchQ]      = useState('');

  // ── Auth guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) { router.push('/login'); return; }
      const email = u.email?.toLowerCase() ?? '';
      if (!ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email)) {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
    });
  }, [router]);

  // ── Fetch all properties ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, 'properties')));
        const list: Property[] = snap.docs.map(d => {
          const data = d.data();
          return {
            id:        d.id,
            name:      data.projectName || data.name || 'Untitled',
            location:  data.projectLocation || data.location || `${data.locality ?? ''}, ${data.city ?? ''}`.replace(/^, |, $/, '') || 'N/A',
            price:     formatPrice(data.expectedPrice || data.price),
            category:  data.propertyCategory === 'Commercial' ? 'Commercial'
                         : (data.propertyType?.toLowerCase().includes('plot') ? 'Plots' : data.category || 'Residential'),
            image:     data.image || data.imageUrl || data.heroImage || (data.photos?.[0] ?? ''),
            source:    data.source ?? 'admin',
            status:    data.availability || data.status || 'N/A',
            developer: data.developer || data.developerName || '',
            createdAt: data.createdAt,
            featured:  data.featured ?? false,
          };
        }).sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
        setProperties(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this property?')) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'properties', id));
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (e) { alert('Delete failed. Please try again.'); }
    finally { setDeleting(null); }
  };

  // Toggle source between 'admin' (shows on home) and 'user_submission' (hidden from home)
  const handleToggleHome = async (p: Property) => {
    setToggling(p.id);
    const newSource = p.source === 'admin' ? 'user_submission' : 'admin';
    try {
      await updateDoc(doc(db, 'properties', p.id), { source: newSource });
      setProperties(prev => prev.map(x => x.id === p.id ? { ...x, source: newSource } : x));
    } catch (e) { alert('Update failed. Please try again.'); }
    finally { setToggling(null); }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  // ── Computed lists ───────────────────────────────────────────────────────
  const curated = properties.filter(p => (p.source ?? 'admin') !== 'user_submission');
  const userSub = properties.filter(p => p.source === 'user_submission');
  const visible = (activeTab === 'curated' ? curated : userSub)
    .filter(p => !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase())
                          || p.location.toLowerCase().includes(searchQ.toLowerCase()));

  // ── Loading / Auth states ────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <svg className="animate-spin w-10 h-10" viewBox="0 0 24 24" fill="none" style={{ color: PRIMARY }}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!isAdmin && user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-500 text-sm mb-2">
            Logged in as <span className="font-semibold text-slate-700">{user.email}</span>
          </p>
          <p className="text-slate-400 text-sm mb-6">This page is only accessible to admin accounts.</p>
          <button
            onClick={handleSignOut}
            className="px-6 py-2 rounded-full text-sm font-semibold text-white"
            style={{ background: PRIMARY }}
          >
            Sign out &amp; go back
          </button>
        </div>
      </div>
    );
  }

  // ── Main admin UI ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f1f5f9' }}>

      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-slate-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-bold text-slate-800">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">{user?.email}</span>
            <Link
              href="/admin/add-project"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90"
              style={{ background: PRIMARY }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Curated Project
            </Link>
            <button
              onClick={handleSignOut}
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Properties', value: properties.length, color: '#1a2744' },
            { label: 'Shown on Home Page', value: curated.length, color: '#059669' },
            { label: 'User Submissions', value: userSub.length, color: '#d97706' },
            { label: 'Hidden from Home', value: userSub.length, color: '#6366f1' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <p className="text-2xl font-bold mb-0.5" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex gap-1 bg-white border border-slate-200 rounded-full p-1 w-fit">
            {([['curated', `Home Page (${curated.length})`], ['user', `User Submitted (${userSub.length})`]] as const).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: activeTab === tab ? PRIMARY : 'transparent',
                  color:      activeTab === tab ? '#fff'    : '#64748b',
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search by name or location…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-full border border-slate-200 text-sm bg-white outline-none focus:border-slate-400"
          />
        </div>

        {/* Explanation banner */}
        <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5"
          style={{ background: activeTab === 'curated' ? '#ecfdf5' : '#fffbeb', border: `1px solid ${activeTab === 'curated' ? '#a7f3d0' : '#fde68a'}` }}>
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke={activeTab === 'curated' ? '#059669' : '#d97706'} strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {activeTab === 'curated'
            ? <span style={{ color: '#065f46' }}>These projects are <strong>visible on the home page</strong> Featured Projects section. Use the toggle to hide any property from the home page.</span>
            : <span style={{ color: '#92400e' }}>These are properties submitted by users. They appear on the <strong>/projects page</strong> but NOT on the home page. Use the toggle to promote any to the home page.</span>
          }
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none" style={{ color: PRIMARY }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-slate-500 text-sm">Loading properties…</span>
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <p className="font-semibold text-slate-500">No properties found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider w-14">Photo</th>
                    <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Property</th>
                    <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden lg:table-cell">Price</th>
                    <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider text-center">Home Page</th>
                    <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p, idx) => (
                    <tr key={p.id}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      style={{ borderBottom: idx === visible.length - 1 ? 'none' : undefined }}
                    >
                      {/* Thumbnail */}
                      <td className="px-4 py-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          {p.image ? (
                            <img src={p.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Name + Location */}
                      <td className="px-4 py-3 max-w-[220px]">
                        <p className="font-semibold text-slate-800 truncate text-sm">{p.name}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{p.location}</p>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            background: p.category === 'Commercial' ? '#dbeafe' : p.category === 'Plots' ? '#fef9c3' : '#dcfce7',
                            color:      p.category === 'Commercial' ? '#1e40af' : p.category === 'Plots' ? '#854d0e' : '#166534',
                          }}>
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs font-semibold text-slate-700">{p.price}</span>
                      </td>

                      {/* Home Page toggle */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleHome(p)}
                          disabled={toggling === p.id}
                          title={p.source !== 'user_submission' ? 'Shown on home page — click to hide' : 'Hidden from home page — click to show'}
                          className="inline-flex flex-col items-center gap-1 disabled:opacity-50"
                        >
                          {/* Toggle pill */}
                          <div
                            className="w-11 h-6 rounded-full transition-all flex items-center px-1"
                            style={{ background: p.source !== 'user_submission' ? '#059669' : '#e2e8f0' }}
                          >
                            <span
                              className="w-4 h-4 bg-white rounded-full shadow transition-transform block"
                              style={{ transform: p.source !== 'user_submission' ? 'translateX(20px)' : 'translateX(0px)' }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold"
                            style={{ color: p.source !== 'user_submission' ? '#059669' : '#94a3b8' }}>
                            {toggling === p.id ? '...' : p.source !== 'user_submission' ? 'Visible' : 'Hidden'}
                          </span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {deleting === p.id ? (
                            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
