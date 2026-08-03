import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductDetailRow({ product, categoryId, categoryName }) {
  const [activeView, setActiveView] = useState('main');
  const [selectedPack, setSelectedPack] = useState('');

  if (!product) return null;

  // Helper to extract values from specsTable
  const getSpecValue = (paramName) => {
    return product.specsTable?.find(s => s.param.toLowerCase().includes(paramName.toLowerCase()))?.value || 'Standard';
  };

  // Extract packaging options from specsTable
  const packOptsRaw = product.specsTable?.find(s => s.param.toLowerCase().includes('packaging'))?.value || '50 KG Drum, 200 KG Drum, 1000 KG (IBC)';
  const packOptions = packOptsRaw.split(',').map(o => o.trim());
  
  // Set default selected pack if not set
  if (!selectedPack && packOptions.length > 0) {
    setSelectedPack(packOptions[0]);
  }

  // Determine main image based on thumbnail view
  let mainImageUrl = product.image;
  if (activeView === 'pack') {
    mainImageUrl = '/images/products/white_phenyl_drum.png';
  } else if (activeView === 'factory') {
    mainImageUrl = '/images/ind_facilities.png';
  } else if (activeView === 'cert') {
    mainImageUrl = '/images/mfg_quality_assurance.png';
  }

  const handlePackSelect = (size) => {
    setSelectedPack(size);
  };

  return (
    <div 
      className="product-detail-row-container"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1.15fr) 1.5fr',
        gap: '2.5rem',
        backgroundColor: 'var(--color-bg-white)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '3rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        alignItems: 'start'
      }}
    >
      {/* Left Column: Interactive Image Box and Badges */}
      <div>
        <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', height: '320px', position: 'relative' }}>
          {/* Certifications Badge Sidebar */}
          <div 
            style={{ 
              width: '75px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.65rem', 
              padding: '1.25rem 0.5rem', 
              backgroundColor: '#f8fafc', 
              borderRight: '1px solid var(--color-border)',
              justifyContent: 'center'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.5rem' }}>
              <img src="/images/kresko_logo.png" alt="Kresko Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              <span style={{ fontSize: '0.45rem', fontWeight: 950, color: 'var(--color-primary)', marginTop: '2px', letterSpacing: '0.5px' }}>KRESKO</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: '0.85rem' }}></i>
                <span style={{ fontSize: '0.38rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>GMP</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <i className="fa-solid fa-shield-halved" style={{ color: '#0ea5e9', fontSize: '0.85rem' }}></i>
                <span style={{ fontSize: '0.38rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>FDA</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <i className="fa-solid fa-certificate" style={{ color: '#f59e0b', fontSize: '0.85rem' }}></i>
                <span style={{ fontSize: '0.38rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>HALAL</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <i className="fa-solid fa-award" style={{ color: '#8b5cf6', fontSize: '0.85rem' }}></i>
                <span style={{ fontSize: '0.38rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>ISO</span>
              </div>
            </div>
          </div>

          {/* Main Visual Display */}
          <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backgroundColor: '#fff' }}>
            <img 
              src={mainImageUrl} 
              alt={product.title} 
              style={{ 
                maxHeight: '260px', 
                maxWidth: '100%', 
                objectFit: 'contain',
                transition: 'transform 0.3s ease'
              }} 
            />
            {product.tag && (
              <span 
                style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  right: '12px', 
                  backgroundColor: 'var(--color-accent)', 
                  color: '#fff', 
                  fontSize: '0.62rem', 
                  fontWeight: 800, 
                  padding: '0.25rem 0.6rem', 
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}
              >
                {product.tag}
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail Selector Gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '0.75rem' }}>
          {[
            { id: 'main', icon: 'fa-bottle-droplet', label: 'Product' },
            { id: 'pack', icon: 'fa-boxes-packing', label: 'Packaging' },
            { id: 'factory', icon: 'fa-industry', label: 'Facility' },
            { id: 'cert', icon: 'fa-file-shield', label: 'Quality' }
          ].map((thumb) => (
            <button
              key={thumb.id}
              onClick={() => setActiveView(thumb.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                padding: '0.5rem 0.25rem',
                backgroundColor: activeView === thumb.id ? '#fff' : '#f8fafc',
                border: activeView === thumb.id ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              type="button"
            >
              <i className={`fa-solid ${thumb.icon}`} style={{ color: activeView === thumb.id ? 'var(--color-accent)' : '#64748b', fontSize: '0.85rem' }}></i>
              <span style={{ fontSize: '0.55rem', fontWeight: 700, color: activeView === thumb.id ? 'var(--color-primary)' : '#64748b' }}>
                {thumb.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Title, Description, Specs Grid, Pack sizes */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '0.25rem' }}>
            {categoryName || 'Home Care Concentrate'}
          </span>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 0.75rem 0', lineHeight: '1.25' }}>
            {product.title}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', lineHeight: '1.6', margin: '0 0 1.25rem 0' }}>
            {product.desc}
          </p>

          {/* Swadesh-Style Product Specifications Card */}
          <div 
            style={{ 
              backgroundColor: 'rgba(27, 42, 71, 0.02)', 
              border: '1px solid rgba(27, 42, 71, 0.06)', 
              borderRadius: '8px', 
              padding: '1.25rem', 
              marginBottom: '1.25rem' 
            }}
          >
            <h4 style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 1rem 0', borderBottom: '1px solid rgba(27, 42, 71, 0.08)', paddingBottom: '0.4rem' }}>
              Product Specifications
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem' }}>
              {/* Column 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <small style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Physical Form</small>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)' }}>{getSpecValue('physical form')}</span>
                </div>
                <div>
                  <small style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>pH Value</small>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)' }}>{getSpecValue('ph value')}</span>
                </div>
                <div>
                  <small style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Appearance</small>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)' }}>{getSpecValue('appearance')}</span>
                </div>
              </div>
              
              {/* Column 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <small style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Chemical Composition</small>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: '1.2', display: 'block', marginTop: '2px' }}>{getSpecValue('chemical composition')}</span>
                </div>
                <div>
                  <small style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Odor</small>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)' }}>{getSpecValue('odor')}</span>
                </div>
                <div>
                  <small style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Grade</small>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)' }}>{getSpecValue('grade')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Packaging Options Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Packaging Options
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {packOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => handlePackSelect(size)}
                  style={{
                    padding: '0.45rem 1rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: selectedPack === size ? 'rgba(220, 38, 38, 0.05)' : '#fff',
                    border: selectedPack === size ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    color: selectedPack === size ? 'var(--color-accent)' : '#475569',
                    transition: 'all 0.2s ease'
                  }}
                  type="button"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
          <Link 
            to={`/contact?product=${encodeURIComponent(product.title)}&pack=${encodeURIComponent(selectedPack)}`}
            className="btn btn-primary" 
            style={{ 
              backgroundColor: 'var(--color-accent)', 
              borderColor: 'var(--color-accent)',
              borderRadius: '6px',
              padding: '0.7rem 1.75rem',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className="fa-solid fa-paper-plane"></i> Request Quote
          </Link>
          <a 
            href={`https://wa.me/919377998866?text=Hello%20Kresko%20Chemicals,%20I%20am%20interested%20in%20"${encodeURIComponent(product.title)}"%20with%20pack%20size%20"${encodeURIComponent(selectedPack)}".%20Please%20send%20commercial%20quote.`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary"
            style={{
              borderColor: 'var(--color-border)',
              borderRadius: '6px',
              padding: '0.7rem 1.75rem',
              fontWeight: 700,
              fontSize: '0.82rem',
              color: 'var(--color-text-main)',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className="fa-brands fa-whatsapp" style={{ color: '#25d366', fontSize: '1rem' }}></i> Contact Sales
          </a>
        </div>
      </div>
    </div>
  );
}
