import { useEffect, useState } from 'react';
import { Package, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface OrderItem {
  id: number;
  productName: string;
  variantSku: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface OrderRecord {
  id: number;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING:    { bg: 'var(--warning-bg)',  color: 'var(--warning)' },
  PROCESSING: { bg: 'var(--primary-light)', color: 'var(--primary)' },
  SHIPPED:    { bg: 'var(--primary-light)', color: 'var(--primary)' },
  DELIVERED:  { bg: 'var(--success-bg)',  color: 'var(--success)' },
  CANCELLED:  { bg: 'var(--danger-bg)',   color: 'var(--danger)' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data.data?.content ?? []))
      .catch(err => console.error('Orders fetch error', err))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id: number) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '2rem' }}>Order History</h1>
        {[1, 2, 3].map(i => (
          <div key={i} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', opacity: 0.6 }}>
            <div style={{ background: 'var(--border-light)', height: '1rem', width: '40%', borderRadius: 4, marginBottom: '1rem' }} />
            <div style={{ background: 'var(--border-light)', height: '0.75rem', width: '70%', borderRadius: 4 }} />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <ShoppingBag size={40} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--secondary)', marginBottom: '1rem' }}>No Orders Yet</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
          When you place your first order, it will appear here with real-time status tracking.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'var(--primary)', color: 'white', padding: '0.875rem 2rem', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Order History</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map(order => {
          const statusStyle = STATUS_COLORS[order.status] ?? { bg: 'var(--bg-surface)', color: 'var(--text-muted)' };
          const isExpanded = expanded.includes(order.id);

          return (
            <div key={order.id} className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {/* Order Header */}
              <div
                onClick={() => toggleExpand(order.id)}
                style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: isExpanded ? '1px solid var(--border-light)' : 'none' }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Order #{order.id} • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ padding: '0.25rem 0.875rem', borderRadius: 'var(--radius-xl)', fontSize: '0.75rem', background: statusStyle.bg, color: statusStyle.color, fontWeight: 700 }}>
                      {order.status}
                    </span>
                    <span style={{ padding: '0.25rem 0.875rem', borderRadius: 'var(--radius-xl)', fontSize: '0.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                      ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
              </div>

              {/* Order Items — collapsible */}
              {isExpanded && (
                <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
                        <Package size={22} color="var(--text-muted)" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{item.productName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          SKU: {item.variantSku} · Qty: {item.quantity} · Unit: ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                        ${item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
