/* === Contact Form Country Dropdown Enhancement === */
document.addEventListener('DOMContentLoaded', function () {
  console.log('Contact form script loaded');
  
  // Enhanced debugging - check all possible elements
  console.log('🔍 Checking all possible contact-related elements:');
  
  // Check for contact button with different possible selectors
  const contactBtnById = document.getElementById('contact-btn');
  const contactBtnByClass = document.querySelector('.contact-btn');
  const contactBtnByText = Array.from(document.querySelectorAll('a, button')).find(el => 
    el.textContent.toLowerCase().includes('contact')
  );
  
  // Check for modal overlay with different possible selectors
  const contactOverlayById = document.getElementById('contact-overlay');
  const contactOverlayByClass = document.querySelector('.contact-overlay');
  const contactOverlayByData = document.querySelector('[data-contact-overlay]');
  
  // Check for close button with more comprehensive detection
  const closeBtn = document.querySelector('.contact-close') || 
                   document.querySelector('.subscribe-close') ||
                   document.querySelector('[class*="close"]');
  
  console.log('📋 Element Search Results:', {
    contactBtnById: contactBtnById,
    contactBtnByClass: contactBtnByClass,
    contactBtnByText: contactBtnByText,
    contactOverlayById: contactOverlayById,
    contactOverlayByClass: contactOverlayByClass,
    contactOverlayByData: contactOverlayByData,
    closeBtn: closeBtn,
    closeBtnClasses: closeBtn ? closeBtn.className : 'N/A',
    closeBtnText: closeBtn ? closeBtn.textContent : 'N/A'
  });
  
  // Check all elements with 'contact' in their ID or class
  const allContactElements = document.querySelectorAll('[id*="contact"], [class*="contact"]');
  console.log('🔍 All elements with "contact" in ID or class:', allContactElements);
  
  // Check all buttons and links
  const allButtons = document.querySelectorAll('button, a[href], .w-button');
  console.log('🔍 All buttons and links found:', allButtons.length);
  
  // Modal functionality - use let instead of const to avoid reassignment error
  let contactBtn = contactBtnById || contactBtnByClass || contactBtnByText;
  let contactOverlay = contactOverlayById || contactOverlayByClass || contactOverlayByData;

  console.log('Elements found:', {
    contactBtn: contactBtn,
    contactOverlay: contactOverlay,
    closeBtn: closeBtn
  });

  // Check if we should auto-open modal from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const shouldOpenModal = urlParams.get('openContact') === 'true';
  
  if (shouldOpenModal && contactOverlay) {
    console.log('🔄 Auto-opening modal from URL parameter');
    setTimeout(() => {
      contactOverlay.classList.add('active');
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
      console.log('Modal opened from URL parameter');
    }, 500);
  }

  // Fallback: Try to find elements again after a short delay
  if (!contactBtn || !contactOverlay || !closeBtn) {
    setTimeout(() => {
      // Use let to avoid reassignment error
      let contactBtn = document.getElementById('contact-btn') || 
                       document.querySelector('.contact-btn') ||
                       Array.from(document.querySelectorAll('a, button')).find(el => 
                         el.textContent.toLowerCase().includes('contact')
                       );
      let contactOverlay = document.getElementById('contact-overlay') || 
                           document.querySelector('.contact-overlay') ||
                           document.querySelector('[data-contact-overlay]');
      let closeBtn = document.querySelector('.contact-close') || 
                      document.querySelector('.subscribe-close') ||
                      document.querySelector('[class*="close"]');
      
      console.log('Elements found after delay:', {
        contactBtn: contactBtn,
        contactOverlay: contactOverlay,
        closeBtn: closeBtn
      });
      
      if (contactBtn && contactOverlay && closeBtn) {
        setupModalEvents(contactBtn, contactOverlay, closeBtn);
      } else {
        console.error('❌ Still missing required elements after delay');
        console.log('💡 Please check in Webflow:');
        console.log('   - Contact button should have id="contact-btn"');
        console.log('   - Modal container should have id="contact-overlay"');
        console.log('   - Close button should have class="contact-close"');
        console.log('   - If button is on different page, use URL parameter: ?openContact=true');
      }
    }, 1000);
  } else {
    setupModalEvents(contactBtn, contactOverlay, closeBtn);
  }

  function setupModalEvents(contactBtn, contactOverlay, closeBtn) {
    console.log('🔧 Setting up modal events with:', { contactBtn, contactOverlay, closeBtn });
    
         // Open modal when contact button is clicked
     if (contactBtn) {
       contactBtn.addEventListener('click', function(e) {
         e.preventDefault();
         e.stopPropagation();
         console.log('Contact button clicked');
         if (contactOverlay) {
           // Store current scroll position before opening modal
           const currentScrollY = window.scrollY;
           const currentScrollX = window.scrollX;
           
           // Prevent scroll to top by maintaining scroll position
           document.body.style.top = `-${currentScrollY}px`;
           document.body.style.left = `-${currentScrollX}px`;
           
           contactOverlay.classList.add('active');
           contactOverlay.style.display = 'flex';
           contactOverlay.style.opacity = '1';
           contactOverlay.style.visibility = 'visible';
           document.body.classList.add('modal-open');
           document.documentElement.classList.add('modal-open');
           
           // Store scroll position for restoration when modal closes
           contactOverlay.setAttribute('data-scroll-y', currentScrollY);
           contactOverlay.setAttribute('data-scroll-x', currentScrollX);
           
           console.log('Modal opened at current position');
         } else {
           console.error('Contact overlay not found');
         }
       });
     } else {
       console.error('Contact button not found');
     }

    // Close modal when close button is clicked
    if (closeBtn) {
      console.log('🔧 Setting up close button event for:', closeBtn.className);
      
      // Remove any existing event listeners first
      const newCloseBtn = closeBtn.cloneNode(true);
      closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
      
             // Add new event listener
       newCloseBtn.addEventListener('click', function(e) {
         e.preventDefault();
         e.stopPropagation();
         e.stopImmediatePropagation();
         console.log('Close button clicked - closing modal');
         
                   if (contactOverlay) {
            // Restore scroll position
            const scrollY = contactOverlay.getAttribute('data-scroll-y');
            const scrollX = contactOverlay.getAttribute('data-scroll-x');
            
            console.log('📍 Restoring scroll position:', { y: scrollY, x: scrollX });
            
            contactOverlay.classList.remove('active');
            contactOverlay.style.display = 'none';
            contactOverlay.style.opacity = '0';
            contactOverlay.style.visibility = 'hidden';
            document.body.classList.remove('modal-open');
            document.documentElement.classList.remove('modal-open');
            
            // Restore body position and scroll
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            
            // Restore scroll position after a brief delay to ensure DOM is updated
            setTimeout(() => {
              if (scrollY && scrollX) {
                window.scrollTo(parseInt(scrollX), parseInt(scrollY));
                console.log('✅ Scroll position restored to:', { y: scrollY, x: scrollX });
              }
            }, 10);
            
            console.log('Modal closed successfully and scroll position restored');
          } else {
            console.error('Contact overlay not found when closing');
          }
       });
      
             // Also add mousedown event as backup
       newCloseBtn.addEventListener('mousedown', function(e) {
         e.preventDefault();
         e.stopPropagation();
         console.log('Close button mousedown - closing modal');
         
                   if (contactOverlay) {
            // Restore scroll position
            const scrollY = contactOverlay.getAttribute('data-scroll-y');
            const scrollX = contactOverlay.getAttribute('data-scroll-x');
            
            console.log('📍 Restoring scroll position (mousedown):', { y: scrollY, x: scrollX });
            
            contactOverlay.classList.remove('active');
            contactOverlay.style.display = 'none';
            contactOverlay.style.opacity = '0';
            contactOverlay.style.visibility = 'hidden';
            document.body.classList.remove('modal-open');
            document.documentElement.classList.remove('modal-open');
            
            // Restore body position and scroll
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            
            // Restore scroll position after a brief delay to ensure DOM is updated
            setTimeout(() => {
              if (scrollY && scrollX) {
                window.scrollTo(parseInt(scrollX), parseInt(scrollY));
                console.log('✅ Scroll position restored to (mousedown):', { y: scrollY, x: scrollX });
              }
            }, 10);
            
            console.log('Modal closed via mousedown and scroll position restored');
          }
       });
      
    } else {
      console.error('Close button not found');
    }

         // Close modal when clicking outside the modal content
     if (contactOverlay) {
       contactOverlay.addEventListener('click', function(e) {
                   if (e.target === contactOverlay) {
            console.log('Clicked outside modal');
            
            // Restore scroll position
            const scrollY = contactOverlay.getAttribute('data-scroll-y');
            const scrollX = contactOverlay.getAttribute('data-scroll-x');
            
            console.log('📍 Restoring scroll position (click outside):', { y: scrollY, x: scrollX });
            
            contactOverlay.classList.remove('active');
            contactOverlay.style.display = 'none';
            contactOverlay.style.opacity = '0';
            contactOverlay.style.visibility = 'hidden';
            document.body.classList.remove('modal-open');
            document.documentElement.classList.remove('modal-open');
            
            // Restore body position and scroll
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            
            // Restore scroll position after a brief delay to ensure DOM is updated
            setTimeout(() => {
              if (scrollY && scrollX) {
                window.scrollTo(parseInt(scrollX), parseInt(scrollY));
                console.log('✅ Scroll position restored to (click outside):', { y: scrollY, x: scrollX });
              }
            }, 10);
            
            console.log('Modal closed by clicking outside and scroll position restored');
          }
       });
     }

    // Ensure modal is hidden on page load
    if (contactOverlay) {
      contactOverlay.classList.remove('active');
      console.log('Modal hidden on page load');
      
      // Force hide with CSS as backup
      contactOverlay.style.display = 'none';
      contactOverlay.style.opacity = '0';
      contactOverlay.style.visibility = 'hidden';
    }
  }
  
  // Global close function that can be called from anywhere
  window.forceCloseModal = function() {
    const overlay = document.getElementById('contact-overlay') || document.querySelector('.contact-overlay');
    if (overlay) {
      // Restore scroll position
      const scrollY = overlay.getAttribute('data-scroll-y');
      const scrollX = overlay.getAttribute('data-scroll-x');
      
      console.log('📍 Restoring scroll position (force close):', { y: scrollY, x: scrollX });
      
      overlay.classList.remove('active');
      overlay.style.display = 'none';
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      
      // Restore body position and scroll
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restore scroll position after a brief delay to ensure DOM is updated
      setTimeout(() => {
        if (scrollY && scrollX) {
          window.scrollTo(parseInt(scrollX), parseInt(scrollY));
          console.log('✅ Scroll position restored to (force close):', { y: scrollY, x: scrollX });
        }
      }, 10);
      
      console.log('Modal force closed and scroll position restored');
    }
  };

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && contactOverlay && contactOverlay.classList.contains('active')) {
      console.log('Escape key pressed');
      
      // Restore scroll position
      const scrollY = contactOverlay.getAttribute('data-scroll-y');
      const scrollX = contactOverlay.getAttribute('data-scroll-x');
      
      console.log('📍 Restoring scroll position (Escape):', { y: scrollY, x: scrollX });
      
      contactOverlay.classList.remove('active');
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      
      // Restore body position and scroll
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restore scroll position after a brief delay to ensure DOM is updated
      setTimeout(() => {
        if (scrollY && scrollX) {
          window.scrollTo(parseInt(scrollX), parseInt(scrollY));
          console.log('✅ Scroll position restored to (Escape):', { y: scrollY, x: scrollX });
        }
      }, 10);
      
      console.log('Modal closed with Escape key and scroll position restored');
    }
  });

  // Manual trigger function (for testing)
  window.openContactModal = function() {
    const overlay = document.getElementById('contact-overlay') || document.querySelector('.contact-overlay');
    if (overlay) {
      overlay.classList.add('active');
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
      console.log('Modal opened manually');
    } else {
      console.error('Contact overlay not found for manual trigger');
    }
  };
  
  // Global close function
  window.closeContactModal = function() {
    const overlay = document.getElementById('contact-overlay') || document.querySelector('.contact-overlay');
    if (overlay) {
      // Restore scroll position
      const scrollY = overlay.getAttribute('data-scroll-y');
      const scrollX = overlay.getAttribute('data-scroll-x');
      
      console.log('📍 Restoring scroll position (global close):', { y: scrollY, x: scrollX });
      
      overlay.classList.remove('active');
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      
      // Restore body position and scroll
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restore scroll position after a brief delay to ensure DOM is updated
      setTimeout(() => {
        if (scrollY && scrollX) {
          window.scrollTo(parseInt(scrollX), parseInt(scrollY));
          console.log('✅ Scroll position restored to (global close):', { y: scrollY, x: scrollX });
        }
      }, 10);
      
      console.log('Modal closed via global function and scroll position restored');
    } else {
      console.error('Contact overlay not found for global close');
    }
  };

  // Test function to check if modal exists
  window.testContactModal = function() {
    const overlay = document.getElementById('contact-overlay') || document.querySelector('.contact-overlay');
    const btn = document.getElementById('contact-btn');
    const closeBtn = document.querySelector('.contact-close');
    
    console.log('Modal Test Results:', {
      overlay: overlay,
      button: btn,
      closeBtn: closeBtn,
      overlayClasses: overlay ? overlay.className : 'N/A',
      overlayStyle: overlay ? overlay.style.display : 'N/A'
    });
    
    return {
      overlay: overlay,
      button: btn,
      closeBtn: closeBtn
    };
  };

  // Comprehensive test function
  window.debugContactForm = function() {
    console.log('🔍 === CONTACT FORM DEBUG ===');
    
    // Test 1: Check if elements exist
    const elements = {
      contactBtn: document.getElementById('contact-btn'),
      contactOverlay: document.getElementById('contact-overlay') || document.querySelector('.contact-overlay'),
      closeBtn: document.querySelector('.contact-close')
    };
    
    console.log('📋 Element Check:', elements);
    
    // Test 2: Check all contact-related elements
    const allContactElements = document.querySelectorAll('[id*="contact"], [class*="contact"]');
    console.log('🔍 All contact elements:', allContactElements);
    
    // Test 3: Check all buttons
    const allButtons = document.querySelectorAll('button, a[href], .w-button');
    console.log('🔍 All buttons:', allButtons.length);
    
    // Test 4: Try to find contact button by text
    const contactByText = Array.from(allButtons).find(el => 
      el.textContent.toLowerCase().includes('contact')
    );
    console.log('🔍 Contact button by text:', contactByText);
    
    // Test 5: Check if modal can be opened manually
    if (elements.contactOverlay) {
      console.log('✅ Modal container found - testing manual open');
      elements.contactOverlay.classList.add('active');
      setTimeout(() => {
        elements.contactOverlay.classList.remove('active');
        console.log('✅ Manual modal test completed');
      }, 2000);
    } else {
      console.log('❌ Modal container not found');
    }
    
    return elements;
  };

  // Function to navigate to contact form page
  window.navigateToContactForm = function() {
    const currentUrl = window.location.href;
    const separator = currentUrl.includes('?') ? '&' : '?';
    const contactUrl = currentUrl + separator + 'openContact=true';
    window.location.href = contactUrl;
  };

  // Main page header contact button handler - only handle header contact button
  const mainPageContactBtn = document.getElementById('contact-btn');
  if (mainPageContactBtn) {
    // Check if this is a header contact button (not footer)
    const isHeaderButton = mainPageContactBtn.closest('.header') || 
                          mainPageContactBtn.closest('.menu-panel') || 
                          mainPageContactBtn.closest('.navigation') ||
                          mainPageContactBtn.closest('.nav');
    
    // Only handle if it's a header button and not already initialized by footer script
    if (isHeaderButton && !mainPageContactBtn.hasAttribute('data-footer-initialized')) {
      console.log('📍 Header contact button found - setting up modal open');
      
      // Remove any existing event listeners first
      const newContactBtn = mainPageContactBtn.cloneNode(true);
      mainPageContactBtn.parentNode.replaceChild(newContactBtn, mainPageContactBtn);
      
             newContactBtn.addEventListener('click', function(e) {
         e.preventDefault();
         e.stopPropagation();
         console.log('Header contact button clicked - opening modal');
         
         // Open modal directly instead of navigating
         if (contactOverlay) {
           // Store current scroll position BEFORE any DOM changes
           const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
           const currentScrollX = window.pageXOffset || document.documentElement.scrollLeft;
           
           console.log('📍 Current scroll position (header):', { y: currentScrollY, x: currentScrollX });
           
           // Store scroll position for restoration when modal closes
           contactOverlay.setAttribute('data-scroll-y', currentScrollY);
           contactOverlay.setAttribute('data-scroll-x', currentScrollX);
           
           // Prevent scroll to top by maintaining scroll position IMMEDIATELY
           document.body.style.position = 'fixed';
           document.body.style.top = `-${currentScrollY}px`;
           document.body.style.left = `-${currentScrollX}px`;
           document.body.style.width = '100%';
           document.body.style.overflow = 'hidden';
           
           // Now open the modal
           contactOverlay.classList.add('active');
           contactOverlay.style.display = 'flex';
           contactOverlay.style.opacity = '1';
           contactOverlay.style.visibility = 'visible';
           document.body.classList.add('modal-open');
           document.documentElement.classList.add('modal-open');
           
           console.log('Modal opened from header contact button at current position');
         } else {
           console.error('Contact overlay not found');
         }
       });
    } else {
      console.log('📍 Contact button found but skipping (footer button or already initialized)');
    }
  }

  // Test modal functionality immediately
  if (contactOverlay && closeBtn) {
    console.log('✅ Modal elements found - testing functionality');
    
    // Remove auto-opening test - this was causing the modal to open automatically
    // setTimeout(() => {
    //   console.log('🧪 Testing modal open...');
    //   contactOverlay.classList.add('active');
    //   document.body.style.overflow = 'hidden';
    //   console.log('✅ Modal test completed successfully');
    // }, 1000);
  }

  // Enhanced button detection - look for any button with "contact" text
  const allContactButtons = Array.from(document.querySelectorAll('a, button, .w-button')).filter(el => 
    el.textContent.toLowerCase().includes('contact') || 
    el.getAttribute('href')?.includes('contact') ||
    el.className.toLowerCase().includes('contact')
  );
  
  console.log('🔍 Found contact-related buttons:', allContactButtons);
  
  // Remove duplicate event handlers - we already handled the main contact button above
  // if (allContactButtons.length > 0 && contactOverlay) {
  //   console.log('🎯 Setting up contact button events');
  //   allContactButtons.forEach(btn => {
  //     btn.addEventListener('click', function(e) {
  //       e.preventDefault();
  //       console.log('Contact button clicked:', btn.textContent);
  //       if (contactOverlay) {
  //         contactOverlay.classList.add('active');
  //         document.body.style.overflow = 'hidden';
  //         console.log('Modal opened from contact button');
  //       }
  //     });
  //   });
  // }

  // Simple test function to open modal manually
  window.testModal = function() {
    console.log('🧪 Manual modal test');
    if (contactOverlay) {
      contactOverlay.classList.add('active');
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
      console.log('✅ Modal opened manually');
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        contactOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        console.log('✅ Modal closed automatically');
      }, 3000);
    } else {
      console.error('❌ Modal overlay not found');
    }
  };
  
  // Test close button specifically
  window.testCloseButton = function() {
    console.log('🧪 Testing close button functionality');
    const closeBtn = document.querySelector('.contact-close') || document.querySelector('.subscribe-close');
    
    if (closeBtn) {
      console.log('✅ Close button found:', {
        className: closeBtn.className,
        text: closeBtn.textContent,
        tagName: closeBtn.tagName
      });
      
      // Test if it has click event
      const events = closeBtn.onclick;
      console.log('Click event:', events);
      
      // Manually trigger click
      console.log('🔄 Manually clicking close button...');
      closeBtn.click();
      
    } else {
      console.error('❌ Close button not found');
      console.log('🔍 Searching for any close-related elements:');
      const allCloseElements = document.querySelectorAll('[class*="close"]');
      allCloseElements.forEach((el, index) => {
        console.log(`Close element ${index + 1}:`, {
          className: el.className,
          text: el.textContent,
          tagName: el.tagName
        });
      });
    }
  };

  // Function to find all buttons on the page
  window.findAllButtons = function() {
    const allButtons = document.querySelectorAll('a, button, .w-button, [role="button"]');
    console.log('🔍 All buttons on page:', allButtons.length);
    
    allButtons.forEach((btn, index) => {
      console.log(`Button ${index + 1}:`, {
        text: btn.textContent.trim(),
        id: btn.id,
        className: btn.className,
        href: btn.href,
        tagName: btn.tagName
      });
    });
    
    return allButtons;
  };

  // Country dropdown enhancement
  const countrySelect = document.getElementById('country');
  if (!countrySelect) {
    console.log('Country select not found');
    return;
  }

  console.log('Populating country dropdown');

  // 1) Preserve/ensure placeholder as first option
  countrySelect.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select country';
  placeholder.selected = true;   // default visible
  placeholder.disabled = true;   // cannot be chosen/submitted
  countrySelect.appendChild(placeholder);

  // 2) Full ISO 3166 country list (alphabetical order)
  const COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
    'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
    'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
    'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
    'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Honduras', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast',
    'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
    'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
    'Oman',
    'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar',
    'Romania', 'Russia', 'Rwanda',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
    'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
    'Yemen',
    'Zambia', 'Zimbabwe'
  ];

  // 3) Insert countries
  const frag = document.createDocumentFragment();
  for (const name of COUNTRIES) {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    frag.appendChild(opt);
  }
  countrySelect.appendChild(frag);
  console.log('Country dropdown populated with', COUNTRIES.length, 'countries');

  // 4) Add dynamic search functionality
  function setupCountrySearch() {
    console.log('Setting up country search functionality');
    
    // Make the select element searchable
    let searchBuffer = '';
    let searchTimeout;
    
    // Add keydown event listener for search functionality
    countrySelect.addEventListener('keydown', function(e) {
      // Clear the search buffer after 1 second of no typing
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchBuffer = '';
      }, 1000);
      
      // Only handle printable characters
      if (e.key.length === 1) {
        searchBuffer += e.key.toLowerCase();
        console.log('Search buffer:', searchBuffer);
        
        // Find matching option
        const options = this.querySelectorAll('option:not([disabled])');
        let foundMatch = false;
        
        options.forEach(option => {
          const countryName = option.textContent.toLowerCase();
          if (countryName.startsWith(searchBuffer)) {
            option.selected = true;
            foundMatch = true;
            return;
          }
        });
        
        // If no exact match, find partial match
        if (!foundMatch) {
          options.forEach(option => {
            const countryName = option.textContent.toLowerCase();
            if (countryName.includes(searchBuffer)) {
              option.selected = true;
              foundMatch = true;
              return;
            }
          });
        }
      }
    });
    
    // Add click event to focus the select for searching
    countrySelect.addEventListener('click', function() {
      this.focus();
    });
    
    // Add focus event to enable searching
    countrySelect.addEventListener('focus', function() {
      console.log('Country select focused - ready for search');
    });
    
    // Add keyboard shortcut (Ctrl/Cmd + K) to focus search
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        countrySelect.focus();
      }
    });

    console.log('Country search functionality added');
  }

  // Initialize the search functionality
  setupCountrySearch();

  // === Select Field Color Management ===
  function setupSelectFieldColors() {
    const selectFields = document.querySelectorAll('select');
    
    selectFields.forEach(select => {
      // Set initial color based on whether a value is selected
      updateSelectColor(select);
      
      // Add change event listener
      select.addEventListener('change', function() {
        updateSelectColor(this);
      });
      
      // Also listen for input events (for dynamic changes)
      select.addEventListener('input', function() {
        updateSelectColor(this);
      });
    });
  }

  function updateSelectColor(select) {
    const selectedOption = select.options[select.selectedIndex];
    const isPlaceholder = selectedOption && (
      selectedOption.value === '' || 
      selectedOption.value === 'Select one...' || 
      selectedOption.value === 'Select country' ||
      selectedOption.disabled
    );
    
    console.log('Select field:', select.id || select.name);
    console.log('Selected option:', selectedOption ? selectedOption.textContent : 'none');
    console.log('Is placeholder:', isPlaceholder);
    
    if (isPlaceholder) {
      select.style.color = '#D1D1D1'; // Light grey for placeholder
      select.classList.remove('has-value');
      console.log('Set to light grey');
    } else {
      select.style.color = '#212121'; // Dark color for selected value
      select.classList.add('has-value');
      console.log('Set to dark');
    }
  }

  // Initialize select field colors
  setupSelectFieldColors();
  
  // Fix phone input pattern (invalid regex in HTML)
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    // Replace invalid pattern with corrected version
    phoneInput.pattern = '^[0-9()\\-+\\s]{7,}$';
    console.log('Phone input pattern fixed');
  }

  // === Email Functionality ===
  
  // Initialize EmailJS (you'll need to add the EmailJS script to your HTML)
  // Add this to your HTML head: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
  
  // EmailJS configuration
  if (typeof emailjs !== 'undefined') {
    emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your EmailJS user ID
  }

  // Form submission handler - Only intercept if custom submission is enabled
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    console.log('Contact form found');
    
    // Check if custom submission is explicitly enabled
    if (contactForm.dataset.customSubmit === 'true') {
      console.log('Custom submission enabled - setting up custom handler');
      
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted - processing with custom handler...');
        
        // Validate form
        if (!validateForm()) {
          console.log('Form validation failed');
          return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('.submit-button');
      const originalText = submitButton.value;
      submitButton.value = 'Sending...';
      submitButton.disabled = true;
      
      // Collect form data
      const formData = collectFormData();
      console.log('Form data collected:', formData);
      
      // Send email using EmailJS
      sendEmail(formData)
        .then(() => {
          console.log('Email sent successfully');
          showSuccessMessage();
          contactForm.reset();
          // Reset country dropdown
          const countrySelect = document.getElementById('country');
          if (countrySelect) {
            countrySelect.innerHTML = '';
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = 'Select country';
            placeholder.selected = true;
            placeholder.disabled = true;
            countrySelect.appendChild(placeholder);
            
            // Re-populate countries
            const frag = document.createDocumentFragment();
            for (const name of COUNTRIES) {
              const opt = document.createElement('option');
              opt.value = name;
              opt.textContent = name;
              frag.appendChild(opt);
            }
            countrySelect.appendChild(frag);
          }
        })
        .catch((error) => {
          console.error('Email sending failed:', error);
          showErrorMessage();
        })
        .finally(() => {
          // Reset button state
          submitButton.value = originalText;
          submitButton.disabled = false;
        });
      });
    } else {
      console.log('Using native Webflow form submission - no custom interception');
      // Let Webflow handle the form submission natively
      // This will show the .w-form-done message automatically after successful submission
    }
  }

  // Form validation function
  function validateForm() {
    const requiredFields = [
      'first-name',
      'surname', 
      'email',
      'phone',
      'country',
      'message'
    ];
    
    const requiredSelects = [
      'country'
    ];
    
    // Check required text fields
    for (const fieldId of requiredFields) {
      const field = document.getElementById(fieldId);
      if (!field || !field.value.trim()) {
        showFieldError(fieldId, 'This field is required');
        return false;
      }
    }
    
    // Check required selects
    for (const selectId of requiredSelects) {
      const select = document.getElementById(selectId);
      if (!select || !select.value || select.value === '') {
        showFieldError(selectId, 'Please select an option');
        return false;
      }
    }
    
    // Validate email format
    const emailField = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
      showFieldError('email', 'Please enter a valid email address');
      return false;
    }
    
    // Validate phone format
    const phoneField = document.getElementById('phone');
    const phoneRegex = /^[0-9+\-() ]{7,}$/;
    if (!phoneRegex.test(phoneField.value)) {
      showFieldError('phone', 'Please enter a valid phone number');
      return false;
    }
    
    // Check privacy consent checkbox
    const privacyCheckbox = document.querySelector('input[name="consent_privacy"]');
    if (!privacyCheckbox || !privacyCheckbox.checked) {
      showFieldError('consent_privacy', 'You must agree to the privacy policy');
      return false;
    }
    
    return true;
  }

  // Show field error
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
      // Remove existing error styling
      field.classList.remove('error');
      
      // Add error styling
      field.classList.add('error');
      field.style.borderColor = '#C0392B';
      
      // Show error message
      let errorDiv = field.parentNode.querySelector('.field-error');
      if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#C0392B';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        field.parentNode.appendChild(errorDiv);
      }
      errorDiv.textContent = message;
      
      // Focus on the field
      field.focus();
      
      // Remove error after 5 seconds
      setTimeout(() => {
        field.classList.remove('error');
        field.style.borderColor = '';
        if (errorDiv) {
          errorDiv.remove();
        }
      }, 5000);
    }
  }

  // Collect form data
  function collectFormData() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    
    const data = {
      firstName: formData.get('first_name'),
      surname: formData.get('surname'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      country: formData.get('country'),
      city: formData.get('city'),
      company: formData.get('company'),
      profession: formData.get('profession'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      consentPrivacy: formData.get('consent_privacy') === 'on',
      consentNews: formData.get('consent_news') === 'on',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      pageUrl: window.location.href
    };
    
    return data;
  }

  // Send email using EmailJS
  function sendEmail(formData) {
    return new Promise((resolve, reject) => {
      if (typeof emailjs === 'undefined') {
        // Fallback: Use a simple fetch to a form submission service
        sendEmailFallback(formData)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // EmailJS template parameters
      const templateParams = {
        to_email: 'your-email@duva.com', // Replace with your email
        from_name: `${formData.firstName} ${formData.surname}`,
        from_email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        company: formData.company,
        profession: formData.profession,
        subject: formData.subject,
        message: formData.message,
        consent_privacy: formData.consentPrivacy ? 'Yes' : 'No',
        consent_news: formData.consentNews ? 'Yes' : 'No',
        timestamp: formData.timestamp
      };
      
      // Send email using EmailJS
      emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        templateParams
      )
      .then((response) => {
        console.log('EmailJS response:', response);
        resolve();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        reject(error);
      });
    });
  }

  // Fallback email sending method
  function sendEmailFallback(formData) {
    return new Promise((resolve, reject) => {
      // Use a form submission service like Formspree, Netlify Forms, or your own backend
      const form = document.getElementById('contact-form');
      
      // Option 1: Formspree (free tier available)
      // Change the action to your Formspree endpoint
      form.action = 'https://formspree.io/f/YOUR_FORMSPREE_ID';
      form.method = 'POST';
      
      // Option 2: Netlify Forms (if hosted on Netlify)
      // form.action = '/';
      // form.setAttribute('data-netlify', 'true');
      
      // Option 3: Custom backend endpoint
      // form.action = 'https://your-backend.com/api/contact';
      
      // Submit the form
      const formDataObj = new FormData(form);
      
      fetch(form.action, {
        method: 'POST',
        body: formDataObj,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          resolve();
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  // Show success message
  function showSuccessMessage() {
    const successDiv = document.querySelector('.w-form-done');
    const failDiv = document.querySelector('.w-form-fail');
    
    if (successDiv) {
      successDiv.style.display = 'block';
      if (failDiv) failDiv.style.display = 'none';
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        successDiv.style.display = 'none';
      }, 5000);
    }
  }

  // Show error message
  function showErrorMessage() {
    const failDiv = document.querySelector('.w-form-fail');
    const successDiv = document.querySelector('.w-form-done');
    
    if (failDiv) {
      failDiv.style.display = 'block';
      if (successDiv) successDiv.style.display = 'none';
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        failDiv.style.display = 'none';
      }, 5000);
    }
  }

  // Global function to test email functionality
  window.testEmailFunctionality = function() {
    console.log('🧪 Testing email functionality...');
    
    // Test form validation
    console.log('Testing form validation...');
    const isValid = validateForm();
    console.log('Form validation result:', isValid);
    
    // Test form data collection
    console.log('Testing form data collection...');
    const formData = collectFormData();
    console.log('Collected form data:', formData);
    
    return {
      formValidation: isValid,
      formData: formData
    };
  };
});

