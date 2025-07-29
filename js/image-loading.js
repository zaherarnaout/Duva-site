console.log("DUVA image-loading.js loaded!");

/* === Skeleton Loader Functionality === */

// Initialize skeleton loaders for all images
function initializeSkeletonLoaders() {
  const images = document.querySelectorAll('img[src]');
  
  images.forEach(img => {
    // Add skeleton class initially
    img.classList.add('skeleton');
    
    // Create a wrapper if it doesn't exist
    let wrapper = img.parentElement;
    if (!wrapper.classList.contains('skeleton-wrapper')) {
      wrapper.classList.add('skeleton-wrapper');
    }
    
    // Handle image load
    if (img.complete) {
      handleImageLoad(img);
    } else {
      img.addEventListener('load', () => handleImageLoad(img));
      img.addEventListener('error', () => handleImageError(img));
    }
  });
}

// Handle successful image load
function handleImageLoad(img) {
  img.classList.remove('skeleton');
  img.classList.add('loaded');
  
  // Add fade-in effect
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.3s ease';
  
  setTimeout(() => {
    img.style.opacity = '1';
  }, 50);
}

// Handle image load error
function handleImageError(img) {
  img.classList.remove('skeleton');
  img.classList.add('error');
  
  // Show error placeholder
  img.style.display = 'none';
  const errorPlaceholder = document.createElement('div');
  errorPlaceholder.className = 'image-error-placeholder';
  errorPlaceholder.innerHTML = '<span>Image not available</span>';
  errorPlaceholder.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    color: #999;
    font-size: 12px;
  `;
  img.parentElement.appendChild(errorPlaceholder);
}

// Initialize skeleton loaders when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeSkeletonLoaders();
});

// Handle dynamically added images (for CMS content)
function handleDynamicImages() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          const images = node.querySelectorAll ? node.querySelectorAll('img[src]') : [];
          images.forEach(img => {
            if (!img.classList.contains('skeleton')) {
              img.classList.add('skeleton');
              if (img.complete) {
                handleImageLoad(img);
              } else {
                img.addEventListener('load', () => handleImageLoad(img));
                img.addEventListener('error', () => handleImageError(img));
              }
            }
          });
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize dynamic image handling
document.addEventListener('DOMContentLoaded', function() {
  handleDynamicImages();
});

// Preload critical images
function preloadCriticalImages() {
  const criticalImages = [
    'main-lightbox-trigger',
    'thumbnail-image',
    'gallery-image'
  ];
  
  criticalImages.forEach(selector => {
    const images = document.querySelectorAll(selector);
    images.forEach(img => {
      if (img.src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
      }
    });
  });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', function() {
  preloadCriticalImages();
});

// Export functions for use in other modules
window.imageLoadingModule = {
  initializeSkeletonLoaders,
  handleImageLoad,
  handleImageError,
  handleDynamicImages,
  preloadCriticalImages
}; 