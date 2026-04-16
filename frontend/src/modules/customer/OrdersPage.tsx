import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data.data.content))
      .catch(err => console.error("Orders mapping dropped", err));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '2rem' }}>Order History</h1>
      
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No historical logs tracked natively around your profile yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Order #{order.id} • Placed {new Date(order.createdAt).toLocaleDateString()}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-xl)', fontSize: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>{order.status}</span>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-xl)', fontSize: '0.75rem', background: 'var(--warning-bg)', color: 'var(--warning)', fontWeight: 600 }}>{order.paymentStatus}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Amount</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>${order.totalAmount.toFixed(2)}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-admin)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                      <Package size={24} color="var(--text-muted)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{item.productName}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>SKU: {item.variantSku} • Qty {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 600 }}>${item.totalPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
