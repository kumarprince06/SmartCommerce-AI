import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertCircle, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleCheckout = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/orders', {
        items: items.map(item => ({ variantId: item.variantId, quantity: item.quantity }))
      });
      clearCart();
      navigate('/orders');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <ShoppingBag size={40} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Add products from the catalog to get started.</p>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'var(--primary)', color: 'white', padding: '0.875rem 2rem', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowRight size={18} /> Browse Products
        </button>
      </div>
    );
  }

  const tax = total * 0.18; // 18% GST

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
      {/* Cart Items */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>
            Shopping Cart <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '1.25rem' }}>({items.length} item{items.length !== 1 ? 's' : ''})</span>
          </h1>
          <button
            onClick={clearCart}
            style={{ background: 'none', border: '1px solid var(--border-light)', color: 'var(--danger)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Trash2 size={14} /> Clear All
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {items.map((item, index) => (
            <div
              key={item.variantId}
              style={{
                display: 'flex', gap: '1.5rem', alignItems: 'center',
                padding: '1.5rem 2rem',
                borderBottom: index < items.length - 1 ? '1px solid var(--border-light)' : 'none',
              }}
            >
              {/* Thumbnail */}
              <div style={{ width: '80px', height: '80px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShoppingBag size={30} color="var(--border-light)" />
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>{item.productName}</h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                  {Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(' · ')} · SKU: {item.sku}
                </div>
                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>${item.price.toFixed(2)} each</div>
              </div>

              {/* Qty Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => item.quantity > 1 ? updateQuantity(item.variantId, item.quantity - 1) : removeItem(item.variantId)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Line Total */}
              <div style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: '80px', textAlign: 'right' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.variantId)}
                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '2rem', position: 'sticky', top: '90px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
          Order Summary
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>GST (18%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontSize: '0.875rem' }}>
            <span>Shipping</span>
            <span>FREE</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: 700 }}>
          <span>Total</span>
          <span style={{ color: 'var(--primary)' }}>${(total + tax).toFixed(2)}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{ width: '100%', background: 'var(--primary)', color: 'white', border: 'none', padding: '1rem', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '1.05rem', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          {loading ? 'Placing Order...' : <><ArrowRight size={20} /> Proceed to Checkout</>}
        </button>

        {!isAuthenticated && (
          <p style={{ color: 'var(--warning)', fontSize: '0.8rem', textAlign: 'center', marginTop: '0.75rem' }}>
            You need to login to place an order
          </p>
        )}
      </div>
    </div>
  );
}
