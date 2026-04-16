import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function VendorOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // For MVP mapping, querying generic orders array structurally targeting vendor parameters intrinsically in backend
    api.get('/orders')
      .then(res => setOrders(res.data.data.content))
      .catch(err => console.error(err));
  }, []);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (err: any) {
      alert('Cannot mutate boundary limits natively: ' + err.message);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)', marginBottom: '2rem' }}>Order Fulfillment Board</h1>
      
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Order ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Lifecycle Target</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Revenue Mapping</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status Patching</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>#{order.id}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: 'var(--radius-xl)', 
                    fontSize: '0.875rem',
                    background: order.status === 'DELIVERED' ? 'var(--success-bg)' : 'var(--primary-light)',
                    color: order.status === 'DELIVERED' ? 'var(--success)' : 'var(--primary)',
                    fontWeight: 600
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontWeight: 600 }}>${order.totalAmount.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>
                  <select 
                    value={order.status} 
                    onChange={e => handleStatusUpdate(order.id, e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
