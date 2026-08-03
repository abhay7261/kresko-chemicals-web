import React from 'react';
import { Link } from 'react-router-dom';

export default function Facility() {
  return (
    <div>
      {/* Page Banner */}
      <section className="solution-banner" style={{ backgroundImage: "url('/images/photo-1528218609959-006f98e6b79e.jpeg')", padding: "5rem 0" }}>
        <div className="container solution-content">
          <h2>Our Manufacturing Facility</h2>
          <p>State-of-the-art surfactant blending, pH testing, and customized private labeling systems in Ahmedabad, Gujarat.</p>
        </div>
      </section>

      {/* Production Details */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
            <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(220, 38, 38, 0.08)', color: 'var(--color-accent)', padding: '0.35rem 0.85rem', borderRadius: '30px', fontWeight: 800, display: 'inline-block', marginBottom: '0.75rem' }}>
              PLANT & INFRASTRUCTURE
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 900, color: 'var(--color-primary)' }}>
              Industrial Manufacturing Capabilities
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
              Our Ahmedabad manufacturing unit houses advanced stainless steel chemical reactors, automated liquid filling lines, and high-precision testing loops for national and international dispatches.
            </p>
          </div>

          {/* Capability 1 */}
          <div className="company-feature-row">
            <div className="company-feature-img-card">
              <img src="/images/ind_facilities.png" alt="Chemical Blending Tanks" />
            </div>
            <div>
              <span className="hero-tag" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>01. SURFACTANT SYNTHESIS & MIXING</span>
              <h3 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)', margin: '0.5rem 0 1rem 0', fontWeight: 900, color: 'var(--color-primary)' }}>
                Bulk Concentrate Blending & Mixing
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.92rem' }}>
                Our manufacturing department deploys industrial-grade stainless steel jacketed mixing reactors. This allows us to synthesise high-viscosity liquid soap bases, pearlized hand washes, and floor cleaner emulsions under precise thermal cycles. Advanced shear mixing ensures that active ingredients, colors, and premium fragrances remain fully homogenized.
              </p>

              <ul className="company-feature-list">
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Batch Capacities: Up to 5,000 Litres per cycle</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Temperature-controlled blending for organic compounds</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Automated dosing arrays for active cleaning agents</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Physical segregation for eco-friendly concentrates</li>
              </ul>

              <Link to="/contact?product=Bulk+Concentrate+Blending" className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Get Blending Quote</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Capability 2 */}
          <div className="company-feature-row reverse-mobile">
            <div>
              <span className="hero-tag" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>02. QUALITY CONTROL & STABILITY</span>
              <h3 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)', margin: '0.5rem 0 1rem 0', fontWeight: 900, color: 'var(--color-primary)' }}>
                Rigorous QC Stability & Lab Testing
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.92rem' }}>
                Our in-house QC laboratory conducts systematic inspections on every single batch. We verify viscosity parameters, active surfactant concentrations, pH indices, and color consistency. We run accelerated stability tests to ensure that our concentrates will not separate or lose color over time, even under extreme warehouse storage temperatures.
              </p>

              <ul className="company-feature-list">
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Digital pH profiling & Brookfield viscometer checks</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Thermal chamber aging for shelf-life validation</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Refractometric testing for solids concentration</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Batch tracking certificates provided with every dispatch</li>
              </ul>

              <Link to="/contact?product=QC+Testing+Enquiry" className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Consult Our Chemists</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
            <div className="company-feature-img-card">
              <img src="/images/mfg_quality_assurance.png" alt="QC Laboratory Testing" />
            </div>
          </div>

          {/* Capability 3 */}
          <div className="company-feature-row">
            <div className="company-feature-img-card">
              <img src="/images/oem_manufacturing_custom.jpg" alt="Custom Chemical Packaging" />
            </div>
            <div>
              <span className="hero-tag" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>03. PRIVATE LABEL & OEM PACKING</span>
              <h3 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)', margin: '0.5rem 0 1rem 0', fontWeight: 900, color: 'var(--color-primary)' }}>
                Custom Packaging & Contract OEM Logistics
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.92rem' }}>
                We accommodate various commercial order sizes, packing bulk concentrates in HDPE canisters, plastic drums, or dry powder sachets. For distributors and retail brands, we offer OEM private label contract packing, including container printing, barcode placement, and custom box sealing configurations ready for logistics dispatch.
              </p>

              <ul className="company-feature-list">
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Packaging range: 5kg, 30kg, 50kg to 200kg drums</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Custom private label design and container printing</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Palletized shipping with safety stretch wraps</li>
                <li><span className="check-icon"><i className="fa-solid fa-check"></i></span> Specialized dry powder compound packing assemblies</li>
              </ul>

              <Link to="/contact?product=Private+Label+Packing" className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Get Packaging Quote</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
