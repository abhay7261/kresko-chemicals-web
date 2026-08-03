import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer" style={{ backgroundColor: '#111827', color: '#fff', padding: '4rem 0 0 0', borderTop: '4px solid var(--color-accent)' }}>
      <div className="container footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
        
        {/* About Company Widget */}
        <div className="footer-about">
          <div className="footer-about-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <img src="/images/kresko_logo.png" alt="Kresko Chemicals Logo" style={{ height: '46px', objectFit: 'contain' }} />
            <span style={{ fontSize: '1.4rem', fontWeight: 950, letterSpacing: '0.5px', color: '#fff' }}>
              KRESKO <span style={{ color: 'var(--color-accent)' }}>CHEMICALS</span>
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.7', opacity: 0.8, color: '#e5e7eb' }}>
            Leading bulk manufacturer and exporter of Premium Hygiene and Cleaning Products Concentrate and Specialty Raw Chemicals. Trusted by businesses worldwide for over 12 years.
          </p>
          <div className="footer-socials" style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <a href="https://www.facebook.com/kreskochemicals/" target="_blank" rel="noopener noreferrer" style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyXontent: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem' }}><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem' }}><i className="fa-brands fa-linkedin-in"></i></a>
            <a href="#" style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem' }}><i className="fa-brands fa-instagram"></i></a>
            <a href="https://wa.me/919377998866" target="_blank" rel="noopener noreferrer" style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem' }}><i className="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>

        {/* Products Widget */}
        <div className="footer-links">
          <h5 className="footer-widget-title" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Products</h5>
          <ul className="footer-links-list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <li><Link to="/products/home-care" style={{ color: '#e5e7eb' }}>Home Care Concentrate</Link></li>
            <li><Link to="/products/personal-care" style={{ color: '#e5e7eb' }}>Personal Care Concentrate</Link></li>
            <li><Link to="/products/specialty-cleaners" style={{ color: '#e5e7eb' }}>Specialty Cleaners Base</Link></li>
            <li><Link to="/products/disinfectant-liquid" style={{ color: '#e5e7eb' }}>Disinfectant Concentrate</Link></li>
            <li><Link to="/products/automobile-care" style={{ color: '#e5e7eb' }}>Automobile Care Base</Link></li>
            <li><Link to="/products/eco-friendly" style={{ color: '#e5e7eb' }}>Eco Friendly Cleaning Products</Link></li>
            <li><Link to="/products" style={{ color: 'var(--color-accent)', fontWeight: '700' }}>All Products</Link></li>
          </ul>
        </div>

        {/* Company Widget */}
        <div className="footer-links">
          <h5 className="footer-widget-title" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company</h5>
          <ul className="footer-links-list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <li><Link to="/about" style={{ color: '#e5e7eb' }}>About Us</Link></li>
            <li><Link to="/resources" style={{ color: '#e5e7eb' }}>Raw Chemicals</Link></li>
            <li><Link to="/blog" style={{ color: '#e5e7eb' }}>Technical Blog</Link></li>
            <li><Link to="/oem" style={{ color: '#e5e7eb' }}>Private Labeling</Link></li>
            <li><Link to="/certifications" style={{ color: '#e5e7eb' }}>Certifications</Link></li>
            <li><Link to="/facility" style={{ color: '#e5e7eb' }}>Facility Showcase</Link></li>
            <li><Link to="/contact" style={{ color: '#e5e7eb' }}>Contact Us</Link></li>
            <li><Link to="/admin" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Admin Portal</Link></li>
          </ul>
        </div>

        {/* Contact Info Widget */}
        <div className="footer-contact-info">
          <h5 className="footer-widget-title" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Info</h5>
          <div className="footer-contact-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <i className="fa-solid fa-location-dot" style={{ color: 'var(--color-accent)', marginTop: '0.2rem' }}></i>
              <div>
                <strong style={{ color: '#fff', fontSize: '0.85rem' }}>Office HQ:</strong>
                <p style={{ marginTop: '0.2rem', lineHeight: '1.5' }}>
                  <a href="https://www.google.com/maps/search/?api=1&query=39/457,+Raghukul+GHB+Flats,+near+Paras+Nagar+BRTD,+Sola+Road,+Naranpura,+Ahmedabad,+Gujarat+380063" target="_blank" rel="noopener noreferrer" className="address-map-link" style={{ opacity: 0.8, color: '#e5e7eb' }}>
                    39/457, Raghukul GHB Flats, near Paras Nagar BRTD, Sola Road, Naranpura, Ahmedabad, Gujarat - 380063, India.
                  </a>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <i className="fa-solid fa-industry" style={{ color: 'var(--color-accent)', marginTop: '0.2rem' }}></i>
              <div>
                <strong style={{ color: '#fff', fontSize: '0.85rem' }}>Factory Plant:</strong>
                <p style={{ marginTop: '0.2rem', lineHeight: '1.5' }}>
                  <a href="https://www.google.com/maps/search/?api=1&query=Sumel+-+7+Business+Park,+Rakhial,+Ahmedabad,+Gujarat+382415" target="_blank" rel="noopener noreferrer" className="address-map-link" style={{ opacity: 0.8, color: '#e5e7eb' }}>
                    Sumel - 7 Business Park, Rakhial, Ahmedabad, Gujarat - 382415, India.
                  </a>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <i className="fa-solid fa-phone" style={{ color: 'var(--color-accent)' }}></i>
              <div>
                <span style={{ opacity: 0.8, color: '#e5e7eb' }}>+91 93779 98866</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <i className="fa-solid fa-envelope" style={{ color: 'var(--color-accent)' }}></i>
              <div>
                <a href="mailto:kresko.chemicals@gmail.com" style={{ opacity: 0.8, color: '#e5e7eb' }}>kresko.chemicals@gmail.com</a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <i className="fa-solid fa-file-invoice" style={{ color: 'var(--color-accent)' }}></i>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#e5e7eb' }}><strong>GSTIN:</strong> 24AAAFK8899C1Z5</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '2rem 0', fontSize: '0.8rem', opacity: 0.75 }}>
        <div className="container footer-bottom-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            &copy; 2026 <Link to="/" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>Kresko Chemicals</Link>. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/about">Privacy Policy</Link>
            <Link to="/about">Terms & Conditions</Link>
            <Link to="/contact">Support Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
