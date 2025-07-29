console.log("DUVA menu.js loaded!");

// === Menu Panel Functionality ===
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
      console.log('📋 Close button found:', menuClose);
      menuClose.addEventListener('click', function(e) {
        console.log('📋 Close button clicked!');
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      });
    } else {
      console.log('⚠️ Close button not found!');
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menuPanel.classList.contains('active')) {
        closeMenu();
      }
    });
    
    // Prevent wheel scrolling when menu is open
    document.addEventListener('wheel', function(e) {
      if (menuPanel.classList.contains('active')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, { passive: false });
    
    // Prevent touch scrolling when menu is open (mobile)
    document.addEventListener('touchmove', function(e) {
      if (menuPanel.classList.contains('active')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, { passive: false });
    
    // Close menu on overlay click
    if (menuOverlay) {
      menuOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        closeMenu();
      });
      
      // Prevent scroll on overlay
      menuOverlay.addEventListener('wheel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, { passive: false });
      
      menuOverlay.addEventListener('touchmove', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, { passive: false });
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
    
    // Close menu when menu links are clicked
    const menuLinks = menuPanel.querySelectorAll('a[href]');
    menuLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        console.log('📋 Menu link clicked, closing menu...');
        closeMenu();
      });
    });
  }
  
  function openMenu() {
    console.log('📋 Opening menu...');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    document.body.classList.add('menu-open');
    
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
    menuPanel.style.visibility = 'visible';
    menuPanel.style.opacity = '1';
    
    console.log('📋 Menu panel display set to flex');
    console.log('📋 Menu panel visibility:', menuPanel.style.visibility);
    console.log('📋 Menu panel opacity:', menuPanel.style.opacity);
    
    // Trigger animation after display change
    setTimeout(() => {
      menuPanel.classList.add('active');
      console.log('📋 Menu panel active class added');
      
      // Check close button visibility
      const closeBtn = menuPanel.querySelector('.menu-close');
      if (closeBtn) {
        console.log('📋 Close button found in active menu:', closeBtn);
        console.log('📋 Close button display:', closeBtn.style.display);
        console.log('📋 Close button visibility:', closeBtn.style.visibility);
        console.log('📋 Close button opacity:', closeBtn.style.opacity);
      } else {
        console.log('⚠️ Close button not found in active menu');
      }
    }, 50);
    
    // Update ARIA state
    menuWrapper.setAttribute('aria-expanded', 'true');
    
    console.log('📋 Menu opened at header bottom:', headerHeight + 'px');
  }
  
  function closeMenu() {
    console.log('📋 Closing menu...');
    
    // Restore body scrolling
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
    
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

// Initialize menu panel functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeMenuPanel();
});

// Export functions for use in other modules
window.menuModule = {
  initializeMenuPanel
}; 