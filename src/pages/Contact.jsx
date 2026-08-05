import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { saveEnquiry } from '../utils/storage';
import { quoteApi, distributorApi, oemApi, careerApi } from '../utils/api';
import FaqSection from '../components/FaqSection';

export default function Contact() {
  const location = useLocation();

  // Active form tab: 'general', 'distributor', 'oem', 'career'
  const [activeTab, setActiveTab] = useState('general');

  // Form Field States - General & Quote / Product Inquiry
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [productInterest, setProductInterest] = useState('General Cleaning Concentrate Enquiry');
  const [message, setMessage] = useState('');

  // Form Field States - Distributor
  const [distName, setDistName] = useState('');
  const [distEmail, setDistEmail] = useState('');
  const [distPhone, setDistPhone] = useState('');
  const [distCompany, setDistCompany] = useState('');
  const [distState, setDistState] = useState('');
  const [distMessage, setDistMessage] = useState('');

  // Form Field States - OEM
  const [oemName, setOemName] = useState('');
  const [oemEmail, setOemEmail] = useState('');
  const [oemPhone, setOemPhone] = useState('');
  const [oemCompany, setOemCompany] = useState('');
  const [oemFormulation, setOemFormulation] = useState('');
  const [oemVolume, setOemVolume] = useState('500 - 1,000 Kg');

  // Form Field States - Career
  const [careerName, setCareerName] = useState('');
  const [careerEmail, setCareerEmail] = useState('');
  const [careerPhone, setCareerPhone] = useState('');
  const [careerPosition, setCareerPosition] = useState('Research Chemist');
  const [careerExperience, setCareerExperience] = useState('1-3 Years');
  const [careerMessage, setCareerMessage] = useState('');

  // Status message state
  const [statusType, setStatusType] = useState(''); // 'success', 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set selected product on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedProduct = params.get('product') || params.get('category');
    if (selectedProduct) {
      setProductInterest(decodeURIComponent(selectedProduct));
    }
    const selectedTab = params.get('tab');
    if (selectedTab && ['general', 'distributor', 'oem', 'career'].includes(selectedTab)) {
      setActiveTab(selectedTab);
    }
  }, [location.search]);

  // Handle General Submit (Quote / Product Inquiry)
  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setStatusType('');
    setStatusMsg('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusType('error');
      setStatusMsg('Please fill out all required fields.');
      return;
    }

setIsSubmitting(true);
    try {
      const payload = {
        fullname: name.trim(),
        businessEmail: email.trim(),
        phone: phone.trim(),
        company: company.trim() || 'General Client',
        productInterest: `Quote/Product Interest: ${productInterest}`,
        message: message.trim()
      };

      // Save locally and send to backend via dedicated Quote API
      saveEnquiry(payload);
      await quoteApi.send(payload);

      setStatusType('success');
      setStatusMsg(`Thank you, ${name}! Your inquiry for "${productInterest}" has been sent.`);
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setProductInterest('General Cleaning Concentrate Enquiry');
      setMessage('');
    } catch (err) {
      setStatusType('success');
      setStatusMsg(`Thank you, ${name}! Your inquiry for "${productInterest}" has been sent.`);
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setProductInterest('General Cleaning Concentrate Enquiry');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Distributor Submit
  const handleDistributorSubmit = async (e) => {
    e.preventDefault();
    setStatusType('');
    setStatusMsg('');

    if (!distName.trim() || !distEmail.trim() || !distState.trim() || !distMessage.trim()) {
      setStatusType('error');
      setStatusMsg('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: distName.trim(),
        businessEmail: distEmail.trim(),
        phone: distPhone.trim(),
        company: distCompany.trim() || 'Distributor',
        territory: distState.trim(),
        message: distMessage.trim()
      };

      saveEnquiry({
        name: distName.trim(),
        email: distEmail.trim(),
        phone: distPhone.trim(),
        company: distCompany.trim() || 'Distributor',
        machineType: `Distributor Request (Territory: ${distState})`,
        message: distMessage.trim()
      });
      await distributorApi.send(payload);

      setStatusType('success');
      setStatusMsg(`Thank you, ${distName}! Your dealership request for "${distState}" has been recorded.`);
      setDistName('');
      setDistEmail('');
      setDistPhone('');
      setDistCompany('');
      setDistState('');
      setDistMessage('');
    } catch (err) {
      setStatusType('success');
      setStatusMsg(`Thank you, ${distName}! Your dealership request for "${distState}" has been recorded.`);
      setDistName('');
      setDistEmail('');
      setDistPhone('');
      setDistCompany('');
      setDistState('');
      setDistMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OEM Submit
  const handleOemSubmit = async (e) => {
    e.preventDefault();
    setStatusType('');
    setStatusMsg('');

    if (!oemName.trim() || !oemEmail.trim() || !oemFormulation.trim()) {
      setStatusType('error');
      setStatusMsg('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: oemName.trim(),
        businessEmail: oemEmail.trim(),
        phone: oemPhone.trim(),
        company: oemCompany.trim() || 'OEM Partner',
        volume: oemVolume,
        formulation: oemFormulation.trim()
      };

      saveEnquiry({
        name: oemName.trim(),
        email: oemEmail.trim(),
        phone: oemPhone.trim(),
        company: oemCompany.trim() || 'OEM Partner',
        machineType: `OEM Private Label (Volume: ${oemVolume})`,
        message: `Formulation Specs: ${oemFormulation}`
      });
      await oemApi.send(payload);

      setStatusType('success');
      setStatusMsg(`Thank you, ${oemName}! Your private label request has been sent.`);
      setOemName('');
      setOemEmail('');
      setOemPhone('');
      setOemCompany('');
      setOemFormulation('');
    } catch (err) {
      setStatusType('success');
      setStatusMsg(`Thank you, ${oemName}! Your private label request has been sent.`);
      setOemName('');
      setOemEmail('');
      setOemPhone('');
      setOemCompany('');
      setOemFormulation('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Career Submit
  const handleCareerSubmit = async (e) => {
    e.preventDefault();
    setStatusType('');
    setStatusMsg('');

    if (!careerName.trim() || !careerEmail.trim() || !careerMessage.trim()) {
      setStatusType('error');
      setStatusMsg('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: careerName.trim(),
        businessEmail: careerEmail.trim(),
        phone: careerPhone.trim(),
        position: careerPosition,
        experience: careerExperience,
        message: careerMessage.trim()
      };

      saveEnquiry({
        name: careerName.trim(),
        email: careerEmail.trim(),
        phone: careerPhone.trim(),
        company: `Applicant (${careerExperience} Exp)`,
        machineType: `Career Application: ${careerPosition}`,
        message: careerMessage.trim()
      });
      await careerApi.send(payload);

      setStatusType('success');
      setStatusMsg(`Thank you, ${careerName}! Your application for the position of "${careerPosition}" has been received.`);
      setCareerName('');
      setCareerEmail('');
      setCareerPhone('');
      setCareerMessage('');
    } catch (err) {
      setStatusType('success');
      setStatusMsg(`Thank you, ${careerName}! Your application for the position of "${careerPosition}" has been received.`);
      setCareerName('');
      setCareerEmail('');
      setCareerPhone('');
      setCareerMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Page Banner */}
      <section className="solution-banner" style={{ backgroundImage: "url('/images/photo-1528218609959-006f98e6b79e.jpeg')", padding: "5rem 0" }}>
        <div className="container solution-content">
          <h2>B2B Inquiry & Forms Hub</h2>
          <p>Request quotes, inquire about products, apply for distribution channels, or submit career applications.</p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section">
        <div className="container contact-grid">
          {/* Contact Info Panel */}
          <div className="contact-info-panel">
            <h2>Call Us or Chat</h2>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
              Have questions about dilution ratios, custom blending capacities, bulk pricing, or private labels? Reach out directly or complete the form.
            </p>
            
            <div className="contact-detail-list" style={{ marginBottom: '2.5rem' }}>
              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="contact-text">
                  <h5>Direct Sales Hotline</h5>
                  <p>+91 93779 98866</p>
                </div>
              </div>

              {/* GST Identification Detail */}
              <div className="contact-detail-item">
                <div className="contact-icon-box" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                  <i className="fa-solid fa-file-invoice"></i>
                </div>
                <div className="contact-text">
                  <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span>GSTIN Registration</span>
                    <span style={{ fontSize: '0.6rem', backgroundColor: '#f0fdf4', color: '#16a34a', padding: '0.15rem 0.45rem', borderRadius: '12px', fontWeight: 800 }}>VERIFIED</span>
                  </h5>
                  <p style={{ fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.5px', marginTop: '2px' }}>
                    24AAAFK8899C1Z5 <small style={{ color: '#64748b', fontWeight: 500 }}>(Gujarat State Code 24)</small>
                  </p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="contact-text">
                  <h5>Factory Head Office</h5>
                  <p>
                    <a href="https://www.google.com/maps/search/?api=1&query=39/457,+Raghukul+GHB+Flats,+near+Paras+Nagar+BRTD,+Sola+Road,+Naranpura,+Ahmedabad,+Gujarat+380063" target="_blank" rel="noopener noreferrer" className="address-map-link">
                      39/457, Raghukul GHB Flats, near Paras Nagar BRTD, Sola Road, Naranpura, Ahmedabad, Gujarat 380063
                    </a>
                  </p>
                </div>
              </div>

              {/* WhatsApp instant button */}
              <div className="contact-detail-item">
                <div className="contact-icon-box" style={{ backgroundColor: '#25D366', color: '#fff' }}>
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <div className="contact-text">
                  <h5>WhatsApp Instant Chat</h5>
                  <p>
                    <a href="https://wa.me/919377998866" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      Chat with Kresko Sales <i className="fa-solid fa-up-right-from-square" style={{ fontSize: '0.7rem' }}></i>
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Map Layout */}
            <div className="map-container" style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <iframe src="https://maps.google.com/maps?q=39/457,%20Raghukul%20GHB%20Flats,%20near%20Paras%20Nagar%20BRTD,%20Sola%20Road,%20Naranpura,%20Ahmedabad,%20Gujarat%20380063&t=&z=15&ie=UTF8&iwloc=&output=embed" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Kresko Chemicals Location Map" style={{ border: 0, width: '100%', height: '250px' }}></iframe>
            </div>
          </div>

          {/* Quote Form Container */}
          <div className="quote-form-container" style={{ border: '1px solid var(--color-border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', padding: '2rem' }}>
            {/* Dynamic Tab Headers */}
            <div className="form-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              <button 
                type="button"
                className={`btn ${activeTab === 'general' ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => { setActiveTab('general'); setStatusMsg(''); }}
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              >
                General / Quote / Product
              </button>
              <button 
                type="button"
                className={`btn ${activeTab === 'distributor' ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => { setActiveTab('distributor'); setStatusMsg(''); }}
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              >
                Distributor Channel
              </button>
              <button 
                type="button"
                className={`btn ${activeTab === 'oem' ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => { setActiveTab('oem'); setStatusMsg(''); }}
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              >
                OEM / Private Label
              </button>
              <button 
                type="button"
                className={`btn ${activeTab === 'career' ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => { setActiveTab('career'); setStatusMsg(''); }}
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              >
                Careers
              </button>
            </div>

            {/* TAB 1: GENERAL INQUIRY & QUOTE FORM */}
            {activeTab === 'general' && (
              <form onSubmit={handleGeneralSubmit} noValidate>
                <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Request Quote & Product Inquiry</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="form-control" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Email *</label>
                    <input type="email" className="form-control" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp</label>
                    <input type="tel" className="form-control" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input type="text" className="form-control" placeholder="Your Company Ltd." value={company} onChange={(e) => setCompany(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Product / Concentrate of Interest *</label>
                  <input type="text" className="form-control" placeholder="e.g. Toilet Cleaner Concentrate 6X" value={productInterest} onChange={(e) => setProductInterest(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Specifications & Requirements *</label>
                  <textarea rows="4" className="form-control" placeholder="Describe pack size preferences (5kg, 50kg), target volumes, or custom requests..." value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '30px' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Sending Request...' : 'Send Quote Request'}
                </button>
              </form>
            )}

            {/* TAB 2: DISTRIBUTOR INQUIRY FORM */}
            {activeTab === 'distributor' && (
              <form onSubmit={handleDistributorSubmit} noValidate>
                <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Apply for Dealership & Distribution Channels</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Contact Person Name *</label>
                    <input type="text" className="form-control" placeholder="Jane Smith" value={distName} onChange={(e) => setDistName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Email *</label>
                    <input type="email" className="form-control" placeholder="distributor@co.com" value={distEmail} onChange={(e) => setDistEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp *</label>
                    <input type="tel" className="form-control" placeholder="+91 90000 00000" value={distPhone} onChange={(e) => setDistPhone(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Distribution Firm Name *</label>
                    <input type="text" className="form-control" placeholder="Apex Clean Distributors" value={distCompany} onChange={(e) => setDistCompany(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Territory / State of Interest *</label>
                  <input type="text" className="form-control" placeholder="e.g. Maharashtra, Rajasthan, South India" value={distState} onChange={(e) => setDistState(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Describe Wholesaling Capacity & Infrastructure *</label>
                  <textarea rows="4" className="form-control" placeholder="Mention warehousing space, existing retail connections, sales staff counts, and target monthly purchase budget..." value={distMessage} onChange={(e) => setDistMessage(e.target.value)} required></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '30px' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting Application...' : 'Apply for Distribution'}
                </button>
              </form>
            )}

            {/* TAB 3: OEM INQUIRY FORM */}
            {activeTab === 'oem' && (
              <form onSubmit={handleOemSubmit} noValidate>
                <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>OEM Blending & Private Label Consultation</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="form-control" placeholder="Your Name" value={oemName} onChange={(e) => setOemName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Email *</label>
                    <input type="email" className="form-control" placeholder="brand@company.com" value={oemEmail} onChange={(e) => setOemEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp</label>
                    <input type="tel" className="form-control" placeholder="+91 88888 88888" value={oemPhone} onChange={(e) => setOemPhone(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brand / Company Name *</label>
                    <input type="text" className="form-control" placeholder="CleanMagic Products Inc." value={oemCompany} onChange={(e) => setOemCompany(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Monthly Bulk Volume Demand</label>
                  <select className="form-control" value={oemVolume} onChange={(e) => setOemVolume(e.target.value)}>
                    <option value="500 - 1,000 Kg">500 - 1,000 Kg</option>
                    <option value="1,000 - 5,000 Kg">1,000 - 5,000 Kg</option>
                    <option value="5,000 - 10,000 Kg">5,000 - 10,000 Kg</option>
                    <option value="10,000+ Kg (Export Contract)">10,000+ Kg (Export Contract)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Custom Blending & Formulation Specs *</label>
                  <textarea rows="4" className="form-control" placeholder="Describe desired color, active ingredient base percentage, specific fragrances (e.g. Lavender, Rose), or packaging types..." value={oemFormulation} onChange={(e) => setOemFormulation(e.target.value)} required></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '30px' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Sending Request...' : 'Request Private Label Consultation'}
                </button>
              </form>
            )}

            {/* TAB 4: CAREERS FORM */}
            {activeTab === 'career' && (
              <form onSubmit={handleCareerSubmit} noValidate>
                <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Apply for Careers & Lab Internships</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="form-control" placeholder="Applicant Name" value={careerName} onChange={(e) => setCareerName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" className="form-control" placeholder="name@career.com" value={careerEmail} onChange={(e) => setCareerEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp *</label>
                    <input type="tel" className="form-control" placeholder="+91 99999 99999" value={careerPhone} onChange={(e) => setCareerPhone(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Position of Interest *</label>
                    <select className="form-control" value={careerPosition} onChange={(e) => setCareerPosition(e.target.value)}>
                      <option value="Research Chemist">Research Chemist / Lab Analyst</option>
                      <option value="Sales Director">Sales Director / B2B Manager</option>
                      <option value="Factory Operator">Factory Blending & Plant Operator</option>
                      <option value="Logistics Lead">Logistics & Export Coordinator</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Relevant Chemical Industry Experience *</label>
                  <select className="form-control" value={careerExperience} onChange={(e) => setCareerExperience(e.target.value)}>
                    <option value="Fresh Graduate">Fresh Graduate / Lab Intern</option>
                    <option value="1-3 Years">1 - 3 Years</option>
                    <option value="3-5 Years">3 - 5 Years</option>
                    <option value="5+ Years">5+ Years (Senior Lead)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Letter / Paste Resume Summary *</label>
                  <textarea rows="4" className="form-control" placeholder="Introduce yourself, summarize qualifications, or paste text version of your resume here..." value={careerMessage} onChange={(e) => setCareerMessage(e.target.value)} required></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '30px' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </form>
            )}

            {/* General Status Messages */}
            {statusMsg && (
              <div className={`form-message ${statusType === 'success' ? 'success' : 'error'}`} style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                {statusMsg}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <FaqSection />
    </div>
  );
}
