import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Nexique Estate Housing Advisors',
  description:
    'Real estate tips, investment guides, and market insights for Delhi NCR properties.',
};

const posts = [
  {
    slug: 'top-residential-projects-noida-2025',
    title: 'Top 5 Residential Projects in Noida to Invest in 2025',
    excerpt:
      'Noida has emerged as one of the most sought-after real estate destinations in Delhi NCR. Here are the top 5 RERA-approved residential projects worth considering.',
    category: 'Investment Tips',
    date: 'August 20, 2026',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
  },
  {
    slug: 'commercial-vs-residential-investment',
    title: 'Commercial vs Residential Investment: What Should You Choose?',
    excerpt:
      'Confused between investing in a commercial property or a residential flat? This guide breaks down the pros and cons of each to help you make the right decision.',
    category: 'Guide',
    date: 'August 10, 2026',
    readTime: '7 min read',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    slug: 'rera-explained-home-buyers',
    title: 'RERA Explained: Everything a Home Buyer Needs to Know',
    excerpt:
      'RERA has transformed the real estate sector in India. Learn how the Real Estate Regulatory Authority protects your rights as a buyer and what to check before buying.',
    category: 'Legal & RERA',
    date: 'July 28, 2026',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
  },
  {
    slug: 'home-loan-tips-first-time-buyers',
    title: 'Home Loan Tips for First-Time Buyers in 2026',
    excerpt:
      'Applying for your first home loan? Understand eligibility, documents required, interest rate comparisons, and how to increase your loan approval chances.',
    category: 'Finance',
    date: 'July 15, 2026',
    readTime: '8 min read',
    image:
      'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=800&auto=format&fit=crop',
  },
  {
    slug: 'yamuna-expressway-real-estate-growth',
    title: 'Why Yamuna Expressway is the Next Real Estate Hotspot',
    excerpt:
      'With Jewar Airport, F1 circuit, and Film City on the horizon, the Yamuna Expressway corridor is witnessing unprecedented real estate growth. Here is why investors are bullish.',
    category: 'Market Insights',
    date: 'July 5, 2026',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=800&auto=format&fit=crop',
  },
  {
    slug: 'ready-to-move-vs-under-construction',
    title: 'Ready to Move vs Under Construction: Pros and Cons',
    excerpt:
      'Should you buy a ready-to-move-in flat or an under-construction property? We compare both on price, GST, risk, and possession timeline to help you decide.',
    category: 'Guide',
    date: 'June 22, 2026',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
  },
];

const categoryColors: Record<string, string> = {
  'Investment Tips': '#1a2744',
  'Guide': '#0f766e',
  'Legal & RERA': '#7c3aed',
  'Finance': '#b45309',
  'Market Insights': '#b91c1c',
};

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section
        className="w-full py-16 md:py-24 relative overflow-hidden"
        style={{ backgroundColor: '#1a2744' }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: '#243156' }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#243156' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-[#C4A35A] text-xs uppercase tracking-widest mb-2">INSIGHTS & GUIDES</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Our Blog</h1>
          <p className="text-slate-300 max-w-2xl text-sm md:text-base">
            Real estate investment tips, market updates, legal guides, and expert advice for property buyers in Delhi NCR.
          </p>
        </div>
      </section>

      <section className="w-full py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Featured Post */}
          <div className="mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Featured Post</p>
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 lg:h-auto min-h-[280px] overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span
                  className="inline-block px-3 py-1 rounded-full text-white text-[11px] font-bold uppercase tracking-wide mb-4 w-fit"
                  style={{ backgroundColor: categoryColors[featured.category] ?? '#1a2744' }}
                >
                  {featured.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 group-hover:text-[#1a2744] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.readTime}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Rest of posts grid */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Latest Articles</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wide"
                      style={{ backgroundColor: categoryColors[post.category] ?? '#1a2744' }}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#1a2744] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{post.date}</span>
                        <span>·</span>
                        <span>{post.readTime}</span>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: '#1a2744' }}>
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className="mt-16 rounded-3xl p-10 md:p-14 text-center"
            style={{ backgroundColor: '#1a2744' }}
          >
            <p className="text-[#C4A35A] text-xs uppercase tracking-widest mb-3">Get Expert Advice</p>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Looking for the Right Property?
            </h3>
            <p className="text-slate-300 text-sm mb-7 max-w-xl mx-auto">
              Talk to our real estate experts for personalised investment guidance, site visits, and the best deals across Delhi NCR.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white font-bold text-sm rounded-full transition-all hover:bg-slate-100"
              style={{ color: '#1a2744' }}
            >
              Free Consultation
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
