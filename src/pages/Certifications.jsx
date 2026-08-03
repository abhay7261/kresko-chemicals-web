import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Certifications() {
  const [modalCert, setModalCert] = useState(null);

  useEffect(() => {
    if (modalCert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalCert]);

  const certificates = [
    {
      title: 'ISO 9001:2015 Certification',
      subtitle: 'Quality Management System',
      certNo: 'UK-02-G-558',
      issuingBody: 'UKAF CERT Limited, United Kingdom',
      scope: 'Manufacturer, Supplier & Exporter of Chlorine Dioxide (Rapi-G, RapidOxide, CLO2TAB, SureShot, etc.) and Cleaning, Hygiene & Shining Products.',
      expiry: '06-06-2027',
      initialDate: '07-06-2024',
      pdfPath: '/certificates/iso9001-2015.pdf',
      imagePath: '/certificates/iso9001-2015.png',
      color: '#3b82f6',
      icon: 'fa-gauge-high'
    },
    {
      title: 'ISO 14001:2015 Certification',
      subtitle: 'Environment Management System',
      certNo: 'EMS/26M01796',
      issuingBody: 'MQA Certification Services (Accredited by UKAF CERT Limited)',
      scope: 'Manufacturer, Supplier & Exporter of Chlorine Dioxide (RAPI-G, RAPIDOXIDE, CLO2TAB, SURESHOT, etc.) and Cleaning, Holi Color, Hygiene & Shining Products.',
      expiry: '27-03-2029',
      initialDate: '28-03-2026',
      pdfPath: '/certificates/iso14001-2015.pdf',
      imagePath: '/certificates/iso14001-2015.png',
      color: '#10b981',
      icon: 'fa-leaf'
    },
    {
      title: 'WHO-GMP Compliance Certification',
      subtitle: 'Good Manufacturing Practices',
      certNo: 'WGMP/26M0245',
      issuingBody: 'MQA Certification Services, United Kingdom',
      scope: 'Manufacturer, Supplier & Exporter of Chlorine Dioxide (Rapi-G, RapidOxide, CLO2TAB, SureShot, etc.) and Gulal, Cleaning, Hygiene & Shining Products.',
      expiry: '07-01-2029',
      initialDate: '08-01-2026',
      pdfPath: '/certificates/who-gmp-compliance.pdf',
      imagePath: '/certificates/who-gmp-compliance.png',
      color: '#f59e0b',
      icon: 'fa-prescription-bottle-medical'
    },
    {
      title: 'FDA Compliance Certification',
      subtitle: 'Food and Drug Administration Guidelines',
      certNo: 'UG/24M02847',
      issuingBody: 'MQA Certification Services (Accredited by UKAF CERT Limited)',
      scope: 'Assessed and found conforming to FDA Regulatory Guidelines for Food and Drug Administration.',
      expiry: '06-06-2027',
      initialDate: '07-06-2024',
      pdfPath: '/certificates/fda-compliance.pdf',
      imagePath: '/certificates/fda-compliance.png',
      color: '#ef4444',
      icon: 'fa-building-columns'
    },
    {
      title: 'EN 12671:2016 Water Treatment',
      subtitle: 'In-situ Chlorine Dioxide Compliance',
      certNo: 'UK-02-VS-02672',
      issuingBody: 'UKAF CERT Limited, United Kingdom',
      scope: 'Compliance standard for chemicals used for treatment of water intended for human consumption - Chlorine dioxide generated in situ.',
      expiry: '27-03-2029',
      initialDate: '28-03-2026',
      pdfPath: '/certificates/ukaf-en12671-compliance.pdf',
      imagePath: '/certificates/ukaf-en12671-compliance.png',
      color: '#6366f1',
      icon: 'fa-faucet-drip'
    },
    {
      title: 'OHSAS 18001:2007 Certification',
      subtitle: 'Occupational Health & Safety',
      certNo: 'OHSAS/26M01797',
      issuingBody: 'MQA Certification Services (Accredited by UKAF CERT Limited)',
      scope: 'Manufacturer, Supplier & Exporter of Chlorine Dioxide (RAPI-G, RAPIDOXIDE, CLO2TAB, SURESHOT, ETC.) and Cleaning, Holi Color, Hygiene & Shining Products.',
      expiry: '27-03-2029',
      initialDate: '28-03-2026',
      pdfPath: '/certificates/ohsas18001-2007.pdf',
      imagePath: '/certificates/ohsas18001-2007.png',
      color: '#06b6d4',
      icon: 'fa-shield-heart'
    }
  ];

  return (
    <div>
      <style>{`
        .cert-preview-container {
          position: relative;
          height: 380px;
          background-color: #f8fafc;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.06);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
        }
        .cert-hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(27, 42, 71, 0);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          opacity: 0;
          transition: all var(--transition-normal);
          cursor: pointer;
          z-index: 10;
        }
        .cert-preview-container:hover .cert-hover-overlay {
          background-color: rgba(27, 42, 71, 0.45);
          opacity: 1;
        }
        .cert-card-wrapper {
          background-color: var(--color-bg-white);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          transition: transform var(--transition-normal), box-shadow var(--transition-normal);
        }
        .cert-card-wrapper:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg) !important;
        }
      `}</style>

      {/* Banner */}
      <section className="solution-banner" style={{ backgroundImage: "linear-gradient(135deg, rgba(27, 42, 71, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%), url('/images/photo-1528218609959-006f98e6b79e.jpeg')", padding: "5rem 0", color: '#fff' }}>
        <div className="container solution-content" style={{ textAlign: 'center' }}>
          <span style={{ backgroundColor: 'var(--color-accent)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-block', marginBottom: '1rem' }}>
            Regulatory Compliance
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>Compliance & Certifications</h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '650px', margin: '0 auto' }}>
            Inspect our verified regulatory credentials. Click on any certificate card to inspect the document in high resolution.
          </p>
        </div>
      </section>

      {/* Grid vault list */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Official Regulatory Certificates</h2>
            <p>Verifiable compliance credentials issued by international registrars, certifying our safety and quality management.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2.5rem' }}>
            {certificates.map((cert, idx) => (
              <div key={idx} className="cert-card-wrapper">
                {/* Visual Accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: cert.color }}></div>

                <div>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '6px', backgroundColor: `${cert.color}15`, color: cert.color }}>
                        <i className={`fa-solid ${cert.icon}`} style={{ fontSize: '1.1rem' }}></i>
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>ID: {cert.certNo}</span>
                    </div>
                    <span 
                      style={{ 
                        backgroundColor: '#def7ec', 
                        color: '#03543f', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '20px', 
                        fontSize: '0.68rem', 
                        fontWeight: 700, 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.25rem' 
                      }}
                    >
                      <span style={{ width: '5px', height: '5px', backgroundColor: '#31c48d', borderRadius: '50%', display: 'inline-block' }}></span>
                      Active
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.25rem', fontWeight: 800, lineHeight: '1.4' }}>
                    {cert.title}
                  </h3>
                  <span style={{ display: 'block', fontSize: '0.82rem', color: cert.color, fontWeight: 600, marginBottom: '1.25rem' }}>
                    {cert.subtitle}
                  </span>

                  {/* Certificate Image Preview Box */}
                  <div className="cert-preview-container" onClick={() => setModalCert(cert)}>
                    <img 
                      src={cert.imagePath} 
                      alt={`${cert.title} preview`} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} 
                    />
                    {/* Hover Overlay */}
                    <div className="cert-hover-overlay">
                      <i className="fa-solid fa-magnifying-glass-plus" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}></i>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Click to Expand</span>
                    </div>
                  </div>

                  {/* Metadata table */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', marginBottom: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    <div>
                      <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '0.1rem' }}>Registrar:</strong>
                      <span style={{ color: 'var(--color-text-muted)' }}>{cert.issuingBody}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '0.1rem' }}>Validity:</strong>
                      <span style={{ color: 'var(--color-text-muted)' }}>Registered: {cert.initialDate} | Expiry: {cert.expiry}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '0.1rem' }}>Scope:</strong>
                      <span style={{ color: 'var(--color-text-muted)', lineHeight: '1.4', fontSize: '0.78rem', display: 'block' }}>
                        {cert.scope}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                  <button 
                    onClick={() => setModalCert(cert)}
                    className="btn btn-secondary" 
                    style={{ 
                      padding: '0.6rem', 
                      fontSize: '0.72rem', 
                      borderRadius: '6px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.4rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fa-solid fa-expand"></i> Expand View
                  </button>
                  <a 
                    href={cert.pdfPath} 
                    download 
                    className="btn btn-primary" 
                    style={{ 
                      padding: '0.6rem', 
                      fontSize: '0.72rem', 
                      borderRadius: '6px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.4rem',
                      fontWeight: 600,
                      backgroundColor: cert.color,
                      borderColor: cert.color
                    }}
                  >
                    <i className="fa-solid fa-download"></i> Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal Overlay */}
      {modalCert && (
        <div 
          onClick={() => setModalCert(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '2rem'
          }}
        >
          {/* Modal Container */}
          <div 
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '900px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              height: '85vh',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div 
              style={{ 
                padding: '1.25rem 2rem', 
                borderBottom: '1px solid var(--color-border)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: 'var(--color-bg-light)'
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', margin: 0, fontWeight: 800 }}>
                  {modalCert.title}
                </h4>
                <span style={{ fontSize: '0.8rem', color: modalCert.color, fontWeight: 600 }}>
                  {modalCert.subtitle} (No: {modalCert.certNo})
                </span>
              </div>
              <button 
                onClick={() => setModalCert(null)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '1.75rem',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '0.2rem 0.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-accent)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
              >
                &times;
              </button>
            </div>

            {/* Modal Image Viewer Body (Fully Responsive) */}
            <div style={{ flexGrow: 1, overflow: 'auto', backgroundColor: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '1.5rem' }}>
              <img 
                src={modalCert.imagePath} 
                alt={modalCert.title} 
                style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', borderRadius: '4px' }} 
              />
            </div>

            {/* Modal Footer */}
            <div 
              style={{ 
                padding: '1rem 2rem', 
                borderTop: '1px solid var(--color-border)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: 'var(--color-bg-light)',
                fontSize: '0.8rem'
              }}
            >
              <span style={{ color: 'var(--color-text-muted)' }} className="hide-mobile">
                Registered body: <strong>{modalCert.issuingBody}</strong>
              </span>
              <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'space-between' }}>
                <span style={{ display: 'none' }} className="show-mobile"></span>
                <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
                  <a 
                    href={modalCert.pdfPath} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-secondary" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderRadius: '4px', fontWeight: 600 }}
                  >
                    <i className="fa-solid fa-up-right-from-square"></i> Open PDF Tab
                  </a>
                  <a 
                    href={modalCert.pdfPath} 
                    download 
                    className="btn btn-primary" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderRadius: '4px', fontWeight: 600, backgroundColor: modalCert.color, borderColor: modalCert.color }}
                  >
                    <i className="fa-solid fa-download"></i> Download PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* QC Testing Section */}
      <section className="section" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '1.25rem', fontWeight: 800 }}>Laboratory Batch Testing Protocols</h3>
            <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
              We operate an in-house QC laboratory equipped with digital instrumentation. Every batch of home care, personal care, and specialty chemical concentrate undergoes analysis before container sealing:
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><i className="fa-solid fa-circle-check" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> <strong>Refractometric Solids Testing:</strong> Verifies active concentration metrics match the product specifications.</li>
              <li><i className="fa-solid fa-circle-check" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> <strong>Brookfield Viscometer Profiling:</strong> Verifies soap bases retain thick texture curves after site dilution.</li>
              <li><i className="fa-solid fa-circle-check" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> <strong>Accelerated Thermal Stability:</strong> Samples are aged at 50°C to guarantee long-term shelf stability without separation.</li>
              <li><i className="fa-solid fa-circle-check" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> <strong>Microbial Challenge Assays:</strong> Verifies disinfectants achieve 99.999% bacterial eradication.</li>
            </ul>
          </div>
          <div>
            <img src="/images/photo-1561383621-d109918107aa.jpeg" alt="QC Laboratory testing equipment" style={{ width: '100%', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)' }} />
          </div>
        </div>
      </section>

      {/* Documents Showcase */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Technical Documentation Offered</h2>
            <p>We provide full technical dossiers and safety sheets for institutional purchasers and export clearings.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'var(--color-bg-white)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <i className="fa-solid fa-file-pdf" style={{ fontSize: '2rem', color: 'var(--color-accent)' }}></i>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-bg-light)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>TDS-104</span>
              </div>
              <h5 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>TDS (Technical Data Sheet)</h5>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>Outlines active ingredients %, specific gravity, pH metrics, dilution targets, and physical stability data.</p>
            </div>
            <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'var(--color-bg-white)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <i className="fa-solid fa-file-pdf" style={{ fontSize: '2rem', color: 'var(--color-accent)' }}></i>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-bg-light)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>COA-909</span>
              </div>
              <h5 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>COA (Certificate of Analysis)</h5>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>Batch-specific quality verification report reporting viscosity checks, pH buffers, and bacterial kill rates.</p>
            </div>
            <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'var(--color-bg-white)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <i className="fa-solid fa-file-pdf" style={{ fontSize: '2rem', color: 'var(--color-accent)' }}></i>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-bg-light)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>SDS-410</span>
              </div>
              <h5 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>SDS / MSDS (Safety Data Sheet)</h5>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>Outlines hazardous classification, safety handling metrics, fire protocols, and global transport warnings.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/contact" className="btn btn-primary" style={{ borderRadius: '30px' }}>Request Specific Compliance Docs</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
