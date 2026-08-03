import React from 'react';

/**
 * Dynamic SVG Product Visual Generator for Kresko Chemicals
 * Renders custom 3D-shaded vector bottle/canister based on category, title, and product specifications.
 */
export default function ProductImage({ category, title, image, style }) {
  const pTitle = (title || '').toLowerCase();

  // 0. Resolve to photorealistic generated image if no image path is passed
  let finalImage = image;
  if (!finalImage || finalImage.trim() === '') {
    const cat = (category || '').toLowerCase();
    if (cat.includes('floor')) {
      if (pTitle.includes('phenyl') || pTitle.includes('black') || pTitle.includes('pvl') || pTitle.includes('psv') || pTitle.includes('pscv')) {
        finalImage = '/images/products/white_phenyl_drum.png';
      } else {
        finalImage = '/images/products/floor_cleaner_purple.png';
      }
    } else if (cat.includes('personal')) {
      finalImage = '/images/products/handwash_pink.png';
    } else if (cat.includes('laundry')) {
      finalImage = '/images/products/laundry_detergent_blue.png';
    } else if (cat.includes('kitchen')) {
      finalImage = '/images/products/dishwash_gel_yellow.png';
    } else if (cat.includes('bathroom') || cat.includes('toilet') || pTitle.includes('toilet')) {
      finalImage = '/images/products/toilet_cleaner_blue.png';
    } else if (cat.includes('pest') || cat.includes('air') || cat.includes('glass')) {
      finalImage = '/images/products/spray_bottle_repellent.png';
    } else if (cat.includes('car')) {
      finalImage = '/images/products/car_shampoo_orange.png';
    } else {
      finalImage = '/images/products/chemical_drum_white.png';
    }
  }

  if (finalImage && finalImage.trim() !== '') {
    const defaultStyle = { width: '100%', height: '100%', display: 'block', objectFit: 'contain', ...style };
    return <img src={finalImage} alt={title || 'Product'} style={defaultStyle} className="product-image-static" />;
  }
  
  // 1. Determine liquid and bottle color gradients based on names and categories
  let liquidStart = '#3b82f6'; // Default blue
  let liquidEnd = '#1d4ed8';
  let capColor = '#1e293b';
  let shapeType = 'canister'; // canister, pump, spray, squeeze, jar, shaker

  const cat = (category || '').toLowerCase();

  // Set default color and shape based on Category first
  if (cat.includes('glass')) {
    liquidStart = '#38bdf8'; // Sky blue
    liquidEnd = '#0284c7';
    capColor = '#0369a1';
    shapeType = 'spray';
  } else if (cat.includes('car')) {
    liquidStart = '#f97316'; // Orange
    liquidEnd = '#ea580c';
    capColor = '#1e293b';
    shapeType = pTitle.includes('shampoo') ? 'canister' : 'spray';
  } else if (cat.includes('air')) {
    liquidStart = '#ec4899'; // Lavender / rose
    liquidEnd = '#be185d';
    capColor = '#64748b';
    shapeType = pTitle.includes('cake') ? 'jar' : 'spray';
  } else if (cat.includes('pest') || cat.includes('insect') || cat.includes('bug')) {
    liquidStart = '#f43f5e'; // Warning red
    liquidEnd = '#be123c';
    capColor = '#1e293b';
    shapeType = 'spray';
  } else if (cat.includes('special')) {
    liquidStart = '#10b981'; // Emerald Green
    liquidEnd = '#047857';
    capColor = '#065f46';
    shapeType = pTitle.includes('powder') ? 'shaker' : 'canister';
  } else if (cat.includes('hotel') || cat.includes('amenities')) {
    liquidStart = '#fbbf24'; // Amber Gold
    liquidEnd = '#d97706';
    capColor = '#78350f';
    shapeType = 'pump';
  } else if (cat.includes('personal')) {
    liquidStart = '#f472b6'; // Pink
    liquidEnd = '#db2777';
    capColor = '#9d174d';
    shapeType = pTitle.includes('powder') ? 'shaker' : 'pump';
  } else if (cat.includes('laundry')) {
    liquidStart = '#60a5fa'; // Clean light blue
    liquidEnd = '#2563eb';
    capColor = '#1d4ed8';
    shapeType = 'canister';
  } else if (cat.includes('floor')) {
    liquidStart = '#8b5cf6'; // Violet
    liquidEnd = '#6d28d9';
    capColor = '#4c1d95';
    shapeType = pTitle.includes('glass') ? 'spray' : 'canister';
  } else if (cat.includes('bathroom') || cat.includes('toilet') || pTitle.includes('toilet')) {
    liquidStart = '#06b6d4'; // Deep cyan
    liquidEnd = '#0891b2';
    capColor = '#0f172a';
    shapeType = 'squeeze';
  }

  // 2. Keyword overrides (specific scents/liquids)
  if (pTitle.includes('rose')) {
    liquidStart = '#ec4899'; // Pink
    liquidEnd = '#be185d';
    capColor = '#db2777';
  } else if (pTitle.includes('strawberry')) {
    liquidStart = '#f43f5e'; // Rose-red
    liquidEnd = '#be123c';
    capColor = '#e11d48';
  } else if (pTitle.includes('sandal')) {
    liquidStart = '#d97706'; // Amber
    liquidEnd = '#92400e';
    capColor = '#b45309';
  } else if (pTitle.includes('aqua') || pTitle.includes('blue')) {
    liquidStart = '#06b6d4'; // Cyan/blue
    liquidEnd = '#0891b2';
    capColor = '#0284c7';
  } else if (pTitle.includes('lemon') || pTitle.includes('citrus')) {
    liquidStart = '#eab308'; // Yellow
    liquidEnd = '#ca8a04';
    capColor = '#a16207';
  } else if (pTitle.includes('citronella') || pTitle.includes('grass') || pTitle.includes('green')) {
    liquidStart = '#10b981'; // Green
    liquidEnd = '#047857';
    capColor = '#059669';
  } else if (pTitle.includes('lavender') || pTitle.includes('purple') || pTitle.includes('violet')) {
    liquidStart = '#8b5cf6'; // Violet
    liquidEnd = '#6d28d9';
    capColor = '#7c3aed';
  } else if (pTitle.includes('white phenyl') || pTitle.includes('pvl') || pTitle.includes('psv') || pTitle.includes('pscv')) {
    liquidStart = '#f8fafc'; // Milky white
    liquidEnd = '#cbd5e1';
    capColor = '#475569';
  } else if (pTitle.includes('black phenyl')) {
    liquidStart = '#475569'; // Dark grey/black
    liquidEnd = '#0f172a';
    capColor = '#020617';
  } else if (pTitle.includes('shining') || pTitle.includes('glow') || pTitle.includes('powder')) {
    liquidStart = '#cbd5e1'; // Silver/metallic
    liquidEnd = '#94a3b8';
    capColor = '#dc2626'; // Red cap for shine
    shapeType = 'shaker';
  } else if (pTitle.includes('repellent') || pTitle.includes('mosquito') || pTitle.includes('spray') || pTitle.includes('insect')) {
    liquidStart = '#ef4444'; // Safety red
    liquidEnd = '#991b1b';
    capColor = '#ef4444';
    shapeType = 'spray';
  } else if (pTitle.includes('car') || pTitle.includes('polish') || pTitle.includes('wax')) {
    liquidStart = '#f97316'; // Orange
    liquidEnd = '#ea580c';
    capColor = '#1e3a8a';
  }

  // Common styles
  const defaultStyle = { width: '100%', height: '100%', display: 'block', ...style };

  // Render SVG based on shapeType
  switch (shapeType) {
    case 'pump': // Soap/Shampoo pump bottle
      return (
        <svg viewBox="0 0 200 240" style={defaultStyle} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`liq-${title}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={liquidStart} />
              <stop offset="70%" stopColor={liquidEnd} />
              <stop offset="100%" stopColor={liquidStart} />
            </linearGradient>
            <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          
          {/* Shadows */}
          <ellipse cx="100" cy="225" rx="55" ry="10" fill="#e2e8f0" />
          
          {/* Pump Nozzle Mechanism */}
          <path d="M90 35 h20 v10 h-20 z" fill="#64748b" />
          <path d="M97 18 h6 v17 h-6 z" fill="#475569" />
          <path d="M85 10 h20 c8 0 10 5 10 10 h-8 c0-3-4-4-7-4 h-15 z" fill={capColor} />
          <path d="M73 14 h15 v4 h-15 z" fill={capColor} />
          
          {/* Bottle Neck */}
          <rect x="84" y="45" width="32" height="20" rx="2" fill="#cbd5e1" />
          <rect x="80" y="58" width="40" height="6" fill={capColor} />
          
          {/* Liquid content */}
          <path d="M60 85 C60 70 140 70 140 85 L145 200 C145 215 55 215 55 200 Z" fill={`url(#liq-${title})`} opacity="0.85" />
          <ellipse cx="100" cy="80" rx="39" ry="8" fill={liquidStart} opacity="0.9" />

          {/* Bottle Outer Shell */}
          <path d="M58 85 C58 68 142 68 142 85 L148 200 C148 220 52 220 52 200 Z" fill="url(#glass)" stroke="#e2e8f0" strokeWidth="2" />
          
          {/* Centered Branded Label */}
          <rect x="62" y="110" width="76" height="65" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          
          {/* Centered Logo */}
          <path d="M92 122 L100 117 L108 122 L100 128 Z" fill="#1b2a47" />
          <path d="M92 117 L100 122 L108 117" fill="none" stroke="#dc2626" strokeWidth="1.5" />
          
          <text x="100" y="138" textAnchor="middle" fontFamily="sans-serif" fontSize="7.5" fontWeight="bold" fill="#1b2a47">KRESKO</text>
          <text x="100" y="148" textAnchor="middle" fontFamily="sans-serif" fontSize="5.5" fontWeight="bold" fill="#dc2626" letterSpacing="0.8">CONCENTRATE</text>
          
          {/* Centered Product title */}
          <text x="100" y="160" textAnchor="middle" fontFamily="sans-serif" fontSize="5.2" fontWeight="600" fill="#475569">
            {title.substring(0, 18)}...
          </text>
          
          {/* Reflection highlights */}
          <path d="M63 90 L67 195" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
          <path d="M137 90 L134 195" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
        </svg>
      );
      
    case 'canister': // Commercial cleaning canister/jerrycan
      return (
        <svg viewBox="0 0 200 240" style={defaultStyle} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`liq-${title}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={liquidStart} />
              <stop offset="80%" stopColor={liquidEnd} />
              <stop offset="100%" stopColor={liquidStart} />
            </linearGradient>
            <linearGradient id="canister-body" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
              <stop offset="40%" stopColor="#f1f5f9" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Shadow */}
          <ellipse cx="100" cy="225" rx="70" ry="12" fill="#cbd5e1" opacity="0.8" />
          
          {/* Canister Cap */}
          <rect x="75" y="15" width="26" height="12" fill={capColor} rx="2" />
          <rect x="73" y="27" width="30" height="4" fill="#475569" />
          
          {/* Canister Handle */}
          <path d="M102 31 C102 31 135 31 135 55 L135 90 C135 90 135 102 122 102 C110 102 110 90 110 90 L110 65 C110 52 102 50 102 50 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2.5" />
          
          {/* Liquid content */}
          <rect x="44" y="90" width="112" height="120" rx="8" fill={`url(#liq-${title})`} opacity="0.8" />
          
          {/* Canister Body Shell */}
          <rect x="40" y="45" width="120" height="170" rx="12" fill="url(#canister-body)" stroke="#cbd5e1" strokeWidth="2.5" />
          
          {/* Centered Branded Label */}
          <rect x="52" y="105" width="96" height="85" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          
          {/* Centered Logo */}
          <path d="M90 123 L100 116 L110 123 L100 130 Z" fill="#1b2a47" />
          <path d="M90 116 L100 123 L110 116" fill="none" stroke="#dc2626" strokeWidth="2" />
          
          <text x="100" y="142" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#1b2a47">KRESKO</text>
          <text x="100" y="153" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#dc2626" letterSpacing="0.8">CHEMICALS</text>
          <text x="100" y="163" textAnchor="middle" fontFamily="sans-serif" fontSize="5.5" fontWeight="bold" fill="#475569">PREMIUM CONCENTRATE</text>
          
          {/* Centered Title */}
          <text x="100" y="176" textAnchor="middle" fontFamily="sans-serif" fontSize="5.5" fontWeight="600" fill="#64748b">
            {title.substring(0, 22)}
          </text>
          <text x="100" y="185" textAnchor="middle" fontFamily="sans-serif" fontSize="5" fontWeight="600" fill="#64748b">
            {title.length > 22 ? title.substring(22, 45) + '...' : ''}
          </text>
          
          {/* Highlights */}
          <path d="M46 55 L46 205" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
      
    case 'spray': // Aerosol/Trigger spray bottle
      return (
        <svg viewBox="0 0 200 240" style={defaultStyle} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`liq-${title}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={liquidStart} />
              <stop offset="70%" stopColor={liquidEnd} />
              <stop offset="100%" stopColor={liquidStart} />
            </linearGradient>
            <linearGradient id="spray-bottle" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          
          {/* Shadow */}
          <ellipse cx="100" cy="225" rx="45" ry="8" fill="#cbd5e1" />
          
          {/* Spray Trigger Nozzle */}
          <path d="M92 40 h16 v12 h-16 z" fill="#64748b" />
          <path d="M100 15 L125 22 L125 32 L110 32 L110 40 L90 40 L90 28 Z" fill={capColor} />
          <path d="M90 28 L75 32 L75 22 Z" fill="#475569" /> {/* Spray nozzle tip */}
          <path d="M112 32 C112 32 120 48 114 55" stroke={capColor} strokeWidth="3" fill="none" strokeLinecap="round" /> {/* Trigger hook */}
          
          {/* Bottle Neck */}
          <path d="M85 52 L115 52 L108 90 L92 90 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="80" y="60" width="40" height="5" fill={capColor} />
          
          {/* Liquid content */}
          <path d="M72 100 C72 100 128 100 128 100 L135 205 C135 215 65 215 65 205 Z" fill={`url(#liq-${title})`} opacity="0.8" />
          
          {/* Spray Bottle Body */}
          <path d="M70 95 C70 95 130 95 130 95 L138 205 C138 218 62 218 62 205 Z" fill="url(#spray-bottle)" stroke="#cbd5e1" strokeWidth="2" />
          
          {/* Centered Branded Label */}
          <rect x="70" y="118" width="60" height="60" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          
          {/* Centered Logo */}
          <path d="M92 129 L100 124 L108 129 L100 134 Z" fill="#1b2a47" />
          <path d="M92 124 L100 129 L108 124" fill="none" stroke="#dc2626" strokeWidth="1.5" />
          
          <text x="100" y="143" textAnchor="middle" fontFamily="sans-serif" fontSize="6.5" fontWeight="bold" fill="#1b2a47">KRESKO</text>
          <text x="100" y="151" textAnchor="middle" fontFamily="sans-serif" fontSize="5" fontWeight="bold" fill="#dc2626" letterSpacing="0.5">CHEMICALS</text>
          
          {/* Centered Title */}
          <text x="100" y="163" textAnchor="middle" fontFamily="sans-serif" fontSize="4.8" fontWeight="600" fill="#64748b">
            {title.substring(0, 16)}...
          </text>
          
          {/* Highlights */}
          <path d="M73 105 L77 200" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.4" />
        </svg>
      );
      
    case 'squeeze': // Squeeze bottle for toilet cleaners
      return (
        <svg viewBox="0 0 200 240" style={defaultStyle} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`liq-${title}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={liquidStart} />
              <stop offset="70%" stopColor={liquidEnd} />
              <stop offset="100%" stopColor={liquidStart} />
            </linearGradient>
            <linearGradient id="sq-body" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="40%" stopColor="#f1f5f9" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Shadow */}
          <ellipse cx="100" cy="225" rx="42" ry="7" fill="#cbd5e1" />
          
          {/* Squeeze bottle neck with tilt */}
          <path d="M92 45 L80 18 L104 10 L112 38 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M80 18 L104 10 L108 17 L84 25 Z" fill={capColor} />
          
          {/* Liquid content */}
          <path d="M68 95 C68 85 132 85 132 95 L126 205 C126 215 74 215 74 205 Z" fill={`url(#liq-${title})`} opacity="0.85" />
          
          {/* Squeeze Bottle Body */}
          <path d="M65 95 C65 80 135 80 135 95 L128 205 C128 218 72 218 72 205 Z" fill="url(#sq-body)" stroke="#cbd5e1" strokeWidth="2" />
          
          {/* Centered Branded Label */}
          <rect x="74" y="112" width="52" height="65" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          
          {/* Centered Logo */}
          <path d="M92 122 L100 118 L108 122 L100 126 Z" fill="#1b2a47" />
          <path d="M92 118 L100 122 L108 118" fill="none" stroke="#dc2626" strokeWidth="1.2" />
          
          <text x="100" y="134" textAnchor="middle" fontFamily="sans-serif" fontSize="5.5" fontWeight="bold" fill="#1b2a47">KRESKO</text>
          <text x="100" y="142" textAnchor="middle" fontFamily="sans-serif" fontSize="4.5" fontWeight="bold" fill="#dc2626" letterSpacing="0.5">CHEMICALS</text>
          
          {/* Centered Title */}
          <text x="100" y="154" textAnchor="middle" fontFamily="sans-serif" fontSize="4.2" fontWeight="600" fill="#64748b">
            {title.substring(0, 12)}...
          </text>
          <text x="100" y="163" textAnchor="middle" fontFamily="sans-serif" fontSize="3.8" fontWeight="600" fill="#94a3b8">
            TOILET SHINE
          </text>
          
          {/* Highlights */}
          <path d="M72 102 L78 200" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
        </svg>
      );
      
    case 'shaker': // Specialized Shining powder canister
      return (
        <svg viewBox="0 0 200 240" style={defaultStyle} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shaker-metal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="35%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
          
          {/* Shadow */}
          <ellipse cx="100" cy="225" rx="46" ry="8" fill="#cbd5e1" />
          
          {/* Red Shaker Cap */}
          <rect x="68" y="25" width="64" height="15" fill={capColor} rx="3" />
          <ellipse cx="100" cy="25" rx="32" ry="4" fill="#fca5a5" />
          
          {/* Metallic canister cylinder */}
          <rect x="62" y="40" width="76" height="175" rx="6" fill="url(#shaker-metal)" stroke="#94a3b8" strokeWidth="2" />
          
          {/* Branded Label Wrap - Centered content */}
          <rect x="62" y="80" width="76" height="90" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
          <rect x="62" y="80" width="76" height="5" fill="#dc2626" />
          <rect x="62" y="165" width="76" height="5" fill="#1b2a47" />
          
          {/* Centered Logo */}
          <path d="M92 101 L100 96 L108 101 L100 106 Z" fill="#1b2a47" />
          <path d="M92 96 L100 101 L108 96" fill="none" stroke="#dc2626" strokeWidth="1.5" />
          
          <text x="100" y="114" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#1b2a47">KRESKO</text>
          <text x="100" y="124" textAnchor="middle" fontFamily="sans-serif" fontSize="6.5" fontWeight="bold" fill="#dc2626">CHEMICALS</text>
          <text x="100" y="133" textAnchor="middle" fontFamily="sans-serif" fontSize="5.5" fontWeight="bold" fill="#475569">RAPID GLOW</text>
          
          {/* Centered Title */}
          <text x="100" y="147" textAnchor="middle" fontFamily="sans-serif" fontSize="4.8" fontWeight="600" fill="#64748b">
            {title.substring(0, 18)}...
          </text>
          <text x="100" y="156" textAnchor="middle" fontFamily="sans-serif" fontSize="3.8" fontWeight="600" fill="#94a3b8">
            SHINING POWDER
          </text>
          
          {/* Shine sparklines */}
          <path d="M142 55 L146 59 M146 55 L142 59" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M52 185 L56 189 M56 185 L52 189" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
      
    case 'jar': // General Jar / Air freshener cake box
    default:
      return (
        <svg viewBox="0 0 200 240" style={defaultStyle} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="jar-body" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#f1f5f9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          
          {/* Shadow */}
          <ellipse cx="100" cy="215" rx="55" ry="10" fill="#cbd5e1" />
          
          {/* Screw cap */}
          <rect x="65" y="45" width="70" height="20" fill={capColor} rx="3" />
          <rect x="68" y="60" width="64" height="5" fill="#475569" />
          
          {/* Jar liquid content */}
          <rect x="52" y="80" width="96" height="120" rx="8" fill={liquidStart} opacity="0.8" />
          
          {/* Jar Body shell */}
          <rect x="48" y="70" width="104" height="135" rx="12" fill="url(#jar-body)" stroke="#e2e8f0" strokeWidth="2.5" />
          
          {/* Label - Centered content */}
          <rect x="58" y="100" width="84" height="70" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          
          {/* Centered Logo */}
          <path d="M92 113 L100 108 L108 113 L100 117 Z" fill="#1b2a47" />
          <path d="M92 108 L100 113 L108 108" fill="none" stroke="#dc2626" strokeWidth="1.5" />
          
          <text x="100" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#1b2a47">KRESKO</text>
          <text x="100" y="136" textAnchor="middle" fontFamily="sans-serif" fontSize="6" fontWeight="bold" fill="#dc2626">CHEMICALS</text>
          
          {/* Centered Title */}
          <text x="100" y="150" textAnchor="middle" fontFamily="sans-serif" fontSize="5" fontWeight="600" fill="#64748b">
            {title.substring(0, 20)}...
          </text>
          <text x="100" y="160" textAnchor="middle" fontFamily="sans-serif" fontSize="4.2" fontWeight="600" fill="#94a3b8">
            HYGIENE PRODUCT
          </text>
          
          {/* Reflections */}
          <path d="M52 80 L52 190" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
        </svg>
      );
  }
}
