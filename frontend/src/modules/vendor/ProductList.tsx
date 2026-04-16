import { useEffect, useState } from 'react';
import { Package, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Ideally GET /vendors/me/products mapping natively. We'll utilize universal products bounded for MVP scope.
    api.get('/products')
      .then(res => setProducts(res.data.data.content))
      .catch(err => console.error("Products abstraction drop", err));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>My Product Matrix</h1>
        <button onClick={() => navigate('/vendor/products/create')} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer' }}>
          <Plus size={18} /> New Product Wrapper
        </button>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Product Array</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Category</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Traffic Hitbounds</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--bg-admin)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={20} color="var(--text-muted)" />
                  </div>
                  <span style={{ fontWeight: 500 }}>{product.name}</span>
                </td>
                <td style={{ padding: '1rem' }}><span style={{ padding: '0.25rem 0.75rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', fontSize: '0.875rem' }}>{product.categoryName}</span></td>
                <td style={{ padding: '1rem', color: 'var(--success)' }}>Active Scale</td>
                <td style={{ padding: '1rem' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Edit Matrix</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
