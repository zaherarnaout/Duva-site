console.log("DUVA animations.js loaded!");

// === Scroll-triggered Fade-in Animations ===
function initializeScrollAnimations() {
  console.log('✨ Initializing scroll animations...');
  
  // Create a single observer for all sections
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        console.log(`🎬 ${entry.target.className} fade-in triggered`);
      }
    });
  }, {
    threshold: 0.3, // Trigger when 30% of section is visible
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before section comes into view
  });
  
  // Observe specific product page elements (NOT the wrapper)
  const productVisuals = document.querySelector('.product-visuals');
  const productInfoBlock = document.querySelector('.product-info-block');
  const downloadPanel = document.querySelector('.download-panel');
  
  if (productVisuals) {
    observer.observe(productVisuals);
    console.log('✅ Product visuals observer set up');
  }
  
  if (productInfoBlock) {
    observer.observe(productInfoBlock);
    console.log('✅ Product info block observer set up');
  }
  
  if (downloadPanel) {
    observer.observe(downloadPanel);
    console.log('✅ Download panel observer set up');
  }
  
  // Observe Related Items section
  const relatedSection = document.querySelector('.related-section');
  if (relatedSection) {
    observer.observe(relatedSection);
    console.log('✅ Related section observer set up');
  }
  
  // Observe Gallery section
  const gallerySection = document.querySelector('.gallery-section');
  if (gallerySection) {
    observer.observe(gallerySection);
    console.log('✅ Gallery section observer set up');
  }
  
  // Enhanced accessories dropdown animation
  const accessoriesToggle = document.querySelector('.accessories-toggle');
  if (accessoriesToggle) {
    accessoriesToggle.addEventListener('click', function() {
      const accessoriesSection = this.closest('.accessories-section');
      const accessoriesItems = accessoriesSection.querySelectorAll('.accessories-item');
      
      // Add staggered animation delays to accessories items
      accessoriesItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
      });
      
      console.log('🎬 Accessories dropdown animation triggered');
    });
  }
}

// === Smooth Scroll to Related Section ===
function scrollToRelatedSection() {
  const relatedSection = document.querySelector('.related-section');
  if (relatedSection) {
    relatedSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    console.log('📜 Smooth scrolling to related section');
  }
}

// === Arrow Hover Effects ===
function initializeArrowHoverEffects() {
  console.log('🎯 Initializing arrow hover effects...');
  
  // Download arrow hover effects
  document.querySelectorAll('.download-arrow').forEach(arrow => {
    arrow.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.transition = 'transform 0.2s ease';
      console.log('📥 Download arrow hover effect triggered');
    });
    
    arrow.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Dropdown arrow hover effects
  document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
    arrow.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.transition = 'transform 0.2s ease';
      console.log('📋 Dropdown arrow hover effect triggered');
    });
    
    arrow.addEventListener('mouseleave', function() {
      // Only reset scale if dropdown is not open (to preserve rotation)
      const dropdown = this.closest('.dropdown-wrapper');
      if (!dropdown || !dropdown.classList.contains('open')) {
        this.style.transform = 'scale(1)';
      } else {
        // If dropdown is open, maintain rotation but reset scale
        this.style.transform = 'rotate(180deg) scale(1)';
      }
    });
  });
  
  console.log('✅ Arrow hover effects initialized');
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeScrollAnimations();
  initializeArrowHoverEffects();
  
  // Add smooth scroll button if needed (optional)
  const scrollToRelatedBtn = document.querySelector('.scroll-to-related');
  if (scrollToRelatedBtn) {
    scrollToRelatedBtn.addEventListener('click', scrollToRelatedSection);
  }
});

// Export functions for use in other modules
window.animationsModule = {
  initializeScrollAnimations,
  scrollToRelatedSection,
  initializeArrowHoverEffects
}; 