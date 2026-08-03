import React from 'react';
import { Link } from 'react-router-dom';

export default function Industries() {
  return (
    <div>
      {/* Page Banner */}
      <section className="solution-banner" style={{ backgroundImage: "url('/images/photo-1527398317618-b3da8a79e0ca.jpeg')", padding: "5rem 0" }}>
        <div className="container solution-content">
          <h2>Industries We Serve</h2>
          <p>High-efficacy chemical formulations built to satisfy sanitation and operational standards across diverse commercial sectors.</p>
        </div>
      </section>

      {/* Industries Core Detail */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
            <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(220, 38, 38, 0.08)', color: 'var(--color-accent)', padding: '0.35rem 0.85rem', borderRadius: '30px', fontWeight: 800, display: 'inline-block', marginBottom: '0.75rem' }}>
              TARGET MARKETS
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 900, color: 'var(--color-primary)' }}>
              Tailored Cleaning Formulations for B2B Sectors
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
              From high-traffic facility management and luxury hospitality resorts to heavy manufacturing plants, Kresko Chemicals delivers specialized concentrated bases that drastically lower operating costs.
            </p>
          </div>

          {/* 1. Commercial & Institutional */}
          <div className="company-feature-row">
            <div className="company-feature-img-card">
              <img src="/images/ind_facilities.png" alt="Facility & Institutional Cleaning" />
            </div>
            <div>
              <span className="hero-tag" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>01. CORPORATE & FACILITY MANAGEMENT</span>
              <h3 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)', margin: '0.5rem 0 1rem 0', fontWeight: 900, color: 'var(--color-primary)' }}>
                <i className="fa-solid fa-building" style={{ color: 'var(--color-accent)', marginRight: '0.6rem' }}></i> Commercial & Institutional Sanitation
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.92rem' }}>
                Maintaining hygienic conditions across office parks, corporate headquarters, shopping centers, and public transport hubs is vital. We supply premium floor cleaner concentrates (such as lavender lemongrass 10X bases and Citronella bug repellers), streak-free glass cleaners, and toilet bowl acids to facility management companies, cutting cleaning budgets by up to 80%.
              </p>

              <ul className="company-feature-list">
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> High activity concentrates reduced shipping volume by 80%</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Streak-free glass cleaner & antibacterial floor compounds</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Eco-friendly biodegradable surfactants and minimal plastic waste</li>
              </ul>

              <Link to="/products" className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Browse Facility Cleaners</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* 2. Hospitality & Hotels */}
          <div className="company-feature-row reverse-mobile">
            <div>
              <span className="hero-tag" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>02. HOTEL & RESORT HYGIENE</span>
              <h3 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)', margin: '0.5rem 0 1rem 0', fontWeight: 900, color: 'var(--color-primary)' }}>
                <i className="fa-solid fa-hotel" style={{ color: 'var(--color-accent)', marginRight: '0.6rem' }}></i> Hospitality & Guest Amenities
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.92rem' }}>
                Hotels, resorts, and restaurants require premium personal hygiene and fabric wash products that enhance guest satisfaction. We manufacture high-viscosity pearlescent hand wash concentrates, conditioning shampoos, shower gels, laundry fabric softeners, and laundry concentrates compatible with commercial washing systems.
              </p>

              <ul className="company-feature-list">
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Premium Rose, Sandalwood & Strawberry fragrance bases</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Pearlescent hand soaps & silk-conditioning shampoo compounds</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Commercial laundry boosters for hotel linen optical brightness</li>
              </ul>

              <Link to="/products" className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Browse Hotel Amenities</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
            <div className="company-feature-img-card">
              <img src="/images/ind_hospitality.png" alt="Hospitality & Hotel Amenities" />
            </div>
          </div>

          {/* 3. Toll Blending & Industrial */}
          <div className="company-feature-row">
            <div className="company-feature-img-card">
              <img src="/images/ind_industrial.png" alt="Industrial Surfactants & Toll Blending" />
            </div>
            <div>
              <span className="hero-tag" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>03. CUSTOM TOLL BLENDING & INDUSTRIAL</span>
              <h3 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)', margin: '0.5rem 0 1rem 0', fontWeight: 900, color: 'var(--color-primary)' }}>
                <i className="fa-solid fa-flask" style={{ color: 'var(--color-accent)', marginRight: '0.6rem' }}></i> Toll Blending & Surfactant Synthesis
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.92rem' }}>
                We partner with industrial chemical distributors, cleaning brands, and manufacturing facilities requiring custom chemical synthesis. We supply high-viscosity thickener powders, custom surfactant packages, descaling powders for boiler arrays, and concentrated metal polishes for industrial copper/brass equipment.
              </p>

              <ul className="company-feature-list">
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Custom viscosity modifiers & specialty polymer thickeners</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Heavy-duty boiler scale removers & brass shining powders</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Batch lab analysis & custom container toll compounding</li>
              </ul>

              <Link to="/products" className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Browse Surfactants</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
