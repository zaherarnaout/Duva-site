// === PRODUCT CARDS JAVASCRIPT ===
// All JavaScript functionality for product cards, flip cards, and related interactions

(function() {
  'use strict';
  
  console.log('🎴 Product Cards System: Script loaded successfully!');
  
  // Configuration
  const CARDS_CONFIG = {
    animationDelay: 100,
    parallaxThreshold: 0.15,
    floatAnimationDuration: 3000,
    entranceAnimationDelay: 120
  };
  
  // === CARDS CONTAINER PARALLAX SYSTEM ===
  
  // Initialize cards container parallax
  function initializeCardsContainerParallax() {
    const cardsContainer = document.querySelector('.cards-Container');
    
    console.log('🔍 Looking for cards-Container element...');
    console.log('🔍 Found elements with "cards" in class:', document.querySelectorAll('[class*="cards"]'));
    
    if (!cardsContainer) {
      console.log('⚠️ Cards container (.cards-Container) not found');
      console.log('🔍 Available containers:', document.querySelectorAll('[class*="container"]'));
      return;
    }
    
    console.log('✅ Cards container found:', cardsContainer);
    console.log('🎴 Initializing cards container parallax...');
    
    let ticking = false;
    
    function updateCardsContainerParallax() {
      const scrollY = window.pageYOffset;
      const rect = cardsContainer.getBoundingClientRect();
      
      // Check if container is in viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        cardsContainer.style.setProperty('--scroll-y', scrollY);
        cardsContainer.classList.add('parallax-active');
        console.log('🎴 Cards container parallax active, scrollY:', scrollY);
      } else {
        cardsContainer.classList.remove('parallax-active');
      }
      
      ticking = false;
    }
    
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateCardsContainerParallax);
        ticking = true;
      }
    }
    
    // Add scroll listener
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial update
    updateCardsContainerParallax();
    
    console.log('✅ Cards container parallax initialized');
  }
  
  // === PRODUCT CARDS ANIMATION SYSTEM ===
  
  // Initialize product cards animations
  function initializeProductCards() {
    const cards = document.querySelectorAll('.collection-item, .product-card, .related-card, .flip-card-wrapper');
    
    if (cards.length === 0) {
      console.log('🎴 No product cards found');
      return;
    }
    
    console.log(`🎴 Found ${cards.length} product cards`);
    
    // Set card indices for staggered animations
    cards.forEach((card, index) => {
      card.style.setProperty('--card-index', index);
      card.style.setProperty('--random-delay', `${Math.random() * 0.2}s`);
    });
    
    // Initialize entrance animations
    initializeEntranceAnimations(cards);
    
    // Initialize parallax effects
    initializeParallaxEffects(cards);
    
    // Initialize floating animations
    initializeFloatingAnimations(cards);
    
    // Initialize intersection observer for viewport animations
    initializeViewportObserver(cards);
    
    console.log('✅ Product Cards System initialized');
  }
  
  // Initialize entrance animations
  function initializeEntranceAnimations(cards) {
    cards.forEach((card, index) => {
      // Don't add entrance-animation class immediately
      // Let the Intersection Observer handle when to show cards
      
      // Set staggered delay for when they do appear
      const delay = index * CARDS_CONFIG.entranceAnimationDelay;
      card.style.animationDelay = `${delay}ms`;
    });
  }
  
  // Initialize parallax effects
  function initializeParallaxEffects(cards) {
    let ticking = false;
    
    function updateParallax() {
      const scrollY = window.pageYOffset;
      
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardTop = rect.top + scrollY;
        const cardHeight = rect.height;
        
        // Check if card is in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const parallaxOffset = (scrollY - cardTop) * CARDS_CONFIG.parallaxThreshold;
          card.style.setProperty('--scroll-y', scrollY);
          card.classList.add('parallax-active');
        } else {
          card.classList.remove('parallax-active');
        }
      });
      
      ticking = false;
    }
    
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }
    
    // Add scroll listener
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial update
    updateParallax();
  }
  
  // Initialize floating animations
  function initializeFloatingAnimations(cards) {
    cards.forEach((card, index) => {
      // Add floating animation with staggered timing
      const delay = index * 200;
      card.style.animationDelay = `${delay}ms`;
      card.classList.add('float-animation');
    });
  }
  
  // Initialize intersection observer for viewport animations
  function initializeViewportObserver(cards) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('viewport-visible');
          entry.target.classList.add('animate-on-viewport');
        } else {
          entry.target.classList.remove('viewport-visible');
        }
      });
    }, observerOptions);
    
    cards.forEach(card => {
      observer.observe(card);
    });
  }
  
  // === FLIP CARDS FUNCTIONALITY ===
  
  // Initialize flip cards
  function initializeFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card-wrapper');
    
    if (flipCards.length === 0) {
      console.log('🎴 No flip cards found');
      return;
    }
    
    console.log(`🎴 Found ${flipCards.length} flip cards`);
    
    flipCards.forEach(card => {
      // Add flip card specific classes
      card.classList.add('flip-card-initialized');
      
      // Ensure proper z-index stacking
      const frontCard = card.querySelector('.flip-card-front');
      const backCard = card.querySelector('.flip-card-back');
      
      if (frontCard && backCard) {
        frontCard.style.zIndex = '1';
        backCard.style.zIndex = '2';
      }
    });
  }
  
  // === PRODUCT CARD INTERACTIONS ===
  
  // Handle card clicks and navigation
  function initializeCardClicks() {
    // Only handle clicks for non-flip cards
    const cards = document.querySelectorAll('.collection-item, .product-card, .related-card');
    
    cards.forEach(card => {
      card.addEventListener('click', function(e) {
        // Add click feedback
        card.classList.add('card-clicked');
        setTimeout(() => {
          card.classList.remove('card-clicked');
        }, 200);
        
        // Let Webflow handle the navigation - don't prevent default
        console.log('🎴 Card clicked, letting Webflow handle navigation');
      });
    });
    
    // For flip cards, let Webflow handle everything - no JavaScript interference
    console.log('🎴 Flip cards: Letting Webflow handle all navigation');
  }
  
  // Helper function to extract product code from card
  function extractProductCode(element) {
    // Look for product code in various elements
    const codeElement = element.querySelector('[class*="code"], [class*="number"], [class*="product"]');
    if (codeElement) {
      const text = codeElement.textContent?.trim();
      if (text) {
        // Extract product code (e.g., "C331", "4709")
        const codeMatch = text.match(/([A-Z]?\d+)/);
        if (codeMatch) {
          return codeMatch[1];
        } else {
          // If no pattern found, use first word
          return text.split(' ')[0];
        }
      }
    }
    return null;
  }
  
  // === PERFORMANCE OPTIMIZATIONS ===
  
  // Optimize animations for performance
  function optimizeAnimations() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduced-motion');
      console.log('🎴 Reduced motion mode enabled');
    }
    
    // Check if device is low-end
    const isLowEndDevice = navigator.hardwareConcurrency <= 4 || 
                          navigator.deviceMemory <= 4;
    
    if (isLowEndDevice) {
      document.documentElement.classList.add('low-end-device');
      console.log('🎴 Low-end device optimizations enabled');
    }
  }
  
  // === UTILITY FUNCTIONS ===
  
  // Get card statistics
  function getCardStats() {
    const cards = document.querySelectorAll('.collection-item, .product-card, .related-card, .flip-card-wrapper');
    const flipCards = document.querySelectorAll('.flip-card-wrapper');
    const cardsContainer = document.querySelector('.cards-Container');
    
    return {
      totalCards: cards.length,
      flipCards: flipCards.length,
      regularCards: cards.length - flipCards.length,
      cardsContainer: cardsContainer ? 'Found' : 'Not found',
      visibleCards: Array.from(cards).filter(card => {
        const rect = card.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      }).length
    };
  }
  
  // Refresh card animations
  function refreshCardAnimations() {
    const cards = document.querySelectorAll('.collection-item, .product-card, .related-card, .flip-card-wrapper');
    
    cards.forEach(card => {
      // Remove and re-add animation classes
      card.classList.remove('entrance-animation', 'float-animation', 'parallax-active');
      
      // Force reflow
      card.offsetHeight;
      
      // Re-add classes
      card.classList.add('entrance-animation', 'float-animation');
    });
    
    console.log('🎴 Card animations refreshed');
  }
  
  // === INITIALIZATION ===
  
  // Main initialization function
  function initializeProductCardsSystem() {
    console.log('🎴 Product Cards System: Starting initialization...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        console.log('🎴 DOM loaded, initializing...');
        setTimeout(initializeProductCardsSystem, 100);
      });
      return;
    }
    
    console.log('🎴 DOM ready, initializing systems...');
    
    // Initialize all systems
    initializeCardsContainerParallax();
    initializeProductCards();
    initializeFlipCards();
    initializeCardClicks();
    optimizeAnimations();
    
    // Make functions globally available
    window.getCardStats = getCardStats;
    window.refreshCardAnimations = refreshCardAnimations;
    
    console.log('✅ Product Cards System fully initialized');
  }
  
  // Initialize when script loads
  initializeProductCardsSystem();
  
  // Re-initialize on dynamic content changes
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
      let shouldReinitialize = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && (
              node.classList.contains('collection-item') ||
              node.classList.contains('product-card') ||
              node.classList.contains('related-card') ||
              node.classList.contains('flip-card-wrapper') ||
              node.classList.contains('cards-Container') ||
              node.querySelector('.collection-item, .product-card, .related-card, .flip-card-wrapper, .cards-Container')
            )) {
              shouldReinitialize = true;
            }
          });
        }
      });
      
      if (shouldReinitialize) {
        console.log('🎴 New cards detected, reinitializing...');
        setTimeout(initializeProductCardsSystem, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
})();
