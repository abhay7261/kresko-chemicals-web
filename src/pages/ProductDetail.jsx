import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProducts, getProductCategories, saveEnquiry } from '../utils/storage';
import ProductImage from '../components/ProductImage';

export default function ProductDetail() {
  const [categories, setCategories] = useState(getProductCategories());
  const { categoryId, productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  
  // Interactive UI States
  const [activeTab, setActiveTab] = useState('desc');
  const [activeView, setActiveView] = useState('main');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedPack, setSelectedPack] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [quantityUnit, setQuantityUnit] = useState('KG');
  
  // Inquiry Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('');

  useEffect(() => {
    const reloadCats = () => {
      setCategories(getProductCategories());
    };
    window.addEventListener('categoriesUpdated', reloadCats);
    return () => window.removeEventListener('categoriesUpdated', reloadCats);
  }, []);

  useEffect(() => {
    // Resolve Category Name
    const catInfo = categories[categoryId];
    if (catInfo) {
      setCategoryName(catInfo.name);
    } else {
      for (const [catKey, catVal] of Object.entries(categories)) {
        if (catVal.subcategories && catVal.subcategories[categoryId]) {
          setCategoryName(catVal.subcategories[categoryId]);
          break;
        }
      }
    }

    // Resolve Product
    const allProducts = getProducts();
    const foundProduct = allProducts.find(p => p.id === productId);
    setProduct(foundProduct);
    setActiveImageIndex(0);
    setActiveView('main');

    if (foundProduct) {
      // Set default packaging option
      const packOptsRaw = foundProduct.specsTable?.find(s => s.param.toLowerCase().includes('packaging'))?.value || '50 KG Drum, 200 KG Drum, 1000 KG (IBC)';
      const packOptions = packOptsRaw.split(',').map(o => o.trim());
      if (packOptions.length > 0) {
        setSelectedPack(packOptions[0]);
      }
      
      setMessage(`Hello Kresko Team, I am interested in purchasing "${foundProduct.title}" with a target quantity of ${quantity} ${quantityUnit} in "${packOptions[0] || '50 KG Drum'}". Please share commercial terms and COA documents.`);
    }
  }, [categoryId, productId, categories]);

  // Update prefilled message when quantity/unit/pack changes
  useEffect(() => {
    if (product) {
      setMessage(`Hello Kresko Team, I am interested in purchasing "${product.title}" with a target quantity of ${quantity} ${quantityUnit} in "${selectedPack}". Please share commercial terms and COA documents.`);
    }
  }, [quantity, quantityUnit, selectedPack, product]);

  if (!product) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center', minHeight: '60vh' }}>
        <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '3rem', color: 'var(--color-accent)', marginBottom: '1.5rem' }}></i>
        <h2>Product Specification Not Found</h2>
        <p style={{ margin: '1rem 0' }}>The product you requested does not exist or may have been modified.</p>
        <Link to="/products" className="btn btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  // Specifications helpers
  const getSpecValue = (paramName) => {
    return product.specsTable?.find(s => s.param.toLowerCase().includes(paramName.toLowerCase()))?.value || 'Standard';
  };

  const packOptsRaw = product.specsTable?.find(s => s.param.toLowerCase().includes('packaging'))?.value || '50 KG Drum, 200 KG Drum, 1000 KG (IBC)';
  const packOptions = packOptsRaw.split(',').map(o => o.trim());

  // Determine main image based on active thumbnail
  let mainImageUrl = product.image;
  if (activeView === 'main') {
    if (product.images && product.images.length > activeImageIndex) {
      mainImageUrl = product.images[activeImageIndex];
    }
  } else if (activeView === 'pack') {
    mainImageUrl = '/images/products/white_phenyl_drum.png';
  } else if (activeView === 'factory') {
    mainImageUrl = '/images/ind_facilities.png';
  } else if (activeView === 'cert') {
    mainImageUrl = '/images/kresko_quality_certificate.png';
  }

  // Get Related Products (4 items from the same category)
  const allProducts = getProducts();
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setStatusMsg('');
    setStatusType('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusType('error');
      setStatusMsg('Please fill out all required fields.');
      return;
    }

    const newEnquiry = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      machineType: `${product.title} (${selectedPack})`,
      message: `Quantity: ${quantity} ${quantityUnit}\n\n${message.trim()}`
    };

    saveEnquiry(newEnquiry);
    setStatusType('success');
    setStatusMsg(`Thank you, ${name}! Your B2B quotation request has been received. Our sales desk will email the quote and COA documents within 12 hours.`);
    
    // Clear fields and close modal after delay
    setTimeout(() => {
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setStatusMsg('');
      setStatusType('');
    }, 3000);
  };

  const incrementQty = () => setQuantity(prev => prev + 25);
  const decrementQty = () => setQuantity(prev => Math.max(25, prev - 25));

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* 1. Breadcrumbs Header Bar */}
      <div style={{ backgroundColor: 'var(--color-bg-light)', borderBottom: '1px solid var(--color-border)', padding: '0.85rem 0' }}>
        <div className="container" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontWeight: 500 }}>
          <Link to="/" style={{ color: 'var(--color-primary)' }}>Home</Link> &gt; 
          <Link to={`/products/${product.category}`} style={{ color: 'var(--color-primary)' }}>{categoryName}</Link> &gt; 
          <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{product.title}</span>
        </div>
      </div>

      {/* 2. Headline & Introduction */}
      <section style={{ padding: '2.5rem 0 1.5rem 0' }}>
        <div className="container">
          <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(220, 38, 38, 0.08)', color: 'var(--color-accent)', padding: '0.35rem 0.85rem', borderRadius: '30px', fontWeight: 800, display: 'inline-block', marginBottom: '0.75rem' }}>
            {categoryName}
          </span>
          <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 2.1rem)', fontWeight: 900, color: 'var(--color-primary)', margin: '0 0 1rem 0', lineHeight: '1.25' }}>
            {product.title.replace(/\s*\d+X.*/i, '').replace(/concentrate/i, '').trim()} Concentrate Manufacturer - {categoryName} Compound
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', lineHeight: '1.7', maxWidth: '1100px', margin: 0 }}>
            Kresko Chemicals is a trusted {product.title.replace(/\s*\d+X.*/i, '').replace(/concentrate/i, '').trim()} Concentrate Manufacturer and compound supplier in India, compounding high-activity B2B chemical bases for commercial, industrial, and institutional sanitation applications. Our specialized concentrates are engineered for high-performance cleaning stability, rich active matter content, and easy dilution capabilities.
          </p>
        </div>
      </section>

      {/* 3. Main Product Box Display */}
      <section style={{ padding: '1rem 0' }}>
        <div className="container swadesh-details-grid">
          
          {/* Left Column: Premium Image Gallery Showcase */}
          <div>
            {/* Main Image Stage Box */}
            <div 
              className="product-detail-stage-box"
              style={{ 
                position: 'relative', 
                backgroundColor: '#ffffff', 
                borderRadius: '16px', 
                border: '1px solid rgba(226, 232, 240, 0.8)', 
                boxShadow: '0 12px 32px -8px rgba(15, 23, 42, 0.08)', 
                overflow: 'hidden',
                display: 'flex',
                height: '400px',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Sleek Vertical Trust Badge Strip */}
              <div 
                className="product-trust-strip"
                style={{ 
                  width: '95px', 
                  backgroundColor: '#f8fafc', 
                  borderRight: '1px solid #e2e8f0', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '1.25rem 0.5rem'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <img src="/images/kresko_logo.png" alt="Kresko Logo" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
                  <span style={{ fontSize: '0.62rem', fontWeight: 950, color: 'var(--color-primary)', letterSpacing: '0.5px' }}>KRESKO</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', alignItems: 'center', width: '100%' }}>
                  {[
                    { icon: 'fa-circle-check', color: '#10b981', label: 'GMP' },
                    { icon: 'fa-shield-halved', color: '#0ea5e9', label: 'FDA' },
                    { icon: 'fa-certificate', color: '#f59e0b', label: 'HALAL' },
                    { icon: 'fa-award', color: '#8b5cf6', label: 'ISO' }
                  ].map((badge, bIdx) => (
                    <div 
                      key={bIdx}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '4px',
                        padding: '0.45rem 0.3rem',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                        border: '1px solid #edf2f7',
                        width: '100%'
                      }}
                    >
                      <i className={`fa-solid ${badge.icon}`} style={{ color: badge.color, fontSize: '1.3rem' }}></i>
                      <span style={{ fontSize: '0.62rem', fontWeight: 900, color: '#334155', letterSpacing: '0.5px' }}>{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Active Image Canvas */}
              <div 
                style={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '2.5rem 2rem', 
                  position: 'relative',
                  background: 'radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%)'
                }}
              >
                {product.tag && (
                  <span 
                    style={{ 
                      position: 'absolute', 
                      top: '16px', 
                      right: '16px', 
                      backgroundColor: 'var(--color-accent)', 
                      color: '#fff', 
                      fontSize: '0.65rem', 
                      fontWeight: 800, 
                      padding: '0.3rem 0.75rem', 
                      borderRadius: '20px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.6px',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
                    }}
                  >
                    {product.tag}
                  </span>
                )}

                {/* Main Image with smooth drop shadow */}
                <img 
                  src={mainImageUrl} 
                  alt={product.title} 
                  style={{ 
                    maxHeight: '300px', 
                    maxWidth: '100%', 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 12px 20px rgba(0, 0, 0, 0.08))',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} 
                />
              </div>
            </div>

            {/* Unified Interactive Gallery & Segmented View Control */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.25rem' }}>
              
              {/* 1. Image Angle Thumbnails (if multiple product images exist) */}
              {product.images && product.images.length > 1 && (
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.4rem' }}>
                    Product Photo Gallery
                  </span>
                  <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                    {product.images.map((img, idx) => {
                      const isSelected = activeView === 'main' && activeImageIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => { setActiveView('main'); setActiveImageIndex(idx); }}
                          style={{
                            width: '60px',
                            height: '60px',
                            minWidth: '60px',
                            padding: '4px',
                            border: isSelected ? '2px solid var(--color-accent)' : '1px solid #e2e8f0',
                            borderRadius: '10px',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                            transform: isSelected ? 'translateY(-2px)' : 'none',
                            boxShadow: isSelected ? '0 6px 16px rgba(220, 38, 38, 0.2)' : '0 2px 6px rgba(0,0,0,0.03)'
                          }}
                          type="button"
                          title={`Product View ${idx + 1}`}
                        >
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Sleek Segmented Control Bar for Context Views */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)', 
                  gap: '0.4rem', 
                  padding: '0.35rem', 
                  backgroundColor: '#f1f5f9', 
                  borderRadius: '12px' 
                }}
              >
                {[
                  { id: 'main', icon: 'fa-box-open', label: 'Product' },
                  { id: 'pack', icon: 'fa-boxes-packing', label: 'Packaging' },
                  { id: 'factory', icon: 'fa-industry', label: 'Facility' },
                  { id: 'cert', icon: 'fa-award', label: 'Quality' }
                ].map((thumb) => {
                  const isActive = activeView === thumb.id;
                  return (
                    <button
                      key={thumb.id}
                      onClick={() => setActiveView(thumb.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.6rem 0.2rem',
                        backgroundColor: isActive ? '#ffffff' : 'transparent',
                        color: isActive ? 'var(--color-accent)' : '#64748b',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '0.75rem',
                        boxShadow: isActive ? '0 3px 10px rgba(0, 0, 0, 0.08)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                      type="button"
                    >
                      <i className={`fa-solid ${thumb.icon}`} style={{ fontSize: '0.82rem' }}></i>
                      <span>{thumb.label}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right Column: Title, Specs Card, Options, Form Buttons */}
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-primary)', margin: '0 0 0.5rem 0', lineHeight: '1.2' }}>
              {product.title}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
              {product.desc}
            </p>

            {/* B2B Product Specifications Card */}
            <div 
              style={{ 
                backgroundColor: 'rgba(27, 42, 71, 0.02)', 
                border: '1px solid rgba(27, 42, 71, 0.06)', 
                borderRadius: '8px', 
                padding: '1.25rem', 
                marginBottom: '1.5rem' 
              }}
            >
              <h4 style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 1rem 0', borderBottom: '1px solid rgba(27, 42, 71, 0.08)', paddingBottom: '0.4rem' }}>
                Product Specifications
              </h4>
              
              <div className="swadesh-specs-grid">
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
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: '1.2' }}>{getSpecValue('chemical composition')}</span>
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

            {/* Packaging Options Outline Row */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Packaging Options
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {packOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedPack(size)}
                    style={{
                      padding: '0.45rem 1rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: selectedPack === size ? 'rgba(var(--color-accent-rgb), 0.05)' : '#fff',
                      border: selectedPack === size ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                      color: selectedPack === size ? 'var(--color-accent)' : 'var(--color-text-main)',
                      transition: 'all 0.2s ease'
                    }}
                    type="button"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector Counter */}
            <div style={{ marginBottom: '1.75rem' }}>
              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Quantity (Min. Order: 50 KG)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button 
                  onClick={decrementQty}
                  style={{ width: '40px', height: '40px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: '#f8fafc', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                >-</button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(25, parseInt(e.target.value) || 0))}
                  style={{ width: '80px', height: '40px', textAlign: 'center', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }} 
                />
                <button 
                  onClick={incrementQty}
                  style={{ width: '40px', height: '40px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: '#f8fafc', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                >+</button>

                <select 
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                  style={{ height: '40px', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0 0.5rem', fontWeight: 'bold', fontSize: '0.85rem' }}
                >
                  <option value="KG">KG</option>
                  <option value="MT">MT (Tons)</option>
                  <option value="Ltr">Litre</option>
                </select>
              </div>
            </div>

            {/* Main CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn" 
                style={{ 
                  flexGrow: 1, 
                  backgroundColor: 'var(--color-accent)', 
                  color: '#fff', 
                  borderRadius: '6px', 
                  padding: '0.85rem 0', 
                  fontWeight: 800, 
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Request Quote
              </button>
              
              <a 
                href={`https://wa.me/919377998866?text=Hello%20Kresko%20Chemicals,%20I%20am%20interested%20in%20"${encodeURIComponent(product.title)}"%20with%20quantity%20"${quantity}%20${quantityUnit}"%20in%20"${selectedPack}".%20Please%20send%20commercial%20quote.`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn" 
                style={{ 
                  flexGrow: 1, 
                  backgroundColor: 'var(--color-primary)', 
                  color: '#fff', 
                  borderRadius: '6px', 
                  padding: '0.85rem 0', 
                  fontWeight: 800, 
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'block'
                }}
              >
                Contact Sales
              </a>
            </div>

            {/* Delivery / Support Highlights */}
            <div className="swadesh-highlights-grid">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f0fdf4', padding: '0.75rem', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                <i className="fa-solid fa-truck" style={{ color: '#16a34a', fontSize: '1.1rem' }}></i>
                <div>
                  <small style={{ display: 'block', fontSize: '0.55rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>Fast Delivery</small>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-primary)' }}>2-5 Days</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#eff6ff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #dbeafe' }}>
                <i className="fa-solid fa-shield-halved" style={{ color: '#2563eb', fontSize: '1.1rem' }}></i>
                <div>
                  <small style={{ display: 'block', fontSize: '0.55rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase' }}>Quality Assured</small>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-primary)' }}>ISO Certified</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#faf5ff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #f3e8ff' }}>
                <i className="fa-solid fa-headset" style={{ color: '#9333ea', fontSize: '1.1rem' }}></i>
                <div>
                  <small style={{ display: 'block', fontSize: '0.55rem', fontWeight: 800, color: '#6b21a8', textTransform: 'uppercase' }}>24/7 Support</small>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-primary)' }}>Expert Help</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Swadesh-Style Dynamic Tabbed Details (Description / Specs / Applications / Documents) */}
      <section style={{ padding: '3rem 0 1rem 0' }}>
        <div className="container">
          
          {/* Tab Headers */}
          <div className="swadesh-tabs-header">
            {[
              { id: 'desc', label: 'Description' },
              { id: 'specs', label: 'Product Specifications' },
              { id: 'apps', label: 'Applications' },
              { id: 'docs', label: 'Documents / Videos' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '1rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid var(--color-accent)' : '3px solid transparent',
                  color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginRight: '0.5rem'
                }}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Body Contents */}
          <div style={{ minHeight: '260px' }}>
            
            {/* DESC TAB */}
            {activeTab === 'desc' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>Product Description</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', lineHeight: '1.7', marginBottom: '2rem' }}>
                  {product.desc}
                </p>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>Key Features</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                  {product.features?.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'start' }}>
                      <i className="fa-solid fa-check" style={{ color: 'var(--color-accent)', marginTop: '0.2rem', fontSize: '0.9rem' }}></i>
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'block' }}>{feat.title}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>{feat.desc}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'start' }}>
                    <i className="fa-solid fa-check" style={{ color: '#ab7d3a', marginTop: '0.2rem', fontSize: '0.9rem' }}></i>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'block' }}>Chemical Resistance</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>Stable viscosity compound base that resists thermal breakdown and electrolyte separation.</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'start' }}>
                    <i className="fa-solid fa-check" style={{ color: '#ab7d3a', marginTop: '0.2rem', fontSize: '0.9rem' }}></i>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'block' }}>Eco-Friendly Surfactants</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>Formulated utilizing biodegradable linear active compounds compliant with green safety norms.</span>
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>Quality Assurance</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>
                  Our chemical concentrates are blended inside ISO 9001:2015 certified reactors under computerized temperature and compounding controls to assure perfect batch stability. Every single batch is analyzed for active matter density, viscosity curves, specific gravity, and pH levels before packaging. Fully compliant with environmental standards, with COA sheet logs dispatched with every supply container.
                </p>

                {/* 3 Circular Badges Row */}
                <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-flask" style={{ color: '#16a34a', fontSize: '1.1rem', margin: 0, padding: 0, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}></i>
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-primary)' }}>100% Tested</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Every batch analyzed</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-award" style={{ color: '#d97706', fontSize: '1.1rem', margin: 0, padding: 0, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}></i>
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-primary)' }}>Certified Quality</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>ISO 9001:2015 Compliant</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-file-invoice" style={{ color: '#2563eb', fontSize: '1.1rem', margin: 0, padding: 0, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}></i>
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-primary)' }}>Documentation</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>TDS & COA log provided</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* SPECS TAB */}
            {activeTab === 'specs' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Detailed Specifications Sheet</h3>
                <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                        <th style={{ padding: '1rem', fontWeight: 800, color: 'var(--color-primary)' }}>Parameter</th>
                        <th style={{ padding: '1rem', fontWeight: 800, color: 'var(--color-primary)' }}>Specifications Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.specsTable?.map((spec, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>{spec.param}</td>
                          <td style={{ padding: '1rem', color: 'var(--color-text-main)' }}>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* APPLICATIONS TAB */}
            {activeTab === 'apps' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>Recommended Applications & Industries</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Our highly-dilutable surfactant bases are engineered to cater to large volume distributors, chemical repackers, and cleaning brand owners. Key industry scopes include:
                </p>
                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                  {product.applicationsList?.map((app, i) => (
                    <li key={i} style={{ lineHeight: '1.5' }}>
                      <strong>{app.split(':')[0]}:</strong> {app.split(':')[1] || app}
                    </li>
                  ))}
                  <li style={{ lineHeight: '1.5' }}>
                    <strong>Contract Cleaners:</strong> Diluting concentrates on-site directly cuts transportation weight overheads by up to 90%.
                  </li>
                  <li style={{ lineHeight: '1.5' }}>
                    <strong>Industrial Hygiene:</strong> Used in warehouse scrubbing, office mopping, and machinery facility cleaning compounds.
                  </li>
                </ul>
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === 'docs' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Technical Documents & Certificates Downloads</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  
                  <div style={{ padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 0.25rem 0' }}>Technical Data Sheet (TDS)</h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: '0 0 1.25rem 0' }}>Blending procedures, dilution parameters, and chemical structure data.</p>
                    </div>
                    <button onClick={() => alert('Downloading TDS PDF...')} className="btn" style={{ border: '1px solid var(--color-accent)', color: 'var(--color-accent)', background: 'none', width: '100%', padding: '0.5rem 0', fontWeight: 'bold', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}>
                      <i className="fa-solid fa-download"></i> Download PDF
                    </button>
                  </div>

                  <div style={{ padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 0.25rem 0' }}>Safety Data Sheet (SDS)</h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: '0 0 1.25rem 0' }}>Compounding safety guidelines, handling precautions, and toxicological norms.</p>
                    </div>
                    <button onClick={() => alert('Downloading SDS PDF...')} className="btn" style={{ border: '1px solid var(--color-accent)', color: 'var(--color-accent)', background: 'none', width: '100%', padding: '0.5rem 0', fontWeight: 'bold', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}>
                      <i className="fa-solid fa-download"></i> Download PDF
                    </button>
                  </div>

                  <div style={{ padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 0.25rem 0' }}>Certificate of Analysis (COA)</h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: '0 0 1.25rem 0' }}>Batch-specific test certificates verifying composition standards.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn" style={{ border: '1px solid var(--color-accent)', color: 'var(--color-accent)', background: 'none', width: '100%', padding: '0.5rem 0', fontWeight: 'bold', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}>
                      Request COA
                    </button>
                  </div>

                  <div style={{ padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 0.25rem 0' }}>ISO Certification</h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: '0 0 1.25rem 0' }}>ISO 9001:2015 standard documentation for laboratory and factory systems.</p>
                    </div>
                    <Link to="/certifications" className="btn" style={{ border: '1px solid var(--color-accent)', color: 'var(--color-accent)', background: 'none', width: '100%', padding: '0.5rem 0', fontWeight: 'bold', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', textAlign: 'center', display: 'block' }}>
                      View ISO Certificate
                    </Link>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 5. Related Products Section */}
      {relatedProducts.length > 0 && (
        <section style={{ padding: '3rem 0 1rem 0', borderTop: '1px solid var(--color-border)', marginTop: '2rem' }}>
          <div className="container">
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-primary)', textAlign: 'center', marginBottom: '0.5rem' }}>Related Products</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2.5rem' }}>
              Explore other chemicals that complement your packaging and formulation requirements
            </p>

            <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
              {relatedProducts.map(p => (
                <div 
                  key={p.id}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'var(--transition-normal)'
                  }}
                  className="product-item-card"
                >
                  <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', height: '200px', overflow: 'hidden' }}>
                    {/* Badge column */}
                    <div style={{ width: '50px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', gap: '0.35rem', borderRight: '1px solid var(--color-border)' }}>
                      <img src="/images/kresko_logo.png" alt="Logo" style={{ width: '18px', height: '18px' }} />
                      <span style={{ fontSize: '0.3rem', fontWeight: 900, color: 'var(--color-primary)' }}>KRESKO</span>
                      <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: '0.55rem', marginTop: '0.5rem' }}></i>
                      <i className="fa-solid fa-shield-halved" style={{ color: '#0ea5e9', fontSize: '0.55rem' }}></i>
                      <i className="fa-solid fa-certificate" style={{ color: '#f59e0b', fontSize: '0.55rem' }}></i>
                      <i className="fa-solid fa-award" style={{ color: '#8b5cf6', fontSize: '0.55rem' }}></i>
                    </div>
                    {/* Main Image */}
                    <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                      <ProductImage category={p.category} title={p.title} image={p.image} style={{ maxHeight: '140px' }} />
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <small style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>
                      {categoryName}
                    </small>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 1rem 0', minHeight: '2.5rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.title}
                    </h4>
                    <Link 
                      to={`/products/${p.category}/${p.id}`}
                      style={{
                        marginTop: 'auto',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--color-accent)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      View Details <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
              <Link 
                to="/products"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '0.75rem 2rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                View All Products
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* 6. Quote Enquiry Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '600px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
                Request Bulk Quote
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
                Send us your target quantity and specifications requirements for **{product.title}** to receive custom B2B pricing.
              </p>

              {statusMsg && (
                <div style={{ 
                  padding: '0.85rem', 
                  borderRadius: '4px', 
                  marginBottom: '1rem',
                  backgroundColor: statusType === 'success' ? '#def7ec' : '#fde8e8',
                  color: statusType === 'success' ? '#03543f' : '#9b1c1c',
                  border: `1px solid ${statusType === 'success' ? '#bbf7d0' : '#f8b4b4'}`,
                  fontSize: '0.8rem',
                  textAlign: 'center'
                }}>
                  {statusMsg}
                </div>
              )}

              <form onSubmit={handleInquirySubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-primary)', display: 'block', marginBottom: '0.25rem' }}>Full Name *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.8rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-primary)', display: 'block', marginBottom: '0.25rem' }}>Business Email *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.8rem' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-primary)', display: 'block', marginBottom: '0.25rem' }}>Phone Contact</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91..." style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.8rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-primary)', display: 'block', marginBottom: '0.25rem' }}>Company Name</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Ltd." style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.8rem' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-primary)', display: 'block', marginBottom: '0.25rem' }}>Message Details *</label>
                  <textarea rows="3" value={message} onChange={(e) => setMessage(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.8rem', resize: 'vertical' }}></textarea>
                </div>

                <button 
                  type="submit" 
                  style={{ 
                    width: '100%', 
                    backgroundColor: 'var(--color-accent)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '4px', 
                    padding: '0.75rem 0', 
                    fontWeight: 800, 
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Submit Quotation Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
