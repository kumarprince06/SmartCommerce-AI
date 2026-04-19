import { useEffect, useState } from 'react';
import { ShoppingBag, Loader, RefreshCw } from 'lucide-react';
import api from '../../services/api';

interface Order {
  id: number;
  status: string;
  totalAmount: number;
  createdAt?: string;
}

export default function VendorOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    setError('');
    api.get('/orders/vendor')
      .then(res => {
        const data = res.data.data;
        setOrders(Array.isArray(data) ? data : (data?.content || []));
      })
      .catch(() => {
        // If vendor endpoint doesn't exist yet, fall back to empty state gracefully
        setOrders([]);
        setError('');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch {
      alert('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColor = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      PENDING:    { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
      PROCESSING: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
      SHIPPED:    { bg: 'rgba(139,92,246,0.12)', color: 'var(--secondary)' },
      DELIVERED:  { bg: 'var(--success-bg)', color: 'var(--success)' },
      CANCELLED:  { bg: 'var(--danger-bg)', color: 'var(--danger)' },
    };
    return map[status] || map.PENDING;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShoppingBag size={24} color="var(--success, #16a34a)" />
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Order Fulfillment</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>Manage and update your order statuses</p>
          </div>
        </div>
        <button
          onClick={fetchOrders}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.875rem' }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Loader size={32} />
          <p style={{ marginTop: '1rem' }}>Loading orders...</p>
        </div>
      )}

      {!loading && (
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Order ID</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <ShoppingBag size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 1rem' }} />
                    <p style={{ fontWeight: 500 }}>No orders yet</p>
                    <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Orders from customers will appear here</p>
                  </td>
                </tr>
              ) : orders.map(order => {
                const sc = statusColor(order.status);
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, fontFamily: 'monospace' }}>#{order.id}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-xl)', fontSize: '0.8125rem', fontWeight: 600, background: sc.bg, color: sc.color }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>₹{order.totalAmount?.toFixed(2) || '—'}</td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={e => handleStatusUpdate(order.id, e.target.value)}
                        style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.875rem' }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
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
