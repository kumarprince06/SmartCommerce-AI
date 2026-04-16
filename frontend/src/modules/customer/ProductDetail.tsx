import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Shield, Truck } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

interface ProductDetails {
  id: number;
  name: string;
  description: string;
  vendorName: string;
  variants: ProductVariant[];
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);

  // Directly hitting Spring Boot API natively bridging domains
  useEffect(() => {
    Promise.all([
      api.get(`/products/${id}`),
      api.get(`/products/${id}/variants`)
    ]).then(([resProduct, resVariants]) => {
      const prod = resProduct.data.data;
      const vars = resVariants.data.data;
      setProduct({ ...prod, variants: vars });
      if (vars.length > 0) setSelectedVariant(vars[0]);
      setLoading(false);
    }).catch(err => console.error("Details API failure", err));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading details dynamically...</div>;
  if (!product) return <div>Product bounds lost</div>;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      sku: selectedVariant.sku,
      productName: product.name,
      price: selectedVariant.price,
      quantity: 1,
      attributes: selectedVariant.attributes
    });
    navigate('/cart');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
      {/* Visual Canvas Block */}
      <div className="glass" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/mock_tech.png" alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      
      {/* Metrics Payload Block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Sold by: {product.vendorName}</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--secondary)' }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
            <Star fill="currentColor" size={20} />
            <Star fill="currentColor" size={20} />
            <Star fill="currentColor" size={20} />
            <Star fill="currentColor" size={20} />
            <Star size={20} color="var(--border-light)" />
            <span style={{ color: 'var(--text-muted)' }}>(124 Verified Reviews)</span>
          </div>
        </div>

        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', padding: '1rem 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
          ${selectedVariant?.price.toFixed(2)}
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.125rem' }}>
          {product.description || "Incredible architecture maximizing local ecosystem tracking dynamically."}
        </p>

        {/* Variant Mapping Engine */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {product.variants.map(variant => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                background: selectedVariant?.id === variant.id ? 'var(--primary-light)' : 'transparent',
                border: `2px solid ${selectedVariant?.id === variant.id ? 'var(--primary)' : 'var(--border-light)'}`,
                color: selectedVariant?.id === variant.id ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all var(--transition-fast)'
              }}
            >
              {Object.entries(variant.attributes).map(([key, val]) => `${key}: ${val}`).join(' • ')} 
            </button>
          ))}
        </div>

        <div style={{ color: selectedVariant?.stock && selectedVariant.stock > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
          {selectedVariant?.stock && selectedVariant.stock > 0 ? `In Stock (${selectedVariant.stock} left)` : 'Out of Stock'}
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock === 0}
          style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            fontSize: '1.125rem',
            fontWeight: 600,
            cursor: (!selectedVariant || selectedVariant.stock === 0) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '1rem',
            opacity: (!selectedVariant || selectedVariant.stock === 0) ? 0.5 : 1
          }}>
          <ShoppingCart size={24} />
          Add to Cart
        </button>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={20} /> Free Delivery
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} /> 1 Year Warranty
          </div>
        </div>
      </div>
    </div>
  );
}
