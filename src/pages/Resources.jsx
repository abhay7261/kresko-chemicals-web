import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { catalogApi, resolveFileUrl } from '../utils/api';
import { getStoredCatalogs } from '../utils/storage';

export default function Resources() {
  const [openFaq, setOpenFaq] = useState(null);
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewer, setViewer] = useState(null); // { title, url } for PDF preview

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const data = await catalogApi.getAll();
        // Filter only Catalogue type documents
        const catalogDocs = data.filter(cat => cat.documentType === 'Catalogue');
        setCatalogs(catalogDocs);
      } catch (err) {
        console.error('Failed to fetch catalogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogs();
  }, []);

  const openViewer = (catalog) => {
    if (!catalog) return;
    const fileUrl = resolveFileUrl(catalog.file);
    const link = fileUrl || catalog.pdfLink;
    if (link) {
      setViewer({ title: catalog.title || 'Product Catalogue', url: link });
    } else {
      alert('Product Catalogue file is not available yet. You can upload it via the Admin portal.');
    }
  };

  const handleDownloadResource = (catalog) => {
    if (!catalog) return;
    const fileUrl = resolveFileUrl(catalog.file);
    const link = fileUrl || catalog.pdfLink;
    if (link) {
      // For embedded base64 data-URL PDFs, force a real file download via a
      // Blob/`<a download>` link. Opening a huge data URL in a new tab often
      // results in a blank/white page, so we avoid that here.
      if (String(link).startsWith('data:')) {
        try {
          const safeName = (catalog.title || 'catalog').replace(/[^\w\- ]+/g, '').trim() || 'catalog';
          const a = document.createElement('a');
          a.href = link;
          a.download = `${safeName}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          return;
        } catch (err) {
          /* fall through to window.open */
        }
      }
      window.open(link, '_blank');
    } else {
      alert('Product Catalogue file is not available yet. You can upload it via the Admin portal.');
    }
  };

  // All locally-saved catalogs (added via the Admin "Manage Corporate
  // Catalog PDF" form — stored as a list so multiple catalogs are supported).
  // Shown alongside any catalogs synced from the backend.
  const localCatalogs = getStoredCatalogs();

  const downloads = [
    ...localCatalogs.map(catalog => ({
      title: catalog.title || 'Product Catalogue',
      type: 'PDF Document',
      size: catalog.fileSize ? `${(catalog.fileSize / (1024 * 1024)).toFixed(1)} MB` : 'PDF Document',
      icon: 'fa-file-pdf',
      catalog: catalog
    })),
    ...catalogs.map(catalog => ({
      title: catalog.title || 'Product Catalogue',
      type: 'PDF Document',
      size: catalog.fileSize ? `${(catalog.fileSize / (1024 * 1024)).toFixed(1)} MB` : 'PDF Document',
      icon: 'fa-file-pdf',
      catalog: catalog
    })),
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
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {d.catalog && (
                      <button
                        onClick={() => openViewer(d.catalog)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 1rem', fontSize: '0.7rem', textTransform: 'none', borderRadius: '4px' }}
                      >
                        <i className="fa-solid fa-eye" style={{ marginRight: '0.3rem' }}></i>Preview
                      </button>
                    )}
                    <button
                      onClick={() => d.catalog && handleDownloadResource(d.catalog)}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.7rem', textTransform: 'none', borderRadius: '4px' }}
                    >
                      Download File <i className="fa-solid fa-arrow-down" style={{ marginLeft: '0.3rem' }}></i>
                    </button>
                  </div>
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

      {/* PDF Preview Modal */}
      {viewer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15,23,42,0.78)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setViewer(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '900px',
              height: '90vh',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
              <strong style={{ color: 'var(--color-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <i className="fa-solid fa-file-pdf" style={{ marginRight: '0.5rem', color: 'var(--color-accent)' }}></i>
                {viewer.title}
              </strong>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <a href={viewer.url} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem', textTransform: 'none' }}>
                  Open in new tab
                </a>
                <button type="button" onClick={() => setViewer(null)} className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem', textTransform: 'none' }}>
                  Close
                </button>
              </div>
            </div>
            <iframe src={viewer.url} title={viewer.title} style={{ flex: 1, border: 'none', width: '100%' }} />
          </div>
        </div>
      )}
    </div>
  );
}
