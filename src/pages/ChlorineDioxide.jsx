import React, { useState } from 'react';
import { saveEnquiry } from '../utils/storage';

export default function ChlorineDioxide() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('We are requesting technical data sheets, certifications, and packing size rates for Kresko Chlorine Dioxide (ClO2) concentrates.');
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('');

  const handleSubmit = (e) => {
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
      company: 'Chlorine Dioxide Inquiry',
      machineType: 'Chlorine Dioxide (ClO2)',
      message: message.trim()
    });

    setStatusType('success');
    setStatusMsg('Thank you! Your Chlorine Dioxide spec request has been recorded. Our technical team will email the chemical safety details and rates shortly.');
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div>
      {/* Banner */}
      <section className="split-hero-section" style={{ backgroundImage: "linear-gradient(135deg, rgba(11, 19, 41, 0.94) 0%, rgba(26, 42, 74, 0.94) 100%), url('/images/clo2_solutions_bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <div className="split-hero-grid">
            <div>
              <span className="hero-pill-badge">
                <i className="fa-solid fa-shield-virus"></i> High-Efficacy Disinfection
              </span>
              <h1 className="hero-title-main">Chlorine Dioxide (ClO2) Solutions</h1>
              <p className="hero-subtitle-main">
                Eco-friendly, highly selective oxidant and sanitizer for water purification, food safety, and industrial sterilization.
              </p>
              <div className="hero-bullets-box">
                <div className="hero-bullet-row">
                  <i className="fa-solid fa-circle-check hero-bullet-icon"></i>
                  <span><strong>Broad Spectrum:</strong> Highly effective against bacteria, viruses, fungi, and spores.</span>
                </div>
                <div className="hero-bullet-row">
                  <i className="fa-solid fa-circle-check hero-bullet-icon"></i>
                  <span><strong>Safe & Eco-Friendly:</strong> Breaks down into completely harmless byproducts (no toxic residues).</span>
                </div>
                <div className="hero-bullet-row">
                  <i className="fa-solid fa-circle-check hero-bullet-icon"></i>
                  <span><strong>High Stability:</strong> Advanced formulation with longer shelf life and consistent dosage.</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#enquire" className="btn btn-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-envelope"></i> Request TDS Sheets
                </a>
                <a href="https://wa.me/919898000000" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
                  <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i> Chat with Sales
                </a>
              </div>
            </div>
            <div className="hero-mockup-wrap">
              <div className="hero-mockup-card">
                <img 
                  src="/images/clo2_solutions_custom.jpg" 
                  alt="Kresko Chlorine Dioxide" 
                  className="hero-mockup-image" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Info */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="hero-tag" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-white)', marginBottom: '1rem' }}>Advanced Disinfection</span>
            <h3 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem', fontWeight: 800 }}>
              The Power of Chlorine Dioxide (ClO2)
            </h3>
            <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
              Chlorine Dioxide is a highly effective, eco-friendly disinfectant and selective oxidizing agent. Unlike traditional chlorine beach, ClO2 does not create toxic chlorinated organic compounds or carcinogenic trihalomethanes (THMs) in water, making it the choice chemical for modern eco-responsible sanitization.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Kresko Chemicals supplies premium stabilized Chlorine Dioxide liquid concentrates, kit powders, and tablets suitable for large volume disinfection targets. It remains active across a broad pH range (4 to 10) and penetrates biofilms that harbor bacteria.
            </p>
            
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Key Sanitation Features</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-accent)', backgroundColor: 'var(--color-bg-light)' }}>
                <strong>99.999% Sterilization</strong>
                <small style={{ display: 'block', color: 'var(--color-text-muted)' }}>Destroys bacteria, viruses, spores, and fungi rapidly.</small>
              </div>
              <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-accent)', backgroundColor: 'var(--color-bg-light)' }}>
                <strong>No Toxic Byproducts</strong>
                <small style={{ display: 'block', color: 'var(--color-text-muted)' }}>Does not chlorinate organic substances. Safe for waterways.</small>
              </div>
              <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-accent)', backgroundColor: 'var(--color-bg-light)' }}>
                <strong>Biofilm Removal</strong>
                <small style={{ display: 'block', color: 'var(--color-text-muted)' }}>Strips microbial slime coatings inside pipeline systems.</small>
              </div>
              <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-accent)', backgroundColor: 'var(--color-bg-light)' }}>
                <strong>Odor Eradication</strong>
                <small style={{ display: 'block', color: 'var(--color-text-muted)' }}>Oxidizes hydrogen sulfide and phenols, destroying smells.</small>
              </div>
            </div>
          </div>
          <div>
            <img src="/images/photo-1561383621-d109918107aa.jpeg" alt="ClO2 Testing Labs" style={{ width: '100%', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)' }} />
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-light)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <h2>ClO2 Primary Applications</h2>
            <p>Stabilized Chlorine Dioxide is used extensively across multiple industrial sectors.</p>
          </div>
          <div className="cards-grid">
            {/* Water Treatment */}
            <div className="bg-image-card">
              <img src="/images/ind_facilities.png" alt="Water Treatment" className="bg-image-card-img" />
              <div className="bg-image-card-overlay"></div>
              <div className="bg-image-card-content">
                <div className="bg-image-card-icon-wrapper">
                  <div className="bg-image-card-icon">
                    <i className="fa-solid fa-faucet-drip"></i>
                  </div>
                </div>
                <h4 className="bg-image-card-title">Water Treatment</h4>
                <p className="bg-image-card-desc">Purifies municipal drinking water reservoirs, sanitizes cooling towers, and cleans swimming pools without chemical smells.</p>
              </div>
            </div>

            {/* Food & Beverage */}
            <div className="bg-image-card">
              <img src="/images/ind_hospitality.png" alt="Food & Beverage" className="bg-image-card-img" />
              <div className="bg-image-card-overlay"></div>
              <div className="bg-image-card-content">
                <div className="bg-image-card-icon-wrapper">
                  <div className="bg-image-card-icon">
                    <i className="fa-solid fa-wheat-awn"></i>
                  </div>
                </div>
                <h4 className="bg-image-card-title">Food & Beverage</h4>
                <p className="bg-image-card-desc">Used for sanitizing vegetables and fruit washing baths, disinfecting meat packaging equipment, and keeping breweries sterile.</p>
              </div>
            </div>

            {/* Medical & Clinical */}
            <div className="bg-image-card">
              <img src="/images/ind_healthcare.png" alt="Medical & Clinical" className="bg-image-card-img" />
              <div className="bg-image-card-overlay"></div>
              <div className="bg-image-card-content">
                <div className="bg-image-card-icon-wrapper">
                  <div className="bg-image-card-icon">
                    <i className="fa-solid fa-hospital"></i>
                  </div>
                </div>
                <h4 className="bg-image-card-title">Medical & Clinical</h4>
                <p className="bg-image-card-desc">Sterilizes medical tools, cleanrooms, and operates as an air-vaporized disinfectant inside surgical wards.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Certifications Banner */}
      <section className="section" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600, fontSize: '0.88rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <i className="fa-solid fa-circle-check"></i> Certified & Verified
            </div>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '1rem', fontWeight: 800 }}>Certified for Water Treatment Standards</h3>
            <p style={{ marginBottom: '1.25rem', lineHeight: '1.7' }}>
              Our Chlorine Dioxide formulation complies with <strong>EN 12671:2016</strong> standards for chemicals used for the treatment of water intended for human consumption. Our production facilities follow strict quality guidelines to guarantee safe chemical delivery.
            </p>
            <div style={{ backgroundColor: 'var(--color-bg-light)', padding: '1rem 1.25rem', borderRadius: '6px', borderLeft: '4px solid var(--color-accent)', marginBottom: '1.5rem' }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>Certificate No: UK-02-VS-02672</strong>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Registered by UKAF CERT Limited. Valid until 27 March 2029.</span>
            </div>
            <a href="/certificates/ukaf-en12671-compliance.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px' }}>
              <i className="fa-solid fa-file-pdf"></i> View UKAF Compliance PDF
            </a>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', backgroundColor: '#fff', maxWidth: '100%' }}>
              <img 
                src="/certificates/ukaf-en12671-compliance.png" 
                alt="UKAF Certificate of Compliance for EN 12671" 
                style={{ width: '100%', maxWidth: '340px', height: 'auto', borderRadius: '8px', display: 'block' }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="quote-form-container" style={{ backgroundColor: 'var(--color-bg-white)', padding: '3rem', borderRadius: '8px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', textAlign: 'center', marginBottom: '0.5rem' }}>Request Chlorine Dioxide Quote</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', textAlign: 'center', marginBottom: '2rem' }}>Please fill out the form below. Our technical directors will send pricing sheets and TDS analysis parameters.</p>

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
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Business Email *</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea rows="4" className="form-control" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '30px', padding: '0.8rem 0' }}>
                Submit ClO2 Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
