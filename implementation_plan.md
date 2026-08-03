# Implementation Plan - Cleaning Concentrates Catalog & Branding Integration

We are pivoting the website product catalog and descriptions from **Machinery Packaging** to **Kresko Chemicals' Cleaning Product Concentrates** as listed in your corporate quote sheets.

---

## User Review Required

> [!IMPORTANT]
> This change alters the core purpose of the website from selling packaging machines to selling cleaning chemical concentrates (Hand Wash, Phenyl, Toilet Cleaners, Car Care, etc.). All machine cards, categories, and homepage references will be updated to reflect this new catalog.

---

## Proposed Changes

### 1. [MODIFY] Storage Database (`src/utils/storage.js`)
- Replaces `DEFAULT_PRODUCTS` with the **61 items** from the quotation sheet.
- Each product will contain:
  - `id`: unique ID
  - `title`: Name (e.g. `"Hand Wash Concentrate 6X Transparent"`)
  - `category`: Category tag (e.g. `"handwash"`, `"floor"`, `"laundry"`)
  - `price`: Concentrate rate per Kg (e.g. `"Rs. 170 / Kg"`)
  - `minPack`: Minimum packing weight/volume (e.g. `"30 Kg"`)
  - `dilution`: Compound + Water mix formula (e.g. `"1 + 5"`)
  - `rateAfter`: Calculated Per Litre rate after dilution (e.g. `"Rs. 24.83 / Litre"`)
  - `image`: Category-specific branded image
  - `desc`: Application and formulation notes

### 2. [NEW] Custom Branded Product Images (`public/images/`)
- We will generate 6 premium, realistic, studio-lit images for each major product category.
- **CRITICAL:** Every image prompt will instruct the model to print the **"Kresko Chemicals"** brand name and corporate logo directly onto the labels:
  - `prod_handwash.png`: Hand Wash & Shampoo categories.
  - `prod_laundry.png`: Laundry & Fabric wash category.
  - `prod_cleaners.png`: Floor cleaners, phenyls, and toilet cleaners.
  - `prod_aircare.png`: Air freshener sprays and vaporizer category.
  - `prod_powders.png`: Specialized shining/descaling powders.
  - `prod_carcare.png`: Car care shampoos and polishes.

### 3. [MODIFY] Products Grid Page (`src/pages/Products.jsx`)
- Replaces machinery filters with the 9 chemical concentrate categories:
  - Hand Wash, Shampoo, Laundry & Fabric, Floor & Phenyl, Toilet Cleaner, Air Freshener, Car Care, Insect Repellent, and Specialized Powders.
- Re-designs product cards to display **Dilution Ratios**, **MOQ (Min order)**, and **Per-Litre Cost after dilution** to highlight the high economic value of concentrates.

### 4. [MODIFY] Contact Page Form (`src/pages/Contact.jsx`)
- Replaces the hardcoded "Machine Interest" select dropdown with a flexible **Text Input field** for "Concentrate of Interest".
- Automatically populates the text field from url params (e.g. `?product=Hand+Wash+Concentrate`).

### 5. [MODIFY] Homepage Description Alignment (`src/pages/Home.jsx`)
- Updates slideshow banners, descriptions, and feature lists to talk about **bulk chemical concentrates, industrial dilutions, and process safety** rather than packaging machines.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify clean compilation with no layout errors.

### Manual Verification
1. **Catalog Browsing:** Open `/#/products`. Click the "Floor Cleaner" filter tab, and verify that items like "Black Phenyl (Phenyl Concentrate) 14X" appear with their specific dilution and pricing metrics.
2. **Branded Visuals:** Hover over the product cards and check that the product images display Kresko Chemicals labels.
3. **Quote Forms:** Click "Request Quote" on a product card, and verify it redirects to the contact form with the chosen product name auto-filled.
