import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProducts, getProductCategories, saveEnquiry } from '../utils/storage';
import ProductImage from '../components/ProductImage';

export default function CategoryProducts() {
  const [categories, setCategories] = useState(getProductCategories());
  const { categoryId } = useParams();
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [products, setProducts] = useState([]);
  
  // Quick Enquiry Form States
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
    const info = categories[categoryId];
    setCategoryInfo(info);

    // Get all products matching this category
    const allProducts = getProducts();
    const filtered = allProducts.filter(p => p.category === categoryId);
    setProducts(filtered);
  }, [categoryId, categories]);

  if (!categoryInfo) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center', minHeight: '60vh' }}>
        <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '3rem', color: 'var(--color-accent)', marginBottom: '1.5rem' }}></i>
        <h2>Category Not Found</h2>
        <p style={{ margin: '1rem 0' }}>The product category you requested does not exist or has been modified.</p>
        <Link to="/products" className="btn btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMsg('');
    setStatusType('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusType('error');
      setStatusMsg('Please fill out all required fields (Name, Email, and message).');
      return;
    }

    const newEnquiry = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      machineType: `Category: ${categoryInfo.name}`,
      message: message.trim()
    };

    saveEnquiry(newEnquiry);
    setStatusType('success');
    setStatusMsg('Thank you! Your bulk category quote request has been sent. We will email you the catalog and price sheet shortly.');
    
    // Clear fields
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setMessage('');
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="solution-banner" style={{ 
        backgroundImage: `linear-gradient(rgba(27, 42, 71, 0.85), rgba(27, 42, 71, 0.85)), url(${categoryInfo.image})`, 
        padding: "6rem 0",
        color: 'var(--color-bg-white)'
      }}>
        <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <span className="hero-tag" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-white)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {categoryInfo.name} Manufacturer & Exporter
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: '1.2' }}>
            Premium Cleaning Concentrate Solutions for Brands & Private Labels
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: '1.7', marginBottom: '2.5rem' }}>
            KRESKO Chemicals develops high-performance {categoryInfo.name.toLowerCase()} formulations designed for cost-effective production, superior cleaning performance, and scalable manufacturing.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#quick-quote" className="btn btn-primary" style={{ borderRadius: '30px' }}>Request Bulk Quote</a>
            <a href="#products-list" className="btn btn-white" style={{ borderRadius: '30px' }}>Explore Range</a>
          </div>
        </div>
      </section>

      {/* 2. Products List Range */}
      <section className="section" id="products-list">
        <div className="container">
          <div className="section-header">
            <h2>Explore Our Product Solutions</h2>
            <p>Select a product to view detailed specifications, key performance features, active ingredients, and pack capacities.</p>
          </div>

          <div className="products-grid">
            {products.map(p => (
              <div 
                key={p.id} 
                className="product-item-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  height: '100%' 
                }}
              >
                {p.tag && <span className="product-tag-badge">{p.tag}</span>}
                <div className="product-img-box" style={{ padding: '2rem 1rem', height: '240px' }}>
                  <ProductImage category={p.category} title={p.title} image={p.image} />
                </div>
                <div className="product-info-box" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h4 className="product-item-title" style={{ fontSize: '1rem', fontWeight: 700, minHeight: '2.8rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
                    {p.title}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', margin: '0.75rem 0', fontSize: '0.75rem', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '0.65rem 0' }}>
                    <div><strong>Base Rate:</strong> <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{p.price}</span></div>
                    <div><strong>Min Order:</strong> {p.minPack}</div>
                    <div><strong>Dilution:</strong> {p.dilution}</div>
                    <div><strong>Cost /L (Diluted):</strong> <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{p.rateAfter || 'RTU'}</span></div>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.5', minHeight: '3.6rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    {p.desc}
                  </p>
                  
                  <Link to={`/products/${categoryId}/${p.id}`} className="btn btn-primary" style={{ width: '100%', borderRadius: '30px', padding: '0.65rem 0', fontSize: '0.8rem', textAlign: 'center', marginTop: 'auto' }}>
                    View Specifications Sheet
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Choose Kresko */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Why Choose KRESKO?</h2>
            <p>Manufacturing Excellence Behind Every Single Formula</p>
          </div>

          <div className="cards-grid">
            <div className="card-item" style={{ backgroundColor: 'var(--color-bg-white)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div className="card-icon-box" style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)', color: 'var(--color-accent)' }}>
                <i className="fa-solid fa-flask-vial"></i>
              </div>
              <h3 style={{ fontSize: '1.25rem', margin: '1rem 0 0.5rem 0' }}>High Concentration Technology</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Formulations engineered for high dilution, reducing packaging plastics and lowering overall shipping cost by up to 90%.</p>
            </div>

            <div className="card-item" style={{ backgroundColor: 'var(--color-bg-white)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div className="card-icon-box" style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)', color: 'var(--color-accent)' }}>
                <i className="fa-solid fa-tags"></i>
              </div>
              <h3 style={{ fontSize: '1.25rem', margin: '1rem 0 0.5rem 0' }}>OEM & Private Label</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Complete support from initial lab formulation up to the finalized shipping container. Build your brand stress-free.</p>
            </div>

            <div className="card-item" style={{ backgroundColor: 'var(--color-bg-white)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div className="card-icon-box" style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)', color: 'var(--color-accent)' }}>
                <i className="fa-solid fa-bezier-curve"></i>
              </div>
              <h3 style={{ fontSize: '1.25rem', margin: '1rem 0 0.5rem 0' }}>Custom Development</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Customized scents, customized physical forms (liquid/powder), color adjustments, and viscosity tweaks matching your market.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Application Industries */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Suitable Industries Served</h2>
            <p>Our bulk chemical concentrates are ideal for a wide range of commercial and industrial sectors.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
            {['Household Cleaning Brands', 'Hotels & Hospitality Chains', 'Facility Management Companies', 'Retail & Distribution Networks', 'Export Traders & Markets'].map((ind, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', backgroundColor: 'var(--color-bg-light)', borderRadius: '30px', border: '1px solid var(--color-border)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                <i className="fa-solid fa-circle-check" style={{ color: 'var(--color-accent)' }}></i>
                {ind}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OEM / Private Label Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-white)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="hero-tag" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-white)', marginBottom: '1rem' }}>OEM & Private Label</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Build Your Own Cleaning Product Brand</h2>
            <p style={{ opacity: 0.85, marginBottom: '2rem', lineHeight: '1.7' }}>
              Partner with Kresko Chemicals to launch your custom-branded hygiene solutions. We formulate, synthesize, package, and document everything, letting you focus on branding and distribution.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
              {['✓ Custom Formulations', '✓ Bulk Manufacturing', '✓ Packaging Solutions', '✓ Label Support', '✓ Export Documentation', '✓ QC Testing Sheets'].map((c, i) => (
                <div key={i} style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-bg-white)' }}>{c}</div>
              ))}
            </div>
            <Link to="/oem" className="btn btn-primary" style={{ borderRadius: '30px' }}>Start Your Brand With KRESKO</Link>
          </div>
          <div>
            <img src="/images/photo-1561383621-d109918107aa.jpeg" alt="OEM Packaging Line" style={{ width: '100%', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', border: '4px solid rgba(255,255,255,0.1)' }} />
          </div>
        </div>
      </section>

      {/* 6. Quality Documentation */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Available Quality Documentation</h2>
            <p>We compile complete technical files for batch safety, regulatory approvals, and export clearings.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            {['COA (Certificate of Analysis)', 'TDS (Technical Data Sheet)', 'SDS / MSDS', 'Product Test Reports', 'Export Documents'].map((doc, i) => (
              <div key={i} style={{ padding: '2rem 1rem', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'var(--color-bg-light)' }}>
                <i className="fa-solid fa-file-pdf" style={{ fontSize: '2.5rem', color: 'var(--color-accent)', marginBottom: '1rem' }}></i>
                <h5 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '0.95rem' }}>{doc}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Quick Quote Form */}
      <section className="section" id="quick-quote" style={{ backgroundColor: 'var(--color-bg-light)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <div className="quote-form-container" style={{ backgroundColor: 'var(--color-bg-white)', padding: '3rem', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>Request Bulk Category Quote</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', textAlign: 'center', marginBottom: '2rem' }}>
              Submit your inquiry details below. Our technical sales directors will draft a tailored commercial proposal and email the catalogue.
            </p>

            {statusMsg && (
              <div style={{ 
                padding: '1rem', 
                borderRadius: '4px', 
                marginBottom: '1.5rem',
                backgroundColor: statusType === 'success' ? '#def7ec' : '#fde8e8',
                color: statusType === 'success' ? '#03543f' : '#9b1c1c',
                border: `1px solid ${statusType === 'success' ? '#bbf7d0' : '#f8b4b4'}`,
                fontSize: '0.88rem',
                textAlign: 'center'
              }}>
                {statusMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Business Email *</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Company Name</label>
                  <input type="text" className="form-control" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Ltd." />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Inquiry Message *</label>
                <textarea rows="4" className="form-control" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Describe your required quantities, dilution targets, packing size needs for ${categoryInfo.name}...`} required></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '30px', padding: '0.8rem 0' }}>
                Submit Category Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 8. Related Products/Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2>Explore More Cleaning Solutions</h2>
            <p>Browse other B2B dilutable cleaning concentrate ranges developed by Kresko.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {Object.entries(PRODUCT_CATEGORIES)
              .filter(([key]) => key !== categoryId)
              .slice(0, 4)
              .map(([key, val]) => (
                <Link key={key} to={`/products/${key}`} className="btn btn-secondary" style={{ borderRadius: '30px', padding: '0.65rem 1.25rem', fontSize: '0.8rem' }}>
                  {val.name}
                </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final CTA Banner */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-light)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Ready to Launch Your Cleaning Product Range?</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Partner with Kresko Chemicals — Your Trusted Manufacturing & Formulation Partner.</p>
          <a href="#quick-quote" className="btn btn-primary" style={{ borderRadius: '30px' }}>Request Category Quote</a>
        </div>
      </section>
    </div>
  );
}
