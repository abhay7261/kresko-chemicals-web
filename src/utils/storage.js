// Centralized API configuration
import {
  inquiryApi,
  categoriesApi,
  productsApi,
  resolveImageUrl,
} from './api';

// ─────────────────────────────────────────────────────────────
//  Product Category & Subcategory Hierarchy
//  These defaults give the site instant catalog data on first load.
//  The backend sync (syncCategoriesWithBackend) merges API data on top
//  of this base so admins can extend or override from the dashboard.
// ─────────────────────────────────────────────────────────────
export const PRODUCT_CATEGORIES = {
  'home-care': {
    name: 'Home Care Concentrates',
    icon: 'fa-home-wind',
    image: '/images/home_care_bg.png',
    desc: 'Dilutable all-purpose cleaners, glass shiners, and kitchen degreasers for everyday household and light commercial cleaning.',
    subcategories: {
      'all-purpose': 'All-Purpose Cleaner',
      'glass-shine': 'Glass & Surface Shine',
      'kitchen-degreaser': 'Kitchen Degreaser'
    }
  },
  'personal-care': {
    name: 'Personal Care Concentrates',
    icon: 'fa-hand-holding-heart',
    image: '/images/personal_care_bg.png',
    desc: 'Concentrated hand washes, shampoos, and body washes enriched with skin-conditioning agents and premium fragrance retention.',
    subcategories: {
      'hand-wash': 'Hand Wash & Shampoo',
      'body-lotions': 'Body Lotions & Lather'
    }
  },
  'laundry-care': {
    name: 'Laundry & Fabric Care',
    icon: 'fa-washer-bath',
    image: '/images/laundry_care_bg.png',
    desc: 'High-load laundry detergent concentrates, fabric softeners, and oxygen-based whiteners for commercial laundries.',
    subcategories: {
      'laundry-detergent': 'Laundry Detergent Liquid',
      'fabric-softener': 'Fabric Softener Concentrate',
      'oxygen-whitener': 'Active Oxygen Whitener'
    }
  },
  'kitchen-care': {
    name: 'Kitchen Care Concentrates',
    icon: 'fa-utensils',
    image: '/images/kitchen_care_bg.png',
    desc: 'Dishwashing gel concentrates, heavy-duty degreasers, and appliance cleaners for restaurant and institutional kitchens.',
    subcategories: {
      'dishwash-gel': 'Dishwash Gel Concentrate',
      'deep-degreaser': 'Deep Kitchen Degreaser'
    }
  },
  'floor-care': {
    name: 'Floor Care Concentrates',
    icon: 'fa-mop',
    image: '/images/floor_care_bg.png',
    desc: 'Concentrated floor cleaners, phenyl disinfectants, and buffing compounds for high-traffic commercial and industrial floors.',
    subcategories: {
      'floor-cleaner': 'Floor Cleaner Concentrate',
      'white-phenyl': 'White Phenyl (MPAV)',
      'black-phenyl': 'Black Phenyl Disinfectant'
    }
  },
  'bathroom-care': {
    name: 'Bathroom & Toilet Care',
    icon: 'fa-toilet-paper',
    image: '/images/bathroom_care_bg.png',
    desc: 'Acidic and alkaline toilet bowl cleaners, bathroom sanitizers, and descaling formulations for hard water stains.',
    subcategories: {
      'toilet-cleaner': 'Toilet Cleaner Concentrate',
      'bathroom-cleaner': 'Bathroom Cleaner Spray'
    }
  },
  'glass-care': {
    name: 'Glass & Window Care',
    icon: 'fa-windshield',
    image: '/images/glass_care_bg.png',
    desc: 'Streak-free glass cleaners, window concentrates, and surface prep formulations for crystal-clear shine.',
    subcategories: {
      'glass-cleaner': 'Glass Cleaner Concentrate',
      'window-shine': 'Window Shine Solution'
    }
  },
  'car-care': {
    name: 'Car Care Concentrates',
    icon: 'fa-car',
    image: '/images/car_care_bg.png',
    desc: 'Automotive shampoos, wheel cleaners, and protective finishes safe for paint, chrome, and upholstery.',
    subcategories: {
      'car-shampoo': 'Car Wash Shampoo',
      'wheel-cleaner': 'Wheel & Tyre Cleaner',
      'wax-shine': 'Car Wax Protective Concentrate'
    }
  },
  'air-care': {
    name: 'Air Fresheners & Ambience',
    icon: 'fa-smog',
    image: '/images/air_fresheners_bg.png',
    desc: 'Fragrance concentrates, vaporizer solutions, and ambient scenting systems with long-lasting odor neutralization.',
    subcategories: {
      'air-freshener': 'Aerosol Air Freshener',
      'room-spray': 'Room & Fabric Refresh Spray',
      'vaporizer': 'Vaporizer Refill Concentrate'
    }
  },
  'pest-control': {
    name: 'Insect Repellent & Pest Control',
    icon: 'fa-bug',
    image: '/images/pest_control_bg.png',
    desc: 'Natural and synthetic insect repellents, mosquito coil blends, and crawling insect formulations for commercial use.',
    subcategories: {
      'insect-repellent': 'Insect Repellent Liquid',
      'mosquito-coil': 'Mosquito Coil Blend'
    }
  },
  'specialty-products': {
    name: 'Specialized Solutions',
    icon: 'fa-flask',
    image: '/images/specialty_products_bg.png',
    desc: 'Specialty chemicals including descalers, polishing powders, and custom OEM formulations for specific industrial applications.',
    subcategories: {
      'descaler': 'Industrial Descaler',
      'shining-powder': 'Shining Powder',
      'chemical-drum': 'Bulk Chemical Drums'
    }
  }
};

// ─────────────────────────────────────────────────────────────
//  Homepage Hero Slider Configuration
//  Persisted to localStorage so admins can edit the hero text
//  and background images from the Admin panel.
// ─────────────────────────────────────────────────────────────
const LOCAL_STORAGE_HERO_SLIDES = 'kresko_hero_slides';

const DEFAULT_HERO_SLIDES = [
  {
    image: '/images/photo-1528218609959-006f98e6b79e.jpeg',
    tag: 'B2B Chemical Concentrates',
    title: 'High-Performance Cleaning Concentrates',
    desc: 'Dilute up to 30X with plain water. Formulated for bulk repackagers, facility networks, and brand owners seeking massive freight and packaging savings.',
    overlay: true
  },
  {
    image: '/images/photo-1561383621-d109918107aa.jpeg',
    tag: 'OEM & Private Label',
    title: 'Build Your Own Cleaning Product Brand',
    desc: 'We support custom formulation development, raw compounding, safety compliance certifications, and logistics for domestic and export markets.',
    overlay: true
  },
  {
    image: '/images/photo-1503547490235-0d6d87990308.jpeg',
    tag: 'Eco-Friendly Sanitation',
    title: 'Pine Oil & Citronella Floor Concentrates',
    desc: 'Milky white phenyl PVL bases and herbal sanitizers. Powerful microbial elimination, pleasant fragrances, and natural insect repellent protection.',
    overlay: true
  }
];

/** Read the homepage hero slides (with default fallback). */
export function getHeroSlides() {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_STORAGE_HERO_SLIDES) || 'null');
    if (Array.isArray(raw) && raw.length) return raw;
  } catch (e) {
    // ignore parse errors and fall through to defaults
  }
  return DEFAULT_HERO_SLIDES;
}

/** Persist the homepage hero slides config. */
export function saveHeroSlides(slides) {
  localStorage.setItem(LOCAL_STORAGE_HERO_SLIDES, JSON.stringify(slides));
}

/** Restore the hero slides back to the original defaults. */
export function resetHeroSlides() {
  localStorage.removeItem(LOCAL_STORAGE_HERO_SLIDES);
}

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
/// Each product maps to a category key above. populateProductDetails()
/// (called on save and on read via getProducts) dynamically enriches the
/// image, applications list, features, and spec table for every entry.
const DEFAULT_PRODUCTS = [
    // --- personal-care: Hand Wash & Shampoo ---
  {
    id: 'hand-wash-concentrate-6x',
    title: 'Hand Wash Concentrate 6X Transparent',
    category: 'personal-care',
    subcategory: 'hand-wash',
    price: 'Rs. 170 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 5',
    rateAfter: 'Rs. 28.33 / Litre',
    tag: 'Bestseller',
    desc: 'Premium transparent hand wash concentrate enriched with glycerin and skin-conditioning agents. Fragranced with a clean, fresh aroma. Dilutes 6X for everyday commercial washroom use.'
  },
  {
    id: 'body-lotion-10x',
    title: 'Body Lotion Base Concentrate 10X',
    category: 'personal-care',
    subcategory: 'body-lotions',
    price: 'Rs. 150 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 9',
    rateAfter: 'Rs. 15.00 / Litre',
    desc: 'Rich, non-greasy body lotion base concentrate with moisturizing agents. Easily diluted for private-label body wash and lotion production.'
  },
  // --- home-care: All-Purpose, Glass & Surface, Kitchen Degreaser ---
  {
    id: 'all-purpose-10x',
    title: 'All-Purpose Cleaner Concentrate 10X',
    category: 'home-care',
    subcategory: 'all-purpose',
    price: 'Rs. 160 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 9',
    rateAfter: 'Rs. 16.00 / Litre',
    tag: 'Best Value',
    desc: 'Versatile alkaline all-purpose cleaner concentrate. Effective on grease, grime, and light stains. Safe for sealed surfaces, tiles, and laminates.'
  },
  {
    id: 'glass-shine-12x',
    title: 'Glass & Surface Shine 12X',
    category: 'home-care',
    subcategory: 'glass-shine',
    price: 'Rs. 180 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 11',
    rateAfter: 'Rs. 15.00 / Litre',
    desc: 'Streak-free glass and surface shine concentrate with anti-static properties. Leaves windows, mirrors, and glossy surfaces crystal clear.'
  },
  {
    id: 'kitchen-degreaser-8x',
    title: 'Light Kitchen Surface Cleaner 8X',
    category: 'home-care',
    subcategory: 'kitchen-degreaser',
    price: 'Rs. 190 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 7',
    rateAfter: 'Rs. 23.75 / Litre',
    desc: 'Light-duty kitchen surface cleaner that removes grease and food residue without damaging countertops or appliances.'
  },
  // --- laundry-care: Detergent, Fabric Softener, Oxygen Whitener ---
  {
    id: 'laundry-detergent-6x',
    title: 'Laundry Detergent Liquid 6X',
    category: 'laundry-care',
    subcategory: 'laundry-detergent',
    price: 'Rs. 165 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 5',
    rateAfter: 'Rs. 27.50 / Litre',
    tag: 'Bestseller',
    desc: 'High-activity liquid laundry detergent concentrate with stain-lifting enzymes. Ideal for commercial laundries and uniform washing.'
  },
  {
    id: 'fabric-softener-10x',
    title: 'Fabric Softener Concentrate 10X',
    category: 'laundry-care',
    subcategory: 'fabric-softener',
    price: 'Rs. 155 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 9',
    rateAfter: 'Rs. 15.50 / Litre',
    desc: 'Concentrated fabric softener with anti-static action and fresh linen fragrance. Reduces ironing time and static cling.'
  },
  {
    id: 'oxygen-whitener-4x',
    title: 'Active Oxygen Whitener Powder 4X',
    category: 'laundry-care',
    subcategory: 'oxygen-whitener',
    price: 'Rs. 200 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 3',
    rateAfter: 'Rs. 50.00 / Litre',
    desc: 'Powdered active oxygen bleach concentrate that brightens whites and removes organic stains without chlorine damage.'
  },
  // --- kitchen-care: Dishwash Gel, Deep Degreaser ---
  {
    id: 'dishwash-gel-15x',
    title: 'Dishwash Gel Concentrate 15X',
    category: 'kitchen-care',
    subcategory: 'dishwash-gel',
    price: 'Rs. 175 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 14',
    rateAfter: 'Rs. 11.67 / Litre',
    desc: 'High-foaming dishwashing gel concentrate for commercial dish pits and restaurant kitchens. Cuts grease and food residue effectively.'
  },
  {
    id: 'deep-kitchen-degreaser-8x',
    title: 'Deep Kitchen Degreaser 8X',
    category: 'kitchen-care',
    subcategory: 'deep-degreaser',
    price: 'Rs. 195 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 7',
    rateAfter: 'Rs. 24.38 / Litre',
    desc: 'Heavy-duty alkaline degreaser for removing baked-on grease from ovens, grills, and extraction hoods.'
  },
    // --- floor-care: Floor Cleaner, White Phenyl, Black Phenyl ---
  {
    id: 'floor-cleaner-20x',
    title: 'Premium Floor Cleaner 20X',
    category: 'floor-care',
    subcategory: 'floor-cleaner',
    price: 'Rs. 140 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 19',
    rateAfter: 'Rs. 7.00 / Litre',
    desc: 'Low-foaming neutral floor cleaner concentrate for daily maintenance mopping on vinyl, epoxy, and sealed hard floors.'
  },
  {
    id: 'white-phenyl-30x',
    title: 'White Phenyl Concentrate 30X (MPAV)',
    category: 'floor-care',
    subcategory: 'white-phenyl',
    price: 'Rs. 180 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 29',
    rateAfter: 'Rs. 6.00 / Litre',
    tag: 'Bestseller',
    desc: 'Milky white phenyl concentrate with pine fragrance and MPAV base. Powerful disinfecting and deodorizing for floors.'
  },
  {
    id: 'black-phenyl-14x',
    title: 'Black Phenyl Disinfectant 14X',
    category: 'floor-care',
    subcategory: 'black-phenyl',
    price: 'Rs. 200 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 13',
    rateAfter: 'Rs. 14.29 / Litre',
    desc: 'Dark black phenyl disinfectant concentrate with strong antimicrobial action for deep cleaning commercial floors.'
  },
  // --- bathroom-care: Toilet Cleaner, Bathroom Cleaner ---
  {
    id: 'toilet-cleaner-6x',
    title: 'Toilet Cleaner 6X Concentrate',
    category: 'bathroom-care',
    subcategory: 'toilet-cleaner',
    price: 'Rs. 220 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 5',
    rateAfter: 'Rs. 36.67 / Litre',
    desc: 'Acidic toilet bowl cleaner concentrate that dissolves limescale and rust stains. Effective against hard water deposits.'
  },
  {
    id: 'bathroom-cleaner-10x',
    title: 'Bathroom Cleaner Spray 10X',
    category: 'bathroom-care',
    subcategory: 'bathroom-cleaner',
    price: 'Rs. 190 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 9',
    rateAfter: 'Rs. 19.00 / Litre',
    desc: 'Multi-surface bathroom cleaner that removes soap scum, hard water stains, and mildew from tiles and shower screens.'
  },
  // --- glass-care: Glass Cleaner, Window Shine ---
  {
    id: 'glass-cleaner-15x',
    title: 'Streak-Free Glass Cleaner 15X',
    category: 'glass-care',
    subcategory: 'glass-cleaner',
    price: 'Rs. 165 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 14',
    rateAfter: 'Rs. 10.36 / Litre',
    tag: 'Best Value',
    desc: 'Ammonia-free glass cleaner concentrate with anti-fog technology. Leaves no streaks or residue on windows and mirrors.'
  },
  {
    id: 'window-shine-12x',
    title: 'Window Shine Solution 12X',
    category: 'glass-care',
    subcategory: 'window-shine',
    price: 'Rs. 170 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 11',
    rateAfter: 'Rs. 14.17 / Litre',
    desc: 'Premium window cleaning concentrate with surfactants that lift dirt and leave a sparkling, smear-free finish.'
  },
  // --- car-care: Car Shampoo, Wheel Cleaner, Car Wax ---
  {
    id: 'car-shampoo-10x',
    title: 'Car Wash Shampoo 10X',
    category: 'car-care',
    subcategory: 'car-shampoo',
    price: 'Rs. 170 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 9',
    rateAfter: 'Rs. 17.00 / Litre',
    desc: 'pH-neutral car wash shampoo concentrate that safely removes dirt without stripping wax. Produces rich, clingy foam.'
  },
  {
    id: 'wheel-cleaner-8x',
    title: 'Wheel & Tyre Cleaner 8X',
    category: 'car-care',
    subcategory: 'wheel-cleaner',
    price: 'Rs. 210 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 7',
    rateAfter: 'Rs. 26.25 / Litre',
    desc: 'Specialized wheel and tyre cleaner that dissolves brake dust, road salt, and baked-on grime from alloy wheels.'
  },
  {
    id: 'car-wax-6x',
    title: 'Car Wax Protective Concentrate 6X',
    category: 'car-care',
    subcategory: 'wax-shine',
    price: 'Rs. 250 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 5',
    rateAfter: 'Rs. 41.67 / Litre',
    tag: 'Premium',
    desc: 'Carnauba wax protective concentrate providing deep gloss, hydrophobic protection, and UV resistance for painted surfaces.'
  },
    // --- air-care: Air Freshener, Room Spray, Vaporizer ---
  {
    id: 'air-freshener-8x',
    title: 'Aerosol Air Freshener Base 8X',
    category: 'air-care',
    subcategory: 'air-freshener',
    price: 'Rs. 190 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 7',
    rateAfter: 'Rs. 23.75 / Litre',
    desc: 'Concentrated air freshener base for aerosol filling lines. Available in multiple fragrance options with long-lasting odor coverage.'
  },
  {
    id: 'room-spray-12x',
    title: 'Room & Fabric Refresh Spray 12X',
    category: 'air-care',
    subcategory: 'room-spray',
    price: 'Rs. 175 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 11',
    rateAfter: 'Rs. 14.58 / Litre',
    desc: 'Room and fabric refresher concentrate that eliminates odors and leaves a light, pleasant fragrance.'
  },
  {
    id: 'vaporizer-10x',
    title: 'Vaporizer Refill Concentrate 10X',
    category: 'air-care',
    subcategory: 'vaporizer',
    price: 'Rs. 185 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 9',
    rateAfter: 'Rs. 18.50 / Litre',
    desc: 'High-concentration vaporizer refill solution for reed diffusers and electric warmers. Provides 8-12 hours of ambient scenting.'
  },
  // --- pest-control: Insect Repellent, Mosquito Coil ---
  {
    id: 'insect-repellent-5x',
    title: 'Natural Insect Repellent Liquid 5X',
    category: 'pest-control',
    subcategory: 'insect-repellent',
    price: 'Rs. 220 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 4',
    rateAfter: 'Rs. 44.00 / Litre',
    desc: 'Plant-based insect repellent concentrate with citronella, lemongrass, and eucalyptus oils. Effective against mosquitoes.'
  },
  {
    id: 'mosquito-coil-blend',
    title: 'Mosquito Coil Blend Concentrate',
    category: 'pest-control',
    subcategory: 'mosquito-coil',
    price: 'Rs. 200 / Kg',
    minPack: '30 Kg',
    dilution: 'Ready to Use (RTU)',
    rateAfter: 'Rs. 200.00 / Litre',
    desc: 'Concentrated blend for manufacturing mosquito coils. Combines pyrethroid actives with natural repellent oils.'
  },
  // --- specialty-products: Descaler, Shining Powder, Bulk Drums ---
  {
    id: 'industrial-descaler-5x',
    title: 'Industrial Descaler 5X',
    category: 'specialty-products',
    subcategory: 'descaler',
    price: 'Rs. 250 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 4',
    rateAfter: 'Rs. 50.00 / Litre',
    tag: 'Premium',
    desc: 'Phosphoric acid-based industrial descaler. Removes limescale, rust, and mineral deposits from boilers and heat exchangers.'
  },
  {
    id: 'shining-powder-3x',
    title: 'Rapid Shine Polishing Powder 3X',
    category: 'specialty-products',
    subcategory: 'shining-powder',
    price: 'Rs. 280 / Kg',
    minPack: '30 Kg',
    dilution: '1 + 2',
    rateAfter: 'Rs. 93.33 / Litre',
    desc: 'Fine polishing powder concentrate for buffing and shining hard floors, marble, and stainless steel to a high gloss.'
  },
  {
    id: 'bulk-drum-200l',
    title: 'Bulk Industrial Chemical Drum 200L',
    category: 'specialty-products',
    subcategory: 'chemical-drum',
    price: 'Rs. 130 / Kg',
    minPack: '200 Kg',
    dilution: 'Ready to Use (RTU)',
    rateAfter: 'Rs. 130.00 / Litre',
    desc: 'Pre-formulated bulk chemical solution supplied in 200-litre polyethylene drums for industrial applications.'
  }
];

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
const LOCAL_STORAGE_CATALOGS = 'kresko_catalogs';

// Database version string to force clear localStorage if updated
const DATA_VERSION_KEY = 'kresko_data_version';
const CURRENT_DATA_VERSION = 'v18-default-catalog';

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

// ─────────────────────────────────────────────────────────────
//  Corporate Catalog (multi) helpers
//  Catalogs are stored as an array so admins can ADD multiple
//  catalog PDFs/links instead of replacing a single one.
// ─────────────────────────────────────────────────────────────
export function getStoredCatalogs() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CATALOGS);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredCatalog(catalog) {
  const list = getStoredCatalogs();
  const idx = list.findIndex((c) => c && c.id === catalog.id);
  const next = [...list];
  if (idx >= 0) {
    next[idx] = catalog;
  } else {
    next.push(catalog);
  }
  // Guard against blowing past the localStorage quota (large embedded PDFs).
  // Keep as many as fit, always retaining the newest entry.
  let saved = false;
  try {
    localStorage.setItem(LOCAL_STORAGE_CATALOGS, JSON.stringify(next));
    saved = true;
  } catch (e) {
    /* quota exceeded – drop oldest until it fits */
  }
  if (!saved) {
    for (let i = 0; i < next.length - 1; i++) {
      try {
        localStorage.setItem(LOCAL_STORAGE_CATALOGS, JSON.stringify(next.slice(i)));
        saved = true;
        break;
      } catch (e2) {
        /* keep dropping */
      }
    }
  }
  return next;
}

export function removeStoredCatalog(id) {
  const next = getStoredCatalogs().filter((c) => c && c.id !== id);
  localStorage.setItem(LOCAL_STORAGE_CATALOGS, JSON.stringify(next));
  return next;
}

export function getProducts() {
  checkAndSeedDatabase();
  try {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRODUCTS)) || DEFAULT_PRODUCTS;
    // Enrich any products that haven't been through populateProductDetails yet
    // (e.g. freshly seeded defaults or backend products) so spec tables, feature
    // lists and dynamic images are always available to ProductDetail / list views.
    return stored.map(p => (p && p.specsTable ? p : populateProductDetails(p)));
  } catch (e) {
    return DEFAULT_PRODUCTS.map(p => populateProductDetails(p));
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
    // New products are prepended so the latest addition appears FIRST in the
    // product lists (queue / newest-first order).
    products.unshift(newProduct);
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

        // Merge backend products with existing local/default products so that
    // curated defaults are preserved when the backend returns an empty list.
    // Backend products take precedence (overwrite by ID); local defaults fill
    // any gaps.  This ensures the catalog is never wiped by an empty response.
    const existingRaw = localStorage.getItem(LOCAL_STORAGE_PRODUCTS);
    let existing = DEFAULT_PRODUCTS;
    if (existingRaw) {
      try { existing = JSON.parse(existingRaw); } catch { existing = DEFAULT_PRODUCTS; }
    }

    const byId = {};
    existing.forEach(p => { if (p && p.id) byId[p.id] = p; });
    mapped.forEach(bp => { byId[bp.id] = bp; });
    const merged = Object.values(byId);

    localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.warn('Backend products sync failed:', err.message || err);
    // Fall back to whatever is already in localStorage (defaults if seeded)
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_PRODUCTS);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return DEFAULT_PRODUCTS;
  }
}
