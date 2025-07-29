# DUVA JavaScript Modular Structure

The original `script.js` file (3,255 lines) has been split into multiple focused modules for better maintainability and organization.

## 📁 File Structure

```
Duva-pdf/
├── accessories.js          # Accessories interactions and PDF injection
├── gallery.js             # Image gallery, thumbnails, auto-scroll
├── product-configurator.js # Dropdown logic, RAL input, ordering code
├── pdf-export.js          # PDF generation and export functionality
├── animations.js          # Scroll animations and smooth scrolling
├── menu.js               # Menu panel functionality
├── image-loading.js      # Skeleton loaders and image handling
├── main.js              # Main initialization and coordination
└── script.js            # Original file (now deprecated)
```

## 🔧 Module Descriptions

### `accessories.js`
- Accessories image zoom on hover
- Accessories checkbox functionality
- Accessories toggle and dropdown animations
- PDF accessories injection
- Accessories section visibility management

### `gallery.js`
- Thumbnail image selector
- Main image click logic
- Webflow lightbox integration
- Gallery auto-scroll functionality
- Related items mouse wheel scrolling
- Touch/swipe support for mobile

### `product-configurator.js`
- Dropdown setup and interactions
- RAL input styling and functionality
- Global selection state management
- Reset button logic
- Lumen value updates
- Ordering code generation
- Product code detection and injection
- Observer setup for dynamic updates

### `pdf-export.js`
- PDF container show/hide functionality
- Image loading coordination
- PDF content injection (text, images, icons)
- Specifications table updates
- PDF generation with html2pdf
- Download button binding
- Error handling and cleanup

### `animations.js`
- Scroll-triggered fade-in animations
- Product page element animations
- Smooth scroll to related section
- Accessories dropdown animations

### `menu.js`
- Menu panel open/close functionality
- Keyboard navigation (Escape key)
- Touch and wheel event handling
- Overlay and outside click handling
- ARIA state management

### `image-loading.js`
- Skeleton loader initialization
- Image load success/error handling
- Dynamic image observer
- Critical image preloading
- Error placeholder display

### `main.js`
- Module coordination and initialization
- Global utility functions
- Error handling and debugging
- Performance monitoring
- Module communication system
- Application lifecycle management

## 🚀 Usage

### Loading Order
Load the modules in this order for proper initialization:

```html
<script src="accessories.js"></script>
<script src="gallery.js"></script>
<script src="product-configurator.js"></script>
<script src="pdf-export.js"></script>
<script src="animations.js"></script>
<script src="menu.js"></script>
<script src="image-loading.js"></script>
<script src="main.js"></script>
```

### Global Functions Available

#### Module Management
- `checkModulesLoaded()` - Check if all modules are loaded
- `reloadAllModules()` - Reload all modules
- `getAppStatus()` - Get current application status
- `getPerformanceMetrics()` - Get performance metrics

#### Product Configuration
- `refreshProductCode()` - Refresh product code (from Webflow)
- `debugProductCode()` - Debug product code detection
- `forceRefreshOrderingCode()` - Force refresh ordering code
- `testProductChange(newCode)` - Test product change simulation

#### Development
- `showAvailableFunctions()` - Show all available global functions

## 🔄 Module Communication

Modules communicate through the global `window.duvaEvents` system:

```javascript
// Listen for events
window.duvaEvents.on('app:ready', function() {
  console.log('Application is ready!');
});

// Emit events
window.duvaEvents.emit('product:changed', { productCode: 'C123' });
```

## 📊 Performance Benefits

1. **Faster Initial Load**: Smaller files load faster
2. **Better Caching**: Individual modules can be cached separately
3. **Easier Debugging**: Isolated functionality makes debugging easier
4. **Team Development**: Multiple developers can work on different modules
5. **Selective Loading**: Only load modules needed for specific pages

## 🛠️ Development Workflow

### Adding New Features
1. Identify the appropriate module for your feature
2. Add the functionality to that module
3. Export any new functions through the module's `window.*Module` object
4. Update the main.js coordination if needed

### Debugging
1. Use `checkModulesLoaded()` to verify all modules are loaded
2. Use `getAppStatus()` to check current application state
3. Use `getPerformanceMetrics()` to monitor performance
4. Check browser console for module-specific logs

### Testing
1. Use `testProductChange()` to simulate product changes
2. Use `debugProductCode()` to troubleshoot product code detection
3. Use `forceRefreshOrderingCode()` to test ordering code updates

## 🔧 Migration from Original script.js

The original `script.js` file is still present but deprecated. All functionality has been moved to the modular structure. To migrate:

1. Replace the single `script.js` reference with the modular files
2. Update any direct function calls to use the module exports
3. Test thoroughly to ensure all functionality works as expected

## 📝 Module Dependencies

```
main.js
├── animations.js
├── menu.js
├── image-loading.js
└── gallery.js

product-configurator.js
└── pdf-export.js (for PDF generation)

pdf-export.js
├── accessories.js (for accessories injection)
└── product-configurator.js (for code injection)
```

## 🎯 Benefits of This Structure

1. **Maintainability**: Each module has a single responsibility
2. **Scalability**: Easy to add new features without affecting existing code
3. **Testability**: Individual modules can be tested in isolation
4. **Performance**: Better caching and loading strategies
5. **Collaboration**: Multiple developers can work simultaneously
6. **Debugging**: Easier to identify and fix issues
7. **Documentation**: Clear structure makes code self-documenting

## 🔍 Troubleshooting

### Common Issues

1. **Module not loading**: Check file paths and loading order
2. **Function not found**: Ensure the module is loaded and function is exported
3. **Performance issues**: Use `getPerformanceMetrics()` to identify slow modules
4. **State synchronization**: Use `getAppStatus()` to check current state

### Debug Commands

```javascript
// Check module status
checkModulesLoaded()

// Get application status
getAppStatus()

// Show available functions
showAvailableFunctions()

// Reload all modules
reloadAllModules()
``` 