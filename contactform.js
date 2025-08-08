/* === Contact Form Country Dropdown Enhancement === */
document.addEventListener('DOMContentLoaded', function () {
  console.log('Contact form script loaded');
  
  // Modal functionality
  let contactBtn = document.getElementById('contact-btn');
  let contactOverlay = document.getElementById('contact-overlay');
  let closeBtn = document.querySelector('.contact-close');

  console.log('Elements found:', {
    contactBtn: contactBtn,
    contactOverlay: contactOverlay,
    closeBtn: closeBtn
  });

  // Fallback: Try to find elements again after a short delay
  if (!contactBtn || !contactOverlay || !closeBtn) {
    setTimeout(() => {
      contactBtn = document.getElementById('contact-btn');
      contactOverlay = document.getElementById('contact-overlay');
      closeBtn = document.querySelector('.contact-close');
      
      console.log('Elements found after delay:', {
        contactBtn: contactBtn,
        contactOverlay: contactOverlay,
        closeBtn: closeBtn
      });
      
      if (contactBtn && contactOverlay && closeBtn) {
        setupModalEvents();
      }
    }, 1000);
  } else {
    setupModalEvents();
  }

  function setupModalEvents() {
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
    const overlay = document.getElementById('contact-overlay');
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
    const overlay = document.getElementById('contact-overlay');
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
