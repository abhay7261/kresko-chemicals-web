import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Resources() {
  const [openFaq, setOpenFaq] = useState(null);

  const handleDownloadResource = (title) => {
    if (title === 'Corporate Product Catalogue') {
      const storedPdf = localStorage.getItem('kresko_catalog_pdf');
      const storedUrl = localStorage.getItem('kresko_catalog_url');
      if (storedPdf) {
        const link = document.createElement('a');
        link.href = storedPdf;
        link.download = 'Kresko_Chemicals_Catalog.pdf';
        link.click();
      } else if (storedUrl) {
        window.open(storedUrl, '_blank');
      } else {
        alert('Corporate Product Catalogue file is not uploaded yet. You can request it or upload it via the Admin portal.');
      }
    } else {
      alert(`Technical Downloader: Fetching and packaging "${title}" from Kresko library...`);
    }
  };

  const downloads = [
    { title: 'Corporate Product Catalogue', type: 'PDF Document', size: '4.8 MB', icon: 'fa-file-pdf' },
    { title: 'TDS (Technical Data Sheet) Template', type: 'PDF Document', size: '1.2 MB', icon: 'fa-file-pdf' },
    { title: 'SDS / MSDS (Safety Data Sheet) Template', type: 'PDF Document', size: '2.5 MB', icon: 'fa-file-pdf' }
  ];

  const faqs = [
    {
      q: "How do I dilute Kresko's chemical concentrates?",
      a: "Dilution is straightforward. Follow the ratio on the specification sheet (e.g. 1+9 for a 10X concentrate). Add 9 parts clean tap water into your mixing tank, then slowly pour in 1 part concentrate while blending at low speed. Add polymer thickener powder if required, and stir until uniform."
    },
    {
      q: "What is the typical shelf life of undiluted concentrates?",
      a: "Kresko's undiluted concentrates have a guaranteed shelf life of 24 months from the manufacture date. They should be stored in a cool, shaded warehouse inside their original tightly closed HDPE canisters or drums."
    },
    {
      q: "Can we request custom colors and fragrances for our private label brand?",
      a: "Yes! We support custom colors and fragrances (such as Jasmine, Sandalwood, Lavender, Rose, and Lemon) matching your target customer demographics. We can also adjust the active surfactant levels to meet specific target costs."
    },
    {
      q: "Do you supply Certificates of Analysis (COA) for export shipments?",
      a: "Absolutely. Every batch synthesized in our Ahmedabad plant undergoes rigorous testing. A certified Certificate of Analysis reporting viscosity, pH levels, and active content values is provided with every dispatch."
    }
  ];

  return (
    <div>
      {/* Banner */}
      <section className="solution-banner" style={{ backgroundImage: "url('/images/photo-1528218609959-006f98e6b79e.jpeg')", padding: "5rem 0" }}>
        <div className="container solution-content">
          <h2>Resources Hub</h2>
          <p>Download our product catalogues, view technical datasheets, and check dilution blending guides.</p>
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Technical Document Downloads</h2>
            <p>Access our corporate product literature and technical files instantly.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {downloads.map((d, i) => (
              <div 
                key={i} 
                style={{ 
                  padding: '2rem', 
                  backgroundColor: 'var(--color-bg-white)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.5rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ fontSize: '2.5rem', color: 'var(--color-accent)' }}>
                  <i className={`fa-solid ${d.icon}`}></i>
                </div>
                <div>
                  <h4 style={{ color: 'var(--color-primary)', fontSize: '1.05rem', margin: '0 0 0.25rem 0' }}>{d.title}</h4>
                  <small style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.75rem' }}>{d.type} | {d.size}</small>
                  <button 
                    onClick={() => handleDownloadResource(d.title)}
                    className="btn btn-secondary" 
                    style={{ padding: '0.4rem 1rem', fontSize: '0.7rem', textTransform: 'none', borderRadius: '4px' }}
                  >
                    Download File <i className="fa-solid fa-arrow-down" style={{ marginLeft: '0.3rem' }}></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dilution FAQ */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-light)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about dilution blending, storage stability, and customization.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  style={{ 
                    backgroundColor: 'var(--color-bg-white)', 
                    border: '1px solid var(--color-border)', 
                    borderRadius: '6px', 
                    overflow: 'hidden' 
                  }}
                >
                  <div 
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{ 
                      padding: '1.25rem 1.5rem', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: isOpen ? 'var(--color-accent)' : 'var(--color-primary)',
                      userSelect: 'none'
                    }}
                  >
                    <span>{faq.q}</span>
                    <i className={`fa-solid ${isOpen ? 'fa-minus' : 'fa-plus'}`}></i>
                  </div>
                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.7', borderTop: '1px solid var(--color-bg-light)' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog redirect banner */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <i className="fa-solid fa-square-rss" style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}></i>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Read Our Latest Technical Articles</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Stay informed on soap base thickeners, cleanroom standards, and chemical stabilization methods.</p>
          <Link to="/blog" className="btn btn-primary" style={{ borderRadius: '30px' }}>Visit Our Blog</Link>
        </div>
      </section>
    </div>
  );
}
