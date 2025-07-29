console.log("DUVA gallery.js loaded!");

/* === Thumbnail Image Selector === */ 
document.addEventListener("DOMContentLoaded", function () { 
    const mainImage = document.getElementById("main-lightbox-trigger"); 
    const thumbnails = document.querySelectorAll(".thumbnail-image"); 
    thumbnails.forEach(thumb => { 
        thumb.addEventListener("click", function () { 
            thumbnails.forEach(t => t.classList.remove("is-active")); 
            this.classList.add("is-active"); 
            const newImg = this.getAttribute("data-image"); 
            if (mainImage) mainImage.setAttribute("href", newImg); 
        }); 
    }); 
}); 

/* === Main Image Thumbnail Click Logic === */ 
document.addEventListener("DOMContentLoaded", function () { 
  const mainImage = document.getElementById("main-lightbox-trigger"); 
  const thumbnails = document.querySelectorAll(".thumbnail-image"); 

  thumbnails.forEach((thumb) => { 
    thumb.addEventListener("click", function () { 
      const newSrc = this.getAttribute("src"); 
      if (mainImage && newSrc) { 
        mainImage.setAttribute("src", newSrc); 
      } 

      // Update active state 
      thumbnails.forEach(t => t.classList.remove("is-active")); 
      this.classList.add("is-active"); 
    }); 
  }); 

  /* === Trigger Hidden Webflow Lightbox Gallery === */ 
  const firstGalleryItem = document.querySelector(".first-gallery-image"); 
  if (mainImage && firstGalleryItem) { 
    mainImage.addEventListener("click", () => { 
      firstGalleryItem.click(); 
    }); 
  } 
}); 

/* === Auto-scroll Fullscreen Image Gallery === */
function initializeGalleryAutoScroll() {
  console.log('🎠 Initializing gallery auto-scroll...');
  
  const gallery = document.querySelector('.gallery-section-cms');
  
  if (!gallery) {
    console.log('⚠️ Gallery section not found');
    return;
  }

  console.log('📏 Gallery found:', gallery);
  console.log('📏 Gallery scrollWidth:', gallery.scrollWidth);
  console.log('📏 Gallery clientWidth:', gallery.clientWidth);
  
  // Check for images in the gallery
  const images = gallery.querySelectorAll('img');
  console.log('🖼️ Number of images found:', images.length);
  
  // Additional check: if no images found, hide gallery section
  if (images.length === 0) {
    console.log('⚠️ No images found in gallery - hiding gallery section');
    if (gallerySection) {
      gallerySection.style.display = 'none';
      gallerySection.style.visibility = 'hidden';
      gallerySection.style.opacity = '0';
      gallerySection.style.height = '0';
      gallerySection.style.overflow = 'hidden';
    }
    return; // Exit the function early
  }
  
  images.forEach((img, index) => {
    console.log(`🖼️ Image ${index + 1}:`, {
      src: img.src,
      loaded: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      offsetWidth: img.offsetWidth,
      offsetHeight: img.offsetHeight,
      style: {
        display: img.style.display,
        visibility: img.style.visibility,
        opacity: img.style.opacity
      }
    });
  });
  
  // Check for collection items
  const collectionItems = gallery.querySelectorAll('.w-dyn-item');
  console.log('📦 Number of collection items:', collectionItems.length);
  
  // Check if gallery has any images and hide section if empty
  const gallerySection = document.querySelector('.gallery-section');
  if (collectionItems.length === 0) {
    console.log('⚠️ No images found in gallery - hiding gallery section');
    if (gallerySection) {
      gallerySection.style.display = 'none';
      gallerySection.style.visibility = 'hidden';
      gallerySection.style.opacity = '0';
      gallerySection.style.height = '0';
      gallerySection.style.overflow = 'hidden';
    }
    return; // Exit the function early
  } else {
    console.log(`✅ Gallery has ${collectionItems.length} images - showing gallery section`);
    if (gallerySection) {
      gallerySection.style.display = 'block';
      gallerySection.style.visibility = 'visible';
      gallerySection.style.opacity = '1';
      gallerySection.style.height = 'auto';
      gallerySection.style.overflow = 'visible';
    }
  }
  
  // Debug collection item dimensions
  collectionItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    console.log(`📦 Item ${index + 1}:`, {
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
      offsetWidth: item.offsetWidth,
      clientWidth: item.clientWidth
    });
  });
  
  // Check gallery container dimensions
  const galleryRect = gallery.getBoundingClientRect();
  console.log('📏 Gallery container dimensions:', {
    width: galleryRect.width,
    height: galleryRect.height,
    scrollWidth: gallery.scrollWidth,
    clientWidth: gallery.clientWidth
  });

  let scrollInterval;
  let isAutoScrolling = true;
  const scrollSpeed = 5000; // time between slides (ms)

  function scrollToNext() {
    if (!gallery) return;
    
    const currentScroll = gallery.scrollLeft;
    const viewportWidth = window.innerWidth;
    const maxScroll = gallery.scrollWidth - viewportWidth;
    
    console.log(`🔄 Current scroll: ${currentScroll}px, Max scroll: ${maxScroll}px`);
    
    // Check if we're at the end
    const atEnd = currentScroll >= maxScroll - 10;
    
    if (atEnd) {
      // Loop back to the beginning
      gallery.scrollTo({
        left: 0,
        behavior: "smooth"
      });
      console.log('🔄 Looping back to start');
    } else {
      // Scroll to next full image
      gallery.scrollTo({
        left: currentScroll + viewportWidth,
        behavior: "smooth"
      });
      console.log(`🔄 Scrolling to: ${currentScroll + viewportWidth}px`);
    }
  }

  function scrollToPrevious() {
    if (!gallery) return;
    
    const currentScroll = gallery.scrollLeft;
    const viewportWidth = window.innerWidth;
    
    console.log(`🔄 Scrolling to previous image`);
    
    // Check if we're at the beginning
    if (currentScroll <= 10) {
      // Loop to the end
      const maxScroll = gallery.scrollWidth - viewportWidth;
      gallery.scrollTo({
        left: maxScroll,
        behavior: "smooth"
      });
      console.log('🔄 Looping to end');
    } else {
      // Scroll to previous full image
      gallery.scrollTo({
        left: currentScroll - viewportWidth,
        behavior: "smooth"
      });
      console.log(`🔄 Scrolling to: ${currentScroll - viewportWidth}px`);
    }
  }

  function startScrolling() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
    }
    scrollInterval = setInterval(scrollToNext, scrollSpeed);
    isAutoScrolling = true;
    console.log('▶️ Auto-scroll started');
  }

  function stopScrolling() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
      isAutoScrolling = false;
      console.log('⏸️ Auto-scroll paused');
    }
  }

  // Mouse wheel scroll handler
  function handleWheelScroll(event) {
    // Only handle wheel scroll when hovering over gallery
    // Prevent default scroll behavior for the entire page
    event.preventDefault();
    event.stopPropagation();
    
    // Determine scroll direction
    if (event.deltaY > 0) {
      // Scroll down/right - go to next image
      scrollToNext();
    } else {
      // Scroll up/left - go to previous image
      scrollToPrevious();
    }
    
    // Return false to prevent any further scroll events
    return false;
  }

  // Add mouse wheel event listener only when hovering over gallery
  gallery.addEventListener('mouseenter', function() {
    gallery.addEventListener('wheel', handleWheelScroll, { passive: false });
    console.log('🎯 Gallery mouse wheel enabled');
  });
  
  gallery.addEventListener('mouseleave', function() {
    gallery.removeEventListener('wheel', handleWheelScroll);
    console.log('🎯 Gallery mouse wheel disabled');
  });
  
  console.log('🎯 Mouse wheel navigation always active');
  
  // Add hover pause functionality
  gallery.addEventListener('mouseenter', stopScrolling);
  gallery.addEventListener('mouseleave', startScrolling);
  
  console.log('⏸️ Hover pause functionality enabled');
  
  // Start auto-scrolling after a short delay
  setTimeout(() => {
    startScrolling();
  }, 2000); // 2 second delay to let everything load properly
  
  // Force scroll to first image to ensure it's visible (no auto-scroll for testing)
  setTimeout(() => {
    gallery.scrollTo({
      left: 0,
      behavior: "instant"
    });
    console.log('📍 Forced scroll to first image');
    
    // Check scroll position after forcing
    console.log('📍 Gallery scroll position after reset:', gallery.scrollLeft);
    
    // Check if first item is visible
    if (collectionItems.length > 0) {
      const firstItem = collectionItems[0];
      const firstItemRect = firstItem.getBoundingClientRect();
      const galleryRect = gallery.getBoundingClientRect();
      
      console.log('📍 First item visibility check:', {
        firstItemLeft: firstItemRect.left,
        galleryLeft: galleryRect.left,
        isVisible: firstItemRect.left >= galleryRect.left && firstItemRect.right <= galleryRect.right
      });
    }
  }, 500);
  
  console.log('✅ Gallery initialized with auto-scroll enabled');
  console.log('💡 Auto-scroll starts after 2 seconds, mouse wheel always available');
}

// Initialize gallery auto-scroll when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeGalleryAutoScroll();
});

// === Related Items Mouse Wheel Scroll Logic ===
document.addEventListener("DOMContentLoaded", function () {
  const scrollContainer = document.querySelector(".collection-list-6");

  if (scrollContainer) {
    console.log('✅ Related items mouse wheel scroll logic initialized');
    console.log('📦 Related scroll container found:', scrollContainer);
    
    // Smooth mouse wheel scrolling
    scrollContainer.addEventListener('wheel', function(e) {
      console.log('🔄 Related section wheel event triggered');
      
      // Only prevent default if we're actually scrolling the container
      if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
        e.preventDefault(); // Prevent default vertical scrolling
        e.stopPropagation(); // Stop event from bubbling up
        
        // Get scroll direction and amount
        const delta = e.deltaY || e.deltaX;
        const scrollSpeed = 50; // Adjust this value to control scroll sensitivity
        
        // Smooth scroll horizontally
        scrollContainer.scrollBy({
          left: delta > 0 ? scrollSpeed : -scrollSpeed,
          behavior: 'smooth'
        });
        
        console.log('🔄 Mouse wheel scrolling:', delta > 0 ? 'right' : 'left');
      }
    }, { passive: false }); // Required for preventDefault to work
    
    // Add touch/swipe support for mobile
    let isScrolling = false;
    let startX = 0;
    let scrollLeft = 0;
    
    scrollContainer.addEventListener('touchstart', function(e) {
      console.log('📱 Related section touch start');
      isScrolling = true;
      startX = e.touches[0].pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    });
    
    scrollContainer.addEventListener('touchmove', function(e) {
      if (!isScrolling) return;
      e.preventDefault();
      const x = e.touches[0].pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      scrollContainer.scrollLeft = scrollLeft - walk;
      console.log('📱 Related section touch move');
    });
    
    scrollContainer.addEventListener('touchend', function() {
      console.log('📱 Related section touch end');
      isScrolling = false;
    });
    
  } else {
    console.log('⚠️ Related items scroll container not found');
  }
});

// Export functions for use in other modules
window.galleryModule = {
  initializeGalleryAutoScroll
}; 