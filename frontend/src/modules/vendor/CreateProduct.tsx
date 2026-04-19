import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, Server, Layers, AlertCircle, Save, ChevronRight, CheckCircle } from 'lucide-react';
import api from '../../services/api';

interface Category {
  id: number;
  name: string;
}

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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Step 1 — Basic Info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [categories, setCategories] = useState<Category[]>([]);

  // Step 2 — Attributes
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrValue, setNewAttrValue] = useState('');

  // Step 3 — Variants
  const [variants, setVariants] = useState<Variant[]>([]);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data.data || []))
      .catch(() => setCategories([]));
  }, []);

  const handleAddAttribute = () => {
    if (!newAttrName.trim() || !newAttrValue.trim()) return;
    const trimmedName = newAttrName.trim();
    const trimmedValue = newAttrValue.trim();
    const existing = attributes.find(a => a.name === trimmedName);
    if (existing) {
      if (!existing.values.includes(trimmedValue)) {
        setAttributes(attrs => attrs.map(a =>
          a.name === trimmedName ? { ...a, values: [...a.values, trimmedValue] } : a
        ));
      }
    } else {
      setAttributes([...attributes, { name: trimmedName, values: [trimmedValue] }]);
    }
    setNewAttrValue('');
  };

  const removeAttribute = (attrName: string) => {
    setAttributes(attrs => attrs.filter(a => a.name !== attrName));
  };

  const removeAttributeValue = (attrName: string, val: string) => {
    setAttributes(attrs => attrs.map(a =>
      a.name === attrName ? { ...a, values: a.values.filter(v => v !== val) } : a
    ).filter(a => a.values.length > 0));
  };

  const generateVariantsMatrix = () => {
    if (attributes.length === 0) {
      // Allow simple product with no variants — create one default variant
      setVariants([{ sku: `SKU-${Date.now()}`, price: 0, stock: 0, attributes: {} }]);
      setStep(3);
      return;
    }
    const cartesian = (arrays: string[][]): string[][] =>
      arrays.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat() as string[])), [[]] as string[][]);

    const valuesMatrix = attributes.map(a => a.values);
    const combinations = cartesian(valuesMatrix);

    const generatedVariants: Variant[] = combinations.map(combo => {
      const attrMap: Record<string, string> = {};
      attributes.forEach((attr, idx) => { attrMap[attr.name] = combo[idx]; });
      return { sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 9999)}`, price: 0, stock: 0, attributes: attrMap };
    });

    setVariants(generatedVariants);
    setStep(3);
  };

  const handleVariantChange = (index: number, field: 'sku' | 'price' | 'stock', value: string) => {
    const updated = [...variants];
    if (field === 'price') updated[index] = { ...updated[index], price: parseFloat(value) || 0 };
    else if (field === 'stock') updated[index] = { ...updated[index], stock: parseInt(value) || 0 };
    else updated[index] = { ...updated[index], sku: value };
    setVariants(updated);
  };

  const goToStep2 = () => {
    if (!name.trim() || !categoryId) {
      setError('Product name and category are required.');
      return;
    }
    setError('');
    setStep(2);
  };

  const submitProduct = async () => {
    setLoading(true);
    setError('');
    try {
      // Step 1: Create base product
      const productRes = await api.post('/products', {
        name: name.trim(),
        description: description.trim(),
        categoryId: Number(categoryId),
      });
      const productId = productRes.data.data.id;

      // Step 2: Submit all variants as a batch
      if (variants.length > 0) {
        await api.post(`/products/${productId}/variants`, {
          variants: variants.map(v => ({
            sku: v.sku,
            price: v.price,
            stock: v.stock,
            attributes: v.attributes,
          })),
        });
      }

      navigate('/vendor/products');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  const stepStyle = (s: number) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-xl)',
    fontSize: '0.875rem',
    fontWeight: 600 as const,
    background: step === s ? 'var(--primary)' : step > s ? 'var(--success-bg)' : 'var(--bg-primary)',
    color: step === s ? 'white' : step > s ? 'var(--success)' : 'var(--text-muted)',
  });

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-light)',
    background: 'var(--bg-main)',
    color: 'var(--text-primary)',
    fontSize: '0.9375rem',
    boxSizing: 'border-box' as const,
    outline: 'none',
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Create New Product
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Follow the steps to set up your product with variants and inventory.
        </p>
      </div>

      {/* Step Indicators */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={stepStyle(1)}>{step > 1 ? <CheckCircle size={16} /> : <Server size={16} />} 1. Basic Info</div>
        <ChevronRight size={18} color="var(--text-muted)" style={{ marginTop: '0.4rem' }} />
        <div style={stepStyle(2)}>{step > 2 ? <CheckCircle size={16} /> : <Layers size={16} />} 2. Attributes</div>
        <ChevronRight size={18} color="var(--text-muted)" style={{ marginTop: '0.4rem' }} />
        <div style={stepStyle(3)}><PackagePlus size={16} /> 3. Variants</div>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg, #fff1f0)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Product Details</h2>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Product Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="product-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Premium Wireless Headphones"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Category <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <select
                id="product-category"
                value={categoryId}
                onChange={e => setCategoryId(Number(e.target.value))}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">— Select a category —</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Description
              </label>
              <textarea
                id="product-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your product in detail..."
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '100px', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                id="step1-next"
                onClick={goToStep2}
                style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Product Attributes</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Define attributes (e.g. Color: Red, Blue) to generate variant combinations. Skip if no variants needed.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Attribute (e.g. Color)</label>
                <input
                  id="attr-name"
                  type="text"
                  value={newAttrName}
                  onChange={e => setNewAttrName(e.target.value)}
                  placeholder="Color"
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Value (e.g. Red)</label>
                <input
                  id="attr-value"
                  type="text"
                  value={newAttrValue}
                  onChange={e => setNewAttrValue(e.target.value)}
                  placeholder="Red"
                  onKeyDown={e => e.key === 'Enter' && handleAddAttribute()}
                  style={inputStyle}
                />
              </div>
              <button
                id="add-attr"
                onClick={handleAddAttribute}
                style={{ padding: '0.75rem 1.25rem', background: 'var(--secondary)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                + Add
              </button>
            </div>

            {attributes.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {attributes.map(attr => (
                  <div key={attr.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'var(--bg-main)' }}>
                    <div style={{ fontWeight: 600, minWidth: '100px', color: 'var(--text-primary)' }}>{attr.name}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
                      {attr.values.map(val => (
                        <span
                          key={val}
                          onClick={() => removeAttributeValue(attr.name, val)}
                          style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-xl)', fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          title="Click to remove"
                        >
                          {val} ×
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => removeAttribute(attr.name)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem' }}
                      title="Remove attribute"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <button onClick={() => setStep(1)} style={{ padding: '0.75rem 1.25rem', background: 'none', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                ← Back
              </button>
              <button
                id="generate-matrix"
                onClick={generateVariantsMatrix}
                style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center' }}
              >
                Generate Variants <PackagePlus size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Variants & Inventory</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Set price and stock for each variant. SKUs are auto-generated but editable.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245,158,11,0.1)', color: 'var(--warning, #f59e0b)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
              <AlertCircle size={16} /> {variants.length} variant{variants.length !== 1 ? 's' : ''} generated — set prices and stock before publishing.
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                    <th style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Variant</th>
                    <th style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>SKU</th>
                    <th style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, width: '140px' }}>Price (₹)</th>
                    <th style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, width: '110px' }}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {Object.entries(variant.attributes).map(([k, v]) => `${k}: ${v}`).join(' · ') || 'Default'}
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={e => handleVariantChange(idx, 'sku', e.target.value)}
                          style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
                        />
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <input
                          type="number"
                          min="0"
                          value={variant.price}
                          onChange={e => handleVariantChange(idx, 'price', e.target.value)}
                          style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                        />
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <input
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={e => handleVariantChange(idx, 'stock', e.target.value)}
                          style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <button onClick={() => setStep(2)} style={{ padding: '0.75rem 1.25rem', background: 'none', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                ← Back
              </button>
              <button
                id="submit-product"
                disabled={loading}
                onClick={submitProduct}
                style={{ padding: '0.75rem 2rem', background: loading ? 'var(--text-muted)' : 'var(--success, #16a34a)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center' }}
              >
                {loading ? 'Publishing...' : <><Save size={18} /> Publish Product</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
