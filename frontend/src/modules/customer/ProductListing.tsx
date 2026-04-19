import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Package2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  vendorName: string;
  categoryName: string;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductListing() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [page, setPage]           = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params: Record<string, any> = { page, size: 12 };
    if (categoryId) params.categoryId = categoryId;

    api.get('/products', { params })
      .then(res => {
        const data = res.data.data;
        setProducts(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
      })
      .catch(err => console.error('Products fetch error', err))
      .finally(() => setLoading(false));
  }, [page, categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data.data ?? []))
      .catch(() => setCategories([]));
  }, []);

  const filtered = products.filter(p =>
    search.trim() === '' ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
          Explore Products
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {products.length > 0 ? `Showing ${filtered.length} products` : 'Browse our complete catalog'}
        </p>
      </div>

      {/* Filters Row */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{ padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', width: '100%', background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={categoryId ?? ''}
            onChange={e => { setCategoryId(e.target.value ? Number(e.target.value) : null); setPage(0); }}
            style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)', cursor: 'pointer', minWidth: '160px' }}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', animation: 'pulse 1.5s ease infinite' }}>
              <div style={{ background: 'var(--border-light)', height: '200px' }} />
              <div style={{ padding: '1.5rem' }}>
                <div style={{ background: 'var(--border-light)', height: '0.875rem', borderRadius: 4, marginBottom: '0.75rem', width: '60%' }} />
                <div style={{ background: 'var(--border-light)', height: '1.25rem', borderRadius: 4, marginBottom: '0.5rem' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <Package2 size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>No Products Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or clearing the category filter.</p>
          <button onClick={() => { setSearch(''); setCategoryId(null); }} style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {filtered.map(product => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="glass"
                style={{
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                  cursor: 'pointer', transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
              >
                <div style={{ background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-primary))', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package2 size={64} color="var(--border-light)" />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {product.categoryName} • {product.vendorName}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--warning)', marginBottom: '1rem' }}>
                    {[1,2,3,4].map(i => <Star key={i} size={14} fill="currentColor" />)}
                    <Star size={14} color="var(--border-light)" />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.25rem' }}>(42)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>View Options →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
