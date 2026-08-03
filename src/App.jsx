import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { syncCategoriesWithBackend, syncProductsWithBackend } from './utils/storage';

// Import Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ChlorineDioxide from './pages/ChlorineDioxide';
import Industries from './pages/Industries';
import Oem from './pages/Oem';
import Facility from './pages/Facility';
import Certifications from './pages/Certifications';
import Gallery from './pages/Gallery';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import AdminLiveOverlay from './components/AdminLiveOverlay';

// Scroll to top helper on route shifts
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

export default function App() {
  useEffect(() => {
    syncCategoriesWithBackend();
    syncProductsWithBackend();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AdminLiveOverlay />
      <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:categoryId" element={<Products />} />
            <Route path="/products/:categoryId/:productId" element={<ProductDetail />} />
            <Route path="/chlorine-dioxide" element={<ChlorineDioxide />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/oem" element={<Oem />} />
            <Route path="/facility" element={<Facility />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
