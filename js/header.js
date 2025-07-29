// === Header JavaScript Functionality ===

document.addEventListener('DOMContentLoaded', function() {
  console.log('🎨 Header functionality initialized');

  // === Theme Toggle Functionality ===
  initializeThemeToggle();
  
  // === Menu Panel Functionality ===
  initializeMenuPanel();
  
  // === Search Functionality ===
  initializeSearch();
  
  // === Language Toggle ===
  initializeLanguageToggle();
  
  // === Accessibility Improvements ===
  initializeAccessibility();
});

// === Theme Toggle ===
function initializeThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle-wrapper');
  const body = document.body;
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      body.classList.toggle('dark-theme');
      
      // Save theme preference
      const isDark = body.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      
      console.log('🌙 Theme toggled:', isDark ? 'dark' : 'light');
    });
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.classList.add('dark-theme');
    }
  }
}

// === Menu Panel ===
function initializeMenuPanel() {
  const menuWrapper = document.querySelector('.menu-wrapper');
  const menuPanel = document.querySelector('.menu-panel');
  const menuClose = document.querySelector('.menu-close');
  const menuOverlay = document.querySelector('.menu-overlay');
  
  console.log('📋 Menu elements found:', {
    menuWrapper: !!menuWrapper,
    menuPanel: !!menuPanel,
    menuClose: !!menuClose,
    menuOverlay: !!menuOverlay
  });
  
  if (menuWrapper && menuPanel) {
    // Open menu
    menuWrapper.addEventListener('click', function(e) {
      console.log('📋 Menu wrapper clicked!');
      e.preventDefault();
      e.stopPropagation();
      openMenu();
    });
    
    // Close menu
    if (menuClose) {
      menuClose.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      });
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menuPanel.classList.contains('active')) {
        closeMenu();
      }
    });
    
    // Close menu on overlay click
    if (menuOverlay) {
      menuOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        closeMenu();
      });
    }
    
    // Close menu on outside click (backup method)
    document.addEventListener('click', function(e) {
      if (menuPanel.classList.contains('active') && 
          !menuPanel.contains(e.target) && 
          !menuWrapper.contains(e.target) &&
          !menuOverlay.contains(e.target)) {
        closeMenu();
      }
    });
    
    // Prevent menu panel clicks from closing the menu
    menuPanel.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  function openMenu() {
    console.log('📋 Opening menu...');
    
    // Calculate header height to position menu panel at bottom of header
    const headerSection = document.querySelector('.header-section');
    const headerHeight = headerSection ? headerSection.offsetHeight : 0;
    
    console.log('📋 Header height:', headerHeight);
    
    // Position menu panel at bottom of header
    menuPanel.style.top = headerHeight + 'px';
    
    // Show overlay first
    if (menuOverlay) {
      menuOverlay.style.display = 'block';
      setTimeout(() => {
        menuOverlay.classList.add('active');
      }, 10);
    }
    
    // Show menu panel
    menuPanel.style.display = 'flex';
    
    // Trigger animation after display change
    setTimeout(() => {
      menuPanel.classList.add('active');
      console.log('📋 Menu panel active class added');
    }, 50);
    
    // Update ARIA state
    menuWrapper.setAttribute('aria-expanded', 'true');
    
    console.log('📋 Menu opened at header bottom:', headerHeight + 'px');
  }
  
  function closeMenu() {
    console.log('📋 Closing menu...');
    
    // Remove active class from menu panel
    menuPanel.classList.remove('active');
    
    // Remove active class from overlay
    if (menuOverlay) {
      menuOverlay.classList.remove('active');
    }
    
    // Hide elements after animation
    setTimeout(() => {
      menuPanel.style.display = 'none';
      if (menuOverlay) {
        menuOverlay.style.display = 'none';
      }
    }, 400); // Match CSS transition duration
    
    // Update ARIA state
    menuWrapper.setAttribute('aria-expanded', 'false');
    
    console.log('📋 Menu closed');
  }
}

// === Search Functionality ===
function initializeSearch() {
  const searchWrapper = document.querySelector('.search-wrapper');
  const searchInput = document.querySelector('.product-subtitle');
  const searchIcon = document.querySelector('.search-icon');
  
  if (searchWrapper && searchInput) {
    // Make search input focusable
    searchInput.setAttribute('tabindex', '0');
    searchInput.setAttribute('role', 'textbox');
    searchInput.setAttribute('aria-label', 'Search products');
    
    // Store original content
    const originalText = searchInput.textContent;
    const originalIconDisplay = searchIcon ? searchIcon.style.display : 'block';
    
    // Handle search input click/focus
    searchInput.addEventListener('click', function() {
      clearSearchField();
    });
    
    searchInput.addEventListener('focus', function() {
      clearSearchField();
    });
    
    // Handle search input blur (when user clicks outside)
    searchInput.addEventListener('blur', function() {
      if (!searchInput.textContent.trim()) {
        restoreSearchField();
      }
    });
    
    // Handle search input
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        performSearch(searchInput.textContent);
      }
    });
    
    // Handle text input to resize the field
    searchInput.addEventListener('input', function() {
      adjustSearchFieldWidth();
    });
    
    // Add loading state
    searchWrapper.addEventListener('click', function(e) {
      // Don't trigger if clicking on the input itself
      if (e.target === searchInput) return;
      
      searchWrapper.classList.add('loading');
      
      // Simulate search (replace with actual search logic)
      setTimeout(() => {
        searchWrapper.classList.remove('loading');
        console.log('🔍 Search performed');
      }, 1000);
    });
  }
  
  function clearSearchField() {
    // Clear the text
    searchInput.textContent = '';
    
    // Hide the search icon
    if (searchIcon) {
      searchIcon.style.display = 'none';
    }
    
    // Reset width to minimum
    searchInput.style.width = '300px';
    
    // Focus the input for typing
    searchInput.focus();
    
    console.log('🔍 Search field cleared');
  }
  
  function restoreSearchField() {
    // Restore original text
    searchInput.textContent = 'Search products...';
    
    // Show the search icon
    if (searchIcon) {
      searchIcon.style.display = 'block';
    }
    
    // Reset width to minimum
    searchInput.style.width = '300px';
    
    console.log('🔍 Search field restored');
  }
  
  function performSearch(query) {
    console.log('🔍 Searching for:', query);
    // Add your search logic here
  }
  
  function adjustSearchFieldWidth() {
    // Create a temporary span to measure text width
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.style.font = window.getComputedStyle(searchInput).font;
    tempSpan.textContent = searchInput.textContent || 'Search products...';
    
    document.body.appendChild(tempSpan);
    
    // Calculate the width needed for the text
    const textWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);
    
    // Calculate total width needed (text + padding + icon space)
    const paddingLeft = 40; // Left padding for icon
    const paddingRight = 12; // Right padding
    const minWidth = 300; // Minimum width
    const calculatedWidth = Math.max(minWidth, textWidth + paddingLeft + paddingRight + 20); // +20 for buffer
    
    // Apply the calculated width
    searchInput.style.width = calculatedWidth + 'px';
    
    console.log('🔍 Search field width adjusted to:', calculatedWidth + 'px');
  }
}

// === Language Toggle ===
function initializeLanguageToggle() {
  const langSwitches = document.querySelectorAll('.lang-toggle-switch');
  
  langSwitches.forEach(switch_ => {
    const langOptions = switch_.querySelectorAll('.lang-en');
    
    langOptions.forEach(option => {
      option.addEventListener('click', function() {
        const language = this.querySelector('.text-block-3, .text-block-4')?.textContent;
        if (language) {
          console.log('🌍 Language changed to:', language);
          // Add your language change logic here
        }
      });
    });
  });
}

// === Accessibility Improvements ===
function initializeAccessibility() {
  // Add ARIA labels
  const menuWrapper = document.querySelector('.menu-wrapper');
  if (menuWrapper) {
    menuWrapper.setAttribute('aria-label', 'Open main menu');
    menuWrapper.setAttribute('aria-expanded', 'false');
  }
  
  const themeToggle = document.querySelector('.theme-toggle-wrapper');
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
  }
  
  // Add keyboard navigation
  const focusableElements = document.querySelectorAll(
    'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  
  focusableElements.forEach(element => {
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Update menu ARIA state
  const menuPanel = document.querySelector('.menu-panel');
  if (menuPanel && menuWrapper) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isExpanded = menuPanel.classList.contains('active');
          menuWrapper.setAttribute('aria-expanded', isExpanded.toString());
        }
      });
    });
    
    observer.observe(menuPanel, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
}

// === Performance Optimizations ===
function optimizePerformance() {
  // Debounce search input
  let searchTimeout;
  const searchInput = document.querySelector('.product-subtitle');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(this.textContent);
      }, 300);
    });
  }
  
  // Lazy load images
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}

// === Error Handling ===
window.addEventListener('error', function(e) {
  console.error('🚨 Header error:', e.error);
});

// === Initialize Performance Optimizations ===
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', optimizePerformance);
} else {
  optimizePerformance();
}

console.log('✅ Header JavaScript loaded successfully'); 