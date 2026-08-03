import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, deleteBlog } from '../utils/storage';
import EditableText from '../components/EditableText';

export default function Blog() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setBlogPosts(getBlogs());
    
    const checkLogin = () => {
      setIsAdmin(sessionStorage.getItem('isAdminLoggedIn') === 'true');
    };
    checkLogin();
    window.addEventListener('adminLoginStatusChange', checkLogin);
    return () => window.removeEventListener('adminLoginStatusChange', checkLogin);
  }, []);

  const handleInlineDeleteBlog = (id, title) => {
    if (window.confirm(`Admin: Are you sure you want to delete the blog post "${title}"?`)) {
      deleteBlog(id);
      setBlogPosts(getBlogs());
      alert('Blog post deleted.');
    }
  };

  // Filter Logic
  const filteredPosts = blogPosts.filter(p => {
    const matchesCategory = activeFilter === 'all' || p.category === activeFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchText.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* ==========================================================================
           PAGE BANNER
           ========================================================================== */}
      <section className="solution-banner" style={{ backgroundImage: "url('/images/photo-1528218609959-006f98e6b79e.jpeg')", padding: "5rem 0" }}>
        <div className="container solution-content">
          <h2>
            <EditableText id="blog_banner_title" defaultText="News & Chemical Insights" />
          </h2>
          <p>
            <EditableText id="blog_banner_desc" defaultText="Stay up to date with the latest chemical formulations, stability guides, and industrial sanitization guidelines." />
          </p>
        </div>
      </section>

      {/* ==========================================================================
           BLOG SECTION
           ========================================================================== */}
      <section className="section">
        <div className="container">
          
          {/* Filter Bar */}
          <div className="shop-filter-bar" style={{ marginBottom: "3.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "2rem", flexWrap: "wrap", borderBottom: "1px solid var(--color-border)", paddingBottom: "2rem" }}>
            <div className="filter-tabs" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {[
                { label: 'All News', value: 'all' },
                { label: 'Formulations', value: 'tech' },
                { label: 'Sustainability', value: 'green' },
                { label: 'Medicine & Pharma', value: 'pharma' },
                { label: 'Tutorials', value: 'ops' }
              ].map(tab => (
                <button 
                  key={tab.value}
                  className={`btn btn-secondary filter-tab ${activeFilter === tab.value ? 'active' : ''}`}
                  onClick={() => setActiveFilter(tab.value)}
                  style={{ padding: "0.5rem 1.25rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase" }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="search-box" style={{ position: "relative", maxWidth: "320px", width: "100%" }}>
              <input 
                type="text" 
                placeholder="Search blog title..." 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: "100%", padding: "0.65rem 1rem 0.65rem 2.5rem", border: "1px solid var(--color-border)", borderRadius: "4px", backgroundColor: "var(--color-bg-light)", fontSize: "0.85rem" }} 
                className="form-control"
              />
              <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }}></i>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="blog-grid">
            {filteredPosts.map(p => (
              <article key={p.id} className="blog-card" style={{ display: "flex", flexDirection: "column", position: 'relative' }}>
                {isAdmin && (
                  <button
                    onClick={() => handleInlineDeleteBlog(p.id, p.title)}
                    className="btn"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      zIndex: 10,
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.7rem',
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    title="Admin: Delete this article"
                  >
                    <i className="fa-solid fa-trash"></i> Delete
                  </button>
                )}
                <div className="blog-img-container">
                  <img src={p.image} alt={p.title} />
                </div>
                <div className="blog-content" style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div className="blog-date">{p.date}</div>
                    <h3 className="blog-title">
                      <Link to={`/blog/${p.id}`}>{p.title}</Link>
                    </h3>
                    <p className="blog-desc">{p.desc}</p>
                  </div>
                  <Link to={`/blog/${p.id}`} className="blog-more-link" style={{ marginTop: "1rem" }}>
                    Read Article <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </div>
              </article>
            ))}
            {filteredPosts.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '2rem', color: 'var(--color-accent)', marginBottom: '1rem' }}></i>
                <p>No articles matched your search query.</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
