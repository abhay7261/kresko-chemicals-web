import React, { useState } from 'react';
import { saveEnquiry } from '../utils/storage';

export default function Oem() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('We want to establish a private label branding partnership. Please provide information about formulation customization, packaging options, and MOQ requirements.');
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
      company: company.trim() || 'OEM Partner',
      machineType: 'OEM Manufacturing / Private Label',
      message: message.trim()
    });

    setStatusType('success');
    setStatusMsg('Thank you! Your private label consultation request has been sent. A packaging manager will reach out within 24 hours to schedule a call.');
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
  };

  const steps = [
    { num: '01', title: 'Formulation Design', desc: 'Discuss your target dilution ratios (6X, 10X, 30X), active content strength, colors, and fragrances (Rose, Lavender, Citrus, etc.).' },
    { num: '02', title: 'Laboratory Trial', desc: 'Our chemists synthesize a 1 Kg pilot batch. We test viscosity curves, pH buffering, foam density, and thermal separation metrics.' },
    { num: '03', title: 'Packaging Selection', desc: 'Select containers: 5 Kg canisters, 30 Kg carboys, or 200 Kg drums. Settle private label printing, safety symbols, and barcodes.' },
    { num: '04', title: 'Bulk Production', desc: 'We load reactors in our Ahmedabad plant to blend the certified batch, followed by automated packaging and palletized wrap packing.' },
    { num: '05', title: 'Logistics & Compliance', desc: 'We compile COA, SDS, and TDS papers, labeling batches with QR codes, and dispatch shipment via secure regional/export logistics.' }
  ];

  return (
    <div>
      {/* Banner */}
      <section className="split-hero-section" style={{ backgroundImage: "linear-gradient(135deg, rgba(11, 19, 41, 0.94) 0%, rgba(26, 42, 74, 0.94) 100%), url('/images/oem_manufacturing_bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <div className="split-hero-grid">
            <div>
              <span className="hero-pill-badge">
                <i className="fa-solid fa-industry"></i> Turnkey Private Label
              </span>
              <h1 className="hero-title-main">OEM & Private Label Manufacturing</h1>
              <p className="hero-subtitle-main">
                Launch your cleaning chemical brand with Kresko's certified formulations, custom blending, bottle printing, and turnkey regional/export logistics.
              </p>
              <div className="hero-bullets-box">
                <div className="hero-bullet-row">
                  <i className="fa-solid fa-circle-check hero-bullet-icon"></i>
                  <span><strong>Custom Formulations:</strong> Adjust active strengths, viscosity levels, colors, and fragrances.</span>
                </div>
                <div className="hero-bullet-row">
                  <i className="fa-solid fa-circle-check hero-bullet-icon"></i>
                  <span><strong>Total Packaging Support:</strong> Full assistance in HDPE container sourcing, container printing, and barcodes.</span>
                </div>
                <div className="hero-bullet-row">
                  <i className="fa-solid fa-circle-check hero-bullet-icon"></i>
                  <span><strong>B2B Logistics:</strong> Certified batch blending with complete COA, SDS, and compliance sheets.</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#consultation" className="btn btn-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-handshake"></i> Request Free Consultation
                </a>
                <a href="https://wa.me/919898000000" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
                  <i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i> Chat with Compounding Team
                </a>
              </div>
            </div>
            <div className="hero-mockup-wrap">
              <div className="hero-mockup-card">
                <img 
                  src="/images/oem_manufacturing_custom.jpg" 
                  alt="Kresko OEM Private Label Bottling" 
                  className="hero-mockup-image" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Private Label Capabilities</h2>
            <p>From custom formulation to finished packaged products, KRESKO handles the entire manufacturing cycle.</p>
          </div>
          <div className="cards-grid">
            {/* White Label Products */}
            <div className="bg-image-card">
              <img src="/images/mfg_oem_private_label.png" alt="White Label Products" className="bg-image-card-img" />
              <div className="bg-image-card-overlay"></div>
              <div className="bg-image-card-content">
                <div className="bg-image-card-icon-wrapper">
                  <div className="bg-image-card-icon">
                    <i className="fa-solid fa-file-signature"></i>
                  </div>
                </div>
                <h4 className="bg-image-card-title">White Label Products</h4>
                <p className="bg-image-card-desc">Use Kresko's proven, pre-formulated cleaning concentrates (like our 6X Handwash, 30X Floor Cleaners, or 6X Toilet Cleaners) immediately with your custom labels.</p>
              </div>
            </div>

            {/* Custom Formulation R&D */}
            <div className="bg-image-card">
              <img src="/images/mfg_custom_development.png" alt="Custom Formulation R&D" className="bg-image-card-img" />
              <div className="bg-image-card-overlay"></div>
              <div className="bg-image-card-content">
                <div className="bg-image-card-icon-wrapper">
                  <div className="bg-image-card-icon">
                    <i className="fa-solid fa-flask-vial"></i>
                  </div>
                </div>
                <h4 className="bg-image-card-title">Custom Formulation R&D</h4>
                <p className="bg-image-card-desc">Adjust specific parameters (biodegradability, scent profiles, physical state, coloring, active chemical percentage) to match local regulatory limits or market pricing.</p>
              </div>
            </div>

            {/* Custom Packaging Sourcing */}
            <div className="bg-image-card">
              <img src="/images/mfg_quality_assurance.png" alt="Custom Packaging Sourcing" className="bg-image-card-img" />
              <div className="bg-image-card-overlay"></div>
              <div className="bg-image-card-content">
                <div className="bg-image-card-icon-wrapper">
                  <div className="bg-image-card-icon">
                    <i className="fa-solid fa-boxes-packing"></i>
                  </div>
                </div>
                <h4 className="bg-image-card-title">Custom Packaging Sourcing</h4>
                <p className="bg-image-card-desc">We source and fill various size containers from retail 200ml bottles, 5 Kg cans, to 200 Kg bulk drums, printing brand logos directly onto container labels.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OEM Process Timeline */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-light)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-header">
            <h2>Private Label Execution Steps</h2>
            <p>Our systematic timeline from consultation to chemical batch dispatch.</p>
          </div>
          <div className="timeline" style={{ position: "relative", padding: "1.5rem 0" }}>
            <div style={{ position: "absolute", left: "40px", top: 0, bottom: 0, width: "3px", backgroundColor: "var(--color-border)" }}></div>
            {steps.map((s, idx) => (
              <div key={idx} style={{ position: "relative", display: "flex", gap: '2rem', marginBottom: '2.5rem', alignItems: 'start' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  backgroundColor: idx === 0 ? 'var(--color-accent)' : 'var(--color-primary)',
                  color: 'var(--color-bg-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  border: '4px solid var(--color-bg-white)',
                  boxShadow: 'var(--shadow-sm)',
                  zIndex: 2
                }}>
                  {s.num}
                </div>
                <div style={{ backgroundColor: 'var(--color-bg-white)', padding: '1.5rem 2rem', borderRadius: '6px', border: '1px solid var(--color-border)', flexGrow: 1 }}>
                  <h4 style={{ color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>{s.title}</h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: '1.6' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="section">
        <div className="container" style={{ maxWidth: '750px' }}>
          <div className="quote-form-container" style={{ backgroundColor: 'var(--color-bg-white)', padding: '3rem', borderRadius: '8px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', textAlign: 'center', marginBottom: '0.5rem' }}>Start Your Brand Partnership</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', textAlign: 'center', marginBottom: '2rem' }}>Provide details below and an OEM account manager will schedule a technical conference.</p>

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
                  <label className="form-label">Contact Name *</label>
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
                  <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Company Name *</label>
                  <input type="text" className="form-control" value={company} onChange={(e) => setCompany(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Formulation Specifications & Goals *</label>
                <textarea rows="4" className="form-control" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '30px', padding: '0.8rem 0' }}>
                Request Private Label Consultation
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
