import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReviews, getProducts, getBlogs, saveEnquiry, getHeroSlides, getProductCategories } from '../utils/storage';
import ProductImage from '../components/ProductImage';
import EditableText from '../components/EditableText';
import FaqSection from '../components/FaqSection';

export default function Home() {
  // Hero Slide State
  const [currentSlide, setCurrentSlide] = useState(0);
  // Load hero slides from the admin-editable config (falls back to defaults).
  const [slides] = useState(() => getHeroSlides());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Category showcase on homepage (driven by the real catalog from storage)
  const [homeCategories, setHomeCategories] = useState(Object.entries(getProductCategories()));

  // Industries Served Details
  const industries = [
    { id: 'hospitality', name: 'Hotels & Hospitality', icon: 'fa-hotel', desc: 'Supply cost-effective dilutable floor cleaners, high-end fragrant soaps, and premium laundry softeners.', image: '/images/ind_hospitality.png' },
    { id: 'hospitals', name: 'Hospitals & Healthcare', icon: 'fa-hospital-user', desc: 'Sterilizing sanitizers, floor sanitizers, and GMP grade hand hygiene soaps for clean clinical environments.', image: '/images/ind_healthcare.png' },
    { id: 'industrial', name: 'Industrial Units', icon: 'fa-industry', desc: 'Heavy-duty degreasers, machinery cleaners, and bulk descaling solutions for boilers and heat exchangers.', image: '/images/ind_industrial.png' },
    { id: 'laundry', name: 'Commercial Laundry', icon: 'fa-soap', desc: 'Concentrated detergent liquids (4X, 6X), fabric comfort softeners, and active oxygen fabric whiteners.', image: '/images/ind_laundry.png' },
    { id: 'facilities', name: 'Facility Management', icon: 'fa-building-shield', desc: 'Multipurpose cleaning concentrates, glass shiners, and restroom blocks for facilities and corporate malls.', image: '/images/ind_facilities.png' }
  ];

  // Inquiry Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [productInterest, setProductInterest] = useState('Home Care Concentrates');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('');

  // Reviews and Blogs
  const [testimonials, setTestimonials] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setTestimonials(getReviews());
    setRecentBlogs(getBlogs().slice(0, 3));
    // Load product categories for the homepage explorer.
    setHomeCategories(Object.entries(getProductCategories()));
  }, []);

  // Refresh categories whenever the admin dashboard or backend sync
  // adds or removes categories.
  useEffect(() => {
    const reloadCategories = () => setHomeCategories(Object.entries(getProductCategories()));
    window.addEventListener('categoriesUpdated', reloadCategories);
    return () => window.removeEventListener('categoriesUpdated', reloadCategories);
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const testInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(testInterval);
  }, [testimonials.length]);

  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    setStatusMsg('');
    setStatusType('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusType('error');
      setStatusMsg('Please fill out all required fields.');
      return;
    }

    saveEnquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      machineType: productInterest,
      message: message.trim()
    });

    setStatusType('success');
    setStatusMsg(`Thank you, ${name}! Your quick inquiry for "${productInterest}" has been sent. We will email you the catalog sheet within 24 hours.`);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setMessage('');
  };

  return (
    <div>
      {/* 1. Hero Slider Banner */}
      <section className="hero-slider">
        <div 
          className="hero-track"
          style={{ transform: `translate3d(-${currentSlide * 100}%, 0, 0)` }}
        >
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={slide.overlay === false ? 'hero-slide no-overlay' : 'hero-slide'}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="container">
                <div className="hero-content">
                  <span className="hero-tag">
                    <EditableText id={`home_slide_tag_${index}`} defaultText={slide.tag} />
                  </span>
                  <h1 className="hero-title">
                    <EditableText id={`home_slide_title_${index}`} defaultText={slide.title} />
                  </h1>
                  <p className="hero-description">
                    <EditableText id={`home_slide_desc_${index}`} defaultText={slide.desc} />
                  </p>
                  <div className="hero-buttons">
                    <Link to="/products" className="btn btn-primary">Browse Concentrates</Link>
                    <Link to="/contact" className="btn btn-white">Request Bulk Quote</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="slider-arrow slider-arrow-prev" 
          onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
          aria-label="Previous Slide"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button 
          className="slider-arrow slider-arrow-next" 
          onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
          aria-label="Next Slide"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </section>

      {/* 2. Featured Category Solutions Range */}
      <section className="section categories-section" style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="section-header">
            <h2>
              <EditableText id="home_explore_title" defaultText="Explore Our Product Solutions" />
            </h2>
            <p>
              <EditableText id="home_explore_desc" defaultText="High-efficiency concentrates engineered for high dilution, freight optimization, and premium cleaning power." />
            </p>
          </div>

                    <div className="categories-grid">
            {homeCategories.map(([catKey, cat]) => {
              const subCount = Object.keys(cat.subcategories || {}).length;
              return (
                <Link key={catKey} to={`/products/${catKey}`} className="category-card">
                  <div className="category-card-header">
                    <img
                      src={cat.image || '/images/product_placeholder.jpg'}
                      alt={cat.name}
                      className="category-card-bg"
                      onError={(e) => { e.currentTarget.src = '/images/product_placeholder.jpg'; }}
                    />
                    {subCount > 0 && (
                      <span className="subcategory-badge">{subCount} subcategories</span>
                    )}
                  </div>
                  <div className="category-card-body">
                    <div className="category-card-icon">
                      <i className={`fa-solid ${cat.icon || 'fa-sparkles'}`}></i>
                    </div>
                    <h3 className="category-card-title">{cat.name}</h3>
                    <p className="category-card-desc">
                      {cat.desc || 'Premium B2B chemical concentrate formulation engineered for high dilution and freight optimization.'}
                    </p>
                    <div className="category-card-footer">
                      <span className="explore-products">
                        View Range <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {homeCategories.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-white)', border: '1px dashed var(--color-border)', borderRadius: '8px' }}>
              <i className="fa-solid fa-folder-open" style={{ fontSize: '2.5rem', color: 'var(--color-accent)', marginBottom: '1rem', display: 'block' }}></i>
              <p style={{ fontWeight: 600, margin: '0 0 0.25rem', color: 'var(--color-primary)' }}>No categories in the catalog yet.</p>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>Categories added from the Admin panel will appear here automatically.</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/products" className="btn btn-secondary">View Full Catalogue</Link>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Kresko */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>
              <EditableText id="home_mfg_title" defaultText="Manufacturing Excellence Behind Every Formula" />
            </h2>
            <p>
              <EditableText id="home_mfg_desc" defaultText="Why national distributors and exporting cleaning brands partner with Kresko Chemicals." />
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* Card 1 */}
            <div className="industries-card" style={{ height: '360px' }}>
              <img src="/images/mfg_high_concentration.png" alt="High Concentration Technology" />
              <div className="industries-card-content" style={{ zIndex: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '4px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem'
                  }}>
                    <i className="fa-solid fa-flask-vial"></i>
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>High Concentration</h4>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
                  Dilute raw bases up to 30X at your site. Saves warehouse storage space, carbon footprints, and cuts freight by 90%.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="industries-card" style={{ height: '360px' }}>
              <img src="/images/mfg_oem_private_label.png" alt="OEM & Private Label" />
              <div className="industries-card-content" style={{ zIndex: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '4px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem'
                  }}>
                    <i className="fa-solid fa-tags"></i>
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>OEM & Private Label</h4>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
                  Complete support from formulation compounding, container printing, label design, barcode creation, to logistics.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="industries-card" style={{ height: '360px' }}>
              <img src="/images/mfg_custom_development.png" alt="Custom Development" />
              <div className="industries-card-content" style={{ zIndex: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '4px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem'
                  }}>
                    <i className="fa-solid fa-gears"></i>
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Custom Formulation</h4>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
                  Adjust color hues, fragrance levels (Jasmine, Lemon, Rose), viscosities, and active chemicals matching local cost targets.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="industries-card" style={{ height: '360px' }}>
              <img src="/images/mfg_quality_assurance.png" alt="Quality Assurance" />
              <div className="industries-card-content" style={{ zIndex: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '4px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem'
                  }}>
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Quality Assurance</h4>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
                  Digital pH checking, refractometric solids analysis, and viscometer stability tests for every synthesized batch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Industries Served */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-light)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <h2>
              <EditableText id="home_ind_title" defaultText="Industries We Serve" />
            </h2>
            <p>
              <EditableText id="home_ind_desc" defaultText="Supplying highly-stable cleaning chemical concentrates for high-spec commercial and industrial applications." />
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {industries.map(ind => (
              <div 
                key={ind.id} 
                className="industries-card"
                style={{ height: '360px' }}
              >
                {/* Background image */}
                <img 
                  src={ind.image} 
                  alt={ind.name} 
                />

                {/* Content Container */}
                <div className="industries-card-content" style={{ zIndex: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '4px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}>
                      <i className={`fa-solid ${ind.icon}`}></i>
                    </div>
                    <h4 style={{ color: '#ffffff', fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>{ind.name}</h4>
                  </div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>{ind.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/industries" className="btn btn-secondary">Explore Served Sectors</Link>
          </div>
        </div>
      </section>

      {/* Brand Logos Marquee */}
      <section className="marquee-container">
        <style>{`
          @keyframes homeMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-container {
            position: relative;
            width: 100%;
            padding: 3.5rem 0;
            background-color: var(--color-bg-white);
            border-top: 1px solid var(--color-border);
            border-bottom: 1px solid var(--color-border);
            overflow: hidden;
          }
          .marquee-container::before,
          .marquee-container::after {
            content: "";
            position: absolute;
            top: 0;
            width: 180px;
            height: 100%;
            z-index: 2;
            pointer-events: none;
          }
          .marquee-container::before {
            left: 0;
            background: linear-gradient(to right, var(--color-bg-white) 0%, rgba(255, 255, 255, 0) 100%);
          }
          .marquee-container::after {
            right: 0;
            background: linear-gradient(to left, var(--color-bg-white) 0%, rgba(255, 255, 255, 0) 100%);
          }
          .marquee-track {
            display: flex;
            width: max-content;
            align-items: center;
            gap: 7rem;
            animation: homeMarquee 50s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
          .marquee-item {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 70px;
          }
          .marquee-item img {
            height: 60px;
            object-fit: contain;
            opacity: 0.9;
            transition: all var(--transition-normal);
          }
          .marquee-item img:hover {
            opacity: 1;
            transform: scale(1.08);
          }
          @media (max-width: 768px) {
            .marquee-container {
              padding: 2.25rem 0;
            }
            .marquee-track {
              gap: 4.5rem;
              animation: homeMarquee 38s linear infinite;
            }
            .marquee-item {
              height: 52px;
            }
            .marquee-item img {
              height: 44px;
            }
            .marquee-container::before,
            .marquee-container::after {
              width: 90px;
            }
          }
        `}</style>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ 
            fontSize: '0.8rem', 
            letterSpacing: '2px', 
            textTransform: 'uppercase', 
            color: 'var(--color-text-muted)', 
            fontWeight: 700 
          }}>
            Our Certifications, Accreditations & Brands
          </span>
        </div>

        <div style={{ width: '100%', overflow: 'hidden' }}>
          <div className="marquee-track">
            {/* Set 1 (Mixed Accreditations & Brand Logos Alternately) */}
            <div className="marquee-item"><img src="/images/marquee_brand_5.png" alt="ISO 9001:2015 Seal" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_rapidfresh.jpg" alt="Rapid Fresh Logo" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_iso14001.jpg" alt="ISO 14001:2015 Seal" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_rapidpunch.jpg" alt="RapidPunch Logo" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_fda.jpg" alt="FDA Certified Badge" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_rapidoxide.jpg" alt="RapidOxide Logo" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_iaf.jpg" alt="IAF Accredited Badge" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_rapig.jpg" alt="Rapi-G Logo" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_kresko_certified.jpg" alt="Kresko Certified Seal" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_shine.jpg" alt="Cura Shine Logo" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_2.jpg" alt="Verified Exporter Seal" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_rapidglow.jpg" alt="RapidGlow Logo" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_indiamart.jpg" alt="IndiaMart TrustSEAL" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_rapidfresh_red.png" alt="Rapid Fresh Red Logo" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_dac.jpg" alt="DAC Dubai Accreditation" /></div>

            {/* Set 2 (Duplicated exact sequence for seamless horizontal infinite loop) */}
            <div className="marquee-item"><img src="/images/marquee_brand_5.png" alt="ISO 9001:2015 Seal duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_rapidfresh.jpg" alt="Rapid Fresh Logo duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_iso14001.jpg" alt="ISO 14001:2015 Seal duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_rapidpunch.jpg" alt="RapidPunch Logo duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_fda.jpg" alt="FDA Certified Badge duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_rapidoxide.jpg" alt="RapidOxide Logo duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_iaf.jpg" alt="IAF Accredited Badge duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_rapig.jpg" alt="Rapi-G Logo duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_kresko_certified.jpg" alt="Kresko Certified Seal duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_shine.jpg" alt="Cura Shine Logo duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_2.jpg" alt="Verified Exporter Seal duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_rapidglow.jpg" alt="RapidGlow Logo duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_indiamart.jpg" alt="IndiaMart TrustSEAL duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_rapidfresh_red.png" alt="Rapid Fresh Red Logo duplicated" /></div>
            <div className="marquee-item"><img src="/images/marquee_brand_dac.jpg" alt="DAC Dubai Accreditation duplicated" /></div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Slider */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="testimonials-slider">
            <div 
              className="testimonials-track" 
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((test, index) => (
                <div key={index} className="testimonial-slide">
                  <p>"{test.quote}"</p>
                  <div className="testimonial-author" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="avatar" style={{ width: "70px", height: "70px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "var(--color-bg-white)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.25rem", margin: "0 auto 1rem auto" }}>
                      {test.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <strong>{test.name}</strong>
                    <span>{test.role}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  className={`testimonial-dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                  aria-label={`Testimonial review ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Recent Technical Guides */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-light)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <h2>
              <EditableText id="home_blog_title" defaultText="Recent Chemical News & Guides" />
            </h2>
            <p>
              <EditableText id="home_blog_desc" defaultText="Read the latest articles on active surfactant formulations, cleanroom standards, and optimal concentrate dilution protocols." />
            </p>
          </div>

          <div className="blog-grid">
            {recentBlogs.map(blog => (
              <article key={blog.id} className="blog-card" style={{ display: "flex", flexDirection: "column" }}>
                <div className="blog-img-container">
                  <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                </div>
                <div className="blog-content" style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div className="blog-date">{blog.date}</div>
                    <h3 className="blog-title">
                      <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                    </h3>
                    <p className="blog-desc">{blog.desc}</p>
                  </div>
                  <Link to={`/blog/${blog.id}`} className="blog-more-link" style={{ marginTop: "1rem" }}>
                    Read Article <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <FaqSection />

      {/* 7. Quick Inquiry Form */}
      <section className="section" id="home-inquiry">
        <div className="container" style={{ maxWidth: '750px' }}>
          <div className="quote-form-container" style={{ backgroundColor: 'var(--color-bg-white)', padding: '3rem', borderRadius: '8px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', textAlign: 'center', marginBottom: '0.5rem' }}>Send Us An Inquiry</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', textAlign: 'center', marginBottom: '2rem' }}>
              Have questions about dilution ratios, custom formulations, packaging, or wholesale pricing? Fill out the quick form below.
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

            <form onSubmit={handleSubmitInquiry}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Business Email *</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Company Name</label>
                  <input type="text" className="form-control" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Ltd." />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Area of Interest *</label>
                <select className="form-control" value={productInterest} onChange={(e) => setProductInterest(e.target.value)}>
                  <option value="Home Care Concentrates">Home Care Concentrates</option>
                  <option value="Laundry Care Concentrates">Laundry Care Concentrates</option>
                  <option value="Kitchen Care Concentrates">Kitchen Care Concentrates</option>
                  <option value="Floor Care Concentrates">Floor Care Concentrates</option>
                  <option value="Bathroom Care Concentrates">Bathroom Care Concentrates</option>
                  <option value="Personal Care Concentrates">Personal Care Concentrates</option>
                  <option value="Chlorine Dioxide (ClO2)">Chlorine Dioxide (ClO2)</option>
                  <option value="OEM Private Label Blending">OEM Private Label Blending</option>
                  <option value="Other / General Query">Other / General Query</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message Details *</label>
                <textarea rows="4" className="form-control" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your required quantities, packaging, and specific requirements..." required></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '30px', padding: '0.8rem 0' }}>
                Send Bulk Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
