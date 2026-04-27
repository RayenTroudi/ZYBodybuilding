'use client';

import { useState, useEffect, useRef } from 'react';
import { cachedFetch, invalidateCache } from '@/lib/cache';
import {
  Plus, AlertTriangle, CheckCircle, XCircle,
  Package, Tag, Upload, Trash2, ImageIcon, Star,
} from 'lucide-react';
import { appwriteConfig } from '@/lib/appwrite/config';

const CATEGORIES = ['supplements', 'apparel', 'equipment', 'accessories'];
const CATEGORY_LABELS = {
  supplements: 'Supplements',
  apparel: 'Apparel',
  equipment: 'Equipment',
  accessories: 'Accessories',
};

const FL = (text) => (
  <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-1" style={{ letterSpacing: '0.2em' }}>{text}</p>
);

const inputCls = 'w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] text-white text-xs placeholder-neutral-700 focus:outline-none focus:border-primary transition-colors';
const inputStyle = { borderRadius: 0, fontFamily: "'DM Sans', sans-serif" };

const EMPTY_FORM = {
  name_en: '', name_fr: '',
  description_en: '', description_fr: '',
  price: '', category: 'supplements',
  inStock: true, isActive: true, featured: false,
  imageIds: [],
};

function getImageUrl(fileId) {
  return `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.productImagesBucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await cachedFetch('/api/admin/marketplace', {}, 30000);
      setProducts(data.documents || []);
    } catch { setProducts([]); } finally { setLoading(false); }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const openNew = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name_en: product.name_en || '',
      name_fr: product.name_fr || '',
      description_en: product.description_en || '',
      description_fr: product.description_fr || '',
      price: product.price?.toString() || '',
      category: product.category || 'supplements',
      inStock: product.inStock !== false,
      isActive: product.isActive !== false,
      featured: product.featured === true,
      imageIds: product.imageIds || [],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const url = editingProduct
        ? `/api/admin/marketplace/${editingProduct.$id}`
        : '/api/admin/marketplace';
      const res = await fetch(url, {
        method: editingProduct ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        invalidateCache('/api/admin/marketplace');
        setShowModal(false);
        setEditingProduct(null);
        setFormData(EMPTY_FORM);
        fetchProducts();
        showToast(editingProduct ? 'Product updated' : 'Product created', 'success');
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to save product', 'error');
      }
    } catch { showToast('Failed to save product', 'error'); }
    finally { setSavingProduct(false); }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`/api/admin/marketplace/${productToDelete.$id}`, { method: 'DELETE' });
      if (res.ok) {
        invalidateCache('/api/admin/marketplace');
        setShowDeleteModal(false);
        setProductToDelete(null);
        fetchProducts();
        showToast('Product deleted', 'success');
      } else { showToast('Failed to delete product', 'error'); }
    } catch { showToast('Failed to delete product', 'error'); }
  };

  const handleToggle = async (product, field) => {
    try {
      await fetch(`/api/admin/marketplace/${product.$id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !product[field] }),
      });
      invalidateCache('/api/admin/marketplace');
      fetchProducts();
    } catch {}
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`/api/admin/marketplace/${editingProduct.$id}/image`, {
        method: 'POST',
        body: fd,
      });
      if (res.ok) {
        const { fileId } = await res.json();
        const updatedIds = [...formData.imageIds, fileId];
        setFormData((prev) => ({ ...prev, imageIds: updatedIds }));
        invalidateCache('/api/admin/marketplace');
        showToast('Image uploaded', 'success');
      } else { showToast('Failed to upload image', 'error'); }
    } catch { showToast('Failed to upload image', 'error'); }
    finally { setUploadingImage(false); e.target.value = ''; }
  };

  const handleDeleteImage = async (fileId) => {
    if (!editingProduct) return;
    try {
      const res = await fetch(
        `/api/admin/marketplace/${editingProduct.$id}/image?fileId=${fileId}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        setFormData((prev) => ({ ...prev, imageIds: prev.imageIds.filter((id) => id !== fileId) }));
        invalidateCache('/api/admin/marketplace');
        showToast('Image removed', 'success');
      } else { showToast('Failed to remove image', 'error'); }
    } catch { showToast('Failed to remove image', 'error'); }
  };

  const filtered = filterCategory === 'all'
    ? products
    : products.filter((p) => p.category === filterCategory);

  if (!mounted) return (
    <div className="space-y-5 max-w-7xl">
      <div className="bg-[#0c0c0c] border border-[#161616] flex items-center justify-center gap-3 py-16">
        <div className="w-4 h-4 border-t-2 border-primary animate-spin rounded-full" />
        <span className="text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 max-w-7xl">

      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-[#141414]">
        <div>
          {FL('Gym Shop')}
          <h1 className="text-white font-black uppercase leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', letterSpacing: '-0.01em' }}>
            Marketplace
          </h1>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase hover:bg-primary-600 transition-colors"
          style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
          <Plus size={12} /> Add Product
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: products.length, color: 'text-white' },
          { label: 'Active', value: products.filter((p) => p.isActive).length, color: 'text-green-400' },
          { label: 'Out of Stock', value: products.filter((p) => !p.inStock).length, color: 'text-red-500' },
          { label: 'Featured', value: products.filter((p) => p.featured).length, color: 'text-yellow-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#0c0c0c] border border-[#161616] p-5">
            {FL(label)}
            <p className={`font-black leading-none mt-2 ${color}`}
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.2rem' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...CATEGORIES].map((cat) => (
          <button key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase border transition-colors ${
              filterCategory === cat
                ? 'bg-primary text-white border-primary'
                : 'border-[#1e1e1e] text-neutral-600 hover:text-white hover:border-[#2a2a2a]'
            }`}
            style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
            {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="bg-[#0c0c0c] border border-[#161616] flex items-center justify-center gap-3 py-16">
          <div className="w-4 h-4 border-t-2 border-primary animate-spin rounded-full" />
          <span className="text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>Loading...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#0c0c0c] border border-[#161616] py-16 text-center">
          <Package size={24} className="text-neutral-800 mx-auto mb-3" />
          <p className="text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>No products</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((product) => {
            const coverUrl = product.imageIds?.[0] ? getImageUrl(product.imageIds[0]) : null;
            return (
              <div key={product.$id}
                className={`bg-[#0c0c0c] border flex flex-col overflow-hidden transition-colors ${
                  product.isActive ? 'border-[#1e1e1e] hover:border-[#2a2a2a]' : 'border-[#111] opacity-50'
                }`}>
                <div className={`h-[2px] ${product.isActive ? 'bg-primary' : 'bg-[#1a1a1a]'}`} />

                {/* Cover image */}
                <div className="h-36 bg-[#080808] flex items-center justify-center overflow-hidden relative">
                  {coverUrl ? (
                    <img src={coverUrl} alt={product.name_en} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={28} className="text-neutral-800" />
                  )}
                  {product.featured && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[9px] font-bold uppercase"
                      style={{ letterSpacing: '0.12em' }}>
                      <Star size={8} /> Featured
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500/20 border border-red-500/40 text-red-400 text-[9px] font-bold uppercase"
                      style={{ letterSpacing: '0.12em' }}>
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-white font-black uppercase truncate"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.05rem', letterSpacing: '0.04em' }}>
                        {product.name_en}
                      </p>
                      <p className="text-neutral-600 text-[10px] truncate">{product.name_fr}</p>
                    </div>
                    <span className="px-1.5 py-0.5 bg-[#111] border border-[#1e1e1e] text-neutral-600 text-[9px] uppercase flex-shrink-0"
                      style={{ letterSpacing: '0.1em' }}>
                      {CATEGORY_LABELS[product.category]}
                    </span>
                  </div>

                  {product.description_en && (
                    <p className="text-neutral-700 text-[10px] leading-relaxed line-clamp-2">{product.description_en}</p>
                  )}

                  <p className="text-primary font-black mt-auto"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.4rem' }}>
                    {parseFloat(product.price).toFixed(2)}
                    <span className="text-neutral-600 text-xs ml-1">TND</span>
                  </p>
                </div>

                <div className="flex border-t border-[#161616]">
                  <button onClick={() => handleToggle(product, 'isActive')}
                    className={`px-3 py-2.5 text-[9px] font-bold uppercase border-r border-[#161616] transition-colors ${
                      product.isActive ? 'text-green-500 hover:bg-[#111]' : 'text-neutral-700 hover:text-white hover:bg-[#111]'
                    }`}
                    style={{ letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {product.isActive ? 'Active' : 'Hidden'}
                  </button>
                  <button onClick={() => handleEdit(product)}
                    className="flex-1 py-2.5 text-neutral-600 text-[10px] font-bold uppercase hover:text-white hover:bg-[#111] transition-colors border-r border-[#161616]"
                    style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Edit
                  </button>
                  <button onClick={() => { setProductToDelete(product); setShowDeleteModal(true); }}
                    className="px-4 py-2.5 text-red-600/50 text-[10px] font-bold uppercase hover:text-red-500 hover:bg-[#111] transition-colors"
                    style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Del
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0c0c] border border-[#1e1e1e] w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-[#161616] flex items-center justify-between">
              <h2 className="text-white font-black uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', letterSpacing: '0.06em' }}>
                {editingProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={() => { setShowModal(false); setEditingProduct(null); }}
                className="text-neutral-600 hover:text-white transition-colors text-xs">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">

              {/* Bilingual names */}
              <div>
                {FL('Product Names')}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-semibold uppercase text-neutral-700 mb-1.5" style={{ letterSpacing: '0.18em' }}>
                      Name (English) *
                    </label>
                    <input value={formData.name_en} required
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      placeholder="e.g. Whey Protein" className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold uppercase text-neutral-700 mb-1.5" style={{ letterSpacing: '0.18em' }}>
                      Nom (Français) *
                    </label>
                    <input value={formData.name_fr} required
                      onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                      placeholder="ex. Protéine Whey" className={inputCls} style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Bilingual descriptions */}
              <div>
                {FL('Descriptions')}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-semibold uppercase text-neutral-700 mb-1.5" style={{ letterSpacing: '0.18em' }}>
                      Description (EN)
                    </label>
                    <textarea value={formData.description_en} rows={3}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      placeholder="Product description..." className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold uppercase text-neutral-700 mb-1.5" style={{ letterSpacing: '0.18em' }}>
                      Description (FR)
                    </label>
                    <textarea value={formData.description_fr} rows={3}
                      onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                      placeholder="Description du produit..." className={inputCls} style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-semibold uppercase text-neutral-700 mb-1.5" style={{ letterSpacing: '0.18em' }}>
                    Price (TND) *
                  </label>
                  <input value={formData.price} required type="number" step="0.01" min="0"
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00" className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold uppercase text-neutral-700 mb-1.5" style={{ letterSpacing: '0.18em' }}>
                    Category *
                  </label>
                  <select value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={inputCls} style={{ ...inputStyle, appearance: 'none' }}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-6">
                {[
                  { key: 'isActive', label: 'Active (visible in shop)' },
                  { key: 'inStock', label: 'In Stock' },
                  { key: 'featured', label: 'Featured' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                      className="w-3.5 h-3.5 accent-red-600" />
                    <span className="text-xs text-neutral-500">{label}</span>
                  </label>
                ))}
              </div>

              {/* Images — only when editing (need a product ID to attach files) */}
              {editingProduct && (
                <div>
                  {FL('Product Images')}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.imageIds.map((fileId) => (
                      <div key={fileId} className="relative w-20 h-20 bg-[#080808] border border-[#1e1e1e] overflow-hidden group">
                        <img src={getImageUrl(fileId)} alt="" className="w-full h-full object-cover" />
                        <button type="button"
                          onClick={() => handleDeleteImage(fileId)}
                          className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-20 h-20 border border-dashed border-[#2a2a2a] flex flex-col items-center justify-center gap-1 text-neutral-700 hover:text-neutral-400 hover:border-[#3a3a3a] transition-colors disabled:opacity-40">
                      {uploadingImage
                        ? <div className="w-4 h-4 border-t-2 border-primary animate-spin rounded-full" />
                        : <><Upload size={14} /><span className="text-[9px] uppercase" style={{ letterSpacing: '0.1em' }}>Add</span></>
                      }
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                      className="hidden" onChange={handleImageUpload} />
                  </div>
                  <p className="text-neutral-800 text-[10px]">Upload images after saving the product for the first time.</p>
                </div>
              )}

              {!editingProduct && (
                <p className="text-neutral-700 text-[10px] border border-dashed border-[#1e1e1e] p-3">
                  Save the product first, then re-open it to upload images.
                </p>
              )}

              <div className="flex border-t border-[#161616] pt-4 gap-3">
                <button type="button" onClick={() => { setShowModal(false); setEditingProduct(null); }}
                  className="flex-1 py-2.5 border border-[#1e1e1e] text-neutral-600 text-xs font-bold uppercase hover:text-white hover:border-[#2a2a2a] transition-colors"
                  style={{ borderRadius: 0, letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Cancel
                </button>
                <button type="submit" disabled={savingProduct}
                  className="flex-1 py-2.5 bg-primary text-white text-xs font-bold uppercase hover:bg-primary-600 transition-colors disabled:opacity-50"
                  style={{ borderRadius: 0, letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {savingProduct ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0c0c] border border-[#1e1e1e] max-w-sm w-full">
            <div className="px-5 py-4 border-b border-[#161616] flex items-center gap-3">
              <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
              <h3 className="text-white font-black uppercase text-sm"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em' }}>
                Delete Product
              </h3>
            </div>
            <div className="px-5 py-4">
              <p className="text-neutral-500 text-xs leading-relaxed">
                Delete <span className="text-white font-semibold">{productToDelete.name_en}</span> and all its images? This cannot be undone.
              </p>
            </div>
            <div className="flex border-t border-[#161616]">
              <button onClick={() => { setShowDeleteModal(false); setProductToDelete(null); }}
                className="flex-1 py-3 text-neutral-600 text-xs font-bold uppercase hover:text-white hover:bg-[#111] transition-colors border-r border-[#161616]"
                style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>Cancel</button>
              <button onClick={handleDelete}
                className="flex-1 py-3 text-red-500 text-xs font-bold uppercase hover:text-white hover:bg-red-600 transition-colors"
                style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div className={`flex items-center gap-3 px-5 py-3.5 border-l-2 min-w-[260px] bg-[#0c0c0c] border border-[#1e1e1e] ${toast.type === 'success' ? 'border-l-green-500' : 'border-l-red-500'}`}>
            {toast.type === 'success'
              ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
              : <XCircle size={14} className="text-red-500 flex-shrink-0" />}
            <p className="text-white text-xs flex-1">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-neutral-600 hover:text-white transition-colors text-xs">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
