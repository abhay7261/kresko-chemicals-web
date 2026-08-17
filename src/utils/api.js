import axios from 'axios';

/**
 * Centralized API Configuration
 * ─────────────────────────────────────────────────────────────
 * Base URL is read from the Vite environment variable VITE_API_URL.
 * Fallback ensures the app still works if the variable is missing.
 *
 * Admin (authenticated) requests automatically attach:
 *   Authorization: Bearer <JWT_TOKEN>
 *
 * All service functions use async/await with try/catch error handling
 * and return normalized data so callers do not need to worry about
 * axios response wrappers.
 *
 * Backend API Reference (from official docs):
 *   POST /api/auth/login                    → { password } → { token }
 *   GET  /api/auth/security-question        → { question }
 *   POST /api/auth/change-password          → { answer, newPassword }
 *   POST /api/products/upload               → multipart + JWT
 *   GET  /api/products                      → [products]
 *   POST /api/categories/add                → JSON + JWT
 *   GET  /api/categories                    → { categories: [...] }
 *   PUT  /api/categories/:id                → JSON + JWT
 *   DELETE /api/categories/:id              → JWT
 *   POST /api/subcategories/add             → JSON + JWT
 *   GET  /api/subcategories                 → [subcategories]
 *   GET  /api/subcategories/category/:key   → [subcategories]
 *   PUT  /api/subcategories/:id             → JSON + JWT
 *   DELETE /api/subcategories/:id           → JWT
 *   POST /api/blogs/create                  → multipart + JWT
 *   GET  /api/blogs                         → [blogs]
 *   GET  /api/blogs/:id                     → blog
 *   DELETE /api/blogs/:id                   → JWT
 *   POST /api/news/create                   → JSON + JWT
 *   GET  /api/news                          → [news]
 *   GET  /api/news/:slug                    → news
 *   PUT  /api/news/:id                      → JSON + JWT
 *   DELETE /api/news/:id                    → JWT
 *   POST /api/inquiry/send                  → JSON (fullName, businessEmail, phone, companyName, productInterest, message)
 *   GET  /api/inquiry/all                   → JWT
 *   DELETE /api/inquiry/:id                 → JWT
 *   POST /api/quote/send                    → JSON (fullname, businessEmail, phone, companyName, productInterest, specifications, message)
 *   GET  /api/quote/all                     → JWT
 *   DELETE /api/quote/:id                   → JWT
 *   POST /api/distributor/apply             → JSON (contactPersonName, businessEmail, phone, distributionFirmName, territory, infrastructure)
 *   GET  /api/distributor/all               → JWT
 *   DELETE /api/distributor/:id             → JWT
 *   POST /api/oem/request                   → JSON (fullname, businessEmail, phone, brandName, monthlyVolume, blendingSpecs)
 *   GET  /api/oem/all                       → JWT
 *   DELETE /api/oem/:id                     → JWT
 *   POST /api/career/apply                  → multipart (fullname, email, phone, position, experience, coverLetter, resume)
 *   GET  /api/career/all                    → JWT
 *   DELETE /api/career/:id                  → JWT
 *   GET    /api/catalogs                    → [catalogs] public
 *   POST   /api/catalogs                    → multipart + JWT (title, description, documentType, pdf)
 *   PUT    /api/catalogs/:id                → multipart + JWT
 *   DELETE /api/catalogs/:id                → JWT
 *   POST   /api/catalog/save                → legacy multipart + JWT
 *   GET    /api/catalog                     → legacy public (returns list)
 *   DELETE /api/catalog/delete/:id          → legacy JWT

 *   POST /api/faqs/create                   → JWT
 *   GET  /api/faqs                          → public
 *   GET  /api/faqs/admin                    → JWT
 *   PUT  /api/faqs/:id                      → JWT
 *   DELETE /api/faqs/:id                    → JWT
 *   PUT  /api/admin/settings/change-password    → JWT
 *   PUT  /api/admin/settings/recovery-settings  → JWT
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://kreskobackend.onrender.com';

// ─────────────────────────────────────────────────────────────
//  Axios instance
// ─────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s – Render free tier can be slow on cold start
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────────────────────────────────────
//  Request interceptor – attach JWT automatically
// ─────────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────────
//  Response interceptor – centralized error handling
// ─────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network / no response from server
    if (!error.response) {
      console.error('[API] Network error:', error.message);
      return Promise.reject({
        success: false,
        message: 'Unable to connect to the server. Please check your internet connection.',
        isNetworkError: true,
      });
    }

    // 401 Unauthorized – clear stale token
    if (error.response.status === 401) {
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('isAdminLoggedIn');
      window.dispatchEvent(new Event('adminLoginStatusChange'));
    }

    const { status, data } = error.response;
    const message =
      (data && (data.message || data.error)) ||
      `Request failed with status ${status}`;

    console.error(`[API] ${error.config?.method?.toUpperCase()} ${error.config?.url} → ${status}`, message);

    return Promise.reject({
      success: false,
      status,
      message,
      data: data || null,
    });
  }
);

// ─────────────────────────────────────────────────────────────
//  Helper – resolve relative upload URLs to full backend URLs
// ─────────────────────────────────────────────────────────────
export const resolveImageUrl = (image) => {
  if (!image) return '/images/product_placeholder.jpg';
  if (
    typeof image === 'string' &&
    (image.startsWith('http') || image.startsWith('data:') || image.startsWith('/'))
  ) {
    // Relative upload paths like /uploads/... must hit the backend host
    if (typeof image === 'string' && image.startsWith('/uploads/')) {
      return `${API_BASE_URL}${image}`;
    }
    return image;
  }
  if (typeof image === 'string') {
    return `${API_BASE_URL}/uploads/${image}`;
  }
  return '/images/product_placeholder.jpg';
};

/**
 * Resolve a catalog PDF path/URL to a full downloadable URL.
 * Accepts absolute http(s) links, /uploads/... paths, or bare filenames.
 */
export const resolveFileUrl = (file) => {
  if (!file || typeof file !== 'string') return '';
  if (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('data:')) {
    return file;
  }
  if (file.startsWith('/uploads/')) {
    return `${API_BASE_URL}${file}`;
  }
  if (file.startsWith('/')) {
    return `${API_BASE_URL}${file}`;
  }
  return `${API_BASE_URL}/uploads/${file}`;
};

/** Format byte size for display (e.g. 1.2 MB). */
export const formatFileSize = (bytes) => {
  const n = Number(bytes) || 0;
  if (n <= 0) return 'PDF Document';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};


// ─────────────────────────────────────────────────────────────
//  Helper – convert a data-URL string into a File object
// ─────────────────────────────────────────────────────────────
export const dataUrlToFile = (dataUrl, filename = 'upload.png') => {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  if (!dataUrl.startsWith('data:')) return null;
  try {
    const [meta, base64] = dataUrl.split(',');
    const mime = (meta.match(/data:(.*?);/) || [])[1] || 'image/png';
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const ext = (mime.split('/')[1] || 'png').replace('jpeg', 'jpg');
    return new File([bytes], `${filename.replace(/\.[^.]+$/, '')}.${ext}`, { type: mime });
  } catch (e) {
    console.warn('[api] Could not convert data URL to File:', e.message);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────
//  AUTH API  –  /api/auth
// ─────────────────────────────────────────────────────────────
export const authApi = {
  /** Admin login. Sends { password } and receives { message, token }. */
  login: async (password) => {
    const { data } = await api.post('/api/auth/login', { password });
    return data;
  },

  /** Get the security question (public). */
  getSecurityQuestion: async () => {
    const { data } = await api.get('/api/auth/security-question');
    return data;
  },

  /** Change password using security answer (public). */
  changePassword: async (answer, newPassword) => {
    const { data } = await api.post('/api/auth/change-password', { answer, newPassword });
    return data;
  },

  /** Verify the current JWT is still valid (local check). */
  verify: async () => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) return { valid: false };
    return { valid: true };
  },
};

// ─────────────────────────────────────────────────────────────
//  PRODUCTS API  –  /api/products
// ─────────────────────────────────────────────────────────────
export const productsApi = {
  /** Fetch all products. Returns an array. */
  getAll: async () => {
    const { data } = await api.get('/api/products');
    return data;
  },

  /**
   * Create / upload a product.
   * Accepts either a FormData object (with image file) or a plain JSON object.
   * Fields: name, category, variant, price, unit, moq, moqUnit, dilution,
   *         dilutedPrice, description, badge, specifications, image
   * JWT is automatically attached by the request interceptor.
   */
  upload: async (formDataOrPayload) => {
    const isFormData = formDataOrPayload instanceof FormData;
    const { data } = await api.post(
      '/api/products/upload',
      formDataOrPayload,
      isFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined
    );
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  CATEGORIES API  –  /api/categories
// ─────────────────────────────────────────────────────────────
export const categoriesApi = {
  /**
   * Fetch all categories.
   * Backend returns { categories: [...] }; normalized to an array.
   */
  getAll: async () => {
    const { data } = await api.get('/api/categories');
    if (data && Array.isArray(data.categories)) return data.categories;
    if (Array.isArray(data)) return data;
    return [];
  },

  /**
   * Add a new category.
   * Fields: categoryName, uniqueKey, categoryImage
   */
  add: async (payload) => {
    const { data } = await api.post('/api/categories/add', payload);
    return data;
  },

  /**
   * Update a category by its MongoDB _id.
   * Fields: categoryName, uniqueKey, categoryImage
   */
  update: async (id, payload) => {
    const { data } = await api.put(`/api/categories/${id}`, payload);
    return data;
  },

  /** Delete a category by its MongoDB _id. */
  delete: async (id) => {
    const { data } = await api.delete(`/api/categories/${id}`);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  SUBCATEGORIES API  –  /api/subcategories
// ─────────────────────────────────────────────────────────────
export const subcategoriesApi = {
  /** Fetch all subcategories. */
  getAll: async () => {
    const { data } = await api.get('/api/subcategories');
    return data;
  },

  /** Fetch subcategories filtered by a category's uniqueKey. */
  getByCategory: async (categoryKey) => {
    const { data } = await api.get(`/api/subcategories/category/${categoryKey}`);
    return data;
  },

  /**
   * Add a new subcategory.
   * Fields: subcategoryName, uniqueKey, categoryUniqueKey
   */
  add: async (payload) => {
    const { data } = await api.post('/api/subcategories/add', payload);
    return data;
  },

  /** Update a subcategory by id. */
  update: async (id, payload) => {
    const { data } = await api.put(`/api/subcategories/${id}`, payload);
    return data;
  },

  /** Delete a subcategory by id. */
  delete: async (id) => {
    const { data } = await api.delete(`/api/subcategories/${id}`);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  BLOGS API  –  /api/blogs
// ─────────────────────────────────────────────────────────────
export const blogsApi = {
  /** Fetch all blog posts. Returns an array. */
  getAll: async () => {
    const { data } = await api.get('/api/blogs');
    return data;
  },

  /** Fetch a single blog post by id. */
  getById: async (id) => {
    const { data } = await api.get(`/api/blogs/${id}`);
    return data;
  },

  /**
   * Create a blog post with an optional image.
   * Accepts either FormData (with image file) or plain JSON.
   * Fields: title, description, image (file)
   * JWT is automatically attached by the request interceptor.
   */
  create: async (formDataOrPayload) => {
    const isFormData = formDataOrPayload instanceof FormData;
    const { data } = await api.post(
      '/api/blogs/create',
      formDataOrPayload,
      isFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined
    );
    return data;
  },

  /** Delete a blog post by id. JWT required. */
  delete: async (id) => {
    const { data } = await api.delete(`/api/blogs/${id}`);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  NEWS API  –  /api/news
// ─────────────────────────────────────────────────────────────
export const newsApi = {
  /** Fetch all news items. Returns an array. */
  getAll: async () => {
    const { data } = await api.get('/api/news');
    return data;
  },

  /** Fetch a single news item by slug. */
  getBySlug: async (slug) => {
    const { data } = await api.get(`/api/news/${slug}`);
    return data;
  },

  /**
   * Create a news item.
   * Fields: title, slug, category, description, content, image
   * JWT is automatically attached by the request interceptor.
   */
  create: async (payload) => {
    const { data } = await api.post('/api/news/create', payload);
    return data;
  },

  /** Update a news item by id. JWT required. */
  update: async (id, payload) => {
    const { data } = await api.put(`/api/news/${id}`, payload);
    return data;
  },

  /** Delete a news item by id. JWT required. */
  delete: async (id) => {
    const { data } = await api.delete(`/api/news/${id}`);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  INQUIRY API  –  /api/inquiry
// ─────────────────────────────────────────────────────────────
export const inquiryApi = {
  /**
   * Submit a general inquiry (public).
   * Required fields: fullName, businessEmail, phone, companyName, productInterest, message
   */
  send: async (payload) => {
    const normalized = {
      fullName: payload.fullName || payload.fullname || payload.name || '',
      businessEmail: payload.businessEmail || payload.email || '',
      phone: payload.phone || '',
      companyName: payload.companyName || payload.company || '',
      productInterest: payload.productInterest || payload.machineType || '',
      message: payload.message || '',
    };
    const { data } = await api.post('/api/inquiry/send', normalized);
    return data;
  },

  /** Fetch all inquiries (admin). JWT required. */
  getAll: async () => {
    const { data } = await api.get('/api/inquiry/all');
    return data;
  },

  /** Delete an inquiry by id (admin). JWT required. */
  delete: async (id) => {
    const { data } = await api.delete(`/api/inquiry/${id}`);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  QUOTE API  –  /api/quote
// ─────────────────────────────────────────────────────────────
export const quoteApi = {
  /**
   * Submit a quote request (public).
   * Required fields: fullname (lowercase n!), businessEmail, phone, companyName, productInterest, specifications, message
   */
  send: async (payload) => {
    const normalized = {
      fullname: payload.fullname || payload.fullName || payload.name || '',
      businessEmail: payload.businessEmail || payload.email || '',
      phone: payload.phone || '',
      companyName: payload.companyName || payload.company || '',
      productInterest: payload.productInterest || payload.product || '',
      specifications: payload.specifications || '',
      message: payload.message || '',
    };
    const { data } = await api.post('/api/quote/send', normalized);
    return data;
  },

  /** Fetch all quote requests (admin). JWT required. */
  getAll: async () => {
    const { data } = await api.get('/api/quote/all');
    return data;
  },

  /** Delete a quote request by id (admin). JWT required. */
  delete: async (id) => {
    const { data } = await api.delete(`/api/quote/${id}`);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  DISTRIBUTOR API  –  /api/distributor
// ─────────────────────────────────────────────────────────────
export const distributorApi = {
  /**
   * Submit a distributor application (public).
   * Fields: contactPersonName, businessEmail, phone, distributionFirmName, territory, infrastructure
   */
  apply: async (payload) => {
    const normalized = {
      contactPersonName: payload.contactPersonName || payload.fullName || payload.name || '',
      businessEmail: payload.businessEmail || payload.email || '',
      phone: payload.phone || '',
      distributionFirmName: payload.distributionFirmName || payload.company || '',
      territory: payload.territory || '',
      infrastructure: payload.infrastructure || payload.message || '',
    };
    const { data } = await api.post('/api/distributor/apply', normalized);
    return data;
  },

  /** Fetch all distributor applications (admin). JWT required. */
  getAll: async () => {
    const { data } = await api.get('/api/distributor/all');
    return data;
  },

  /** Delete a distributor application by id (admin). JWT required. */
  delete: async (id) => {
    const { data } = await api.delete(`/api/distributor/${id}`);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  OEM API  –  /api/oem
// ─────────────────────────────────────────────────────────────
export const oemApi = {
  /**
   * Submit an OEM / private-label request (public).
   * Fields: fullname, businessEmail, phone, brandName, monthlyVolume, blendingSpecs
   */
  request: async (payload) => {
    const normalized = {
      fullname: payload.fullname || payload.fullName || payload.name || '',
      businessEmail: payload.businessEmail || payload.email || '',
      phone: payload.phone || '',
      brandName: payload.brandName || payload.company || '',
      monthlyVolume: payload.monthlyVolume || payload.volume || '',
      blendingSpecs: payload.blendingSpecs || payload.formulation || payload.message || '',
    };
    const { data } = await api.post('/api/oem/request', normalized);
    return data;
  },

  /** Fetch all OEM requests (admin). JWT required. */
  getAll: async () => {
    const { data } = await api.get('/api/oem/all');
    return data;
  },

  /** Delete an OEM request by id (admin). JWT required. */
  delete: async (id) => {
    const { data } = await api.delete(`/api/oem/${id}`);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  CAREER API  –  /api/career
// ─────────────────────────────────────────────────────────────
export const careerApi = {
  /**
   * Submit a career application (public).
   * Accepts FormData (with resume file) or plain JSON.
   * Fields: fullname, email, phone, position, experience, coverLetter, resume (file)
   */
  apply: async (formDataOrPayload) => {
    const isFormData = formDataOrPayload instanceof FormData;
    const { data } = await api.post(
      '/api/career/apply',
      formDataOrPayload,
      isFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined
    );
    return data;
  },

  /** Fetch all career applications (admin). JWT required. */
  getAll: async () => {
    const { data } = await api.get('/api/career/all');
    return data;
  },

  /** Delete a career application by id (admin). JWT required. */
  delete: async (id) => {
    const { data } = await api.delete(`/api/career/${id}`);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  CATALOG API  –  /api/catalogs  (+ legacy /api/catalog)
// ─────────────────────────────────────────────────────────────
export const catalogApi = {
  // Get all catalogs
  getAll: async () => {
    const { data } = await api.get("/api/catalog");

    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.catalogs)) return data.catalogs;
    if (data && data.catalog) return [data.catalog];
    if (data && data._id) return [data];

    return [];
  },

  // Get one catalog
  getById: async (id) => {
    const catalogs = await catalogApi.getAll();
    return catalogs.find(c => c._id === id || c.id === id);
  },

  // Upload catalog
  create: async (formData) => {
    const { data } = await api.post("/api/catalog/save", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  // Update catalog
  // Backend doesn't have PUT, so use the same save endpoint.
  update: async (id, formData) => {
    formData.append("_id", id);

    const { data } = await api.post("/api/catalog/save", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  // Delete catalog
  delete: async (id) => {
    const { data } = await api.delete(`/api/catalog/delete/${id}`);
    return data;
  },
};
  


// ─────────────────────────────────────────────────────────────
//  FAQS API  –  /api/faqs
// ─────────────────────────────────────────────────────────────
export const faqsApi = {
  /** Create a FAQ (admin). JWT required. */
  create: async (payload) => {
    const { data } = await api.post('/api/faqs/create', payload);
    return data;
  },

  /** Get public FAQs. */
  getAll: async () => {
    const { data } = await api.get('/api/faqs');
    return data;
  },

  /** Get admin FAQ list (admin). JWT required. */
  getAdmin: async () => {
    const { data } = await api.get('/api/faqs/admin');
    return data;
  },

  /** Update a FAQ by id (admin). JWT required. */
  update: async (id, payload) => {
    const { data } = await api.put(`/api/faqs/${id}`, payload);
    return data;
  },

  /** Delete a FAQ by id (admin). JWT required. */
  delete: async (id) => {
    const { data } = await api.delete(`/api/faqs/${id}`);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  ADMIN SETTINGS API  –  /api/admin/settings
// ─────────────────────────────────────────────────────────────
export const adminSettingsApi = {
  /** Change admin password (admin). JWT required. */
  changePassword: async (payload) => {
    const { data } = await api.put('/api/admin/settings/change-password', payload);
    return data;
  },

  /** Update recovery question settings (admin). JWT required. */
  updateRecoverySettings: async (payload) => {
    const { data } = await api.put('/api/admin/settings/recovery-settings', payload);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  Default export – raw axios instance for ad-hoc use
// ─────────────────────────────────────────────────────────────
export default api;