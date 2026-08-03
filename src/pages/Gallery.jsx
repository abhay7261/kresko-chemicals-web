import React, { useState } from 'react';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('all');

  const galleryItems = [
    { id: 1, title: 'Stainless Steel Chemical Reactors', category: 'plant', img: '/images/photo-1527398317618-b3da8a79e0ca.jpeg', desc: 'Jacketed reactors for mixing high viscosity soap bases and concentrates.' },
    { id: 2, title: 'QC Viscosity Testing Lab', category: 'lab', img: '/images/photo-1528218609959-006f98e6b79e.jpeg', desc: 'Digital Brookfield viscometers checking dilution flow consistency.' },
    { id: 3, title: 'Finished Concentrate Jerrycans', category: 'products', img: '/images/photo-1519668963014-2308b08e5e9b.jpeg', desc: 'Secure HDPE 30 Kg and 50 Kg canisters ready for distribution.' },
    { id: 4, title: 'GMP Cleanroom Chemical Compounding', category: 'plant', img: '/images/photo-1561383621-d109918107aa.jpeg', desc: 'Compounding facility for medical-grade disinfectants and surface washes.' },
    { id: 5, title: 'Palletized Shipping Yards', category: 'products', img: '/images/photo-1503547490235-0d6d87990308.jpeg', desc: 'Stretch-wrapped drums prepared for export sea cargo transit.' },
    { id: 6, title: 'Digital pH Meter Profiling', category: 'lab', img: '/images/photo-1528218609959-006f98e6b79e.jpeg', desc: 'Checking undiluted and diluted pH levels for product consistency.' }
  ];

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  const filters = [
    { value: 'all', label: 'All Images' },
    { value: 'plant', label: 'Blending Plant' },
    { value: 'lab', label: 'QC Laboratory' },
    { value: 'products', label: 'Finished Dispatches' }
  ];

  return (
    <div>
      {/* Banner */}
      <section className="solution-banner" style={{ backgroundImage: "url('/images/photo-1528218609959-006f98e6b79e.jpeg')", padding: "5rem 0" }}>
        <div className="container solution-content">
          <h2>Factory Visual Gallery</h2>
          <p>A look inside Kresko Chemicals: our blending vessels, test laboratories, and logistics dispatch bays.</p>
        </div>
      </section>

      {/* Filterable Gallery */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          
          {/* Filters Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`btn ${activeFilter === f.value ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '30px', padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="gallery-item-card"
                style={{ 
                  backgroundColor: 'var(--color-bg-white)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    className="gallery-img-hover" 
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>{item.title}</h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
