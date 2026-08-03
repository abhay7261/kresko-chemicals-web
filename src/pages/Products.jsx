import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProducts, getProductCategories, deleteProduct } from '../utils/storage';
import ProductImage from '../components/ProductImage';

export default function Products() {
  const [categories, setCategories] = useState(getProductCategories());
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const reloadCategories = () => {
      const cats = getProductCategories();
      setCategories(cats);
      if (!categoryId) {
        const keys = Object.keys(cats);
        if (keys.length > 0) {
          setActiveSelector(prev => (prev === 'home-care' || !prev || !cats[prev]) ? keys[0] : prev);
        }
      }
    };
    window.addEventListener('categoriesUpdated', reloadCategories);
    return () => window.removeEventListener('categoriesUpdated', reloadCategories);
  }, [categoryId]);
  
  // Set active selector (can be category slug or subcategory slug)
  const [activeSelector, setActiveSelector] = useState(categoryId || Object.keys(getProductCategories())[0] || 'home-care');
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      setIsAdmin(sessionStorage.getItem('isAdminLoggedIn') === 'true');
    };
    checkLogin();
    window.addEventListener('adminLoginStatusChange', checkLogin);
    return () => window.removeEventListener('adminLoginStatusChange', checkLogin);
  }, []);

  const handleInlineDeleteProduct = (id, name) => {
    if (window.confirm(`Admin: Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      const all = getProducts();
      setProducts(all);
      alert('Product deleted successfully.');
    }
  };

  const handleInlineEditProduct = (p) => {
    sessionStorage.setItem('editProductPayload', JSON.stringify({ id: p.id, category: p.category, subcategory: p.subcategory }));
    navigate('/admin');
  };

  // Sync with route updates
  useEffect(() => {
    if (categoryId) {
      setActiveSelector(categoryId);
    } else {
      const keys = Object.keys(categories);
      setActiveSelector(keys[0] || 'home-care'); // Reset to first available category
    }
    setIsMobileSidebarOpen(false); // Always close mobile sidebar on navigation
  }, [categoryId, categories]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleSelect = (key) => {
    setActiveSelector(key);
    setIsMobileSidebarOpen(false); // Collapse sidebar
    navigate(`/products/${key}`);
    
    // Smooth scroll down to products grid
    setTimeout(() => {
      const mainContent = document.querySelector('.explorer-main');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Filtering Logic
  const filteredProducts = products.filter(p => {
    // Match either parent category slug OR specific subcategory slug
    const matchesCategory = p.category === activeSelector || p.subcategory === activeSelector;
    const matchesSearch = searchText.trim() === '' || 
      p.title.toLowerCase().includes(searchText.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Retrieve active details for the right-side header
  let activeTitle = 'Cleaning Concentrates';
  let activeDesc = 'High-efficiency B2B chemical bases formulated for high dilution.';
  let activeIcon = 'fa-flask';

  if (categories[activeSelector]) {
    activeTitle = categories[activeSelector].name;
    activeDesc = categories[activeSelector].desc || 'Advanced chemical concentrates compounding.';
    activeIcon = categories[activeSelector].icon;
  } else {
    // Traverse to locate subcategory details
    for (const [catKey, catVal] of Object.entries(categories)) {
      if (catVal.subcategories && catVal.subcategories[activeSelector]) {
        activeTitle = catVal.subcategories[activeSelector];
        activeDesc = `Premium grade ${catVal.subcategories[activeSelector]} engineered for consistent performance and safe transportation stability.`;
        activeIcon = catVal.icon;
        break;
      }
    }
  }

  // Resolve parent category to load background image
  let parentCatKey = 'home-care'; // Default fallback
  if (categories[activeSelector]) {
    parentCatKey = activeSelector;
  } else {
    for (const [catKey, catVal] of Object.entries(categories)) {
      if (catVal.subcategories && catVal.subcategories[activeSelector]) {
        parentCatKey = catKey;
        break;
      }
    }
  }

  // Define category image mapping
  const categoryImages = {
    'home-care': '/images/home_care_bg.png',
    'laundry-care': '/images/laundry_care_bg.png',
    'kitchen-care': '/images/kitchen_care_bg.png',
    'floor-care': '/images/floor_care_bg.png',
    'bathroom-care': '/images/bathroom_care_bg.png',
    'personal-care': '/images/personal_care_bg.png',
    'glass-care': '/images/glass_care_bg.png',
    'car-care': '/images/car_care_bg.png',
    'air-care': '/images/air_fresheners_bg.png',
    'metal-care': '/images/photo-1528218609959-006f98e6b79e.jpeg',
    'metal-shining-powder': '/images/photo-1519668963014-2308b08e5e9b.jpeg',
    'pest-control': '/images/pest_control_bg.png',
    'specialty-products': '/images/specialty_products_bg.png',
    'powder-to-liquid': '/images/photo-1528218609959-006f98e6b79e.jpeg'
  };

  const headerBgImage = categoryImages[parentCatKey] || '/images/home_care_bg.png';

  return (
    <div>
      {/* Page Banner */}
      <section className="solution-banner" style={{ backgroundImage: "url('/images/photo-1528218609959-006f98e6b79e.jpeg')", padding: "4rem 0" }}>
        <div className="container solution-content">
          <h2>B2B Concentrates Catalog</h2>
          <p>Explore chemical spec sheets. Filter by subcategories using our Swadesh-style product explorer.</p>
        </div>
      </section>

      {/* Explorer Grid */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="explorer-layout">

            {/* Left Panel: Active Subcategory Description & Product Items */}
            <main className="explorer-main">
              {/* Category Info Header */}
              <div 
                className="swadesh-banner-container"
                style={{ 
                position: 'relative',
                borderRadius: '8px', 
                overflow: 'hidden',
                padding: '2.5rem',
                marginBottom: '2.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {/* Background image */}
                <img 
                  src={headerBgImage} 
                  alt={activeTitle} 
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    zIndex: 1 
                  }} 
                />
                {/* Dark Overlay */}
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95) 45%, rgba(15, 23, 42, 0.6) 100%)',
                  zIndex: 2 
                }} />

                {/* Content Container */}
                <div style={{ position: 'relative', zIndex: 3, color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                      color: '#ffffff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '1.5rem' 
                    }}>
                      {activeIcon && activeIcon.startsWith('fa-') ? (
                        <i className={`fa-solid ${activeIcon}`}></i>
                      ) : (
                        <img src={activeIcon || '/images/product_placeholder.jpg'} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.65rem', color: '#ffffff', fontWeight: 800, margin: 0 }}>
                      {activeTitle}
                    </h3>
                  </div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.7', margin: 0, fontSize: '0.92rem', maxWidth: '600px' }}>
                    {activeDesc}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    <Link to="/contact" className="btn btn-primary" style={{ borderRadius: '4px', padding: '0.6rem 1.5rem', fontSize: '0.75rem', backgroundColor: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}>Request Catalog Sheets</Link>
                    <a href="https://wa.me/919377998866" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ borderRadius: '4px', padding: '0.6rem 1.5rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#ffffff', borderColor: '#ffffff' }}>
                      <i className="fa-brands fa-whatsapp"></i> Chat with Sales
                    </a>
                  </div>
                </div>
              </div>

              {/* Product Listing Stack - Premium horizontal split cards stacked vertically */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center', width: '100%' }}>
                {filteredProducts.map(p => (
                  <div 
                    key={p.id} 
                    className="product-horizontal-card"
                    style={{
                      display: 'flex',
                      position: 'relative',
                      backgroundColor: '#ffffff',
                      border: '1px solid rgba(226, 232, 240, 0.9)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.05)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {isAdmin && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        zIndex: 10,
                        display: 'flex',
                        gap: '0.4rem'
                      }}>
                        <button
                          onClick={() => handleInlineEditProduct(p)}
                          className="btn"
                          style={{
                            padding: '0.35rem 0.7rem',
                            fontSize: '0.72rem',
                            backgroundColor: '#f59e0b',
                            color: '#000000',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                          }}
                          title="Admin: Edit this product"
                        >
                          <i className="fa-solid fa-pen"></i> Edit
                        </button>
                        <button
                          onClick={() => handleInlineDeleteProduct(p.id, p.title)}
                          className="btn"
                          style={{
                            padding: '0.35rem 0.7rem',
                            fontSize: '0.72rem',
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                          }}
                          title="Admin: Delete this product"
                        >
                          <i className="fa-solid fa-trash"></i> Delete
                        </button>
                      </div>
                    )}
                    
                    {/* Left half: Radial Image Stage Canvas - Elevated 320px Height */}
                    <div 
                      className="product-img-box" 
                      style={{ 
                        width: '320px', 
                        minWidth: '320px', 
                        height: '320px', 
                        padding: '1.5rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        background: 'radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%)', 
                        borderRight: '1px solid #edf2f7',
                        position: 'relative' 
                      }}
                    >
                      {p.tag && (
                        <span 
                          style={{ 
                            position: 'absolute', 
                            top: '16px', 
                            left: '16px', 
                            backgroundColor: 'var(--color-accent)', 
                            color: '#ffffff', 
                            fontSize: '0.68rem', 
                            fontWeight: 800, 
                            padding: '0.3rem 0.75rem', 
                            borderRadius: '20px', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                            zIndex: 5 
                          }}
                        >
                          {p.tag}
                        </span>
                      )}

                      <ProductImage 
                        category={p.category} 
                        title={p.title} 
                        image={p.image} 
                        style={{ 
                          maxHeight: '260px', 
                          maxWidth: '100%', 
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 12px 22px rgba(0, 0, 0, 0.09))',
                          transition: 'transform 0.3s ease' 
                        }} 
                      />
                    </div>
                    
                    {/* Right half: Elevated Detail Box - Spacious Height */}
                    <div className="product-info-box" style={{ padding: '1.85rem 2rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                      <div>
                        <h4 className="product-item-title" style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-primary)', margin: '0 0 0.65rem 0', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {p.title}
                        </h4>
                        
                        <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.65', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: '0 0 1.25rem 0' }}>
                          {p.desc}
                        </p>
                      </div>
                      
                      <div>
                        {/* Parameter Data Chips Grid */}
                        <div className="product-param-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', margin: '0 0 1.25rem 0' }}>
                          
                          {/* Price Chip */}
                          <div className="product-param-chip" style={{ backgroundColor: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.12)', borderRadius: '10px', padding: '0.65rem 0.75rem' }}>
                            <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Price</span>
                            <strong style={{ fontSize: '0.98rem', color: '#dc2626', fontWeight: 900 }}>{p.price}</strong>
                          </div>

                          {/* MOQ Chip */}
                          <div className="product-param-chip" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.65rem 0.75rem' }}>
                            <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>MOQ / Pack</span>
                            <strong style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 800 }}>{p.minPack}</strong>
                          </div>

                          {/* Dilution Ratio Chip */}
                          <div className="product-param-chip" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '0.65rem 0.75rem' }}>
                            <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Dilution</span>
                            <strong style={{ fontSize: '0.88rem', color: '#0284c7', fontWeight: 800 }}>{p.dilution}</strong>
                          </div>

                          {/* Effective Rate Chip */}
                          <div className="product-param-chip" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.65rem 0.75rem' }}>
                            <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Effective Rate</span>
                            <strong style={{ fontSize: '0.92rem', color: '#16a34a', fontWeight: 900 }}>{p.rateAfter || 'RTU'}</strong>
                          </div>

                        </div>
                        
                        {/* Elevated CTA Button */}
                        <Link 
                          to={`/products/${p.category}/${p.id}`} 
                          className="btn btn-primary" 
                          style={{ 
                            width: '100%', 
                            borderRadius: '10px', 
                            background: 'linear-gradient(135deg, #1b2a47 0%, #0f172a 100%)', 
                            borderColor: '#1b2a47', 
                            padding: '0.85rem 1rem', 
                            fontSize: '0.86rem', 
                            textAlign: 'center', 
                            fontWeight: '800',
                            letterSpacing: '0.4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                            transition: 'all 0.25s ease'
                          }}
                        >
                          <span>View Product Specifications & TDS / COA Sheets</span>
                          <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.82rem', color: '#f8fafc' }}></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-white)', border: '1px solid var(--color-border)', borderRadius: '8px', width: '100%' }}>
                    <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '2.5rem', color: 'var(--color-accent)', marginBottom: '1rem' }}></i>
                    <p style={{ fontWeight: 600 }}>No products matched your search keyword.</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try clearing your search input or selecting another subcategory.</p>
                  </div>
                )}
              </div>
            </main>

            {/* Right Sidebar: Subcategories grouped under Major Categories */}
            <div>
              <button 
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="btn btn-secondary mobile-filter-toggle"
                style={{
                  width: '100%',
                  marginBottom: '1rem',
                  display: 'none',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)',
                  borderRadius: '6px',
                  backgroundColor: '#fff'
                }}
                type="button"
              >
                <i className="fa-solid fa-filter"></i>
                {isMobileSidebarOpen ? 'Hide Categories Filter' : 'Show Categories Filter'}
              </button>

              <aside className={`explorer-sidebar ${isMobileSidebarOpen ? 'mobile-show' : 'mobile-hide'}`}>
                {/* Search Bar */}
                <div className="sidebar-heading-input" style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search products..." 
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.65rem 1rem 0.65rem 2.25rem', 
                      borderRadius: '30px', 
                      border: '1px solid var(--color-border)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '0.88rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}></i>
                </div>

                {/* Grouped Catalog Categories */}
                {Object.entries(categories).map(([catKey, catVal]) => (
                  <div key={catKey} style={{ marginBottom: '1.5rem' }}>
                    <button
                      onClick={() => handleSelect(catKey)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        border: 'none',
                        background: 'none',
                        color: activeSelector === catKey ? 'var(--color-accent)' : 'var(--color-primary)',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.25rem 0',
                        borderBottom: '1px solid var(--color-border)',
                        marginBottom: '0.5rem',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {catVal.icon && catVal.icon.startsWith('fa-') ? (
                        <i className={`fa-solid ${catVal.icon}`} style={{ fontSize: '0.85rem' }}></i>
                      ) : (
                        <img src={catVal.icon || '/images/product_placeholder.jpg'} alt="" style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }} />
                      )}
                      {catVal.name}
                    </button>

                    {/* Subcategories list under this category */}
                    {catVal.subcategories && (
                      <ul style={{ listStyle: 'none', paddingLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {Object.entries(catVal.subcategories).map(([subKey, subVal]) => {
                          const isSubActive = activeSelector === subKey;
                          return (
                            <li key={subKey}>
                              <button
                                onClick={() => handleSelect(subKey)}
                                style={{
                                  width: '100%',
                                  textAlign: 'left',
                                  padding: '0.45rem 0.75rem',
                                  borderRadius: '4px',
                                  border: 'none',
                                  backgroundColor: isSubActive ? 'rgba(220, 38, 38, 0.05)' : 'transparent',
                                  color: isSubActive ? 'var(--color-accent)' : 'var(--color-text-main)',
                                  fontSize: '0.82rem',
                                  fontWeight: isSubActive ? '700' : '500',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  transition: 'all 0.2s ease'
                                }}
                                className="sidebar-subcat-btn"
                              >
                                <span style={{ 
                                  width: '5px', 
                                  height: '5px', 
                                  borderRadius: '50%', 
                                  backgroundColor: isSubActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                  display: 'inline-block' 
                                }}></span>
                                {subVal}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))}
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
