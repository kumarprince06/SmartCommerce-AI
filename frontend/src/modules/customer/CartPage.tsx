import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function CartPage() {
  const { items, removeItem, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const payload = {
        items: items.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        }))
      };

      await api.post('/orders', payload);
      clearCart();
      navigate('/orders'); // After tracking success organically mapping into history!
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transaction structurally aborted by backend');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Explore the catalog mapping live inventory natively.</p>
        <button onClick={() => navigate('/')} style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 2rem', borderRadius: 'var(--radius-xl)', border: 'none', cursor: 'pointer' }}>
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>Shopping Cart ({items.length} items)</h1>
        
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-bg)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
          {items.map((item, index) => (
            <div key={item.variantId} style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '1.5rem', borderBottom: index < items.length - 1 ? '1px solid var(--border-light)' : 'none'
            }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '0.5rem' }}>
                   <img src="/mock_tech.png" alt="Cart Item" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{item.productName}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    {Object.entries(item.attributes).map(([_,v]) => `${v}`).join(' • ')} (SKU: {item.sku})
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--primary)' }}>${item.price.toFixed(2)}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                  x{item.quantity}
                </div>
                <button 
                  onClick={() => removeItem(item.variantId)} 
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', height: 'max-content' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>Order Summary</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          <span>Tax & Shipping</span>
          <span>Calculated natively at checkout</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', fontSize: '1.25rem', fontWeight: 700 }}>
          <span>Total</span>
          <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={loading}
          style={{
            width: '100%',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '1.125rem',
            marginTop: '2rem',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}>
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
}
