# Cloudflare Configuration for Duva Modular Files

## CSS Files to Include

### Base Styles
```html
<!-- Base CSS Files -->
<link href="base.css" rel="stylesheet">
<link href="menu.css" rel="stylesheet">
<link href="header.css" rel="stylesheet">
```

### Modular Component Styles
```html
<!-- Product Configurator -->
<link href="product-configurator.css" rel="stylesheet">

<!-- PDF Export -->
<link href="pdf-export.css" rel="stylesheet">

<!-- Gallery -->
<link href="gallery.css" rel="stylesheet">

<!-- Accessories -->
<link href="accessories.css" rel="stylesheet">

<!-- Animations -->
<link href="animations.css" rel="stylesheet">

<!-- Image Loading -->
<link href="image-loading.css" rel="stylesheet">
```

### Legacy Support (if needed)
```html
<!-- Original styles.css (for backward compatibility) -->
<link href="styles.css" rel="stylesheet">
```

## JavaScript Files to Include

### Core Dependencies
```html
<!-- External Dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
```

### Modular JavaScript Files
```html
<!-- Main Application -->
<script src="main.js"></script>

<!-- Product Configuration -->
<script src="product-configurator.js"></script>

<!-- PDF Export -->
<script src="pdf-export.js"></script>

<!-- Menu System -->
<script src="menu.js"></script>

<!-- Image Loading -->
<script src="image-loading.js"></script>

<!-- Gallery -->
<script src="gallery.js"></script>

<!-- Animations -->
<script src="animations.js"></script>

<!-- Accessories -->
<script src="accessories.js"></script>

<!-- Header (if separate) -->
<script src="header.js"></script>
```

## Complete HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Duva Lighting - Product Configurator</title>
    
    <!-- CSS Files -->
    <link href="base.css" rel="stylesheet">
    <link href="menu.css" rel="stylesheet">
    <link href="header.css" rel="stylesheet">
    <link href="product-configurator.css" rel="stylesheet">
    <link href="pdf-export.css" rel="stylesheet">
    <link href="gallery.css" rel="stylesheet">
    <link href="accessories.css" rel="stylesheet">
    <link href="animations.css" rel="stylesheet">
    <link href="image-loading.css" rel="stylesheet">
    
    <!-- Legacy support (optional) -->
    <!-- <link href="styles.css" rel="stylesheet"> -->
</head>
<body>
    <!-- Your HTML content here -->
    
    <!-- JavaScript Files -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="main.js"></script>
    <script src="product-configurator.js"></script>
    <script src="pdf-export.js"></script>
    <script src="menu.js"></script>
    <script src="image-loading.js"></script>
    <script src="gallery.js"></script>
    <script src="animations.js"></script>
    <script src="accessories.js"></script>
    <script src="header.js"></script>
</body>
</html>
```

## Cloudflare CDN Configuration

### CSS Files to Cache
- `base.css`
- `menu.css`
- `header.css`
- `product-configurator.css`
- `pdf-export.css`
- `gallery.css`
- `accessories.css`
- `animations.css`
- `image-loading.css`

### JavaScript Files to Cache
- `main.js`
- `product-configurator.js`
- `pdf-export.js`
- `menu.js`
- `image-loading.js`
- `gallery.js`
- `animations.js`
- `accessories.js`
- `header.js`

### External Dependencies
- `https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js`

## Loading Order

### CSS Loading Order
1. `base.css` - Reset and core styles
2. `menu.css` - Menu system styles
3. `header.css` - Header styles
4. Component styles (any order):
   - `product-configurator.css`
   - `pdf-export.css`
   - `gallery.css`
   - `accessories.css`
   - `animations.css`
   - `image-loading.css`

### JavaScript Loading Order
1. External dependencies (html2pdf.js)
2. `main.js` - Core application logic
3. Component modules (any order):
   - `product-configurator.js`
   - `pdf-export.js`
   - `menu.js`
   - `image-loading.js`
   - `gallery.js`
   - `animations.js`
   - `accessories.js`
   - `header.js`

## Performance Optimization

### CSS Optimization
- Minify all CSS files
- Enable gzip compression
- Set appropriate cache headers
- Consider combining frequently used styles

### JavaScript Optimization
- Minify all JavaScript files
- Enable gzip compression
- Set appropriate cache headers
- Consider bundling for production

## Cache Headers Recommendation

```nginx
# CSS files
location ~* \.css$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# JavaScript files
location ~* \.js$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Version Control Strategy

### File Naming Convention
Consider adding version numbers to files for cache busting:
- `base.v1.0.0.css`
- `product-configurator.v1.0.0.js`
- etc.

### Update Strategy
When updating files:
1. Update version numbers
2. Update HTML references
3. Clear Cloudflare cache
4. Deploy new files

## Monitoring

### Key Metrics to Track
- CSS file load times
- JavaScript file load times
- Total page load time
- Cache hit rates
- Error rates for file loading

### Cloudflare Analytics
Monitor in Cloudflare dashboard:
- Bandwidth usage
- Request counts
- Cache performance
- Error rates