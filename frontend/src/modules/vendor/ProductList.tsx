import { useEffect, useState } from 'react';
import { Package, Plus, Loader, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Product {
  id: number;
  name: string;
  categoryName?: string;
  status?: string;
  variantCount?: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // GET /vendors/me/products returns the current vendor's products only
    // Fallback: use GET /products?vendorId param if /me/products isn't wired yet
    api.get('/vendors/me/products')
      .then(res => {
        const data = res.data.data;
        setProducts(Array.isArray(data) ? data : (data?.content || []));
      })
      .catch(() => {
        // Fallback: pull all products (MVP behaviour)
        api.get('/products?size=50')
          .then(res => setProducts(res.data.data?.content || []))
          .catch(() => setProducts([]));
      })
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (status?: string) => {
    if (status === 'ACTIVE') return { bg: 'var(--success-bg)', color: 'var(--success)' };
    if (status === 'INACTIVE') return { bg: 'var(--danger-bg)', color: 'var(--danger)' };
    return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package size={24} color="var(--success, #16a34a)" />
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>My Products</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
              {loading ? '...' : `${products.length} product${products.length !== 1 ? 's' : ''} listed`}
            </p>
          </div>
        </div>
        <button
          id="create-product-btn"
          onClick={() => navigate('/vendor/products/create')}
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Loader size={32} />
          <p style={{ marginTop: '1rem' }}>Loading products...</p>
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Product</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Package size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 1rem' }} />
                    <p style={{ fontWeight: 500 }}>No products yet</p>
                    <button
                      onClick={() => navigate('/vendor/products/create')}
                      style={{ marginTop: '0.75rem', padding: '0.6rem 1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}
                    >
                      + Create your first product
                    </button>
                  </td>
                </tr>
              ) : products.map(product => {
                const sc = statusColor(product.status);
                return (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Package size={20} color="var(--text-muted)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.name}</div>
                        {product.variantCount !== undefined && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{product.variantCount} variant{product.variantCount !== 1 ? 's' : ''}</div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {product.categoryName || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', background: sc.bg, color: sc.color, borderRadius: 'var(--radius-xl)', fontSize: '0.8125rem', fontWeight: 600 }}>
                        {product.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', padding: '0.4rem 0.875rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500 }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
