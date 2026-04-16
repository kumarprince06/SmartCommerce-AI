import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star } from 'lucide-react';
import api from '../../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  vendorName: string;
  categoryName: string;
}

export default function ProductListing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Directly hitting your Live Spring Boot APIs!
  useEffect(() => {
    api.get('/products')
      .then(res => {
        setProducts(res.data.data.content);
        setLoading(false);
      })
      .catch(err => console.error("API Map failure", err));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Explore Products</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', outline: 'none', width: '300px' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', cursor: 'pointer' }}>
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {products.map(product => (
            <div 
              key={product.id} 
              onClick={() => navigate(`/product/${product.id}`)}
              className="glass" 
              style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'transform var(--transition-fast)', cursor: 'pointer' }}
            >
              <div style={{ background: '#f8fafc', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/mock_tech.png" alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {product.categoryName} • {product.vendorName}
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--warning)', marginBottom: '1rem' }}>
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} color="var(--border-light)" />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '0.5rem' }}>(42)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>Select Options</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
