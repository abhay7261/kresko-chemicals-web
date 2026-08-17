import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProducts,
  saveProduct,
  getBlogs,
  saveBlog,
  getEnquiries,
  deleteEnquiry,
  getAdminPassword,
  saveAdminPassword,
  getAdminSecurity,
  saveAdminSecurity,
  deleteBlog,
  deleteProduct,
  getReviews,
  deleteReview,
  getProductCategories,
  saveProductCategories,
  getHeroSlides,
  saveHeroSlides,
  resetHeroSlides,
  getStoredCatalogs,
  saveStoredCatalog,
  removeStoredCatalog
} from '../utils/storage';
import {
  authApi,
  productsApi,
  categoriesApi,
  blogsApi,
  catalogApi,
  dataUrlToFile,
} from '../utils/api';
import ProductImage from '../components/ProductImage';

export default function Admin() {
  const navigate = useNavigate();

  // Authentication states
  const [isLocked, setIsLocked] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Lockout States
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const timerRef = useRef(null);

  // Recovery States (Forgot Password)
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'enquiries', 'manage-content', 'add-product', 'add-blog', 'security'

  // Dynamic Data Lists
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Category management state
  const [categories, setCategories] = useState({});
  const [selectedCatKey, setSelectedCatKey] = useState('');
  const [selectedSubKey, setSelectedSubKey] = useState('');
  
  // Create Category fields
  const [newCatKey, setNewCatKey] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('/images/product_placeholder.jpg');
  
  // Create Subcategory fields
  const [newSubKey, setNewSubKey] = useState('');
  const [newSubName, setNewSubName] = useState('');

  // Product management (nested inside Subcategory)
  const [manageProdId, setManageProdId] = useState(''); // Empty for new, set for edit
  const [manageProdTitle, setManageProdTitle] = useState('');
  const [manageProdPrice, setManageProdPrice] = useState('Rs. 180 / Kg');
  const [manageProdTag, setManageProdTag] = useState('');
  const [manageProdDilution, setManageProdDilution] = useState('1 + 5');
  const [manageProdMinPack, setManageProdMinPack] = useState('30 Kg');
  const [manageProdRateAfter, setManageProdRateAfter] = useState('Rs. 30.00 / Litre');
  const [manageProdDesc, setManageProdDesc] = useState('');
  const [manageProdImages, setManageProdImages] = useState([]);

  // Security question data
  const [securityData, setSecurityData] = useState({ question: '', answer: '' });

  // Load lists on mount
  useEffect(() => {
    setProducts(getProducts());
    setBlogs(getBlogs());
    setEnquiries(getEnquiries());
    setSecurityData(getAdminSecurity());
    setReviews(getReviews());
    setCategories(getProductCategories());
    setCatalogTitle(localStorage.getItem('kresko_catalog_title') || '');
    setCatalogPdf(localStorage.getItem('kresko_catalog_pdf') || '');
    setCatalogUrl(localStorage.getItem('kresko_catalog_url') || '');
    setSavedCatalogs(getStoredCatalogs());

    const reloadCats = () => {
      setCategories(getProductCategories());
    };
    window.addEventListener('categoriesUpdated', reloadCats);

    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
      setIsLocked(false);
    }

        const editPayload = sessionStorage.getItem('editProductPayload');
    if (editPayload) {
      try {
        const payload = JSON.parse(editPayload);
        setActiveTab('manage-content');

        // Find product to pre-fill the inline editor on the Manage Content tab.
        const allProducts = getProducts();
        const p = allProducts.find(prod => prod.id === payload.id);
        if (p) {
          const images = p.images && p.images.length ? [...p.images] : (p.image ? [p.image] : []);
          setEditValues({ ...p, images });
        }
      } catch (e) {
        console.error(e);
      }
      sessionStorage.removeItem('editProductPayload'); // Clear after loading
    }

    return () => {
      window.removeEventListener('categoriesUpdated', reloadCats);
    };
  }, []);

  const handleDeleteReview = (id) => {
    if (window.confirm("Are you sure you want to delete this customer review?")) {
      deleteReview(id);
      setReviews(getReviews());
    }
  };

  // Countdown timer for lockout security
  useEffect(() => {
    if (lockoutTime > 0) {
      timerRef.current = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setFailedAttempts(0); // Reset attempts after timeout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [lockoutTime]);

  // Form Field States - Product
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState('handwash');
  const [prodPrice, setProdPrice] = useState('Rs. 170 / Kg');
  const [prodTag, setProdTag] = useState('Liquid');
  const [prodImages, setProdImages] = useState([]);
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodDilution, setProdDilution] = useState('1 + 5');
  const [prodMinPack, setProdMinPack] = useState('30 Kg');
  const [prodRateAfter, setProdRateAfter] = useState('Rs. 24.83 / Litre');
  const [prodSuccess, setProdSuccess] = useState('');

  // Form Field States - Blog
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('tech');
  const [blogDesc, setBlogDesc] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState(null); // File object for backend upload
  const [blogImagePreview, setBlogImagePreview] = useState(''); // data-URL preview shown on the card & article banner
  const [blogSuccess, setBlogSuccess] = useState('');

  // Form Field States - Password Change
  const [currentPwd, setCurrentPwd] = useState('');
  const [changePwdNew, setChangePwdNew] = useState('');
  const [changePwdConfirm, setChangePwdConfirm] = useState('');
  const [pwdChangeError, setPwdChangeError] = useState('');
  const [pwdChangeSuccess, setPwdChangeSuccess] = useState('');

  // Form Field States - Security Question Change
  const [changeQuestion, setChangeQuestion] = useState('');
  const [changeAnswer, setChangeAnswer] = useState('');
  const [secChangeSuccess, setSecChangeSuccess] = useState('');

  // Catalog manager states
    const [catalogTitle, setCatalogTitle] = useState('');
  const [catalogPdf, setCatalogPdf] = useState('');
  const [catalogUrl, setCatalogUrl] = useState('');
  const [catalogSuccess, setCatalogSuccess] = useState('');
  const [savedCatalogs, setSavedCatalogs] = useState([]);

  // Inline edit a product directly from the Manage Content table (or via the
  // Products-page deep-link). Decoupled from the Category → Subcategory tree,
  // so ANY product can be edited even when its category/subcategory don't exist
  // in the current category hierarchy.
  const [editValues, setEditValues] = useState(null);

  // Homepage hero editor states
  const [heroSlides, setHeroSlides] = useState(() => getHeroSlides());
  const [heroSuccess, setHeroSuccess] = useState('');

  // Enquiries search & details
  const [enquirySearch, setEnquirySearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Authentication unlock logic
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (lockoutTime > 0) return;
    setAuthError('');

    try {
      const data = await authApi.login(passwordInput);

      setIsLocked(false);
      setAuthError('');
      setFailedAttempts(0);
      setPasswordInput('');
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      if (data.token) {
        sessionStorage.setItem('adminToken', data.token);
      }
      window.dispatchEvent(new Event('adminLoginStatusChange'));
    } catch (error) {
      console.error('Login error:', error);
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      const errMsg = error.message || 'Authentication failed. Please verify credentials.';

      if (nextFailed >= 5) {
        setLockoutTime(30);
        setAuthError('Too many failed attempts. Login locked for 30 seconds.');
      } else {
        setAuthError(`${errMsg}. Attempt ${nextFailed}/5.`);
      }
    }
  };

  // Forgot password check
  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    setRecoveryError('');

    const savedSec = getAdminSecurity();
    if (recoveryAnswer.toLowerCase().trim() === savedSec.answer.toLowerCase()) {
      setRecoverySuccess(true);
      setRecoveryError('');
    } else {
      setRecoveryError('Incorrect answer. Please verify and try again.');
    }
  };

  // Reset password form submit
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setRecoveryError('');

    if (newPasswordInput.length < 6) {
      setRecoveryError('New password must be at least 6 characters long.');
      return;
    }

    if (newPasswordInput !== newPasswordConfirm) {
      setRecoveryError('Passwords do not match.');
      return;
    }

    saveAdminPassword(newPasswordInput);
    alert('Password reset successfully! You can now log in using your new password.');
    
    // Reset state & redirect back to login
    setIsRecovering(false);
    setRecoverySuccess(false);
    setRecoveryAnswer('');
    setNewPasswordInput('');
    setNewPasswordConfirm('');
    setPasswordInput('');
    setFailedAttempts(0);
  };

  // Change Password submit inside dashboard
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwdChangeError('');
    setPwdChangeSuccess('');

    const correctPwd = getAdminPassword();
    if (currentPwd !== correctPwd) {
      setPwdChangeError('Current password is incorrect.');
      return;
    }

    if (changePwdNew.length < 6) {
      setPwdChangeError('New password must be at least 6 characters long.');
      return;
    }

    if (changePwdNew !== changePwdConfirm) {
      setPwdChangeError('New passwords do not match.');
      return;
    }

    saveAdminPassword(changePwdNew);
    setPwdChangeSuccess('Password updated successfully!');
    setCurrentPwd('');
    setChangePwdNew('');
    setChangePwdConfirm('');
  };

  // Change Security Question submit inside dashboard
  const handleChangeSecurity = (e) => {
    e.preventDefault();
    setSecChangeSuccess('');

    if (!changeQuestion.trim() || !changeAnswer.trim()) {
      alert('Please fill out both recovery fields.');
      return;
    }

    saveAdminSecurity(changeQuestion.trim(), changeAnswer.trim());
    setSecurityData(getAdminSecurity()); // Reload state
    setSecChangeSuccess('Security recovery question updated successfully!');
    setChangeQuestion('');
    setChangeAnswer('');
  };

  // Delete Blog post trigger
  const handleDeleteBlog = (id, title) => {
    if (window.confirm(`Are you sure you want to delete the blog post "${title}"?`)) {
      deleteBlog(id);
      setBlogs(getBlogs()); // Reload state
      alert('Blog post deleted.');
    }
  };

  // Delete Product listing trigger
  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the product concentrate "${name}"?`)) {
      deleteProduct(id);
      setProducts(getProducts()); // Reload state
      alert('Product deleted.');
    }
  };

    // Edit a product from the Manage Content table (or via the Products-page
  // deep-link). Opens a self-contained inline edit form on the Manage Content
  // tab — decoupled from the Category → Subcategory tree, so it works for ANY
  // product, even when its category/subcategory don't exist in the category tree.
  const handleEditProduct = (p) => {
    const images = p.images && p.images.length ? [...p.images] : (p.image ? [p.image] : []);
    setEditValues({ ...p, images });
    setActiveTab('manage-content');
  };

  const handleEditProductSave = (e) => {
    e.preventDefault();
    if (!editValues) return;
    if (!editValues.title?.trim() || !editValues.price?.trim()) {
      alert('Please fill out the Product Name and Price.');
      return;
    }
    const imagesArr = (editValues.images || []).filter(img => img && img.trim() !== '');
    const image = imagesArr[0] || '/images/product_placeholder.jpg';
    // Preserve id / category / subcategory (and any backend _id) so the product
    // stays in place — only the editable fields are updated.
    const updatedProduct = {
      ...editValues,
      title: editValues.title.trim(),
      price: editValues.price.trim(),
      tag: (editValues.tag || '').trim(),
      dilution: (editValues.dilution || '').trim(),
      minPack: (editValues.minPack || '').trim(),
      rateAfter: (editValues.rateAfter || '').trim(),
      desc: (editValues.desc || '').trim(),
      images: imagesArr,
      image,
    };
    saveProduct(updatedProduct);
    setProducts(getProducts()); // Reload products list
    setEditValues(null);
    alert(`Product "${editValues.title}" updated successfully!`);
  };

  const handleEditProductCancel = () => setEditValues(null);

  // Delete Enquiry lead trigger
  const handleDeleteEnquiry = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the inquiry lead from "${name}"?`)) {
      const updated = await deleteEnquiry(id);
      setEnquiries(updated || getEnquiries()); // Reload state
      setSelectedEnquiry(null); // Close modal if open
      alert('Inquiry deleted successfully.');
    }
  };

  // Add Product Form submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProdSuccess('');

    if (!prodTitle.trim() || !prodPrice.trim() || !prodDesc.trim()) {
      alert('Please fill out all product fields.');
      return;
    }

    const newProduct = {
      category: prodCategory,
      title: prodTitle.trim(),
      name: prodTitle.trim(),
      price: prodPrice.trim(),
      tag: prodTag.trim(),
      images: prodImages,
      image: prodImages[0] || '',
      dilution: prodDilution.trim(),
      minPack: prodMinPack.trim(),
      rateAfter: prodRateAfter.trim(),
      desc: prodDesc.trim(),
      description: prodDesc.trim()
    };

    saveProduct(newProduct);
    setProducts(getProducts()); // Reload list

    // Upload to backend via centralized API client (auth handled by interceptor)
    try {
      const formData = new FormData();
      formData.append('name', prodTitle.trim());
      formData.append('price', prodPrice.trim());
      formData.append('category', prodCategory);
      formData.append('description', prodDesc.trim());
      if (prodImages && prodImages.length > 0) {
        const firstImage = prodImages[0];
        // If it's a data URL (from the file picker), convert to a File for multipart upload
        const file =
          typeof firstImage === 'string' && firstImage.startsWith('data:')
            ? dataUrlToFile(firstImage, 'product')
            : firstImage;
        if (file) {
          formData.append('image', file);
        }
      }

      await productsApi.upload(formData);
      console.log('Product uploaded to backend server successfully!');
    } catch (err) {
      console.warn('Backend product upload API error:', err.message || err);
    }

    setProdSuccess(`Product concentrate "${prodTitle}" added successfully! Redirecting to Concentrates page...`);
    
    // Reset fields
    setProdTitle('');
    setProdDesc('');
    setProdImages([]);
    setManualImageUrl('');
    setProdDilution('1 + 5');
    setProdMinPack('30 Kg');
    setProdRateAfter('Rs. 24.83 / Litre');
    
    setTimeout(() => {
      setProdSuccess('');
      navigate('/products');
    }, 2000);
  };

  // Add Blog Form submit
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setBlogSuccess('');

    if (!blogTitle.trim() || !blogDesc.trim() || !blogContent.trim()) {
      alert('Please fill out all blog fields.');
      return;
    }

    const paragraphs = blogContent
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const now = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const formattedDate = `${months[now.getMonth()]} ${now.getDate().toString().padStart(2,'0')}, ${now.getFullYear()}`;

    const newBlog = {
      category: blogCategory,
      date: formattedDate,
      title: blogTitle.trim(),
      desc: blogDesc.trim(),
      image: blogImagePreview || '/images/Fotolia_116886232_Subscription_Monthly_M.jpg', // Uploaded cover or default
      content: paragraphs
    };

    saveBlog(newBlog);
    setBlogs(getBlogs()); // Reload list

    // Upload to backend via POST /api/blogs/upload using FormData.
    // The axios interceptor automatically attaches the Authorization Bearer token.
    try {
      const formData = new FormData();
      formData.append('title', blogTitle.trim());
      formData.append('description', blogDesc.trim());
      formData.append('content', paragraphs.join('\n'));
      formData.append('category', blogCategory);
      if (blogImage) {
        // If the selected image is a plain File object, append directly.
        formData.append('image', blogImage);
      }
      await blogsApi.upload(formData);
      console.log('Blog post uploaded to backend server successfully!');
    } catch (err) {
      console.warn('Backend blog upload API error:', err.message || err);
    }

    setBlogSuccess(`Blog post "${blogTitle}" uploaded successfully! Redirecting to Blog page...`);
    
    // Reset fields
    setBlogTitle('');
    setBlogDesc('');
    setBlogContent('');
    setBlogImage(null);
    setBlogImagePreview('');

    setTimeout(() => {
      setBlogSuccess('');
      navigate('/blog');
    }, 2000);
  };

  const handleCatalogSubmit = async (e) => {
    e.preventDefault();
    setCatalogSuccess('');

    try {
      const title = catalogTitle.trim();
      if (!title) {
        setCatalogSuccess('Please enter a Catalog Title.');
        return;
      }

      const hasPdf = catalogPdf && catalogPdf.startsWith('data:');
      const hasUrl = !!catalogUrl.trim();
      if (!hasPdf && !hasUrl) {
        setCatalogSuccess('Please upload a PDF file OR provide a custom PDF link/path.');
        return;
      }

      // 1) Build the new catalog entry. Each upload is APPENDED to the list
      //    (multi-catalog), never replacing previously uploaded catalogs.
      const approxBytes = hasPdf ? Math.round((catalogPdf.length * 3) / 4) : 0;
      if (hasPdf && approxBytes > 4.5 * 1024 * 1024) {
        setCatalogSuccess('PDF is too large to embed locally (max ~4.5 MB). Please use a custom PDF link/path, or host the large file on the server.');
        return;
      }
      const catalogEntry = {
        id: `catalog-${Date.now()}`,
        title,
        file: hasPdf ? catalogPdf : '',
        pdfLink: hasUrl ? catalogUrl.trim() : '',
        fileSize: approxBytes,
        createdAt: new Date().toISOString()
      };

      // Store locally (array → multiple catalogs).
      const updated = saveStoredCatalog(catalogEntry);
      setSavedCatalogs(updated);

      // Mirror the newest catalog into the legacy single-slot keys for
      // backward compatibility with older cached pages.
      if (hasPdf) {
        localStorage.setItem('kresko_catalog_title', title);
        localStorage.setItem('kresko_catalog_pdf', catalogPdf);
        localStorage.setItem('kresko_catalog_url', '');
      } else {
        localStorage.setItem('kresko_catalog_title', title);
        localStorage.setItem('kresko_catalog_url', catalogUrl.trim());
        localStorage.setItem('kresko_catalog_pdf', '');
      }

      // 2) Sync to backend (best-effort). The local config still works even
      //    if this call fails (e.g. server cold start / route missing).
      let backendOk = false;
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', 'Product catalog');
        formData.append('documentType', 'Catalogue');

        if (hasPdf) {
          const pdfFile = dataUrlToFile(catalogPdf, 'catalog.pdf');
          if (pdfFile) formData.append('pdf', pdfFile);
        } else {
          formData.append('pdfLink', catalogUrl.trim());
        }

        await catalogApi.create(formData);
        backendOk = true;
      } catch (err) {
        console.warn('Backend catalog sync failed (local config still saved):', err.message || err);
      }

      // Reset the form so a second catalog can be added cleanly.
      setCatalogTitle('');
      setCatalogPdf('');
      setCatalogUrl('');

      setCatalogSuccess(
        backendOk
          ? `Catalog "${title}" added! ${updated.length} catalog(s) saved. It is now live on the Resources page.`
          : `Catalog "${title}" added locally (backend sync failed). It will still show on the Resources page.`
      );
      setTimeout(() => setCatalogSuccess(''), 5000);
    } catch (err) {
      console.error('Catalog save error:', err);
      setCatalogSuccess('Error saving catalog. Please try again.');
    }
  };

  const handleClearCatalog = async () => {
    if (window.confirm('Are you sure you want to clear/delete the uploaded catalog PDF and URL?')) {
      setCatalogTitle('');
      setCatalogPdf('');
      setCatalogUrl('');
      // Remove the locally-saved single-slot config too.
      localStorage.removeItem('kresko_catalog_title');
      localStorage.removeItem('kresko_catalog_pdf');
      localStorage.removeItem('kresko_catalog_url');
      alert('Current form cleared. Any catalogs in the saved list below are unchanged.');
    }
  };

  const handleDeleteCatalog = (id) => {
    if (window.confirm('Are you sure you want to delete this catalog from the Resources page?')) {
      const updated = removeStoredCatalog(id);
      setSavedCatalogs(updated);
      setCatalogSuccess('Catalog removed from the Resources page.');
      setTimeout(() => setCatalogSuccess(''), 4000);
    }
  };

  // ── Homepage Hero editor handlers ──────────────────────────
  const handleHeroFieldChange = (idx, field, value) => {
    setHeroSlides(prev => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const handleHeroImageSelect = (idx, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG/JPG/JPEG/WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image too large (max 2 MB). Please use a smaller image or host it and use a URL.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setHeroSlides(prev => prev.map((s, i) => (i === idx ? { ...s, image: reader.result } : s)));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveHero = (e) => {
    e.preventDefault();
    const clean = heroSlides.map(s => ({
      image: s.image || '',
      overlay: s.overlay !== false,
      tag: (s.tag || '').trim(),
      title: (s.title || '').trim(),
      desc: (s.desc || '').trim()
    }));
    saveHeroSlides(clean);

    // Sync inline EditableText values so admin + inline edits stay in sync.
    const savedTexts = JSON.parse(localStorage.getItem('kresko_editable_texts') || '{}');
    clean.forEach((s, idx) => {
      savedTexts[`home_slide_tag_${idx}`] = s.tag;
      savedTexts[`home_slide_title_${idx}`] = s.title;
      savedTexts[`home_slide_desc_${idx}`] = s.desc;
    });
    localStorage.setItem('kresko_editable_texts', JSON.stringify(savedTexts));

    setHeroSuccess('Homepage hero saved successfully! It will show on the homepage immediately.');
    setTimeout(() => setHeroSuccess(''), 3500);
  };

  const handleResetHero = () => {
    if (window.confirm('Reset all homepage hero slides back to their original defaults?')) {
      resetHeroSlides();
      // Clear every inline hero text edit (any index), not just the first 3.
      const savedTexts = JSON.parse(localStorage.getItem('kresko_editable_texts') || '{}');
      Object.keys(savedTexts).forEach(k => {
        if (k.startsWith('home_slide_')) delete savedTexts[k];
      });
      localStorage.setItem('kresko_editable_texts', JSON.stringify(savedTexts));
      setHeroSlides(getHeroSlides());
      setHeroSuccess('Hero content reset to defaults.');
      setTimeout(() => setHeroSuccess(''), 3500);
    }
  };

  const handleAddHeroSlide = () => {
    setHeroSlides(prev => [
      ...prev,
      {
        image: '/images/photo-1528218609959-006f98e6b79e.jpeg',
        tag: 'New Slide',
        title: 'New Slide Title',
        desc: 'Write a description for this slide...',
        overlay: true
      }
    ]);
  };

  const handleRemoveHeroSlide = (idx) => {
    setHeroSlides(prev => {
      if (prev.length <= 1) {
        alert('At least one hero slide is required.');
        return prev;
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatKey.trim() || !newCatName.trim()) {
      alert('Please enter Category Key and Name');
      return;
    }
    const key = newCatKey.toLowerCase().trim().replace(/\s+/g, '-');
    if (categories[key]) {
      alert('Category with this key already exists!');
      return;
    }
    const updated = {
      ...categories,
      [key]: {
        name: newCatName.trim(),
        icon: newCatIcon.trim() || 'fa-sparkles',
        subcategories: {}
      }
    };
    saveProductCategories(updated);
    setCategories(updated);
    setNewCatKey('');
    setNewCatName('');
    setNewCatIcon('/images/product_placeholder.jpg');

    try {
      await categoriesApi.add({
        categoryName: updated[key].name,
        uniqueKey: key,
        categoryImage: updated[key].icon || 'https://res.cloudinary.com/tjjlj71t/image/upload/f_auto,q_auto/samples/ecommerce/leather-bag-gray.jpg'
      });
      alert('Category added and synchronized with backend successfully!');
    } catch (err) {
      console.error('Error syncing category with backend:', err);
      alert(`Category saved locally, but backend sync failed: ${err.message || 'Network error'}`);
    }
  };

  const handleDeleteCategory = async (key) => {
    if (window.confirm(`Are you sure you want to delete the category "${categories[key]?.name}"? This will delete all its subcategories too!`)) {
      const updated = { ...categories };
      delete updated[key];
      saveProductCategories(updated);
      setCategories(updated);
      if (selectedCatKey === key) {
        setSelectedCatKey('');
        setSelectedSubKey('');
      }

      // Backend expects MongoDB _id, not the uniqueKey
      const catId = categories[key]?._id;
      if (catId) {
        try {
          await categoriesApi.delete(catId);
          alert('Category deleted and synchronized with backend successfully!');
        } catch (err) {
          console.error('Error syncing category deletion with backend:', err);
          alert(`Category deleted locally, but backend sync failed: ${err.message || 'Network error'}`);
        }
      } else {
        alert('Category deleted locally (no backend ID found for sync).');
      }
    }
  };

  const handleEditCategory = async (key) => {
    const currentName = categories[key]?.name;
    const newName = window.prompt(`Enter new name for category "${currentName}":`, currentName);
    if (!newName || !newName.trim() || newName.trim() === currentName) {
      return;
    }
    
    const updated = {
      ...categories,
      [key]: {
        ...categories[key],
        name: newName.trim()
      }
    };
    saveProductCategories(updated);
    setCategories(updated);

    // Backend expects MongoDB _id, not the uniqueKey
    const catId = categories[key]?._id;
    if (catId) {
      try {
        await categoriesApi.update(catId, {
          categoryName: newName.trim(),
          uniqueKey: key,
          categoryImage: categories[key].icon || 'fa-sparkles'
        });
        alert('Category renamed and synchronized with backend successfully!');
      } catch (err) {
        console.error('Error syncing category update with backend:', err);
        alert(`Category renamed locally, but backend sync failed: ${err.message || 'Network error'}`);
      }
    } else {
      alert('Category renamed locally (no backend ID found for sync).');
    }
  };

  const handleAddSubcategory = (e) => {
    e.preventDefault();
    if (!selectedCatKey) {
      alert('Please select a Category first!');
      return;
    }
    if (!newSubKey.trim() || !newSubName.trim()) {
      alert('Please enter Subcategory Key and Name');
      return;
    }
    const subKey = newSubKey.toLowerCase().trim().replace(/\s+/g, '-');
    const cat = categories[selectedCatKey];
    if (cat.subcategories && cat.subcategories[subKey]) {
      alert('Subcategory with this key already exists!');
      return;
    }
    const updated = {
      ...categories,
      [selectedCatKey]: {
        ...cat,
        subcategories: {
          ...(cat.subcategories || {}),
          [subKey]: newSubName.trim()
        }
      }
    };
    saveProductCategories(updated);
    setCategories(updated);
    setNewSubKey('');
    setNewSubName('');
    alert('Subcategory added successfully!');
  };

  const handleDeleteSubcategory = (catKey, subKey) => {
    if (window.confirm(`Are you sure you want to delete the subcategory "${categories[catKey]?.subcategories[subKey]}"?`)) {
      const cat = categories[catKey];
      const newSubs = { ...cat.subcategories };
      delete newSubs[subKey];
      const updated = {
        ...categories,
        [catKey]: {
          ...cat,
          subcategories: newSubs
        }
      };
      saveProductCategories(updated);
      setCategories(updated);
      if (selectedSubKey === subKey) {
        setSelectedSubKey('');
      }
      alert('Subcategory deleted!');
    }
  };

  const handleManageProductSubmit = (e) => {
    e.preventDefault();
    if (!manageProdTitle.trim() || !manageProdPrice.trim() || !manageProdDesc.trim()) {
      alert('Please fill out all product details');
      return;
    }
    
    const productData = {
      id: manageProdId || `custom-${Date.now()}`,
      category: selectedCatKey,
      subcategory: selectedSubKey,
      title: manageProdTitle.trim(),
      price: manageProdPrice.trim(),
      tag: manageProdTag.trim(),
      dilution: manageProdDilution.trim(),
      minPack: manageProdMinPack.trim(),
      rateAfter: manageProdRateAfter.trim(),
      desc: manageProdDesc.trim(),
      images: manageProdImages.filter(img => img && img.trim() !== '').length > 0 ? manageProdImages.filter(img => img && img.trim() !== '') : ['/images/product_placeholder.jpg'],
      image: manageProdImages.filter(img => img && img.trim() !== '')[0] || '/images/product_placeholder.jpg'
    };

    saveProduct(productData);
    setProducts(getProducts()); // Reload products list
    alert(manageProdId ? 'Product updated successfully!' : 'Product added successfully!');
    
    // Reset form
    setManageProdId('');
    setManageProdTitle('');
    setManageProdPrice('Rs. 180 / Kg');
    setManageProdTag('');
    setManageProdDilution('1 + 5');
    setManageProdMinPack('30 Kg');
    setManageProdRateAfter('Rs. 30.00 / Litre');
    setManageProdDesc('');
    setManageProdImages([]);
  };

  // Filter inquiries list
  const filteredEnquiries = enquiries.filter(enq => {
    const searchString = (enquirySearch || '').toLowerCase();
    return (
      (enq.name || '').toLowerCase().includes(searchString) ||
      (enq.company || '').toLowerCase().includes(searchString) ||
      (enq.machineType || '').toLowerCase().includes(searchString) ||
      (enq.email || '').toLowerCase().includes(searchString)
    );
  });

  // ==========================================================================
  // UNLOCKED DASHBOARD VIEW
  // ==========================================================================
  const renderDashboard = () => {
    return (
      <div className="container admin-grid">
        {/* Sidebar Nav */}
        <aside className="admin-sidebar">
          <h3 style={{ color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <i className="fa-solid fa-shield-halved" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> Portal Panel
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              className={`btn btn-secondary ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
              style={{ width: '100%', textAlign: 'left', padding: '0.8rem 1rem', fontSize: '0.8rem' }}
            >
              <i className="fa-solid fa-chart-line" style={{ marginRight: '0.5rem' }}></i> Overview
            </button>
            <button 
              className={`btn btn-secondary ${activeTab === 'enquiries' ? 'active' : ''}`}
              onClick={() => setActiveTab('enquiries')}
              style={{ width: '100%', textAlign: 'left', padding: '0.8rem 1rem', fontSize: '0.8rem' }}
            >
              <i className="fa-solid fa-envelope-open-text" style={{ marginRight: '0.5rem' }}></i> Enquiries ({enquiries.length})
            </button>
            <button 
              className={`btn btn-secondary ${activeTab === 'manage-content' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage-content')}
              style={{ width: '100%', textAlign: 'left', padding: '0.8rem 1rem', fontSize: '0.8rem' }}
            >
              <i className="fa-solid fa-list-check" style={{ marginRight: '0.5rem' }}></i> Manage Content
            </button>
            <button 
              className={`btn btn-secondary ${activeTab === 'manage-hero' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage-hero')}
              style={{ width: '100%', textAlign: 'left', padding: '0.8rem 1rem', fontSize: '0.8rem' }}
            >
              <i className="fa-solid fa-image" style={{ marginRight: '0.5rem' }}></i> Home Content
            </button>
            <button 
              className={`btn btn-secondary ${activeTab === 'manage-categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage-categories')}
              style={{ width: '100%', textAlign: 'left', padding: '0.8rem 1rem', fontSize: '0.8rem' }}
            >
              <i className="fa-solid fa-folder-tree" style={{ marginRight: '0.5rem' }}></i> Product Manager
            </button>
            <button 
              className={`btn btn-secondary ${activeTab === 'manage-reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage-reviews')}
              style={{ width: '100%', textAlign: 'left', padding: '0.8rem 1rem', fontSize: '0.8rem' }}
            >
              <i className="fa-solid fa-star" style={{ marginRight: '0.5rem' }}></i> Manage Reviews ({reviews.length})
            </button>
            <button 
              className={`btn btn-secondary ${activeTab === 'add-blog' ? 'active' : ''}`}
              onClick={() => setActiveTab('add-blog')}
              style={{ width: '100%', textAlign: 'left', padding: '0.8rem 1rem', fontSize: '0.8rem' }}
            >
              <i className="fa-solid fa-file-arrow-up" style={{ marginRight: '0.5rem' }}></i> Add Blog Post
            </button>
            <button 
              className={`btn btn-secondary ${activeTab === 'catalog' ? 'active' : ''}`}
              onClick={() => setActiveTab('catalog')}
              style={{ width: '100%', textAlign: 'left', padding: '0.8rem 1rem', fontSize: '0.8rem' }}
            >
              <i className="fa-solid fa-file-pdf" style={{ marginRight: '0.5rem' }}></i> Manage Catalog
            </button>
            <button 
              className={`btn btn-secondary ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
              style={{ width: '100%', textAlign: 'left', padding: '0.8rem 1rem', fontSize: '0.8rem' }}
            >
              <i className="fa-solid fa-lock" style={{ marginRight: '0.5rem' }}></i> Security Settings
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => { 
                setIsLocked(true); 
                setFailedAttempts(0); 
                sessionStorage.removeItem('isAdminLoggedIn'); 
                window.dispatchEvent(new Event('adminLoginStatusChange'));
              }}
              style={{ width: '100%', textAlign: 'left', padding: '0.8rem 1rem', fontSize: '0.8rem', marginTop: '2rem', borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
            >
              <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '0.5rem' }}></i> Log Out
            </button>
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <main>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '2rem' }}>Dashboard Overview</h2>
              
              {/* Counters Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3.5rem' }} className="overview-stats-grid">
                <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', backgroundColor: 'var(--color-bg-white)' }}>
                  <i className="fa-solid fa-industry" style={{ fontSize: '2rem', color: 'var(--color-accent)', marginBottom: '0.5rem' }}></i>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Total Products</h4>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>{products.length}</div>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', backgroundColor: 'var(--color-bg-white)' }}>
                  <i className="fa-solid fa-newspaper" style={{ fontSize: '2rem', color: 'var(--color-accent)', marginBottom: '0.5rem' }}></i>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Blog Articles</h4>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>{blogs.length}</div>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', backgroundColor: 'var(--color-bg-white)' }}>
                  <i className="fa-solid fa-comment-dots" style={{ fontSize: '2rem', color: 'var(--color-accent)', marginBottom: '0.5rem' }}></i>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Quote Enquiries</h4>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>{enquiries.length}</div>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', backgroundColor: 'var(--color-bg-white)' }}>
                  <i className="fa-solid fa-star" style={{ fontSize: '2rem', color: 'var(--color-accent)', marginBottom: '0.5rem' }}></i>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Client Reviews</h4>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>{reviews.length}</div>
                </div>
              </div>

              {/* Quick Guide */}
              <div style={{ padding: '2rem', backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>Access & Operations Guide</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>Use the left sidebar menu to upload products, write blog articles, and delete unwanted contents. In case of lost credentials, use the security password recovery tools available at the login page screen.</p>
              </div>
            </div>
          )}

          {/* ENQUIRIES TAB */}
          {activeTab === 'enquiries' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.75rem' }}>Quote Requests Logs</h2>
                <input 
                  type="text" 
                  placeholder="Filter name, email, company..." 
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  style={{ maxWidth: '300px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  className="form-control"
                />
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-bg-light)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-primary)', fontWeight: 700 }}>
                      <th style={{ padding: '1rem' }}>Date</th>
                      <th style={{ padding: '1rem' }}>Name</th>
                      <th style={{ padding: '1rem' }}>Company</th>
                      <th style={{ padding: '1rem' }}>Requested Product</th>
                      <th style={{ padding: '1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnquiries.map(enq => (
                      <tr key={enq.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{enq.date}</td>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{enq.name}</td>
                        <td style={{ padding: '1rem' }}>{enq.company || '-'}</td>
                        <td style={{ padding: '1rem', color: 'var(--color-accent)', fontWeight: 600 }}>{enq.machineType}</td>
                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                            onClick={() => setSelectedEnquiry(enq)}
                          >
                            View Specs
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', color: '#dc2626', borderColor: '#fca5a5' }}
                            onClick={() => handleDeleteEnquiry(enq.id || enq._id, enq.name)}
                          >
                            <i className="fa-solid fa-trash-can"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredEnquiries.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                          No enquiries found matching search keyword.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MANAG HERO TAB (Edit homepage hero/banner text & images) */}
          {activeTab === 'manage-hero' && (
            <div>
              <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '1rem' }}>Homepage Hero / Banner</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                Edit the text and background image of each hero slide shown on the homepage. Use <strong>Add Slide</strong> to create more banners and the <strong>Remove</strong> button on each slide to delete one. Changes save to this browser and appear on the homepage immediately.
              </p>

              <form onSubmit={handleSaveHero} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {heroSlides.map((slide, idx) => (
                  <div key={idx} style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'var(--color-bg-white)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--color-accent)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                      <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1rem', fontWeight: 700 }}>
                        <i className="fa-solid fa-sliders" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> Slide {idx + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveHeroSlide(idx)}
                        disabled={heroSlides.length <= 1}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem', color: '#dc2626', borderColor: heroSlides.length <= 1 ? 'var(--color-border)' : '#fca5a5', cursor: heroSlides.length <= 1 ? 'not-allowed' : 'pointer' }}
                      >
                        <i className="fa-solid fa-trash-can" style={{ marginRight: '0.3rem' }}></i> Remove
                      </button>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Slide Tag / Badge</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. B2B Chemical Concentrates"
                        value={slide.tag || ''}
                        onChange={(e) => handleHeroFieldChange(idx, 'tag', e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Slide Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. High-Performance Cleaning Concentrates"
                        value={slide.title || ''}
                        onChange={(e) => handleHeroFieldChange(idx, 'title', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Slide Description</label>
                      <textarea
                        className="form-control"
                        placeholder="Short description shown on the hero slide..."
                        value={slide.desc || ''}
                        onChange={(e) => handleHeroFieldChange(idx, 'desc', e.target.value)}
                        style={{ minHeight: '90px' }}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Background Image</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        <input
                          type="file"
                          accept="image/*"
                          id={`hero-image-upload-${idx}`}
                          style={{ display: 'none' }}
                          onChange={(e) => handleHeroImageSelect(idx, e.target.files[0])}
                        />
                        <label
                          htmlFor={`hero-image-upload-${idx}`}
                          className="btn btn-secondary"
                          style={{ margin: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none', fontSize: '0.8rem' }}
                        >
                          <i className="fa-solid fa-image"></i> Upload Image
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Or paste an image URL/path..."
                          value={slide.image || ''}
                          onChange={(e) => handleHeroFieldChange(idx, 'image', e.target.value)}
                          style={{ maxWidth: '320px' }}
                        />
                        {slide.image && (
                          <img
                            src={slide.image}
                            alt={`Slide ${idx + 1} preview`}
                            style={{ width: '130px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-secondary" onClick={handleAddHeroSlide} style={{ fontWeight: 700 }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '0.4rem' }}></i> Add Slide
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                    <i className="fa-solid fa-floppy-disk" style={{ marginRight: '0.4rem' }}></i> Save Hero Content
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleResetHero} style={{ color: '#dc2626', borderColor: '#fca5a5', fontWeight: 700 }}>
                    <i className="fa-solid fa-rotate-left" style={{ marginRight: '0.4rem' }}></i> Reset to Defaults
                  </button>
                </div>

                {heroSuccess && (
                  <div className="form-message success" style={{ display: 'block', marginTop: '1rem' }}>
                    {heroSuccess}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* MANAGE CONTENT TAB (Delete listings / blogs) */}
          {activeTab === 'manage-content' && (
            <div>
              <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '2rem' }}>Manage Portal Content</h2>

              {/* Product Items Table */}
              <div style={{ marginBottom: '4rem' }}>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Active Chemical Concentrates ({products.length})</h4>

                {editValues && (
                  <div style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '2px solid var(--color-accent)', borderRadius: '6px', backgroundColor: 'var(--color-bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-primary)' }}>
                      Editing: {editValues.title}
                    </h5>
                    <form onSubmit={handleEditProductSave}>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Product Name *</label>
                          <input type="text" className="form-control" value={editValues.title || ''} onChange={(e) => setEditValues({ ...editValues, title: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Price / Pack Cost *</label>
                          <input type="text" className="form-control" placeholder="e.g. Rs. 180 / Kg" value={editValues.price || ''} onChange={(e) => setEditValues({ ...editValues, price: e.target.value })} required />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Category</label>
                          <input type="text" className="form-control" value={editValues.category || ''} readOnly style={{ backgroundColor: '#f1f5f9', cursor: 'default' }} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Subcategory</label>
                          <input type="text" className="form-control" placeholder="e.g. fabric-wash-6x" value={editValues.subcategory || ''} onChange={(e) => setEditValues({ ...editValues, subcategory: e.target.value })} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Card Badge / Tag</label>
                          <input type="text" className="form-control" placeholder="e.g. Popular, Eco Friendly" value={editValues.tag || ''} onChange={(e) => setEditValues({ ...editValues, tag: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Recommended Dilution *</label>
                          <input type="text" className="form-control" placeholder="e.g. 1 + 5" value={editValues.dilution || ''} onChange={(e) => setEditValues({ ...editValues, dilution: e.target.value })} required />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Minimum Pack Size *</label>
                          <input type="text" className="form-control" placeholder="e.g. 30 Kg" value={editValues.minPack || ''} onChange={(e) => setEditValues({ ...editValues, minPack: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Rate After *</label>
                          <input type="text" className="form-control" placeholder="e.g. Rs. 30.00 / Litre" value={editValues.rateAfter || ''} onChange={(e) => setEditValues({ ...editValues, rateAfter: e.target.value })} required />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Detailed Description *</label>
                        <textarea rows="4" className="form-control" placeholder="Describe the application protocols, surfactant percentage, raw materials compatibility..." value={editValues.desc || ''} onChange={(e) => setEditValues({ ...editValues, desc: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Product Image URLs (one per line)</label>
                        <textarea rows="3" className="form-control" placeholder="e.g. /images/products/floor_cleaner_purple.png" value={(editValues.images || []).join('\n')} onChange={(e) => setEditValues({ ...editValues, images: e.target.value.split('\n') })} />
                        <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '0.4rem' }}>The first URL is used as the product thumbnail. Leave blank to keep the placeholder.</small>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>Save Product</button>
                        <button type="button" className="btn btn-secondary" onClick={handleEditProductCancel}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-bg-light)', borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '0.85rem' }}>Thumbnail</th>
                        <th style={{ padding: '0.85rem' }}>Product Title</th>
                        <th style={{ padding: '0.85rem' }}>Category</th>
                        <th style={{ padding: '0.85rem' }}>Price</th>
                        <th style={{ padding: '0.85rem', width: '180px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '0.5rem' }}>
                            <div style={{ width: '40px', height: '40px' }}>
                              <ProductImage category={p.category} title={p.title} image={p.image} />
                            </div>
                          </td>
                          <td style={{ padding: '0.85rem', fontWeight: 600 }}>{p.title}</td>
                          <td style={{ padding: '0.85rem', textTransform: 'capitalize' }}>{p.category}</td>
                          <td style={{ padding: '0.85rem', color: 'var(--color-accent)', fontWeight: 600 }}>{p.price}</td>
                          <td style={{ padding: '0.85rem' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                              <button
                                className="btn btn-primary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                                onClick={() => handleEditProduct(p)}
                              >
                                <i className="fa-solid fa-pen" style={{ marginRight: '0.3rem' }}></i> Edit
                              </button>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', color: '#dc2626', borderColor: '#fca5a5' }}
                                onClick={() => handleDeleteProduct(p.id, p.title)}
                              >
                                <i className="fa-solid fa-trash-can"></i> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Blog Posts Table */}
              <div>
                <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Active Blog Articles ({blogs.length})</h4>
                <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-bg-light)', borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '0.85rem' }}>Publish Date</th>
                        <th style={{ padding: '0.85rem' }}>Article Title</th>
                        <th style={{ padding: '0.85rem' }}>Category</th>
                        <th style={{ padding: '0.85rem', width: '100px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map(b => (
                        <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '0.85rem' }}>{b.date}</td>
                          <td style={{ padding: '0.85rem', fontWeight: 600 }}>{b.title}</td>
                          <td style={{ padding: '0.85rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>{b.category}</td>
                          <td style={{ padding: '0.85rem' }}>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', color: '#dc2626', borderColor: '#fca5a5' }}
                              onClick={() => handleDeleteBlog(b.id, b.title)}
                            >
                              <i className="fa-solid fa-trash-can"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MANAGE CATEGORY TAB */}
          {activeTab === 'manage-categories' && (
            <div>
              <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '2rem' }}>Product Manager & Category Hierarchy</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }} className="manage-cats-grid">
                
                {/* 1. Category Section */}
                <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'var(--color-bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                  <h4 style={{ color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '2px solid var(--color-accent)', paddingBottom: '0.5rem' }}>
                    <i className="fa-solid fa-folder" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> Categories
                  </h4>
                  
                  {/* Category select / delete list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '250px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
                    {Object.entries(categories).map(([key, cat]) => (
                      <div 
                        key={key} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          padding: '0.75rem 1rem', 
                          border: `1px solid ${selectedCatKey === key ? 'var(--color-accent)' : 'var(--color-border)'}`, 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          backgroundColor: selectedCatKey === key ? 'var(--color-bg-light)' : 'transparent'
                        }}
                        onClick={() => {
                          setSelectedCatKey(key);
                          setSelectedSubKey('');
                          setManageProdId('');
                        }}
                      >
                        <span style={{ fontWeight: selectedCatKey === key ? 700 : 500, color: 'var(--color-primary)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {cat.icon && cat.icon.startsWith('fa-') ? (
                            <i className={`fa-solid ${cat.icon}`} style={{ color: selectedCatKey === key ? 'var(--color-accent)' : 'var(--color-text-muted)', width: '20px' }}></i>
                          ) : (
                            <img src={cat.icon || '/images/product_placeholder.jpg'} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />
                          )}
                          {cat.name} <code style={{ fontSize: '0.75rem', opacity: 0.6 }}>({key})</code>
                        </span>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', color: 'var(--color-primary)', borderColor: 'var(--color-border)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCategory(key);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', color: '#dc2626', borderColor: '#fca5a5' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(key);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Category Form */}
                  <form onSubmit={handleAddCategory} style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '1.5rem' }}>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-primary)' }}>Create New Category</h5>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">Category Name *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Laundry Care" 
                        value={newCatName} 
                        onChange={(e) => setNewCatName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Unique Key *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. laundry-care" 
                          value={newCatKey} 
                          onChange={(e) => setNewCatKey(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Category Image *</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <input
                            type="file"
                            accept="image/*"
                            id="category-image-upload"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              if (!file.type.startsWith('image/')) {
                                alert('Please select an image file (PNG/JPG/JPEG/WebP).');
                                return;
                              }
                              if (file.size > 1024 * 1024) {
                                alert('Image too large. Please use an image under 1 MB, or host it and use a URL instead.');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => setNewCatIcon(reader.result);
                              reader.readAsDataURL(file);
                            }}
                          />
                          <label
                            htmlFor="category-image-upload"
                            className="btn btn-secondary"
                            style={{ margin: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none', fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                          >
                            <i className="fa-solid fa-image"></i> Upload Image
                          </label>
                          {newCatIcon ? (
                            <img
                              src={newCatIcon}
                              alt="Category preview"
                              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)', background: '#fff' }}
                            />
                          ) : null}
                        </div>
                        <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                          This image is shown on the product page next to the category. Upload a file (max 1 MB), and it replaces the URL field.
                        </small>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem 0' }}>Add Category</button>
                  </form>
                </div>

                {/* 2. Subcategory Section */}
                <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'var(--color-bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                  <h4 style={{ color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '2px solid var(--color-accent)', paddingBottom: '0.5rem' }}>
                    <i className="fa-solid fa-folder-open" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> Subcategories
                  </h4>

                  {!selectedCatKey ? (
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: '4px' }}>
                      Select a category on the left to manage subcategories.
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: '1rem', fontSize: '0.88rem' }}>
                        Active Category: <strong style={{ color: 'var(--color-primary)' }}>{categories[selectedCatKey]?.name}</strong>
                      </div>
                      
                      {/* Subcategories list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '200px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
                        {Object.entries(categories[selectedCatKey]?.subcategories || {}).map(([subKey, subName]) => (
                          <div 
                            key={subKey} 
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              padding: '0.6rem 0.8rem', 
                              border: `1px solid ${selectedSubKey === subKey ? 'var(--color-accent)' : 'var(--color-border)'}`, 
                              borderRadius: '4px',
                              cursor: 'pointer',
                              backgroundColor: selectedSubKey === subKey ? 'var(--color-bg-light)' : 'transparent'
                            }}
                            onClick={() => {
                              setSelectedSubKey(subKey);
                              setManageProdId('');
                            }}
                          >
                            <span style={{ fontWeight: selectedSubKey === subKey ? 700 : 500, color: 'var(--color-primary)', fontSize: '0.82rem' }}>
                              {subName} <code style={{ fontSize: '0.75rem', opacity: 0.6 }}>({subKey})</code>
                            </span>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', color: '#dc2626', borderColor: '#fca5a5' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubcategory(selectedCatKey, subKey);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                        {Object.keys(categories[selectedCatKey]?.subcategories || {}).length === 0 && (
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>No subcategories found. Add one below!</p>
                        )}
                      </div>

                      {/* Add Subcategory Form */}
                      <form onSubmit={handleAddSubcategory} style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '1.5rem' }}>
                        <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-primary)' }}>Add Subcategory to {categories[selectedCatKey]?.name}</h5>
                        <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                          <label className="form-label">Subcategory Name *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. Fabric Wash 6x" 
                            value={newSubName} 
                            onChange={(e) => setNewSubName(e.target.value)} 
                            required 
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                          <label className="form-label">Unique Key *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. fabric-wash-6x" 
                            value={newSubKey} 
                            onChange={(e) => setNewSubKey(e.target.value)} 
                            required 
                          />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem 0' }}>Add Subcategory</button>
                      </form>
                    </div>
                  )}
                </div>

              </div>

              {/* 3. Products Section under both */}
              {selectedCatKey && selectedSubKey && (
                <div style={{ padding: '2.5rem', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'var(--color-bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                  <h4 style={{ color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '2px solid var(--color-accent)', paddingBottom: '0.5rem' }}>
                    <i className="fa-solid fa-flask" style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}></i> 
                    Manage Products under "{categories[selectedCatKey]?.subcategories[selectedSubKey]}"
                  </h4>

                  {/* List of Products in this Subcategory */}
                  <div style={{ marginBottom: '3rem' }}>
                    <h5 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-primary)' }}>Current Products</h5>
                    <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--color-bg-light)', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '0.85rem' }}>Thumbnail</th>
                            <th style={{ padding: '0.85rem' }}>Title</th>
                            <th style={{ padding: '0.85rem' }}>Price</th>
                            <th style={{ padding: '0.85rem' }}>Dilution</th>
                            <th style={{ padding: '0.85rem', width: '180px' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products
                            .filter(p => p.category === selectedCatKey && p.subcategory === selectedSubKey)
                            .map(p => (
                              <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.5rem' }}>
                                  <div style={{ width: '40px', height: '40px' }}>
                                    <ProductImage category={p.category} title={p.title} image={p.image} />
                                  </div>
                                </td>
                                <td style={{ padding: '0.85rem', fontWeight: 600 }}>{p.title}</td>
                                <td style={{ padding: '0.85rem', color: 'var(--color-accent)', fontWeight: 600 }}>{p.price}</td>
                                <td style={{ padding: '0.85rem' }}>{p.dilution}</td>
                                <td style={{ padding: '0.85rem', display: 'flex', gap: '0.5rem' }}>
                                  <button 
                                    className="btn btn-secondary" 
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                                    onClick={() => {
                                      setManageProdId(p.id);
                                      setManageProdTitle(p.title);
                                      setManageProdPrice(p.price);
                                      setManageProdTag(p.tag || '');
                                      setManageProdDilution(p.dilution);
                                      setManageProdMinPack(p.minPack || '');
                                      setManageProdRateAfter(p.rateAfter || '');
                                      setManageProdDesc(p.desc || '');
                                      setManageProdImages(p.images || (p.image ? [p.image] : []));
                                    }}
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i> Edit
                                  </button>
                                  <button 
                                    className="btn btn-secondary" 
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', color: '#dc2626', borderColor: '#fca5a5' }}
                                    onClick={() => {
                                      handleDeleteProduct(p.id, p.title);
                                      setProducts(getProducts()); // refresh
                                    }}
                                  >
                                    <i className="fa-solid fa-trash-can"></i> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          {products.filter(p => p.category === selectedCatKey && p.subcategory === selectedSubKey).length === 0 && (
                            <tr>
                              <td colSpan="5" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                No products found in this subcategory. Use the form below to create one!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add / Edit Product Form */}
                  <form onSubmit={handleManageProductSubmit} style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '2rem' }}>
                    <h5 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                      {manageProdId ? `Edit Product (ID: ${manageProdId})` : 'Add New Product in Subcategory'}
                    </h5>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Product Name *</label>
                        <input 
                          type="text" 
                          className="form-control"
                          placeholder="e.g. Toilet Cleaner Concentrate 6X (Blue)"
                          value={manageProdTitle}
                          onChange={(e) => setManageProdTitle(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Price / Pack Cost *</label>
                        <input 
                          type="text" 
                          className="form-control"
                          placeholder="e.g. Rs. 180 / Kg"
                          value={manageProdPrice}
                          onChange={(e) => setManageProdPrice(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Card Badge / Ribbon Tag</label>
                        <input 
                          type="text" 
                          className="form-control"
                          placeholder="e.g. Popular, Eco Friendly, New"
                          value={manageProdTag}
                          onChange={(e) => setManageProdTag(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Recommended Dilution *</label>
                        <input 
                          type="text" 
                          className="form-control"
                          placeholder="e.g. 1 + 5"
                          value={manageProdDilution}
                          onChange={(e) => setManageProdDilution(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Minimum Pack Size *</label>
                        <input 
                          type="text" 
                          className="form-control"
                          placeholder="e.g. 30 Kg"
                          value={manageProdMinPack}
                          onChange={(e) => setManageProdMinPack(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Diluted Rate After Dilution</label>
                        <input 
                          type="text" 
                          className="form-control"
                          placeholder="e.g. Rs. 30.00 / Litre"
                          value={manageProdRateAfter}
                          onChange={(e) => setManageProdRateAfter(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label className="form-label" style={{ fontWeight: 700 }}>Product Images (URLs - Max 4 Images)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '0.5rem' }} className="manage-images-grid">
                        <div>
                          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Image 1 (Primary)</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. /images/img1.jpg"
                            value={manageProdImages[0] || ''}
                            onChange={(e) => {
                              const copy = [...manageProdImages];
                              copy[0] = e.target.value;
                              setManageProdImages(copy);
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Image 2</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. /images/img2.jpg"
                            value={manageProdImages[1] || ''}
                            onChange={(e) => {
                              const copy = [...manageProdImages];
                              copy[1] = e.target.value;
                              setManageProdImages(copy);
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Image 3</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. /images/img3.jpg"
                            value={manageProdImages[2] || ''}
                            onChange={(e) => {
                              const copy = [...manageProdImages];
                              copy[2] = e.target.value;
                              setManageProdImages(copy);
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Image 4</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. /images/img4.jpg"
                            value={manageProdImages[3] || ''}
                            onChange={(e) => {
                              const copy = [...manageProdImages];
                              copy[3] = e.target.value;
                              setManageProdImages(copy);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Detailed Product Description *</label>
                      <textarea 
                        rows="4" 
                        className="form-control"
                        placeholder="Describe the application protocols, surfactant percentage, raw materials compatibility, etc."
                        value={manageProdDesc}
                        onChange={(e) => setManageProdDesc(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>
                        {manageProdId ? 'Save / Update Product' : 'Add Product to Catalog'}
                      </button>
                      {manageProdId && (
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => {
                            setManageProdId('');
                            setManageProdTitle('');
                            setManageProdPrice('Rs. 180 / Kg');
                            setManageProdTag('');
                            setManageProdDilution('1 + 5');
                            setManageProdMinPack('30 Kg');
                            setManageProdRateAfter('Rs. 30.00 / Litre');
                            setManageProdDesc('');
                            setManageProdImages([]);
                          }}
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ADD PRODUCT TAB */}
          {activeTab === 'add-product' && (
            <div className="quote-form-container" style={{ padding: '2.5rem', backgroundColor: 'var(--color-bg-light)' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Add New Product to Catalog</h3>
              
              <form onSubmit={handleProductSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. Hand Wash Concentrate 6X"
                      value={prodTitle}
                      onChange={(e) => setProdTitle(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select 
                      className="form-control"
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                    >
                      <option value="home-care">Home Care Concentrates</option>
                      <option value="laundry-care">Laundry Care Concentrates</option>
                      <option value="kitchen-care">Kitchen Care Concentrates</option>
                      <option value="floor-care">Floor Care Concentrates</option>
                      <option value="bathroom-care">Bathroom Care Concentrates</option>
                      <option value="glass-care">Glass Care Concentrates</option>
                      <option value="personal-care">Personal Care Concentrates</option>
                      <option value="air-care">Air Care Products</option>
                      <option value="car-care">Car Care Products</option>
                      <option value="metal-care">Metal Care Products</option>
                      <option value="pest-control">Pest Control Products</option>
                      <option value="specialty">Specialty Products</option>
                      <option value="powder-to-liquid">Powder to Liquid Products</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Base Concentrate Price *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. Rs. 170 / Kg"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Ribbon Tag</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. Liquid, Powder, Concentrated"
                      value={prodTag}
                      onChange={(e) => setProdTag(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Dilution Formula *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. 1 + 5 or RTU"
                      value={prodDilution}
                      onChange={(e) => setProdDilution(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Minimum Packing Order (MOQ) *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. 30 Kg, 100 Pcs"
                      value={prodMinPack}
                      onChange={(e) => setProdMinPack(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Diluted Cost Per Litre *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. Rs. 24.83 / Litre or RTU"
                      value={prodRateAfter}
                      onChange={(e) => setProdRateAfter(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                    <label className="form-label">Product Images (Upload Multiple / Add URLs)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. /images/my-product.jpg" 
                        value={manualImageUrl}
                        onChange={(e) => setManualImageUrl(e.target.value)}
                        style={{ flexGrow: 1 }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => {
                          if (manualImageUrl.trim() !== '') {
                            setProdImages(prev => [...prev, manualImageUrl.trim()]);
                            setManualImageUrl('');
                          }
                        }}
                        style={{ fontSize: '0.8rem', padding: '0.85rem 1.2rem', whiteSpace: 'nowrap' }}
                      >
                        Add URL
                      </button>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="product-image-upload" 
                        multiple 
                        style={{ display: 'none' }} 
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setProdImages(prev => [...prev, reader.result]);
                            };
                            reader.readAsDataURL(file);
                          });
                          e.target.value = ''; // Reset uploader input
                        }}
                      />
                      <label 
                        htmlFor="product-image-upload" 
                        className="btn btn-secondary" 
                        style={{ padding: '0.85rem 1rem', margin: 0, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}
                      >
                        <i className="fa-solid fa-images" style={{ marginRight: '0.35rem' }}></i> Upload Files
                      </label>
                    </div>

                    {/* Horizontal Thumbnails List of Uploaded Images */}
                    {prodImages.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--color-bg-white)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                        {prodImages.map((img, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              position: 'relative', 
                              border: '1px solid var(--color-border)', 
                              borderRadius: '4px', 
                              padding: '2px', 
                              backgroundColor: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <ProductImage category={prodCategory} title={prodTitle || 'Sample'} image={img} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            <button 
                              type="button" 
                              onClick={() => setProdImages(prev => prev.filter((_, i) => i !== idx))}
                              style={{ 
                                position: 'absolute', 
                                top: '-6px', 
                                right: '-6px', 
                                width: '16px', 
                                height: '16px', 
                                borderRadius: '50%', 
                                backgroundColor: 'var(--color-accent)', 
                                color: '#fff', 
                                border: 'none', 
                                fontSize: '8px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                cursor: 'pointer',
                                fontWeight: 'bold' 
                              }}
                              aria-label="Remove Image"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {prodImages.length === 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                          No custom images added. Previewing fallback Dynamic Vector SVG:
                        </span>
                        <div style={{ width: '50px', height: '50px', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '2px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ProductImage category={prodCategory} title={prodTitle || 'Sample Concentrate'} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description *</label>
                  <textarea 
                    className="form-control"
                    placeholder="Describe product formulation advantages, active ingredients, and washing usage..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary form-submit-btn">
                  Publish Product Listing
                </button>

                {prodSuccess && (
                  <div className="form-message success" style={{ display: 'block', marginTop: '1.5rem' }}>
                    {prodSuccess}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* ADD BLOG TAB */}
          {activeTab === 'add-blog' && (
            <div className="quote-form-container" style={{ padding: '2.5rem', backgroundColor: 'var(--color-bg-light)' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Upload New Blog Post</h3>

              <form onSubmit={handleBlogSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Article Title *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. Future of Automated Heat Sealing"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select 
                      className="form-control"
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                    >
                      <option value="tech">Technology</option>
                      <option value="ops">Operations</option>
                      <option value="green">Sustainability</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Brief Summary / Card description *</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Short 1-sentence teaser to display on index list..."
                    value={blogDesc}
                    onChange={(e) => setBlogDesc(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Blog Content Paragraphs (Press enter to separate paragraphs) *</label>
                  <textarea 
                    className="form-control"
                    placeholder="Write full article here. Use hit enter key to separate main paragraphs..."
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    style={{ height: '250px' }}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Blog/Article Cover Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <input
                      type="file"
                      accept="image/*"
                      id="blog-image-upload"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!file.type.startsWith('image/')) {
                          alert('Please select an image file (PNG/JPG/JPEG/WebP).');
                          return;
                        }
                        if (file.size > 2 * 1024 * 1024) {
                          alert('Image too large. Please use an image under 2 MB, or host it and use a URL instead.');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setBlogImagePreview(reader.result);
                          setBlogImage(file); // keep File for backend upload
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <label
                      htmlFor="blog-image-upload"
                      className="btn btn-secondary"
                      style={{ margin: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none' }}
                    >
                      <i className="fa-solid fa-image"></i> Upload Cover Image
                    </label>
                    {blogImagePreview ? (
                      <>
                        <img
                          src={blogImagePreview}
                          alt="Blog cover preview"
                          style={{ width: '120px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => { setBlogImagePreview(''); setBlogImage(null); }}
                          style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem', color: '#dc2626', borderColor: '#fca5a5' }}
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        No image selected — a default cover will be used.
                      </span>
                    )}
                  </div>
                  <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '0.5rem' }}>
                    This image is shown as the blog card cover and as the article banner background.
                  </small>
                </div>

                <button type="submit" className="btn btn-primary form-submit-btn">
                  Publish Blog Post
                </button>

                {blogSuccess && (
                  <div className="form-message success" style={{ display: 'block', marginTop: '1.5rem' }}>
                    {blogSuccess}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* MANAGE CATALOG TAB */}
          {activeTab === 'catalog' && (
            <div className="quote-form-container" style={{ padding: '2.5rem', backgroundColor: 'var(--color-bg-light)' }}>
              <h3 style={{ marginBottom: '1.5rem' }}><i className="fa-solid fa-file-pdf" style={{ marginRight: '0.5rem', color: 'var(--color-accent)' }}></i> Manage Corporate Catalog PDF</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                Upload a catalog PDF file directly or provide a custom web link/path. User-facing downloads on the Catalog and Resources pages will fetch this file instantly.
              </p>

              <form onSubmit={handleCatalogSubmit}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Catalog Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Kresko Chemicals Product Catalogue 2025"
                    value={catalogTitle}
                    onChange={(e) => setCatalogTitle(e.target.value)}
                    required
                  />
                  <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '0.5rem' }}>
                    This title will be displayed on the Resources page and catalog download buttons.
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">Catalog File (Upload PDF)</label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      id="catalog-pdf-upload" 
                      style={{ display: 'none' }} 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 8 * 1024 * 1024) {
                            alert('File size exceeds 8MB. For larger catalog files, please input a custom PDF path/link instead.');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCatalogPdf(reader.result);
                            alert(`Catalog PDF "${file.name}" loaded successfully. Click 'Save Catalog Config' to apply changes.`);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label 
                      htmlFor="catalog-pdf-upload" 
                      className="btn btn-secondary" 
                      style={{ margin: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none' }}
                    >
                      <i className="fa-solid fa-file-arrow-up"></i> Upload PDF Document
                    </label>
                    
                    {catalogPdf ? (
                      <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 'bold' }}>
                        <i className="fa-solid fa-circle-check"></i> PDF Loaded (Base64)
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        No PDF file uploaded yet.
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label">Or Custom PDF Link / Local Path</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="e.g. /kresko_catalog.pdf or https://example.com/catalog.pdf"
                    value={catalogUrl}
                    onChange={(e) => setCatalogUrl(e.target.value)}
                  />
                  <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '0.5rem' }}>
                    Use this field if you want to reference a file in your server or a external hosting URL.
                  </small>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ fontWeight: '700' }}>
                    Add Catalog to Resources
                  </button>
                  
                  {(catalogPdf || catalogUrl) && (
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={handleClearCatalog} 
                      style={{ color: '#dc2626', borderColor: '#fca5a5', fontWeight: '700' }}
                    >
                      Clear/Delete Catalog
                    </button>
                  )}
                </div>

                {catalogSuccess && (
                  <div className="form-message success" style={{ display: 'block', marginTop: '1.5rem' }}>
                    {catalogSuccess}
                  </div>
                )}
              </form>

              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '2rem 0' }} />
              <div>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  <i className="fa-solid fa-list" style={{ marginRight: '0.5rem', color: 'var(--color-accent)' }}></i>
                  Saved Catalogs ({savedCatalogs.length}) — shown on the Resources page
                </h4>
                {savedCatalogs.length === 0 ? (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0 }}>
                    No catalogs saved yet. Use the form above to add catalogs — each upload is <strong>added</strong>, never replaces the previous ones.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {savedCatalogs.map((cat, idx) => {
                      const size = cat.fileSize ? `${(cat.fileSize / (1024 * 1024)).toFixed(1)} MB` : 'Link';
                      return (
                        <div key={cat.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.75rem 1rem', backgroundColor: 'var(--color-bg-white)', border: '1px solid var(--color-border)', borderRadius: '8px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <i className="fa-solid fa-file-pdf" style={{ color: 'var(--color-accent)', fontSize: '1.25rem' }}></i>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{cat.title}</div>
                              <small style={{ color: 'var(--color-text-muted)' }}>PDF Document | {size}</small>
                            </div>
                          </div>
                          <button type="button" onClick={() => handleDeleteCatalog(cat.id)} className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem', textTransform: 'none', borderRadius: '4px', color: '#dc2626', borderColor: '#fca5a5' }}>
                            <i className="fa-solid fa-trash" style={{ marginRight: '0.3rem' }}></i> Delete
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECURITY & SETTINGS TAB */}
          {activeTab === 'security' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
              
              {/* Form 1: Change password */}
              <div className="quote-form-container" style={{ padding: '2.5rem', backgroundColor: 'var(--color-bg-light)' }}>
                <h3 style={{ marginBottom: '1.5rem' }}><i className="fa-solid fa-key" style={{ marginRight: '0.5rem', color: 'var(--color-accent)' }}></i> Change Credentials Password</h3>
                <form onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label className="form-label">Current Password *</label>
                    <input 
                      type="password" 
                      className="form-control"
                      placeholder="Enter current password..."
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">New Password *</label>
                      <input 
                        type="password" 
                        className="form-control"
                        placeholder="Min 6 characters..."
                        value={changePwdNew}
                        onChange={(e) => setChangePwdNew(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password *</label>
                      <input 
                        type="password" 
                        className="form-control"
                        placeholder="Re-type new password..."
                        value={changePwdConfirm}
                        onChange={(e) => setChangePwdConfirm(e.target.value)}
                        required 
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                    Update Password
                  </button>

                  {pwdChangeError && (
                    <div style={{ color: '#991b1b', fontSize: '0.85rem', marginTop: '1.25rem', fontWeight: 600 }}>
                      <i className="fa-solid fa-triangle-exclamation"></i> {pwdChangeError}
                    </div>
                  )}

                  {pwdChangeSuccess && (
                    <div className="form-message success" style={{ display: 'block', marginTop: '1.25rem' }}>
                      {pwdChangeSuccess}
                    </div>
                  )}
                </form>
              </div>

              {/* Form 2: Change Security Question */}
              <div className="quote-form-container" style={{ padding: '2.5rem', backgroundColor: 'var(--color-bg-light)' }}>
                <h3 style={{ marginBottom: '1.5rem' }}><i className="fa-solid fa-circle-question" style={{ marginRight: '0.5rem', color: 'var(--color-accent)' }}></i> Recovery Question Settings</h3>
                <form onSubmit={handleChangeSecurity}>
                  <div className="form-group">
                    <label className="form-label">Security Question *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. What is the name of our factory brand?"
                      value={changeQuestion}
                      onChange={(e) => setChangeQuestion(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Recovery Answer (Case-insensitive) *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. Kresko"
                      value={changeAnswer}
                      onChange={(e) => setChangeAnswer(e.target.value)}
                      required 
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                    Update Recovery Settings
                  </button>

                  {secChangeSuccess && (
                    <div className="form-message success" style={{ display: 'block', marginTop: '1.25rem' }}>
                      {secChangeSuccess}
                    </div>
                  )}
                </form>
              </div>

            </div>
          )}
          {/* MANAGE REVIEWS TAB */}
          {activeTab === 'manage-reviews' && (
            <div>
              <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '2rem' }}>Manage Client Reviews</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Below is a catalog of all client testimonials published on the portal website homepage and reviews pages.</p>

              <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-bg-light)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-primary)', fontWeight: 700 }}>
                      <th style={{ padding: '1rem' }}>Reviewer Name</th>
                      <th style={{ padding: '1rem' }}>Role & Plant</th>
                      <th style={{ padding: '1rem', width: '100px' }}>Rating</th>
                      <th style={{ padding: '1rem' }}>Quote Snippet</th>
                      <th style={{ padding: '1rem', width: '120px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(rev => (
                      <tr key={rev.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{rev.name}</td>
                        <td style={{ padding: '1rem' }}>{rev.role}</td>
                        <td style={{ padding: '1rem', color: 'var(--color-accent)', fontWeight: 700 }}>{rev.rating} ★</td>
                        <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>
                          <span style={{ display: 'inline-block', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            "{rev.quote}"
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', color: '#dc2626', borderColor: '#fca5a5' }}
                            onClick={() => handleDeleteReview(rev.id)}
                          >
                            <i className="fa-solid fa-trash-can"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                          No reviews found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>

        {/* Modal to display full Enquiry details */}
        {selectedEnquiry && (
          <div>
            <div className="modal-overlay active" onClick={() => setSelectedEnquiry(null)}></div>
            <div className="modal-content active">
              <span className="modal-close" onClick={() => setSelectedEnquiry(null)}>
                <i className="fa-solid fa-xmark"></i>
              </span>
              <div className="modal-body">
                <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 700 }}>Logged: {selectedEnquiry.date}</span>
                <h3 style={{ fontSize: '1.6rem', marginTop: '0.2rem', marginBottom: '1.5rem' }}>Quote Request Details</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  <div>
                    <strong>Submitter Name:</strong> {selectedEnquiry.name}
                  </div>
                  <div>
                    <strong>Business Email:</strong> <a href={`mailto:${selectedEnquiry.email}`} style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{selectedEnquiry.email}</a>
                  </div>
                  <div>
                    <strong>Phone Contact:</strong> {selectedEnquiry.phone || 'Not provided'}
                  </div>
                  <div>
                    <strong>Company / Plant:</strong> {selectedEnquiry.company || 'Not provided'}
                  </div>
                  <div>
                    <strong>Product Selection:</strong> <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{selectedEnquiry.machineType}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <strong>Client Specifications:</strong>
                  <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{selectedEnquiry.message}</p>
                </div>

                <button 
                  className="btn btn-secondary" 
                  style={{ marginTop: '2rem' }}
                  onClick={() => setSelectedEnquiry(null)}
                >
                  Close Log
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================================================
  // FORGOT PASSWORD RECOVERY VIEW
  // ==========================================================================
  const renderRecovery = () => {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="quote-form-container" style={{ maxWidth: '450px', width: '100%', textAlign: 'center' }}>
          <i className="fa-solid fa-user-shield" style={{ fontSize: '3rem', color: 'var(--color-accent)', marginBottom: '1rem' }}></i>
          
          {!recoverySuccess ? (
            // Step 1: Answer Question
            <>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Security Verification</h2>
              <p style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Provide the correct answer to recover your password details.</p>
              
              <form onSubmit={handleRecoverySubmit}>
                <div className="form-group" style={{ textAlign: 'left' }}>
                  <label className="form-label" style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                    {securityData.question || 'What is our company brand name?'}
                  </label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Enter answer..."
                    value={recoveryAnswer}
                    onChange={(e) => setRecoveryAnswer(e.target.value)}
                    style={{ textAlign: 'center' }}
                    required 
                  />
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Verify Answer
                </button>

                {recoveryError && (
                  <div style={{ color: '#991b1b', fontSize: '0.8rem', marginTop: '1rem', fontWeight: 600 }}>
                    <i className="fa-solid fa-triangle-exclamation"></i> {recoveryError}
                  </div>
                )}

                <div style={{ marginTop: '1.5rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.7rem', padding: '0.5rem 1rem' }}
                    onClick={() => { setIsRecovering(false); setRecoveryError(''); setRecoveryAnswer(''); }}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          ) : (
            // Step 2: Set New Password
            <>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Reset Password</h2>
              <p style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Verification successful. Set your new admin credentials password.</p>
              
              <form onSubmit={handleResetPasswordSubmit}>
                <div className="form-group">
                  <label className="form-label">New Password *</label>
                  <input 
                    type="password" 
                    className="form-control"
                    placeholder="Min 6 characters..."
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    style={{ textAlign: 'center' }}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password *</label>
                  <input 
                    type="password" 
                    className="form-control"
                    placeholder="Confirm new password..."
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    style={{ textAlign: 'center' }}
                    required 
                  />
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Save New Password
                </button>

                {recoveryError && (
                  <div style={{ color: '#991b1b', fontSize: '0.8rem', marginTop: '1rem', fontWeight: 600 }}>
                    <i className="fa-solid fa-triangle-exclamation"></i> {recoveryError}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    );
  };

  // ==========================================================================
  // LOCKED LOGIN VIEW
  // ==========================================================================
  const renderLogin = () => {
    const isLockedOut = lockoutTime > 0;

    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="quote-form-container" style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <i className="fa-solid fa-lock" style={{ fontSize: '3rem', color: 'var(--color-accent)', marginBottom: '1rem' }}></i>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Admin Access Only</h2>
          <p style={{ marginBottom: '2rem' }}>Please enter password to unlock the dashboard logs and uploader tools.</p>
          
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <input 
                type="password" 
                className="form-control"
                placeholder={isLockedOut ? "Lockout active..." : "Enter password..."}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{ textAlign: 'center' }}
                disabled={isLockedOut}
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={isLockedOut}
            >
              {isLockedOut ? `Locked out (${lockoutTime}s)` : 'Unlock Dashboard'}
            </button>

            {authError && (
              <div style={{ color: '#991b1b', fontSize: '0.8rem', marginTop: '1rem', fontWeight: 600 }}>
                <i className="fa-solid fa-triangle-exclamation"></i> {authError}
              </div>
            )}

            {!isLockedOut && (
              <div style={{ marginTop: '1.5rem' }}>
                <button 
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                  onClick={() => { setIsRecovering(true); setAuthError(''); setPasswordInput(''); }}
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      {isLocked ? (isRecovering ? renderRecovery() : renderLogin()) : renderDashboard()}
    </section>
  );
}
