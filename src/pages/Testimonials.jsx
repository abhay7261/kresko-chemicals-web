import React, { useState, useEffect } from 'react';
import { getReviews, saveReview } from '../utils/storage';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);

  // Review Form States
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5); // Default to 5 stars
  const [quote, setQuote] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Status indicators
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load reviews on mount
  useEffect(() => {
    setReviews(getReviews());
  }, []);

  // Submit Handler
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!name.trim() || !role.trim() || !quote.trim()) {
      alert('Please fill out all review fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newReview = {
        name: name.trim(),
        role: role.trim(),
        rating: rating,
        quote: quote.trim(),
        avatar: '' // Will default in storage.js
      };

      saveReview(newReview);
      setReviews(getReviews()); // Reload lists
      setIsSubmitting(false);
      setSuccessMsg('Thank you! Your testimonial has been successfully published.');
      
      // Reset fields
      setName('');
      setRole('');
      setRating(5);
      setQuote('');
    }, 1000);
  };

  // Render Stars Helper for review cards
  const renderCardStars = (count) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i 
          key={i} 
          className={i < count ? "fa-solid fa-star" : "fa-regular fa-star"} 
          style={{ color: "var(--color-accent)", marginRight: "2px", fontSize: "0.85rem" }}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div>
      {/* ==========================================================================
           PAGE BANNER
           ========================================================================== */}
      <section className="solution-banner" style={{ backgroundImage: "url('/images/photo-1519668963014-2308b08e5e9b.jpeg')", padding: "5rem 0" }}>
        <div className="container solution-content">
          <h2>Testimonials & Case Results</h2>
          <p>Read honest reviews and operational enhancements reported by our commercial clients.</p>
        </div>
      </section>

      {/* ==========================================================================
           REVIEWS DIRECTORY GRID
           ========================================================================== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Client Reviews</h2>
            <p>Operations directors and plant engineering supervisors share their feedback on custom Kresko Chemicals packaging systems.</p>
          </div>

          {/* Testimonial Cards Layout */}
          <div className="blog-grid" style={{ marginBottom: "5rem" }}>
            {reviews.map((rev) => (
              <div 
                key={rev.id} 
                style={{ 
                  backgroundColor: "var(--color-bg-light)", 
                  border: "1px solid var(--color-border)", 
                  padding: "2.5rem", 
                  borderRadius: "4px", 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "space-between",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div>
                  <div style={{ marginBottom: "1rem" }}>
                    {renderCardStars(rev.rating)}
                  </div>
                  <p style={{ fontStyle: "italic", color: "var(--color-text-main)", marginBottom: "2rem", fontFamily: "var(--font-serif)", fontSize: "1.05rem", lineHeight: "1.6" }}>
                    "{rev.quote}"
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", borderTop: "1px solid var(--color-border)", paddingTop: "1.25rem" }}>
                  {rev.avatar ? (
                    <img src={rev.avatar} alt={rev.name} style={{ width: "50px", height: "50px", borderRadius: "50%", border: "2px solid var(--color-accent)", objectFit: "cover" }} />
                  ) : (
                    // Initials Monogram Avatar if no image
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "var(--color-bg-white)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem" }}>
                      {rev.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                  )}
                  <div style={{ textAlign: "left" }}>
                    <h5 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0, color: "var(--color-primary)" }}>{rev.name}</h5>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{rev.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ==========================================================================
               WRITE A TESTIMONIAL FORM
               ========================================================================== */}
          <div className="quote-form-container" style={{ maxWidth: "700px", margin: "0 auto 5rem auto", padding: "3rem", backgroundColor: "var(--color-bg-light)" }}>
            <h3 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Share Your Feedback</h3>
            <p style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.9rem", marginBottom: "2.5rem" }}>We value your partnership. Provide your operational experience below to submit a review.</p>

            <form onSubmit={handleReviewSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role & Company Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Plant Manager, Pfizer Chemicals"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {/* Star Rating selector */}
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="form-label" style={{ display: "block", marginBottom: "0.5rem" }}>Your Star Rating *</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[1, 2, 3, 4, 5].map((starIdx) => (
                    <button
                      key={starIdx}
                      type="button"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      onClick={() => setRating(starIdx)}
                      onMouseEnter={() => setHoverRating(starIdx)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <i 
                        className={(hoverRating || rating) >= starIdx ? "fa-solid fa-star" : "fa-regular fa-star"} 
                        style={{ color: "var(--color-accent)", fontSize: "1.75rem" }}
                      ></i>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review Message *</label>
                <textarea 
                  className="form-control" 
                  rows="4"
                  placeholder="Describe machine performance, installation support, and operational metrics achieved..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary form-submit-btn" disabled={isSubmitting} style={{ width: "100%" }}>
                {isSubmitting ? 'Submitting Review...' : 'Publish Testimonial'}
              </button>

              {successMsg && (
                <div className="form-message success" style={{ display: "block", marginTop: "1.5rem", textAlign: "center" }}>
                  {successMsg}
                </div>
              )}
            </form>
          </div>

          {/* ==========================================================================
               CASE HIGHLIGHT METRICS
               ========================================================================== */}
          <div className="section-header" style={{ marginBottom: "3rem" }}>
            <h2>Operational Metrics & Case Studies</h2>
            <p>A statistical summary of efficiency improvements reported by packaging plants after commissions.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem", textAlign: "center" }} className="steps-container">
            <div style={{ border: "1px solid var(--color-border)", padding: "2rem", borderRadius: "4px", boxShadow: "var(--shadow-sm)", backgroundColor: "var(--color-bg-white)" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "3rem", fontWeight: 800, color: "var(--color-accent)", marginBottom: "0.5rem" }}>40%</div>
              <strong style={{ display: "block", fontSize: "0.95rem", marginBottom: "0.5rem", color: "var(--color-primary)" }}>Reduced Changeover Time</strong>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Slat counters and liquid dosing changeovers completed without additional tooling sets.</p>
            </div>
            <div style={{ border: "1px solid var(--color-border)", padding: "2rem", borderRadius: "4px", boxShadow: "var(--shadow-sm)", backgroundColor: "var(--color-bg-white)" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "3rem", fontWeight: 800, color: "var(--color-accent)", marginBottom: "0.5rem" }}>220+</div>
              <strong style={{ display: "block", fontSize: "0.95rem", marginBottom: "0.5rem", color: "var(--color-primary)" }}>Units Per Minute</strong>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Maximum output speeds verified on horizontal flow packaging wrappers for foods.</p>
            </div>
            <div style={{ border: "1px solid var(--color-border)", padding: "2rem", borderRadius: "4px", boxShadow: "var(--shadow-sm)", backgroundColor: "var(--color-bg-white)" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "3rem", fontWeight: 800, color: "var(--color-accent)", marginBottom: "0.5rem" }}>100%</div>
              <strong style={{ display: "block", fontSize: "0.95rem", marginBottom: "0.5rem", color: "var(--color-primary)" }}>Traceability Check</strong>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Perfect scanning validation on pharma outserts and DSCSA serialization code printouts.</p>
            </div>
            <div style={{ border: "1px solid var(--color-border)", padding: "2rem", borderRadius: "4px", boxShadow: "var(--shadow-sm)", backgroundColor: "var(--color-bg-white)" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "3rem", fontWeight: 800, color: "var(--color-accent)", marginBottom: "0.5rem" }}>24h</div>
              <strong style={{ display: "block", fontSize: "0.95rem", marginBottom: "0.5rem", color: "var(--color-primary)" }}>Engineer Support</strong>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Live technical troubleshooting hotline and quick dispatch for preventative checks.</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
