import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../../services/api';

interface AIRecommendation {
  id: number;
  product: { id: number; name: string };
  reason: string;
  suggestedPrice: number;
  currentPrice?: number;
}

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState<number[]>([]);

  useEffect(() => {
    api.get('/ai/recommendations')
      .then(res => setRecommendations(res.data.data ?? []))
      .catch(() => setRecommendations([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = (id: number) => {
    setAccepted(prev => [...prev, id]);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ padding: '0.75rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-lg)' }}>
          <Sparkles size={28} color="var(--primary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>AI Pricing Recommendations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Intelligent suggestions based on market trends and sales patterns
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', opacity: 0.5 }}>
              <div style={{ background: 'var(--border-light)', height: '1rem', width: '60%', borderRadius: 4, marginBottom: '1rem' }} />
              <div style={{ background: 'var(--border-light)', height: '0.75rem', width: '90%', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="glass" style={{ padding: '4rem', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <TrendingUp size={32} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
            No Recommendations Yet
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
            The AI engine needs more sales data to generate pricing recommendations.
            As your products get purchased, intelligent adjustments will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {recommendations.map(rec => {
            const isAccepted = accepted.includes(rec.id);
            return (
              <div
                key={rec.id}
                className="glass"
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '2rem',
                  border: isAccepted ? '1px solid var(--success)' : '1px solid transparent',
                  transition: 'border var(--transition-fast)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem' }}>{rec.product.name}</h3>
                    {isAccepted && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
                        <CheckCircle size={16} /> Accepted
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                    <AlertCircle size={14} style={{ display: 'inline', marginRight: '0.4rem', color: 'var(--warning)' }} />
                    {rec.reason}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 600 }}>
                    {rec.currentPrice && (
                      <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '1.1rem' }}>
                        ${rec.currentPrice.toFixed(2)}
                      </span>
                    )}
                    <ArrowRight size={20} color="var(--text-muted)" />
                    <span style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>
                      ${rec.suggestedPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleAccept(rec.id)}
                  disabled={isAccepted}
                  style={{
                    padding: '0.875rem 1.75rem',
                    background: isAccepted ? 'var(--success)' : 'transparent',
                    border: `2px solid ${isAccepted ? 'var(--success)' : 'var(--primary)'}`,
                    color: isAccepted ? 'white' : 'var(--primary)',
                    borderRadius: 'var(--radius-md)',
                    cursor: isAccepted ? 'default' : 'pointer',
                    fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    whiteSpace: 'nowrap',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {isAccepted ? <><CheckCircle size={18} /> Accepted</> : <><Sparkles size={18} /> Accept Adjustment</>}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
