import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, Server, Layers, AlertCircle, Save } from 'lucide-react';
import api from '../../services/api';

interface Attribute {
  name: string;
  values: string[];
}

interface Variant {
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export default function CreateProduct() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Phase 1 States
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('Electronics');
  
  // Phase 2 States
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrValue, setNewAttrValue] = useState('');

  // Phase 3 States
  const [variants, setVariants] = useState<Variant[]>([]);

  const handleAddAttribute = () => {
    if (!newAttrName || !newAttrValue) return;
    const existing = attributes.find(a => a.name === newAttrName);
    if (existing) {
      if (!existing.values.includes(newAttrValue)) {
        setAttributes(attrs => attrs.map(a => a.name === newAttrName ? { ...a, values: [...a.values, newAttrValue] } : a));
      }
    } else {
      setAttributes([...attributes, { name: newAttrName, values: [newAttrValue] }]);
    }
    setNewAttrValue('');
  };

  const generateVariantsMatrix = () => {
    if (attributes.length === 0) return;
    
    // Cartesian Product mapping explicitly for Variant SKU generations cleanly
    const cartesian = (arrays: string[][]): string[][] => 
      arrays.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat() as string[])), [[]] as string[][]);

    const valuesMatrix = attributes.map(a => a.values);
    const combinations = cartesian(valuesMatrix);
    
    const generatedVariants: Variant[] = combinations.map(combo => {
      const attrMap: Record<string, string> = {};
      attributes.forEach((attr, idx) => {
        attrMap[attr.name] = combo[idx];
      });
      return {
        sku: `SKU-${Math.floor(Math.random() * 10000)}`,
        price: 0,
        stock: 0,
        attributes: attrMap
      };
    });
    
    setVariants(generatedVariants);
    setStep(3);
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const submitProductNative = async () => {
    setLoading(true);
    try {
      // 1. Map the Base Product Mapping natively
      const res = await api.post('/products', {
        name, description, categoryName
      });
      const productId = res.data.data.id;

      // 2. Iterate mappings sequentially matching variants
      for (const variant of variants) {
        await api.post(`/products/${productId}/variants`, {
          sku: variant.sku,
          price: variant.price,
          stock: variant.stock,
          attributes: variant.attributes
        });
      }

      navigate('/vendor/products');
    } catch (err: any) {
      console.error(err);
      alert('API Failed triggering structurally: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>Create Product Wrapper</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ color: step === 1 ? 'var(--primary)' : 'var(--text-muted)' }}>1. Basic Info</span>
          <span style={{ color: step === 2 ? 'var(--primary)' : 'var(--text-muted)' }}>2. Attributes</span>
          <span style={{ color: step === 3 ? 'var(--primary)' : 'var(--text-muted)' }}>3. Matrix Limits</span>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Server size={20} /> Base Identifiers</h2>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Product Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Category</label>
              <input type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', minHeight: '100px' }} />
            </div>
            <button onClick={() => setStep(2)} style={{ padding: '0.75rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Next Step <Layers size={18} /></button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Layers size={20} /> Define Attribute Maps</h2>
            <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Attribute Key (e.g., Color)</label>
                <input type="text" value={newAttrName} onChange={e => setNewAttrName(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Value (e.g., Red)</label>
                <input type="text" value={newAttrValue} onChange={e => setNewAttrValue(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
              </div>
              <button onClick={handleAddAttribute} style={{ padding: '0.5rem 1rem', background: 'var(--secondary)', color: 'white', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer' }}>Add Limit</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {attributes.map(attr => (
                <div key={attr.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 600, minWidth: '100px' }}>{attr.name}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {attr.values.map(val => (
                      <span key={val} style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-xl)', fontSize: '0.875rem' }}>{val}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button onClick={() => setStep(1)} style={{ padding: '0.75rem', background: 'none', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Back</button>
              <button onClick={generateVariantsMatrix} style={{ padding: '0.75rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>Generate Matrix <PackagePlus size={18} /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PackagePlus size={20} /> Variant Manager Constraints</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--warning-bg)', color: 'var(--warning)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <AlertCircle size={18} /> Matrix generated {variants.length} explicit unique product boundaries natively. Set Prices & Stocks appropriately!
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Variant Profile</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Generated SKU</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', width: '150px' }}>Price Target ($)</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', width: '120px' }}>Stock Bounds</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '1rem' }}>
                         {Object.entries(variant.attributes).map(([k,v]) => `${k}: ${v}`).join(' • ')}
                      </td>
                      <td style={{ padding: '1rem' }}>
                         <input type="text" value={variant.sku} onChange={e => handleVariantChange(idx, 'sku', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
                      </td>
                      <td style={{ padding: '1rem' }}>
                         <input type="number" value={variant.price} onChange={e => handleVariantChange(idx, 'price', parseFloat(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
                      </td>
                      <td style={{ padding: '1rem' }}>
                         <input type="number" value={variant.stock} onChange={e => handleVariantChange(idx, 'stock', parseInt(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button onClick={() => setStep(2)} style={{ padding: '0.75rem', background: 'none', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Back</button>
              <button disabled={loading} onClick={submitProductNative} style={{ padding: '0.75rem 1.5rem', background: 'var(--success)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {loading ? 'Resolving Network...' : <><Save size={18} /> Confirm Deployment</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
