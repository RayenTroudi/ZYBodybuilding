'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/translations';
import { appwriteConfig } from '@/lib/appwrite/config';
import { ShoppingBag, Search, Package, Phone, Star } from 'lucide-react';

const CATEGORIES = ['supplements', 'apparel', 'equipment', 'accessories'];

function getImageUrl(fileId) {
  return `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.productImagesBucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
}

function ProductCard({ product, lang, marketplace }) {
  const name = lang === 'fr' ? product.name_fr : product.name_en;
  const description = lang === 'fr' ? product.description_fr : product.description_en;
  const coverUrl = product.imageIds?.[0] ? getImageUrl(product.imageIds[0]) : null;

  return (
    <div className="group relative bg-[#0a0a0a] border border-[#1a1a1a] hover:border-primary/50 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Animated red accent bar on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary z-10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      {/* Image */}
      <div className="relative h-64 bg-[#080808] overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-neutral-800" />
          </div>
        )}

        {/* Gradient blend into card background */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />

        {/* Category badge pinned to bottom-left of image */}
        <span
          className="absolute bottom-3 left-0 bg-primary px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {marketplace.categories[product.category] || product.category}
        </span>

        {product.featured && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 text-yellow-400 text-[9px] font-bold uppercase tracking-widest">
            <Star size={8} fill="currentColor" /> {marketplace.featured}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span
              className="px-4 py-2 bg-black/80 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {marketplace.outOfStock}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-2">
        <h3
          className="text-white font-black text-xl uppercase leading-tight group-hover:text-primary transition-colors"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {name}
        </h3>
        {description && (
          <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">{description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#1a1a1a]">
          <div>
            <p
              className="text-primary font-black text-2xl leading-none"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {parseFloat(product.price).toFixed(2)}
            </p>
            <span className="text-neutral-600 text-[8px] uppercase tracking-wider">{marketplace.currency}</span>
          </div>
          <a
            href="/#contact"
            className="flex items-center gap-1 px-3 py-1.5 bg-primary hover:bg-primary/80 text-white text-[8px] font-black uppercase tracking-widest transition-colors"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            <Phone size={11} />
            {marketplace.contactToBuy}
          </a>
        </div>
      </div>
    </div>
  );
}

// Static skeleton shown during SSR and before hydration
function LoadingShell() {
  return (
    <div className="min-h-screen bg-dark text-white">
      <section className="relative pt-28 pb-16 px-4 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="h-3 w-24 bg-neutral-800 rounded mb-4" />
          <div className="h-16 w-64 bg-neutral-800 rounded mb-4" />
          <div className="h-4 w-96 bg-neutral-900 rounded" />
        </div>
      </section>
      <div className="container mx-auto max-w-6xl px-4 py-24 flex items-center justify-center">
        <div className="w-5 h-5 border-t-2 border-primary animate-spin rounded-full" />
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Prevent hydration mismatch: render static shell on server,
  // swap to interactive UI only after client has mounted.
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setMounted(true);
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/marketplace');
        const data = await res.json();
        setProducts(data.documents || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (!mounted) return <LoadingShell />;

  const filtered = (() => {
    let list = products;
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name_en?.toLowerCase().includes(q) ||
          p.name_fr?.toLowerCase().includes(q) ||
          p.description_en?.toLowerCase().includes(q) ||
          p.description_fr?.toLowerCase().includes(q)
      );
    }
    return list;
  })();

  const featured = products.filter((p) => p.featured && p.inStock);
  const marketplace = t.marketplace;

  return (
    <div className="min-h-screen bg-dark text-white">

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
            {marketplace.label}
          </p>
          <h1
            className="text-5xl md:text-7xl font-black uppercase leading-none mb-4"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {marketplace.title}
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
            {marketplace.subtitle}
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-12 space-y-10">

        {/* Featured strip */}
        {!loading && featured.length > 0 && (
          <section>
            <p className="text-[10px] font-bold uppercase text-neutral-600 tracking-widest mb-4 flex items-center gap-2">
              <Star size={10} className="text-yellow-400" fill="currentColor" />
              {marketplace.featured}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.slice(0, 3).map((p) => (
                <ProductCard key={p.$id} product={p} lang={lang} marketplace={marketplace} />
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={marketplace.searchPlaceholder}
              autoComplete="off"
              className="w-full pl-9 pr-4 py-2.5 bg-[#0a0a0a] border border-[#1e1e1e] text-white text-xs placeholder-neutral-700 focus:outline-none focus:border-primary/60 transition-colors"
              style={{ borderRadius: 0 }}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {['all', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-white border-primary'
                    : 'border-[#1e1e1e] text-neutral-500 hover:text-white hover:border-[#333]'
                }`}
                style={{ borderRadius: 0 }}
              >
                {cat === 'all' ? marketplace.allCategories : marketplace.categories[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-24">
            <div className="w-5 h-5 border-t-2 border-primary animate-spin rounded-full" />
            <span className="text-neutral-600 text-xs uppercase tracking-widest">{marketplace.loading}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <ShoppingBag size={40} className="text-neutral-800 mx-auto mb-4" />
            <p className="text-neutral-600 text-sm">{marketplace.noProducts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.$id} product={product} lang={lang} marketplace={marketplace} />
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <section className="border border-[#1a1a1a] bg-[#0a0a0a] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase text-primary tracking-widest mb-2">
              {marketplace.contactToBuy}
            </p>
            <h2
              className="text-2xl font-black uppercase text-white leading-none"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {lang === 'fr' ? 'Intéressé par un produit ?' : 'Interested in a product?'}
            </h2>
            <p className="text-neutral-500 text-xs mt-2 max-w-sm">
              {lang === 'fr'
                ? "Contactez-nous directement pour passer commande ou obtenir plus d'informations."
                : 'Reach out to us directly to place an order or get more information.'}
            </p>
          </div>
          <Link
            href="/#contact"
            className="flex-shrink-0 px-8 py-3 bg-primary text-white font-bold uppercase text-sm tracking-widest hover:bg-primary/90 transition-colors"
            style={{ borderRadius: 0 }}
          >
            {t.publicNav?.contact}
          </Link>
        </section>
      </div>
    </div>
  );
}
