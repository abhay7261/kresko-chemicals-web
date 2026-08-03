import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EditableText from '../components/EditableText';

export default function About() {
  const [activeSection, setActiveSection] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Company Profile', icon: 'fa-building' },
    { id: 'vision', label: 'Vision & Mission', icon: 'fa-eye' },
    { id: 'infrastructure', label: 'Infrastructure', icon: 'fa-industry' },
    { id: 'quality', label: 'Quality Policy', icon: 'fa-shield-halved' }
  ];

  return (
    <div>
      {/* Page Banner */}
      <section className="solution-banner" style={{ backgroundImage: "url('/images/photo-1528218609959-006f98e6b79e.jpeg')", padding: "5rem 0" }}>
        <div className="container solution-content">
          <h2>
            <EditableText id="about_banner_title" defaultText="About Us" />
          </h2>
          <p>
            <EditableText id="about_banner_desc" defaultText="Learn more about Kresko Chemicals, our manufacturing facility in Ahmedabad, and our commitment to quality concentrates." />
          </p>
        </div>
      </section>

      {/* Tabbed Interactive Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`btn ${activeSection === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px', padding: '0.75rem 1.5rem' }}
              >
                <i className={`fa-solid ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="about-content-card" style={{ backgroundColor: 'var(--color-bg-white)', padding: '3rem', borderRadius: '8px', boxShadow: 'var(--shadow-md)', minHeight: '400px', transition: 'all 0.3s ease' }}>
            
            {/* 1. Company Profile */}
            {activeSection === 'profile' && (
              <div className="fade-in">
                <h3 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  Company Profile
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center' }}>
                  <div>
                    <p style={{ marginBottom: '1rem', fontSize: '1.05rem', lineHeight: '1.8' }}>
                      <strong>Kresko Chemicals</strong> is a premier manufacturer and exporter of high-performance cleaning chemical concentrates, liquid soaps, and specialty sanitizers based in <strong>Ahmedabad, Gujarat, India</strong>. 
                    </p>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                      We specialize in formulating advanced chemical bases that allow cleaning brands, commercial distributors, hospitality networks, and exporting businesses to minimize shipping weight and volume by diluting raw bases on-site. By eliminating water transport costs and retail packaging waste, Kresko’s partners achieve up to 90% freight savings.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                      <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-accent)', backgroundColor: 'var(--color-bg-light)' }}>
                        <h4 style={{ color: 'var(--color-primary)', margin: '0' }}>15+ Years</h4>
                        <small style={{ color: 'var(--color-text-muted)' }}>Chemical Formulation R&D</small>
                      </div>
                      <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-accent)', backgroundColor: 'var(--color-bg-light)' }}>
                        <h4 style={{ color: 'var(--color-primary)', margin: '0' }}>50+ Products</h4>
                        <small style={{ color: 'var(--color-text-muted)' }}>Dilutable Concentrates</small>
                      </div>
                    </div>
                  </div>
                  <div>
                    <img src="/images/photo-1561383621-d109918107aa.jpeg" alt="Kresko Chemicals Factory Profile" style={{ width: '100%', borderRadius: '6px', boxShadow: 'var(--shadow-lg)' }} />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Vision & Mission */}
            {activeSection === 'vision' && (
              <div className="fade-in">
                <h3 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  Vision & Mission
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                  {/* Our Vision */}
                  <div className="bg-image-card">
                    <img src="/images/photo-1528218609959-006f98e6b79e.jpeg" alt="Our Vision" className="bg-image-card-img" />
                    <div className="bg-image-card-overlay"></div>
                    <div className="bg-image-card-content">
                      <div className="bg-image-card-icon-wrapper">
                        <div className="bg-image-card-icon">
                          <i className="fa-solid fa-eye"></i>
                        </div>
                      </div>
                      <h4 className="bg-image-card-title">Our Vision</h4>
                      <p className="bg-image-card-desc">To revolutionize the global cleaning chemical supply chain by establishing high-dilution concentrate technologies as the industry standard. We envision a sustainable market where water isn't shipped unnecessarily, reducing fuel emissions, single-use plastic waste, and product costs.</p>
                    </div>
                  </div>

                  {/* Our Mission */}
                  <div className="bg-image-card">
                    <img src="/images/photo-1561383621-d109918107aa.jpeg" alt="Our Mission" className="bg-image-card-img" />
                    <div className="bg-image-card-overlay"></div>
                    <div className="bg-image-card-content">
                      <div className="bg-image-card-icon-wrapper">
                        <div className="bg-image-card-icon">
                          <i className="fa-solid fa-bullseye"></i>
                        </div>
                      </div>
                      <h4 className="bg-image-card-title">Our Mission</h4>
                      <p className="bg-image-card-desc">To develop and manufacture premium, stable, and highly-dilutable cleaning formulations for B2B distributors and OEM brands. We commit to supplying consistent batches backed by rigorous quality validation (COA, TDS, SDS) and providing complete formulation customization support.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Infrastructure */}
            {activeSection === 'infrastructure' && (
              <div className="fade-in">
                <h3 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  Our Infrastructure
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center' }}>
                  <div>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
                      Our modern manufacturing unit in Ahmedabad, Gujarat, is fully equipped with state-of-the-art chemical engineering systems. We utilize high-capacity jacketed reactors, blending vessels, and precise testing chambers.
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                      <li><i className="fa-solid fa-circle-check" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> Stainless Steel Jacketed Blending Reactors (up to 5,000L capacity)</li>
                      <li><i className="fa-solid fa-circle-check" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> High-shear homogenizers for stable phenyl emulsion bases</li>
                      <li><i className="fa-solid fa-circle-check" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> Semi-automatic bulk drum filling lines with precise mass flowmeters</li>
                      <li><i className="fa-solid fa-circle-check" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> Integrated powder compounding, blending, and pouch packing assemblies</li>
                    </ul>
                    <div style={{ marginTop: '2rem' }}>
                      <Link to="/facility" className="btn btn-primary">Tour Manufacturing Facility</Link>
                    </div>
                  </div>
                  <div>
                    <img src="/images/photo-1503547490235-0d6d87990308.jpeg" alt="Reactor vessel systems" style={{ width: '100%', borderRadius: '6px', boxShadow: 'var(--shadow-lg)' }} />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Quality Policy */}
            {activeSection === 'quality' && (
              <div className="fade-in">
                <h3 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  Quality Policy & Compliance
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem', alignItems: 'center' }}>
                  <div>
                    <img src="/images/photo-1528218609959-006f98e6b79e.jpeg" alt="QC Laboratory Testing" style={{ width: '100%', borderRadius: '6px', boxShadow: 'var(--shadow-lg)' }} />
                  </div>
                  <div>
                    <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
                      At Kresko Chemicals, quality control is integrated into every step of our formulation process. Each batch of concentrates is tested in our in-house lab before container packing.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                      <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-light)', borderRadius: '4px' }}>
                        <h5 style={{ color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>pH & Viscosity</h5>
                        <small style={{ color: 'var(--color-text-muted)' }}>Tested using digital meters and viscometers to match dilutability standards.</small>
                      </div>
                      <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-light)', borderRadius: '4px' }}>
                        <h5 style={{ color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>Thermal Stability</h5>
                        <small style={{ color: 'var(--color-text-muted)' }}>Accelerated thermal trials ensure bases won't separate in transit or hot storage.</small>
                      </div>
                      <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-light)', borderRadius: '4px' }}>
                        <h5 style={{ color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>Full TDS / SDS</h5>
                        <small style={{ color: 'var(--color-text-muted)' }}>Complete technical sheets and safety data certificates provided for every SKU.</small>
                      </div>
                      <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-light)', borderRadius: '4px' }}>
                        <h5 style={{ color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>Batch Traceability</h5>
                        <small style={{ color: 'var(--color-text-muted)' }}>Retention samples kept for 2 years to trace quality parameters.</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
