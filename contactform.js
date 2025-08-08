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
  
  // Check for close button
  const closeBtn = document.querySelector('.contact-close');
  
  console.log('📋 Element Search Results:', {
    contactBtnById: contactBtnById,
    contactBtnByClass: contactBtnByClass,
    contactBtnByText: contactBtnByText,
    contactOverlayById: contactOverlayById,
    contactOverlayByClass: contactOverlayByClass,
    contactOverlayByData: contactOverlayByData,
    closeBtn: closeBtn
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
  
  // Also check if we're on the contact page and should auto-open
  const isContactPage = window.location.pathname.includes('contact') || 
                       window.location.pathname.includes('contact-us') ||
                       window.location.pathname.includes('form');
  
  if ((shouldOpenModal || isContactPage) && contactOverlay) {
    console.log('🔄 Auto-opening modal from URL parameter or contact page');
    setTimeout(() => {
      contactOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log('Modal opened from URL parameter or contact page');
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
      let closeBtn = document.querySelector('.contact-close');
      
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
        console.log('Contact button clicked');
        if (contactOverlay) {
          contactOverlay.classList.add('active');
          document.body.style.overflow = 'hidden';
          console.log('Modal opened');
        } else {
          console.error('Contact overlay not found');
        }
      });
    } else {
      console.error('Contact button not found');
    }

    // Close modal when close button is clicked
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Close button clicked');
        if (contactOverlay) {
          contactOverlay.classList.remove('active');
          document.body.style.overflow = '';
          console.log('Modal closed');
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
          contactOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Ensure modal is hidden on page load
    if (contactOverlay) {
      contactOverlay.classList.remove('active');
      console.log('Modal hidden on page load');
    }
  }

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && contactOverlay && contactOverlay.classList.contains('active')) {
      console.log('Escape key pressed');
      contactOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Manual trigger function (for testing)
  window.openContactModal = function() {
    const overlay = document.getElementById('contact-overlay') || document.querySelector('.contact-overlay');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log('Modal opened manually');
    } else {
      console.error('Contact overlay not found for manual trigger');
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

  // Main page header contact button handler
  const mainPageContactBtn = document.getElementById('contact-btn');
  if (mainPageContactBtn && !contactOverlay) {
    console.log('📍 Main page contact button found - setting up redirect');
    mainPageContactBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Main page contact button clicked');
      
      // Navigate to the contact-us page
      window.location.href = '/contact-us';
    });
  }

  // Test modal functionality immediately
  if (contactOverlay && closeBtn) {
    console.log('✅ Modal elements found - testing functionality');
    
    // Test manual modal opening (but don't auto-close)
    setTimeout(() => {
      console.log('🧪 Testing modal open...');
      contactOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log('✅ Modal test completed successfully');
    }, 1000);
  }

  // Enhanced button detection - look for any button with "contact" text
  const allContactButtons = Array.from(document.querySelectorAll('a, button, .w-button')).filter(el => 
    el.textContent.toLowerCase().includes('contact') || 
    el.getAttribute('href')?.includes('contact') ||
    el.className.toLowerCase().includes('contact')
  );
  
  console.log('🔍 Found contact-related buttons:', allContactButtons);
  
  if (allContactButtons.length > 0 && contactOverlay) {
    console.log('🎯 Setting up contact button events');
    allContactButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Contact button clicked:', btn.textContent);
        if (contactOverlay) {
          contactOverlay.classList.add('active');
          document.body.style.overflow = 'hidden';
          console.log('Modal opened from contact button');
        }
      });
    });
  }

  // Simple test function to open modal manually
  window.testModal = function() {
    console.log('🧪 Manual modal test');
    if (contactOverlay) {
      contactOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log('✅ Modal opened manually');
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        contactOverlay.classList.remove('active');
        document.body.style.overflow = '';
        console.log('✅ Modal closed automatically');
      }, 3000);
    } else {
      console.error('❌ Modal overlay not found');
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
});
