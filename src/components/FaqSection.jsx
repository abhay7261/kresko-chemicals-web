import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS_DATA = [
  {
    id: 1,
    category: 'b2b',
    categoryName: 'B2B & Concentrates',
    question: 'What is a chemical concentrate, and how does it save cost?',
    answer: 'A chemical concentrate is a high-active formulation compound supplied without water fillers. When distributors or industrial users dilute 1 Litre of Kresko Concentrate with water locally (e.g. 1:4 or 1:30 ratio), they produce 5 to 31 Litres of ready-to-use cleaning products. This cuts chemical freight costs by up to 80% and eliminates plastic waste.'
  },
  {
    id: 2,
    category: 'b2b',
    categoryName: 'B2B & Concentrates',
    question: 'How do I calculate my final ready-to-use cost per Litre?',
    answer: 'Simply divide the concentrate cost by the total diluted yield. For example, if Multipurpose Concentrate costs ₹125/Kg and dilutes 1:4 with water (yielding 5 Litres total), your final ready-to-use product cost is ₹125 / 5 = ₹25.00/Litre.'
  },
  {
    id: 3,
    category: 'shipping',
    categoryName: 'Shipping & MOQ',
    question: 'What is your Minimum Order Quantity (MOQ) for bulk orders?',
    answer: 'Our standard Minimum Order Quantity (MOQ) is 50 Kg for liquid concentrates in HDPE drums, 20 Kg for powder concentrates, and 100 Pcs for spray bottle products. We also accommodate custom sample batches for new commercial clients.'
  },
  {
    id: 4,
    category: 'shipping',
    categoryName: 'Shipping & MOQ',
    question: 'What packaging sizes are available for dispatch?',
    answer: 'We supply concentrates in 5 Kg & 30 Kg HDPE Jerrycans, 50 Kg HDPE Drums, 200 Kg Heavy Drums, 1000 Kg IBC Totes, and moisture-proof 20 Kg dry powder sachets/bags.'
  },
  {
    id: 5,
    category: 'quality',
    categoryName: 'Quality & Certifications',
    question: 'Are Kresko Chemicals products ISO and GMP certified?',
    answer: 'Yes! Kresko Chemicals operates under strict ISO 9001:2015 Quality Management Systems and Good Manufacturing Practice (GMP) standards. Every batch is tested for pH, viscosity, and active matter concentration before dispatch. Batch COA and TDS sheets are provided.'
  },
  {
    id: 6,
    category: 'quality',
    categoryName: 'Quality & Certifications',
    question: 'What is the shelf life of Kresko Chemical Concentrates?',
    answer: 'Our liquid and powder concentrates have an extended shelf life of 24 months from the date of manufacturing when stored in original sealed drums away from direct sunlight.'
  },
  {
    id: 7,
    category: 'oem',
    categoryName: 'OEM & Private Labeling',
    question: 'Can Kresko manufacture private label products under our brand name?',
    answer: 'Absolutely! We offer full OEM contract packaging services, including custom bottle filling, logo label design, barcode printing, customized fragrance selection, and tamper-proof sealing ready for retail distribution.'
  },
  {
    id: 8,
    category: 'oem',
    categoryName: 'OEM & Private Labeling',
    question: 'Can you customize chemical viscosity, color, or fragrance for our market?',
    answer: 'Yes, our in-house R&D lab in Ahmedabad customizes colors (pink, blue, purple, yellow, green), viscosities, and fragrances (Rose, Lemon, Lavender, Sandalwood, Citronella) according to client preferences.'
  }
];

export default function FaqSection({ title = "Frequently Asked Questions (FAQs)", subtitle = "Find clear answers regarding dilution ratios, MOQs, quality certifications, and private labeling." }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState(1); // Default first FAQ open

  const toggleFaq = (id) => {
    setOpenFaqId(prevId => prevId === id ? null : id);
  };

  const filteredFaqs = FAQS_DATA.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="section" style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(220, 38, 38, 0.08)', color: 'var(--color-accent)', padding: '0.35rem 0.85rem', borderRadius: '30px', fontWeight: 800, display: 'inline-block', marginBottom: '0.75rem' }}>
            HELP & KNOWLEDGE BASE
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: 900, color: 'var(--color-primary)', margin: '0 0 0.75rem 0' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' }}>
            {subtitle}
          </p>
        </div>

        {/* Search Bar & Category Filter Tabs */}
        <div style={{ marginBottom: '2rem' }}>
          {/* Instant Search Bar */}
          <div style={{ position: 'relative', maxWidth: '550px', margin: '0 auto 1.5rem auto' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}></i>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs (e.g., dilution, MOQ, GST, sample)..."
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.75rem',
                borderRadius: '30px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                backgroundColor: '#ffffff'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { id: 'all', label: 'All FAQs' },
              { id: 'b2b', label: 'B2B & Concentrates' },
              { id: 'shipping', label: 'Shipping & MOQ' },
              { id: 'quality', label: 'Quality & ISO' },
              { id: 'oem', label: 'Private Label & OEM' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '20px',
                  border: activeCategory === cat.id ? '1px solid var(--color-accent)' : '1px solid #cbd5e1',
                  backgroundColor: activeCategory === cat.id ? 'var(--color-accent)' : '#ffffff',
                  color: activeCategory === cat.id ? '#ffffff' : '#475569',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: activeCategory === cat.id ? '0 4px 10px rgba(220, 38, 38, 0.2)' : 'none'
                }}
                type="button"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQs List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredFaqs.map(faq => {
            const isOpen = openFaqId === faq.id;
            return (
              <div 
                key={faq.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: isOpen ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: isOpen ? '0 8px 20px rgba(15, 23, 42, 0.06)' : '0 2px 6px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Question Row Header */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  style={{
                    width: '100%',
                    padding: '1.15rem 1.35rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    backgroundColor: isOpen ? '#fff' : '#ffffff',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                  type="button"
                >
                  <span style={{ fontSize: '0.98rem', fontWeight: 800, color: isOpen ? 'var(--color-accent)' : 'var(--color-primary)', lineHeight: '1.4' }}>
                    {faq.question}
                  </span>
                  <div 
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isOpen ? 'rgba(220, 38, 38, 0.1)' : '#f1f5f9',
                      color: isOpen ? 'var(--color-accent)' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      flexShrink: 0,
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <i className={`fa-solid ${isOpen ? 'fa-minus' : 'fa-plus'}`}></i>
                  </div>
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div style={{ padding: '0 1.35rem 1.25rem 1.35rem', borderTop: '1px solid #f1f5f9' }}>
                    <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.7', margin: '0.75rem 0 0 0' }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <i className="fa-solid fa-circle-question" style={{ fontSize: '2.5rem', color: '#94a3b8', marginBottom: '1rem' }}></i>
              <p style={{ fontWeight: 700, color: '#334155' }}>No matching questions found.</p>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>Try clearing your search query or switching categories.</p>
            </div>
          )}
        </div>

        {/* Direct Technical Support Banner */}
        <div style={{ marginTop: '3rem', padding: '1.75rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--color-primary)', margin: '0 0 0.25rem 0' }}>
              Have a custom formulation or bulk inquiry?
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Our R&D chemical engineers in Ahmedabad provide free technical support & sample dispatches.
            </p>
          </div>
          <Link to="/contact" className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.7rem 1.4rem', fontSize: '0.82rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Contact Technical Sales Desk</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

      </div>
    </section>
  );
}
