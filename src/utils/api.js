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
 * Backend Audit Results (tested 2026-08-05):
 *   ✅ POST /api/auth/login          → { password } → { token }
 *   ✅ GET  /api/products            → [products]
 *   ✅ POST /api/products/upload     → JSON or FormData + JWT
 *   ❌ DELETE /api/products/:id      → 404 (route doesn't exist)
 *   ✅ GET  /api/categories          → { categories: [...] }
 *   ✅ POST /api/categories/add      → JSON + JWT
 *   ⚠ DELETE /api/categories/:id    → expects ObjectId, not key
 *   ⚠ PUT    /api/categories/:id    → expects ObjectId, not key
 *   ✅ GET  /api/subcategories       → [subcategories]
 *   ✅ POST /api/subcategories/add   → JSON + JWT
 *   ✅ GET  /api/blogs               → [blogs]
 *   ✅ POST /api/blogs/upload        → JSON or FormData + JWT
 *   ✅ DELETE /api/blogs/:id         → JWT
 *   ✅ GET  /api/news                → [news]
 *   ❌ POST /api/news                → 404 (no create route)
 *   ✅ DELETE /api/news/:id          → JWT
 *   ✅ POST /api/inquiry/send        → JSON (fullName, businessEmail, phone, productInterest, message)
 *   ✅ DELETE /api/inquiry/:id       → JWT
 *   ❌ GET  /api/inquiry             → 404 (no admin list route)
 *   ✅ POST /api/quote/send          → JSON (fullname lowercase!, businessEmail, phone, productInterest, message)
 *   ✅ DELETE /api/quote/:id         → JWT
 *   ❌ GET  /api/quote               → 404 (no admin list route)
 *   ❌ /api/distributor              → 404 (route doesn't exist - falls back to inquiry)
 *   ❌ /api/oem                      → 404 (route doesn't exist - falls back to inquiry)
 *   ❌ /api/career                   → 404 (route doesn't exist - falls back to inquiry)
 *   ❌ GET /api/auth/verify          → 404 (route doesn't exist)
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
    return image;
  }
  if (typeof image === 'string') {
    return `${API_BASE_URL}/uploads/${image}`;
  }
  return '/images/product_placeholder.jpg';
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
  /**
   * Admin login.
   * Sends { password } and receives { message, token }.
   */
  login: async (password) => {
    const { data } = await api.post('/api/auth/login', { password });
    return data;
  },

  /**
   * Verify the current JWT is still valid.
   * NOTE: Backend does not have this route (404).
   * Returns true if a token exists in sessionStorage.
   */
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

  /** Fetch a single product by id. */
  getById: async (id) => {
    const { data } = await api.get(`/api/products/${id}`);
    return data;
  },

  /**
   * Create / upload a product.
   * Accepts either a FormData object (with image file) or a plain JSON object.
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

  /**
   * Update a product.
   * NOTE: Backend may not have this route yet.
   */
  update: async (id, payload) => {
    const { data } = await api.put(`/api/products/${id}`, payload);
    return data;
  },

  /**
   * Delete a product.
   * NOTE: Backend route /api/products/:id DELETE returns 404.
   * This will throw an error which callers should catch.
   */
  delete: async (id) => {
    const { data } = await api.delete(`/api/products/${id}`);
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
   * Update a category by its MongoDB _id (NOT by uniqueKey).
   * The backend expects an ObjectId in the URL parameter.
   */
  update: async (id, payload) => {
    const { data } = await api.put(`/api/categories/${id}`, payload);
    return data;
  },

  /**
   * Delete a category by its MongoDB _id (NOT by uniqueKey).
   * The backend expects an ObjectId in the URL parameter.
   */
  delete: async (id) => {
    const { data } = await api.delete(`/api/categories/${id}`);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  SUBCATEGORIES API  –  /api/subcategories
// ─────────────────────────────────────────────────────────────
export const subcategoriesApi = {
  /** Fetch all subcategories (optionally filtered by category). */
  getAll: async (categoryKey) => {
    const url = categoryKey
      ? `/api/subcategories?category=${categoryKey}`
      : '/api/subcategories';
    const { data } = await api.get(url);
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
   * Upload a blog post with an optional image.
   * Accepts either FormData (with image file) or plain JSON.
   * Fields: title, description, image (file)
   * JWT is automatically attached by the request interceptor.
   */
  upload: async (formDataOrPayload) => {
    const isFormData = formDataOrPayload instanceof FormData;
    const { data } = await api.post(
      '/api/blogs/upload',
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

  /** Fetch a single news item by id. */
  getById: async (id) => {
    const { data } = await api.get(`/api/news/${id}`);
    return data;
  },

  /**
   * Create a news item.
   * NOTE: Backend does not have POST /api/news (returns 404).
   * This will throw an error which callers should catch.
   */
  create: async (payload) => {
    const { data } = await api.post('/api/news', payload);
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
   * Required fields: fullName (capital N), businessEmail, phone, productInterest, message
   */
  send: async (payload) => {
    const normalized = {
      fullName: payload.fullName || payload.fullname || payload.name || '',
      businessEmail: payload.businessEmail || payload.email || '',
      phone: payload.phone || '',
      productInterest: payload.productInterest || payload.machineType || '',
      message: payload.message || '',
    };
    const { data } = await api.post('/api/inquiry/send', normalized);
    return data;
  },

  /**
   * Delete an inquiry by id (admin).
   * JWT is automatically attached by the request interceptor.
   */
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
   * Required fields: fullname (lowercase n!), businessEmail, phone, productInterest, message
   */
  send: async (payload) => {
    const normalized = {
      fullname: payload.fullname || payload.fullName || payload.name || '',
      businessEmail: payload.businessEmail || payload.email || '',
      phone: payload.phone || '',
      productInterest: payload.productInterest || payload.product || '',
      message: payload.message || '',
    };
    const { data } = await api.post('/api/quote/send', normalized);
    return data;
  },

  /**
   * Delete a quote request by id (admin).
   * JWT is automatically attached by the request interceptor.
   */
  delete: async (id) => {
    const { data } = await api.delete(`/api/quote/${id}`);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  DISTRIBUTOR API  –  falls back to /api/inquiry/send
//  Backend does not have /api/distributor routes (404).
// ─────────────────────────────────────────────────────────────
export const distributorApi = {
  /**
   * Submit a distributor application.
   * Falls back to the inquiry endpoint since /api/distributor doesn't exist.
   */
  send: async (payload) => {
    const normalized = {
      fullName: payload.fullName || payload.fullname || payload.name || '',
      businessEmail: payload.businessEmail || payload.email || '',
      phone: payload.phone || '',
      productInterest: `Distributor Request (Territory: ${payload.territory || 'N/A'})`,
      message: payload.message || '',
    };
    const { data } = await api.post('/api/inquiry/send', normalized);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  OEM API  –  falls back to /api/inquiry/send
//  Backend does not have /api/oem routes (404).
// ─────────────────────────────────────────────────────────────
export const oemApi = {
  /**
   * Submit an OEM / private-label request.
   * Falls back to the inquiry endpoint since /api/oem doesn't exist.
   */
  send: async (payload) => {
    const normalized = {
      fullName: payload.fullName || payload.fullname || payload.name || '',
      businessEmail: payload.businessEmail || payload.email || '',
      phone: payload.phone || '',
      productInterest: `OEM Private Label (Volume: ${payload.volume || 'N/A'})`,
      message: payload.formulation || payload.message || '',
    };
    const { data } = await api.post('/api/inquiry/send', normalized);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  CAREER API  –  falls back to /api/inquiry/send
//  Backend does not have /api/career routes (404).
// ─────────────────────────────────────────────────────────────
export const careerApi = {
  /**
   * Submit a career application.
   * Falls back to the inquiry endpoint since /api/career doesn't exist.
   */
  send: async (payload) => {
    const normalized = {
      fullName: payload.fullName || payload.fullname || payload.name || '',
      businessEmail: payload.businessEmail || payload.email || '',
      phone: payload.phone || '',
      productInterest: `Career Application: ${payload.position || 'General'}`,
      message: payload.message || '',
    };
    const { data } = await api.post('/api/inquiry/send', normalized);
    return data;
  },
};

// ─────────────────────────────────────────────────────────────
//  Default export – raw axios instance for ad-hoc use
// ─────────────────────────────────────────────────────────────
export default api;