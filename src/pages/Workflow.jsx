import React from 'react';

export default function Workflow() {
  return (
    <div>
      {/* ==========================================================================
           PAGE BANNER
           ========================================================================== */}
      <section className="solution-banner" style={{ backgroundImage: "url('/images/photo-1528218609959-006f98e6b79e.jpeg')", padding: "5rem 0" }}>
        <div className="container solution-content">
          <h2>Our Formulation Process</h2>
          <p>How we take your cleaning specifications and synthesise custom chemical concentrates from scratch.</p>
        </div>
      </section>

      {/* ==========================================================================
           TIMELINE PROCESS SECTION
           ========================================================================== */}
      <section className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          <div className="section-header">
            <h2>Formulation Timeline</h2>
            <p>From initial laboratory testing to wholesale drum dispatch, we maintain chemical stability, pH control, and safety in every batch.</p>
          </div>

          {/* Vertical Timeline Component */}
          <div className="timeline" style={{ position: "relative", padding: "2rem 0" }}>
            {/* Center line */}
            <div style={{ position: "absolute", left: "50px", top: 0, bottom: 0, width: "4px", backgroundColor: "var(--color-border)", zIndex: 1 }}></div>

            {/* Step 1 */}
            <div style={{ position: "relative", display: "flex", gap: "3rem", marginBottom: "4rem", zIndex: 2 }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "var(--color-accent)", color: "var(--color-bg-white)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 700, flexShrink: 0, border: "4px solid var(--color-bg-white)", boxShadow: "var(--shadow-md)" }}>
                01
              </div>
              <div style={{ backgroundColor: "var(--color-bg-light)", padding: "2rem", borderRadius: "4px", border: "1px solid var(--color-border)", flexGrow: 1 }}>
                <h3 style={{ fontSize: "1.35rem", marginBottom: "0.5rem", color: "var(--color-primary)" }}>Formulation Consultation</h3>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>We analyze your sanitation targets, required dilution ratios (e.g., 6X, 10X, 23X), target solid contents, and scent profiles. We establish cost parameters to maximize your savings compared to diluted retail products.</p>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase" }}><i className="fa-solid fa-clock" style={{ marginRight: "0.3rem" }}></i> Duration: 1 - 3 Days</span>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ position: "relative", display: "flex", gap: "3rem", marginBottom: "4rem", zIndex: 2 }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "var(--color-bg-white)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 700, flexShrink: 0, border: "4px solid var(--color-bg-white)", boxShadow: "var(--shadow-md)" }}>
                02
              </div>
              <div style={{ backgroundColor: "var(--color-bg-light)", padding: "2rem", borderRadius: "4px", border: "1px solid var(--color-border)", flexGrow: 1 }}>
                <h3 style={{ fontSize: "1.35rem", marginBottom: "0.5rem", color: "var(--color-primary)" }}>Laboratory R&D Match</h3>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>Our chemical engineers formulate a pilot batch in the laboratory. We verify thickener response, run pH balancing iterations, test foam density profiles, and optimize organic preservation parameters.</p>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase" }}><i className="fa-solid fa-clock" style={{ marginRight: "0.3rem" }}></i> Duration: 3 - 5 Days</span>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ position: "relative", display: "flex", gap: "3rem", marginBottom: "4rem", zIndex: 2 }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "var(--color-bg-white)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 700, flexShrink: 0, border: "4px solid var(--color-bg-white)", boxShadow: "var(--shadow-md)" }}>
                03
              </div>
              <div style={{ backgroundColor: "var(--color-bg-light)", padding: "2rem", borderRadius: "4px", border: "1px solid var(--color-border)", flexGrow: 1 }}>
                <h3 style={{ fontSize: "1.35rem", marginBottom: "0.5rem", color: "var(--color-primary)" }}>Reactor Synthesis & Blending</h3>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>Once pilot testing is validated, we run large-scale manufacturing inside jacketed stainless steel blending reactors, maintaining uniform mixing temperatures and shearing cycles to synthesize perfect concentrates.</p>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase" }}><i className="fa-solid fa-clock" style={{ marginRight: "0.3rem" }}></i> Duration: 2 - 4 Days</span>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ position: "relative", display: "flex", gap: "3rem", marginBottom: "4rem", zIndex: 2 }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "var(--color-bg-white)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 700, flexShrink: 0, border: "4px solid var(--color-bg-white)", boxShadow: "var(--shadow-md)" }}>
                04
              </div>
              <div style={{ backgroundColor: "var(--color-bg-light)", padding: "2rem", borderRadius: "4px", border: "1px solid var(--color-border)", flexGrow: 1 }}>
                <h3 style={{ fontSize: "1.35rem", marginBottom: "0.5rem", color: "var(--color-primary)" }}>QC Stability Testing</h3>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>Before bulk containment packing, we run viscosity aging checks, color matching inspections, and separation trials under extreme storage conditions to ensure maximum chemical shelf-life.</p>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase" }}><i className="fa-solid fa-clock" style={{ marginRight: "0.3rem" }}></i> Duration: 2 - 3 Days</span>
              </div>
            </div>

            {/* Step 5 */}
            <div style={{ position: "relative", display: "flex", gap: "3rem", zIndex: 2 }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "var(--color-bg-white)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 700, flexShrink: 0, border: "4px solid var(--color-bg-white)", boxShadow: "var(--shadow-md)" }}>
                05
              </div>
              <div style={{ backgroundColor: "var(--color-bg-light)", padding: "2rem", borderRadius: "4px", border: "1px solid var(--color-border)", flexGrow: 1 }}>
                <h3 style={{ fontSize: "1.35rem", marginBottom: "0.5rem", color: "var(--color-primary)" }}>Wholesale Dispatch & Support</h3>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>We pack raw concentrates in secure HDPE drums or canisters. We label batches with QR codes for tracking, provide precise mixing instructions, and dispatch items to your facility with prompt logistics assistance.</p>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase" }}><i className="fa-solid fa-clock" style={{ marginRight: "0.3rem" }}></i> Duration: 2 - 3 Days</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
