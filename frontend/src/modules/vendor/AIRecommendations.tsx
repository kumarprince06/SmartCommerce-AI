import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Calling Phase 1 Algorithms bounds mapped structurally
    api.get('/ai/recommendations')
      .then(res => setRecommendations(res.data.data))
      .catch(err => console.error("Algorithms unresponsive natively", err));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Sparkles size={28} color="var(--primary)" />
        <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>Algorithmic Pricing Rules</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr)', gap: '1.5rem' }}>
        {recommendations.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No scaling triggers fired from traffic patterns yet.</p>
        ) : (
          recommendations.map(rec => (
            <div key={rec.id} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{rec.product.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', maxWidth: '500px' }}>
                  {rec.reason}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                   <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>Current Bounds</span>
                   <ArrowRight size={20} color="var(--text-muted)" />
                   <span style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>${rec.suggestedPrice.toFixed(2)} Target</span>
                </div>
              </div>
              <button style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-surface)', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>
                Accept Algorithmic Adjustment
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
