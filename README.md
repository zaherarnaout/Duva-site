# DUVA PDF Export System

## Overview
A complete PDF export system for DUVA lighting product datasheets, built with Webflow integration and client-side PDF generation using html2pdf.js.

## Features
- ✅ **Exact Webflow Template Match** - 794px × 1123px dimensions
- ✅ **Dynamic Content Injection** - CMS data integration
- ✅ **Fixed Width Layout** - Prevents text overflow
- ✅ **Multi-page Support** - A4 format with proper page breaks
- ✅ **Image Integration** - Product, dimension, and photometric diagrams
- ✅ **Accessories Section** - Dynamic accessory display
- ✅ **Specifications Table** - Real-time spec updates
- ✅ **Icon Management** - CMS icon injection
- ✅ **Text Selectable PDFs** - High-quality vector output

## File Structure
```
Duva-pdf/
├── index.html                 # Main PDF template
├── styles.css                 # Custom CSS with PDF overrides
├── script.js                  # JavaScript for PDF generation
├── duva-lighting.webflow.css  # Webflow template styles
├── pdf-template-test.html     # Original Webflow template
├── css/
│   ├── normalize.css          # CSS reset
│   ├── webflow.css            # Webflow grid system
│   └── duva-lighting.webflow.css # Webflow styles
└── README.md                  # This file
```

## Key Changes Made

### 1. Container Structure (index.html)
- ✅ **Webflow CSS Integration** - Added normalize.css, webflow.css, duva-lighting.webflow.css
- ✅ **Exact Template Match** - Uses `.pdf-export-wrapper` class structure
- ✅ **Proper Image Dimensions** - 180px × 180px for all images
- ✅ **Inline Style Overrides** - CSS conflicts resolved with `#pdf-container` selectors

### 2. CSS Overrides (styles.css)
- ✅ **Fixed Dimensions** - 794px × 1123px container
- ✅ **Text Overflow Prevention** - Fixed width for left-hero-wrapper (580px)
- ✅ **Divider Elements** - All dividers match Webflow template exactly:
  - `.series-divaider` - Red border instead of background
  - `.left-divider` - Horizontal section dividers
  - `.divider-specific` - Specs grid dividers
  - `.div-block-4` - Footer red divider
- ✅ **Text Wrapping** - Comprehensive word-break rules
- ✅ **Print Media Queries** - Proper PDF export styling

### 3. JavaScript Integration (script.js)
- ✅ **Updated Selectors** - Works with new Webflow structure
- ✅ **Dynamic Content Injection** - Family name, specs, images, icons
- ✅ **PDF Generation Settings** - Custom format [794, 1123] pixels
- ✅ **Image Loading** - Waits for images before export
- ✅ **Specs Table Updates** - Real-time specification updates

### 4. CSS Files (css/)
- ✅ **normalize.css** - CSS reset for consistent rendering
- ✅ **webflow.css** - Grid system and utilities
- ✅ **duva-lighting.webflow.css** - Complete Webflow template styles

## Technical Specifications

### PDF Container
- **Dimensions:** 794px × 1123px
- **Format:** Custom pixel format (not A4)
- **Quality:** High-resolution with 2x scale
- **Text:** Selectable vector text

### Layout Structure
- **Header:** Series label + Family name + Icons + Logo
- **Content:** Product info + Specifications + Images
- **Accessories:** Dynamic accessory sections
- **Footer:** Website + Legal notice + Red divider

### CSS Priority System
- **Base Styles:** Webflow CSS files
- **Overrides:** `#pdf-container` prefixed rules with `!important`
- **Print Styles:** Media queries for PDF export

## Usage

### 1. Setup
```html
<!-- Include CSS files -->
<link href="css/normalize.css" rel="stylesheet">
<link href="css/webflow.css" rel="stylesheet">
<link href="css/duva-lighting.webflow.css" rel="stylesheet">

<!-- Include JavaScript -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script src="script.js"></script>
```

### 2. PDF Generation
```javascript
// Trigger PDF export
generatePDF();

// Or bind to button
document.querySelector(".download-arrow").addEventListener("click", generatePDF);
```

### 3. Dynamic Content
```javascript
// Update specifications
updateSpecsTable();

// Inject CMS content
injectPdfContent();

// Inject images
injectPdfImages();

// Inject icons
injectPdfIcons();
```

## Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Dependencies
- html2pdf.js v0.10.1
- Webflow CSS framework
- Modern browser with ES6 support

## Notes
- PDF container is hidden by default (`.hidden` class)
- Images must be fully loaded before PDF generation
- Text overflow is prevented with fixed widths and word wrapping
- All dividers match the original Webflow template exactly
- CSS conflicts resolved with specific selectors and `!important` declarations