// Centralized API configuration
import {
  inquiryApi,
  categoriesApi,
  productsApi,
  resolveImageUrl,
} from './api';

// Product Category and Subcategory Mapping matching Tab 4 layout
export const PRODUCT_CATEGORIES = {};

// Help helper to generate complete B2B parameter lists, applications and features dynamically
// Help helper to generate complete B2B parameter lists, applications and features dynamically
function populateProductDetails(p) {
  const pTitle = (p.title || '').toLowerCase();
  
  // Dynamic realistic image path mapping based on category and product title
  let imagePath = '';
  const cat = (p.category || '').toLowerCase();
  const pId = (p.id || '').toLowerCase();
  if (cat.includes('floor')) {
    if (pId.includes('phenyl') || pId.includes('black') || pId.includes('pvl') || pId.includes('psv') || pId.includes('pscv') || pTitle.includes('phenyl')) {
      imagePath = '/images/products/white_phenyl_drum.png';
    } else {
      imagePath = '/images/products/floor_cleaner_purple.png';
    }
  } else if (cat.includes('personal')) {
    imagePath = '/images/products/handwash_pink.png';
  } else if (cat.includes('laundry')) {
    imagePath = '/images/products/laundry_detergent_blue.png';
  } else if (cat.includes('kitchen')) {
    imagePath = '/images/products/dishwash_gel_yellow.png';
  } else if (cat.includes('bathroom') || cat.includes('toilet') || pId.includes('toilet') || pTitle.includes('toilet')) {
    imagePath = '/images/products/toilet_cleaner_blue.png';
  } else if (cat.includes('pest') || cat.includes('air') || cat.includes('glass')) {
    imagePath = '/images/products/spray_bottle_repellent.png';
  } else if (cat.includes('car')) {
    imagePath = '/images/products/car_shampoo_orange.png';
  } else {
    imagePath = '/images/products/chemical_drum_white.png';
  }

  const finalImage = p.image || imagePath;
  let images = p.images;
  if (!images || !Array.isArray(images) || images.length <= 1) {
    const defaultImg = finalImage;
    const additionalPool = [
      '/images/products/chemical_drum_white.png',
      '/images/products/spray_bottle_repellent.png',
      '/images/products/white_phenyl_drum.png',
      '/images/products/floor_cleaner_purple.png',
      '/images/products/laundry_detergent_blue.png'
    ].filter(img => img !== defaultImg);
    images = [defaultImg, ...additionalPool.slice(0, 3)];
  }

  // If it is the Disinfectant Liquid, use the exact User specification content (but assign the image)
  if (p.id === 'disinfectant-liquid-pcmx') {
    return {
      ...p,
      image: finalImage,
      images,
      applicationsList: [
        'Healthcare: Hospitals, clinics, nursing homes',
        'Education: Schools, colleges, institutions',
        'Commercial: Offices, malls, hotels, restaurants',
        'Industrial: Factories, warehouses, manufacturing units',
        'Residential: Apartments, housing societies'
      ],
      features: [
        { title: 'Effective Antimicrobial Action', desc: 'Formulated with disinfecting agents that help control bacteria and maintain hygienic surfaces.' },
        { title: 'Reliable Cleaning Performance', desc: 'Removes dirt, stains, and contaminants while supporting surface sanitation.' },
        { title: 'Concentrated & Economical Formula', desc: 'The disinfectant concentrate allows flexible dilution for large-scale production of cleaning solutions.' },
        { title: 'Surface Compatibility', desc: 'Suitable for cleaning hard surfaces, including tiles, floors, countertops, and equipment.' },
        { title: 'Consistent Manufacturing Quality', desc: 'Produced under controlled processes ensuring batch-to-batch reliability.' },
        { title: 'Stable Formulation', desc: 'Designed for stability during storage and transportation.' },
        { title: 'Wide Application Range', desc: 'Suitable for household, commercial, healthcare, and industrial sanitation applications.' }
      ],
      specsTable: [
        { param: 'Physical Form', value: 'Liquid' },
        { param: 'Storage', value: 'Room Temperature' },
        { param: 'pH Value', value: '6.0 - 8.5 (1% Solution)' },
        { param: 'Odor', value: 'Fresh / Mild Characteristic Fragrance' },
        { param: 'Appearance', value: 'Clear / Light Colored Liquid' },
        { param: 'Applications', value: 'Household, Industrial, Institutional Hygiene' }
      ]
    };
  }

  // Swadesh-style parameters builder
  // 1. Physical Form
  let physicalForm = 'Liquid';
  if (pTitle.includes('powder')) physicalForm = 'Free-Flowing Dry Powder';
  else if (pTitle.includes('cake')) physicalForm = 'Solid Deodorizing Block';

  // 2. Chemical Composition
  let chemicalComposition = 'Active Surfactants & Solubilizers Base';
  if (cat.includes('floor') || cat.includes('housekeeping')) {
    chemicalComposition = 'Anionic & Non-ionic Surfactant Blend with Perfume Stabilizers';
  } else if (cat.includes('laundry')) {
    chemicalComposition = 'High-Activity Active Matter, Fabric Brighteners & Softening Agents';
  } else if (cat.includes('personal')) {
    chemicalComposition = 'Skin-Safe Mild Surfactants, Glycerin, Pearlizing Concentrates';
  } else if (cat.includes('kitchen')) {
    chemicalComposition = 'Heavy-Duty Grease Stripping Active Agents & Foaming Surfactants';
  } else if (cat.includes('car')) {
    chemicalComposition = 'Paint-Safe Surfactants, Carnauba Wax Emulsion & Gloss Additives';
  } else if (cat.includes('glass')) {
    chemicalComposition = 'Streak-Free Evaporating Solvents & Anti-Fogging Agents';
  } else if (cat.includes('pest')) {
    chemicalComposition = 'Active Repellents & Emulsifiable Hydrocarbon Oil Base';
  }

  // 3. pH Value
  let phValue = '6.5 - 8.5 (Neutral)';
  if (cat.includes('toilet') || pTitle.includes('toilet') || pTitle.includes('acid') || pTitle.includes('scale')) {
    phValue = '1.5 - 3.0 (Acidic / Highly Active)';
  } else if (cat.includes('personal')) {
    phValue = '6.0 - 7.5 (Skin-Friendly / Balanced)';
  }

  // 4. Odor
  let odor = 'Premium Customizable Fragrance';
  if (pTitle.includes('lavender')) odor = 'Floral Lavender Scent';
  else if (pTitle.includes('mogranda') || pTitle.includes('mogra') || pTitle.includes('sandal')) odor = 'Traditional Mogra & Sandalwood Aroma';
  else if (pTitle.includes('rose')) odor = 'Sweet Rose Scent';
  else if (pTitle.includes('lemon') || pTitle.includes('citrus')) odor = 'Zesty Citrus Lemon Scent';
  else if (pTitle.includes('strawberry')) odor = 'Fruity Strawberry Scent';
  else if (pTitle.includes('citronella') || pTitle.includes('grass')) odor = 'Herbal Citronella & Lemongrass Insect Repelling Scent';
  else if (pTitle.includes('pine') || pTitle.includes('phenyl') || pId.includes('phenyl')) odor = 'Strong Refreshing Pine Oil Scent';

  // 5. Appearance
  let appearance = 'Viscous Colored Liquid';
  if (pTitle.includes('transparent')) appearance = 'Water-Clear Transparent Liquid';
  else if (pTitle.includes('milky') || pTitle.includes('phenyl') || pId.includes('phenyl') || pId.includes('pvl') || pId.includes('psv') || pId.includes('pscv')) {
    appearance = 'Milky White Emulsion';
  } else if (pTitle.includes('black')) appearance = 'Dark Black Opaque Liquid';
  else if (pTitle.includes('blue') || pId.includes('blue')) appearance = 'Ocean Blue Viscous Liquid';
  else if (pTitle.includes('red') || pTitle.includes('rose')) appearance = 'Crimson Red Viscous Liquid';
  else if (pTitle.includes('green')) appearance = 'Dark Green Viscous Liquid';
  else if (pTitle.includes('pearl') || pTitle.includes('passion') || pId.endsWith('-p')) appearance = 'Pearlescent Viscous Liquid';
  else if (pTitle.includes('powder')) appearance = 'Fine Free-Flowing Powder';
  else if (pTitle.includes('cake')) appearance = 'Solid Deodorizing Block / Cake';

  // 6. Packaging Options
  let packagingOptions = '50 KG Drum, 200 KG Drum, 1000 KG (IBC)';
  if (pTitle.includes('cake') || pTitle.includes('200ml')) {
    packagingOptions = 'Carton / Pack of 24 Pcs / 100 Pcs';
  }

  // 7. Applications List
  let applicationsList = [
    'Commercial Blending & Compounding plants',
    'Institutional cleaning contractors & supply distributors',
    'Private label brand manufacturing operations'
  ];
  if (cat.includes('floor') || pTitle.includes('phenyl')) {
    applicationsList = [
      'Commercial Facilities & Hospitality floor sanitation and cleaning',
      'Household floor mopping and marble/granite tile cleaning',
      'Institutional cleaning in schools, hotels, offices, and hospitals',
      'Industrial units requiring oil-stain and grease-dust removal'
    ];
  } else if (cat.includes('personal')) {
    applicationsList = [
      'High-traffic public washrooms in airports, offices, and shopping malls',
      'Industrial staff wash stations and employee hygiene setups',
      'B2B repacking brands and private label liquid soap distribution'
    ];
  } else if (cat.includes('laundry')) {
    applicationsList = [
      'Commercial laundries, hotels, hospitals & nursing home fabric wash',
      'Industrial uniform wash systems and tough stain removal',
      'Detergent repackaging and local consumer distribution'
    ];
  } else if (cat.includes('kitchen')) {
    applicationsList = [
      'Commercial kitchen utensil wash and restaurant dishwashing',
      'Food processing industry equipment sanitizing and degreasing',
      'Industrial catering kitchen facilities'
    ];
  }

  // 8. Description
  const dilutionRatioText = p.dilution && p.dilution !== 'Ready to Use (RTU)' ? `Dilution ratio is ${p.dilution} with clean water.` : 'Ready to use formulation.';
  const dynamicDesc = `${p.title}, manufactured by Kresko Chemicals, is a highly effective, premium-grade concentrated compound. ${dilutionRatioText} This B2B formulation provides excellent active cleaning efficiency, long-lasting aroma stability, and reliable surface compatibility. Designed to reduce transportation costs and warehouse space requirements significantly.`;

  return {
    ...p,
    image: finalImage,
    images,
    desc: p.desc || dynamicDesc,
    applicationsList,
    features: [
      { title: 'B2B High Concentration', desc: `Specifically formulated for high dilution up to ${p.dilution} with water for maximum economic value.` },
      { title: 'Homogeneous Stability', desc: 'Maintains uniform viscosity, color dispersion, and fragrance suspension during long-term storage.' },
      { title: 'Optimized Logistics Footprint', desc: 'Reduces freight, drum, and warehouse handling expenses by over 80% compared to ready liquids.' },
      { title: 'Surface & Skin Safety', desc: cat.includes('personal') ? 'Enriched with skin conditioners and glycerin to prevent dryness and maintain soft hands.' : 'Surface-safe surfactant blend that strips grease and dirt without damaging tiles, marble, or paint.' }
    ],
    specsTable: [
      { param: 'Physical Form', value: physicalForm },
      { param: 'Chemical Composition', value: chemicalComposition },
      { param: 'pH Value', value: phValue },
      { param: 'Odor', value: odor },
      { param: 'Appearance', value: appearance },
      { param: 'Grade', value: 'Industrial / Commercial / Household Grade' },
      { param: 'Packaging Options', value: packagingOptions },
      { param: 'FOB Port', value: 'Ahmedabad / Mundra Port, India' },
      { param: 'Sample Available', value: 'Yes (Free sample on request)' },
      { param: 'Supply Ability', value: '25,000 Kg Per Week' },
      { param: 'Delivery Time', value: '7 - 10 Business Days' },
      { param: 'Payment Terms', value: 'Cash Advance (CA), Cash in Advance (CID), LC' },
      { param: 'Main Export Market(s)', value: 'Asia, Middle East, Africa, Europe, North America, Australia' },
      { param: 'Brand Name', value: 'KRESKO' }
    ]
  };
}

/// B2B Concentrates database matching Tab 4 layout
const DEFAULT_PRODUCTS = [];

// Reviews database
const DEFAULT_REVIEWS = [
  { id: 'rev-1', name: 'Rajesh Mehta', role: 'Director, CleanCo India', quote: 'Kresko Chemicals has cut our chemical freight rates by 80%. Their White Phenyl 30X concentrate is highly stable, milky, and has excellent fragrance retention.' },
  { id: 'rev-2', name: 'Amit Sharma', role: 'Purchasing Head, Apex Facilities', quote: 'The Toilet Cleaner 6X compound handles scaling beautifully. Our localized mixing plants have saved enormous carbon overheads. Highly recommended for commercial clients.' },
  { id: 'rev-3', name: 'Vikram Singh', role: 'Founder, EcoWash Products', quote: 'Our private brand hand washes are formulated exclusively using Kresko bases. Consistency is batch-perfect, and their lab team customize viscosity levels on demand.' }
];

// Blog posts
const DEFAULT_BLOGS = [
  {
    id: 'dilution-science',
    title: 'The Chemistry of High-Dilution Cleaners',
    date: 'July 15, 2026',
    image: '/images/photo-1519668963014-2308b08e5e9b.jpeg',
    desc: 'How polymeric thickeners and secondary surfactants prevent concentrate separation during large-scale dilution.',
    content: 'Diluting chemical concentrates requires careful attention to water mineral levels, mixing speeds, and formulation balancing. At Kresko Chemicals, our compound bases utilize advanced secondary surfactants that prevent clouding and separation during high ratios, ensuring that finished products remain stable, colorful, and aromatic even after diluting up to 30X. This guide outlines the chemical interactions during compound compounding and the step-by-step blending protocol for distributors.'
  },
  {
    id: 'safe-packaging',
    title: 'Corrosion Prevention in Concentrate Storage',
    date: 'June 28, 2026',
    image: '/images/photo-1528218609959-006f98e6b79e.jpeg',
    desc: 'Selecting proper HDPE drum grades and storage configurations for acidic and cationic surfactant concentrates.',
    content: 'Storing high-strength chemical concentrates like Acid Thickeners or toilet wash bases requires specific material selections to prevent degradation of containment vessels. This report details why high-density polyethylene (HDPE) with fluorinated barriers is the global gold standard for shipping concentrates, preventing gas permeation, stress cracking, and compound discoloration over extended warehouse storage windows.'
  }
];

const LOCAL_STORAGE_PRODUCTS = 'packcraft_products';
const LOCAL_STORAGE_REVIEWS = 'packcraft_reviews';
const LOCAL_STORAGE_BLOGS = 'packcraft_blogs';
const LOCAL_STORAGE_ENQUIRIES = 'packcraft_enquiries';

// Database version string to force clear localStorage if updated
const DATA_VERSION_KEY = 'kresko_data_version';
const CURRENT_DATA_VERSION = 'v17-pure-backend-sync';

function checkAndSeedDatabase() {
  const seededVersion = localStorage.getItem(DATA_VERSION_KEY);
  if (seededVersion !== CURRENT_DATA_VERSION) {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    localStorage.setItem(LOCAL_STORAGE_BLOGS, JSON.stringify(DEFAULT_BLOGS));
    localStorage.removeItem('kresko_categories'); // Force reset to load the 14 new categories mapping!
    localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
    if (!localStorage.getItem(LOCAL_STORAGE_ENQUIRIES)) {
      localStorage.setItem(LOCAL_STORAGE_ENQUIRIES, JSON.stringify([]));
    }
  }
}

// Ensure database is seeded on script evaluation
checkAndSeedDatabase();

export function getProducts() {
  checkAndSeedDatabase();
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRODUCTS)) || DEFAULT_PRODUCTS;
  } catch (e) {
    return DEFAULT_PRODUCTS;
  }
}

export function saveProduct(product) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  const newProduct = populateProductDetails({
    ...product,
    id: product.id || `custom-${Date.now()}`
  });

  if (index >= 0) {
    products[index] = newProduct;
  } else {
    products.push(newProduct);
  }
  localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(products));
  return newProduct;
}

export function deleteProduct(id) {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(filtered));
  return true;
}

export function getReviews() {
  checkAndSeedDatabase();
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_REVIEWS)) || DEFAULT_REVIEWS;
  } catch (e) {
    return DEFAULT_REVIEWS;
  }
}

export function saveReview(review) {
  const reviews = getReviews();
  const newReview = {
    ...review,
    id: review.id || `rev-${Date.now()}`,
    avatar: review.avatar || ''
  };
  reviews.unshift(newReview);
  localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(reviews));
  return newReview;
}

export function deleteReview(id) {
  const reviews = getReviews();
  const filtered = reviews.filter(r => r.id !== id);
  localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(filtered));
  return true;
}

export function getBlogs() {
  checkAndSeedDatabase();
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_BLOGS)) || DEFAULT_BLOGS;
  } catch (e) {
    return DEFAULT_BLOGS;
  }
}

export function saveBlog(blog) {
  const blogs = getBlogs();
  const newBlog = {
    ...blog,
    id: blog.id || `blog-${Date.now()}`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  };
  blogs.unshift(newBlog);
  localStorage.setItem(LOCAL_STORAGE_BLOGS, JSON.stringify(blogs));
  return newBlog;
}

export function deleteBlog(id) {
  const blogs = getBlogs();
  const filtered = blogs.filter(b => b.id !== id);
  localStorage.setItem(LOCAL_STORAGE_BLOGS, JSON.stringify(filtered));
  return true;
}

export function getEnquiries() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_ENQUIRIES)) || [];
  } catch (e) {
    return [];
  }
}

export async function saveEnquiry(enquiry) {
  const enquiries = getEnquiries();
  const newEnquiry = {
    ...enquiry,
    id: `enq-${Date.now()}`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  };
  enquiries.unshift(newEnquiry);
  localStorage.setItem(LOCAL_STORAGE_ENQUIRIES, JSON.stringify(enquiries));

  // Send POST request to backend via centralized API client
  try {
    const payload = {
      fullName: enquiry.fullName || enquiry.name || 'Anonymous Inquiry',
      businessEmail: enquiry.businessEmail || enquiry.email || 'noemail@kresko.com',
      phone: enquiry.phone || enquiry.mobile || 'N/A',
      company: enquiry.company || 'Direct Client',
      productInterest: enquiry.productInterest || enquiry.machineType || enquiry.formulation || 'General Cleaning Concentrate Inquiry',
      message: enquiry.message || enquiry.desc || enquiry.state || 'General B2B Product Inquiry'
    };

    const resData = await inquiryApi.send(payload);
    console.log('Inquiry successfully saved to backend database! Response:', resData);
  } catch (err) {
    console.warn('Backend inquiry API request error:', err.message || err);
  }

  return newEnquiry;
}

export async function deleteEnquiry(id) {
  const enquiries = getEnquiries();
  const filtered = enquiries.filter(item => item.id !== id && item._id !== id);
  localStorage.setItem(LOCAL_STORAGE_ENQUIRIES, JSON.stringify(filtered));

  // Delete from backend via centralized API client (auth handled by interceptor)
  try {
    await inquiryApi.delete(id);
    console.log(`Inquiry ${id} successfully deleted from backend database.`);
  } catch (e) {
    console.warn('Backend inquiry delete API error:', e.message || e);
  }

  return filtered;
}

export function getAdminPassword() {
  return localStorage.getItem('admin_pwd') || 'admin123';
}

export function saveAdminPassword(pwd) {
  localStorage.setItem('admin_pwd', pwd);
  return true;
}

export function getAdminSecurity() {
  try {
    const data = localStorage.getItem('admin_security_data');
    return data ? JSON.parse(data) : { question: 'What is Kresko primary location?', answer: 'ahmedabad' };
  } catch (e) {
    return { question: 'What is Kresko primary location?', answer: 'ahmedabad' };
  }
}

export function saveAdminSecurity(data) {
  localStorage.setItem('admin_security_data', JSON.stringify(data));
  return true;
}

export function getProductCategories() {
  const stored = localStorage.getItem('kresko_categories');
  let cats = PRODUCT_CATEGORIES;
  if (stored) {
    try {
      cats = JSON.parse(stored);
    } catch (e) {
      cats = PRODUCT_CATEGORIES;
    }
  }
  const cleaned = {};
  Object.entries(cats).forEach(([key, val]) => {
    if (key && key.trim() !== '' && val && val.name && val.name.trim() !== '') {
      cleaned[key] = val;
    }
  });
  return cleaned;
}

export function saveProductCategories(categories) {
  const cleaned = {};
  Object.entries(categories).forEach(([key, val]) => {
    if (key && key.trim() !== '' && val && val.name && val.name.trim() !== '') {
      cleaned[key] = val;
    }
  });
  localStorage.setItem('kresko_categories', JSON.stringify(cleaned));
  window.dispatchEvent(new Event('categoriesUpdated'));
}

export async function syncCategoriesWithBackend() {
  try {
    const data = await categoriesApi.getAll();
    if (data) {
        // Start with default hardcoded categories
        const parsed = { ...PRODUCT_CATEGORIES };
        
        // Merge with existing local storage (custom local categories)
        const localCats = getProductCategories();
        Object.entries(localCats).forEach(([key, val]) => {
          parsed[key] = {
            ...parsed[key],
            ...val,
            subcategories: {
              ...(parsed[key] ? parsed[key].subcategories : {}),
              ...(val.subcategories || {})
            }
          };
        });

        // Merge with backend API categories
        // Backend returns: { categoryName, uniqueKey, categoryImage, _id }
        if (Array.isArray(data)) {
          data.forEach(item => {
            const key = item.uniqueKey || item.key || (item._id ? item._id : '');
            if (item && key) {
              parsed[key] = {
                ...parsed[key],
                name: item.categoryName || item.name || (parsed[key] ? parsed[key].name : ''),
                icon: item.categoryImage || item.icon || (parsed[key] ? parsed[key].icon : 'fa-sparkles'),
                _id: item._id || (parsed[key] ? parsed[key]._id : ''),
                subcategories: {
                  ...(parsed[key] ? parsed[key].subcategories : {}),
                  ...(item.subcategories || {})
                }
              };
            }
          });
        } else if (typeof data === 'object' && data !== null) {
          Object.entries(data).forEach(([key, val]) => {
            parsed[key] = {
              ...parsed[key],
              name: val.categoryName || val.name || (parsed[key] ? parsed[key].name : ''),
              icon: val.categoryImage || val.icon || (parsed[key] ? parsed[key].icon : 'fa-sparkles'),
              _id: val._id || (parsed[key] ? parsed[key]._id : ''),
              subcategories: {
                ...(parsed[key] ? parsed[key].subcategories : {}),
                ...(val.subcategories || {})
              }
            };
          });
        }

        saveProductCategories(parsed);
        return parsed;
    }
  } catch (err) {
    console.warn('Backend categories sync failed:', err.message || err);
  }
  return null;
}

export async function syncProductsWithBackend() {
  try {
    const data = await productsApi.getAll();
    const productList = Array.isArray(data) ? data : (data.products || []);

    const mapped = productList.map(bp => {
      const imageUrl = resolveImageUrl(bp.image);
      return {
        id: bp._id || bp.id || `backend-${Date.now()}`,
        _id: bp._id,
        title: bp.name || bp.title || 'Concentrated Chemical Formulation',
        name: bp.name || bp.title,
        category: bp.category || 'home-care',
        price: bp.price ? `Rs. ${bp.price} / Kg` : 'Rs. 180 / Kg',
        image: imageUrl,
        images: [imageUrl],
        desc: bp.description || bp.desc || 'High activity industrial chemical concentrate formulation.',
        dilution: bp.dilution || '1 + 5',
        minPack: bp.minPack || '30 Kg',
        rateAfter: bp.rateAfter || 'Rs. 30.00 / Litre'
      };
    });

    localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(mapped));
    return mapped;
  } catch (err) {
    console.warn('Backend products sync failed:', err.message || err);
  }
  return null;
}
