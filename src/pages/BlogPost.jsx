import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogs } from '../utils/storage';

export default function BlogPost() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const blogs = getBlogs();
    const foundBlog = blogs.find(b => b.id === id);
    setArticle(foundBlog);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fa-solid fa-circle-question" style={{ fontSize: '3.5rem', color: 'var(--color-accent)', marginBottom: '1.5rem' }}></i>
          <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>Article Not Found</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>The article you are trying to view does not exist in our database.</p>
          <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ==========================================================================
           ARTICLE BANNER
           ========================================================================== */}
      <section className="solution-banner" style={{ backgroundImage: `url(${article.image})`, padding: "5rem 0" }}>
        <div className="container solution-content">
          <span className="hero-tag">{article.category}</span>
          <h2>{article.title}</h2>
          <p>Published: {article.date} | Kresko Insights</p>
        </div>
      </section>

      {/* ==========================================================================
           ARTICLE BODY CONTENT
           ========================================================================== */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '4rem' }}>
          {/* Main content */}
          <article>
            <div style={{ marginBottom: '2.5rem' }}>
              <img src={article.image} alt={article.title} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '4px', boxShadow: 'var(--shadow-md)' }} />
            </div>
            <div style={{ color: 'var(--color-text-main)', fontSize: '1.05rem', lineHeight: '1.8' }}>
              {(Array.isArray(article.content) 
                ? article.content 
                : (typeof article.content === 'string' ? article.content.split('\n\n') : [])
              ).map((para, idx) => (
                <p key={idx} style={{ marginBottom: '1.5rem' }}>{para}</p>
              ))}
            </div>
            <div style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
              <Link to="/blog" className="btn btn-secondary">
                <i className="fa-solid fa-arrow-left-long" style={{ marginRight: '0.5rem' }}></i> Back to Articles
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Category Box */}
            <div style={{ padding: '2rem', backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
              <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1.25rem', borderBottom: '2px solid var(--color-accent)', paddingBottom: '0.5rem' }}>Categories</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>
                <li><Link to="/blog" style={{ color: 'var(--color-text-main)' }}><i className="fa-solid fa-circle" style={{ fontSize: '0.5rem', color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> Formulations</Link></li>
                <li><Link to="/blog" style={{ color: 'var(--color-text-main)' }}><i className="fa-solid fa-circle" style={{ fontSize: '0.5rem', color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> Tutorials</Link></li>
                <li><Link to="/blog" style={{ color: 'var(--color-text-main)' }}><i className="fa-solid fa-circle" style={{ fontSize: '0.5rem', color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> Sustainability</Link></li>
                <li><Link to="/blog" style={{ color: 'var(--color-text-main)' }}><i className="fa-solid fa-circle" style={{ fontSize: '0.5rem', color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> Medicine & Pharma</Link></li>
              </ul>
            </div>

            {/* Quote Callout Box */}
            <div style={{ padding: '2rem', backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-white)', borderRadius: '4px', textAlign: 'center' }}>
              <i className="fa-solid fa-flask" style={{ fontSize: '2rem', color: 'var(--color-accent)', marginBottom: '1rem' }}></i>
              <h5 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Need Custom Formulations?</h5>
              <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1.5rem', lineHeight: 1.5 }}>Our laboratory designs custom surfactants and dilution modifiers matching your targets.</p>
              <Link to="/contact" className="btn btn-primary" style={{ display: 'block', fontSize: '0.75rem', padding: '0.75rem 1rem' }}>Request Consultation</Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
