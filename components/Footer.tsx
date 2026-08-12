'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

const NAVY = '#1a2744';

interface FooterProject {
  id: string;
  name: string;
}

export default function Footer() {
  const [footerProjects, setFooterProjects] = useState<FooterProject[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchProjects = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'properties')));
        const EXCLUDE_NAMES = [
          'gulshan taj residences',
          'm3m jacob & co',
          'm3m the cullinan avenue',
          'max estates 105',
          'trump tower noida',
        ];

        const projects: FooterProject[] = snap.docs
          .map(doc => ({
            id: doc.id,
            name: (doc.data().projectName || doc.data().name || '').trim(),
          }))
          .filter(p =>
            p.name !== '' &&
            !EXCLUDE_NAMES.some(ex => p.name.toLowerCase().includes(ex))
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setFooterProjects(projects);
      } catch {
        // silently fail
      }
    };
    fetchProjects();
  }, []);

  return (
    <footer suppressHydrationWarning className="w-full bg-white pt-8 md:pt-12 pb-6 md:pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12">

          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-3 md:mb-4">
              <Image
                src="/15august.png"
                alt="NEHA - New Era Housing Advisors"
                width={200}
                height={200}
                className="h-16 md:h-20 w-auto"
                priority
              />
            </div>
            <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6">
              Best Real Estate Consultant in Delhi/NCR — premium RERA-approved residential & commercial projects
            </p>
            <div className="flex space-x-2.5 md:space-x-4">
              {[
                { href: 'https://www.facebook.com/profile.php?id=61591626782828', icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.302 3.438 9.8 8.207 11.387v-8.04h-2.48V12h2.48V9.84c0-2.47 1.42-3.838 3.766-3.838 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562V12h2.775l-.443 2.816h-2.332v8.04C20.566 21.873 24 17.375 24 12.073z" /> },
                { href: 'https://www.instagram.com/', icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.176.054 1.856.215 2.408.437a4.907 4.907 0 0 1 1.771 1.153 4.907 4.907 0 0 1 1.153 1.771c.222.552.383 1.232.437 2.408.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.176-.215 1.856-.437 2.408a4.907 4.907 0 0 1-1.153 1.771 4.907 4.907 0 0 1-1.771 1.153c-.552.222-1.232.383-2.408.437-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.176-.054-1.856-.215-2.408-.437a4.907 4.907 0 0 1-1.771-1.153 4.907 4.907 0 0 1-1.153-1.771c-.222-.552-.383-1.232-.437-2.408-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.176.215-1.856.437-2.408a4.907 4.907 0 0 1 1.153-1.771 4.907 4.907 0 0 1 1.771-1.153c.552-.222 1.232-.383 2.408-.437 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.273.058-2.068.233-2.758.494a6.999 6.999 0 0 0-2.536 1.65 6.999 6.999 0 0 0-1.65 2.536c-.261.69-.436 1.485-.494 2.758-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.273.233 2.068.494 2.758a6.999 6.999 0 0 0 1.65 2.536 6.999 6.999 0 0 0 2.536 1.65c.69.261 1.485.436 2.758.494 1.28.058 1.688.072 4.947.072s3.667-.014 3.947.072c1.273-.058 2.068-.233 2.758-.494a6.999 6.999 0 0 0 2.536-1.65 6.999 6.999 0 0 0 1.65-2.536c.261-.69.436-1.485.494-2.758.058-1.28.072-1.688.072-4.947s-.058-3.667-.072-3.947c-.058-1.273-.233-2.068-.494-2.758a6.999 6.999 0 0 0-1.65-2.536 6.999 6.999 0 0 0-2.536-1.65c-.69-.261-1.485-.436-2.758-.494-1.28-.058-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.538-10.655a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" /> },
                { href: 'https://www.linkedin.com/feed/', icon: <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /> },
                { href: 'https://www.youtube.com/@NewEraHousingAdvisors', icon: <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /> },
              ].map(({ href, icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 md:w-10 md:h-10 border border-gray-300 rounded-full flex items-center justify-center transition-colors text-gray-700"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = NAVY; (e.currentTarget as HTMLElement).style.borderColor = NAVY; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.borderColor = '#d1d5db'; (e.currentTarget as HTMLElement).style.color = '#374151'; }}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">{icon}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base" style={{ color: NAVY }}>QUICK LINKS</h3>
            <ul className="space-y-1.5 md:space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/testimonials', label: 'Testimonials' },
                { href: '/career', label: 'Career' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms and Conditions' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-600 text-xs md:text-sm transition-colors hover:text-[#1a2744]">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects — dynamic from Firebase */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base" style={{ color: NAVY }}>PROJECTS</h3>
            <ul className="space-y-1.5 md:space-y-2" suppressHydrationWarning>
              {!mounted ? (
                <li className="text-gray-400 text-xs">Loading...</li>
              ) : footerProjects.length === 0 ? (
                <li className="text-gray-400 text-xs">Loading...</li>
              ) : (
                footerProjects.slice(0, 12).map(({ id, name }) => (
                  <li key={id}>
                    <Link
                      href={`/projects?id=${id}`}
                      className="text-gray-600 text-xs md:text-sm transition-colors hover:text-[#1a2744]"
                    >
                      {name}
                    </Link>
                  </li>
                ))
              )}
              {mounted && footerProjects.length > 12 && (
                <li>
                  <Link href="/projects" className="text-xs font-semibold" style={{ color: NAVY }}>
                    View All →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* CENTRAL NOIDA — matched from Firebase by project name */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base" style={{ color: NAVY }}>CENTRAL NOIDA</h3>
            <ul className="space-y-1.5 md:space-y-2" suppressHydrationWarning>
              {(() => {
                const centralNames = ["Kothi's", 'Dasnac Burj', 'Godrej Riverine', 'Godrej Woods', 'Max Towers 16B'];
                return centralNames.map(label => {
                  const match = mounted ? footerProjects.find(p =>
                    p.name.toLowerCase().includes(label.toLowerCase().split("'")[0]) ||
                    label.toLowerCase().includes(p.name.toLowerCase().split('.')[0].trim())
                  ) : undefined;
                  return (
                    <li key={label}>
                      <Link
                        href={match ? `/projects?id=${match.id}` : '/projects'}
                        className="text-gray-600 text-xs md:text-sm transition-colors hover:text-[#1a2744]"
                      >
                        {label}
                      </Link>
                    </li>
                  );
                });
              })()}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base" style={{ color: NAVY }}>CONTACT</h3>
            <ul className="space-y-2 md:space-y-3">
              <li className="flex items-start">
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 mt-0.5 flex-shrink-0" fill="none" stroke={NAVY} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600 text-xs md:text-sm">+91 96673 94175</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 mt-0.5 flex-shrink-0" fill="none" stroke={NAVY} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 text-xs md:text-sm">info@nexiqueestate.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-5 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
          <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm">
            © 2026 NEHA - Nexique Estate Housing Advisors. All rights reserved.
          </p>
          <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm">
            RERA Registered Real Estate Consultant
          </p>
        </div>
      </div>

      {/* WhatsApp FAB */}
      <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6">
        <a
          href="https://wa.me/919667394175?text=Hello%2C%20I%20am%20interested%20in%20your%20properties.%20Please%20share%20more%20details."
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 md:w-14 md:h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.476-.884-.785-1.48-1.75-1.653-2.047-.173-.298-.018-.46.13-.608.135-.135.298-.347.446-.52.149-.173.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.488-.5-.67-.51-.172-.01-.371-.015-.57-.015-.198 0-.52.074-.792.371-.27.296-1.029 1.008-1.029 2.455 0 1.447 1.054 2.848 1.2 3.045.149.198 2.096 3.2 5.077 4.487.712.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.041-1.37l-.36-.213-3.641.96 1.01-3.549-.235-.374a9.86 9.86 0 01-1.54-5.215c-.024-5.45 4.44-9.885 9.901-9.885 2.64 0 5.122 1.03 6.982 2.892a9.825 9.825 0 012.88 6.978c0 5.459-4.44 9.89-9.883 9.89z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
