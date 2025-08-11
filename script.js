
/* === DUVA Filter Script (Complete Version) === */

// Filter state management
const filterState = {
  applicationType: [],
  mountingType: [],
  formFactor: [],
  featureLighting: [],
  performanceSpecs: {
    wattage: '',
    cct: '',
    beam: '',
    lumen: '',
    cri: '',
    ugr: '',
    efficacy: ''
  },
  technicalSpecs: {
    ip: '',
    ik: '',
    outdoor: '',
    indoor: '',
    finishcolor: ''
  }
};

// Input field configuration - Users can enter any value
const INPUT_FIELDS = {
  'Wattage': 'Wattage',
  'Lumen': 'Lumen',
  'CCT': 'CCT',
  'Beam': 'Beam',
  'CRI': 'CRI',
  'UGR': 'UGR',
  'Efficacy': 'Efficacy',
  'IP': 'IP',
  'IK': 'IK',
  'Finish Color': 'Finish Color'
};

// Initialize filter functionality
function initializeFilter() {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFilterComponents);
  } else {
    initializeFilterComponents();
  }
  
  // Retry initialization after a delay to catch late-loading CMS items
  setTimeout(() => {
    initializeFilterComponents();
  }, 3000);
  
  // Listen for Webflow's CMS load events
  if (window.Webflow) {
    window.Webflow.push(() => {
      initializeFilterComponents();
    });
  }
}

// Initialize all filter components
function initializeFilterComponents() {
  // Wait a bit for Webflow to render CMS items
  setTimeout(() => {
    initializeFilterToggle();
    initializeFilterFields();
    initializeApplyFilterButton();
    initializeResetFilterButton();
  }, 1000);
}

// Initialize filter toggle functionality
function initializeFilterToggle() {
  const filterBg = document.querySelector('.filter-bg');
  const filterHeader = document.querySelector('.filter-header-wrapper');
  const filterArrow = document.querySelector('.filter-header-toggle-arrow');
  
  if (filterBg && filterHeader) {
    // Ensure filter starts in collapsed state
    filterBg.classList.remove('expanded');
    if (filterArrow) {
      filterArrow.classList.remove('rotated');
    }
    
    // Remove any existing event listeners to prevent conflicts
    filterHeader.removeEventListener('click', handleFilterToggle);
    
    // Add the event listener
    filterHeader.addEventListener('click', handleFilterToggle);
    
  }
}

// Separate function for handling the toggle
function handleFilterToggle(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const filterBg = document.querySelector('.filter-bg');
  const filterArrow = document.querySelector('.filter-header-toggle-arrow');
  
  if (filterBg) {
    const isExpanded = filterBg.classList.contains('expanded');
    
    if (isExpanded) {
      // Collapse
      filterBg.classList.remove('expanded');
      if (filterArrow) {
        filterArrow.classList.remove('rotated');
      }
    } else {
      // Expand
      filterBg.classList.add('expanded');
      if (filterArrow) {
        filterArrow.classList.add('rotated');
      }
    }
    
  }
}

// Initialize filter fields (input fields only)
function initializeFilterFields() {
  // Initialize input fields
  const inputFields = document.querySelectorAll('.selection-filter-text');
  
  inputFields.forEach((field, index) => {
    const fieldType = getFieldType(field);
    
    // Replace the div with an input field
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'filter-input-field';
    input.placeholder = INPUT_FIELDS[fieldType] || 'Enter value';
    // CSS handles all styling for .filter-input-field
    
    // Replace the existing content
    const existingContent = field.querySelector('.text-filed');
    if (existingContent) {
      existingContent.replaceWith(input);
    }
    
    // Add input handler for manual entry
    input.addEventListener('input', () => {
      updateFieldFilterState(fieldType, input.value);
      applyFilters();
      
      // Update text label color based on input value
      const wrapper = field.closest('.sub-filter-wrapper');
      if (wrapper) {
        if (input.value.trim() !== '') {
          wrapper.classList.add('has-input');
        } else {
          wrapper.classList.remove('has-input');
        }
      }
    });
  });
  
  // Initialize checkboxes
  initializeFilterCheckboxes();
}

// Get field type from the field element
function getFieldType(field) {
  // First try to get from data-type attribute of the parent wrapper
  const parentWrapper = field.closest('[data-type]');
  if (parentWrapper) {
    const dataType = parentWrapper.getAttribute('data-type');
    if (dataType) {
      return dataType;
    }
  }
  
  // Fallback to text content
  const text = field.textContent || '';
  if (text.includes('Wattage')) return 'Wattage';
  if (text.includes('Lumen')) return 'Lumen';
  if (text.includes('CCT')) return 'CCT';
  if (text.includes('Beam')) return 'Beam';
  if (text.includes('CRI')) return 'CRI';
  if (text.includes('UGR')) return 'UGR';
      if (text.includes('Efficacy')) return 'Efficacy';
  if (text.includes('IP')) return 'IP';
  if (text.includes('IK')) return 'IK';
  if (text.includes('Finish')) return 'Finish Color';
  return 'Wattage'; // Default
}

// Initialize filter checkboxes
function initializeFilterCheckboxes() {
  const checkboxes = document.querySelectorAll('.sub-filter-wrapper');
  
  checkboxes.forEach((wrapper, index) => {
    const text = wrapper.querySelector('.sub-filter-wattage');
    const checkmark = wrapper.querySelector('.filter-checkmark');
    
    if (text && checkmark) {
      // Add click handler only to the checkmark
      checkmark.addEventListener('click', () => {
        const isActive = wrapper.classList.contains('active');
        
        if (isActive) {
          // Uncheck
          wrapper.classList.remove('active');
          checkmark.classList.remove('active');
          const filterType = getCheckboxFilterType(wrapper);
          const filterValue = text.textContent.trim().toLowerCase();
          
          if (filterType === 'applicationType') {
            filterState.applicationType = filterState.applicationType.filter(v => v !== filterValue);
          } else if (filterType === 'mountingType') {
            filterState.mountingType = filterState.mountingType.filter(v => v !== filterValue);
          } else if (filterType === 'formFactor') {
            filterState.formFactor = filterState.formFactor.filter(v => v !== filterValue);
          } else if (filterType === 'featureLighting') {
            filterState.featureLighting = filterState.featureLighting.filter(v => v !== filterValue);
          }
        } else {
          // Check
          wrapper.classList.add('active');
          checkmark.classList.add('active');
          const filterType = getCheckboxFilterType(wrapper);
          const filterValue = text.textContent.trim().toLowerCase();
          
          if (filterType === 'applicationType') {
            if (!filterState.applicationType.includes(filterValue)) {
              filterState.applicationType.push(filterValue);
            }
          } else if (filterType === 'mountingType') {
            if (!filterState.mountingType.includes(filterValue)) {
              filterState.mountingType.push(filterValue);
            }
          } else if (filterType === 'formFactor') {
            if (!filterState.formFactor.includes(filterValue)) {
              filterState.formFactor.push(filterValue);
            }
          } else if (filterType === 'featureLighting') {
            if (!filterState.featureLighting.includes(filterValue)) {
              filterState.featureLighting.push(filterValue);
            }
          }
        }
        
        applyFilters();
      });
    }
  });
}

// Get checkbox filter type
function getCheckboxFilterType(wrapper) {
  // First try to get from data-filter attribute of parent
  const parentFilter = wrapper.closest('[data-filter]');
  if (parentFilter) {
    const filterType = parentFilter.getAttribute('data-filter');
    if (filterType === 'Application Type') return 'applicationType';
    if (filterType === 'Mounting Type') return 'mountingType';
    if (filterType === 'Form Factor') return 'formFactor';
    if (filterType === 'Feature Lighting') return 'featureLighting';
  }
  
  // Fallback to text content
  const text = wrapper.querySelector('.sub-filter-wattage')?.textContent || '';
  const lowerText = text.toLowerCase();
  if (lowerText.includes('outdoor') || lowerText.includes('indoor') || lowerText.includes('facade') || 
      lowerText.includes('retail') || lowerText.includes('landscape') || lowerText.includes('architectural') || lowerText.includes('weatherproof')) {
    return 'applicationType';
  } else if (lowerText.includes('surface') || lowerText.includes('recessed') || lowerText.includes('flex') || 
             lowerText.includes('pendant') || lowerText.includes('track') || lowerText.includes('bollard')) {
    return 'mountingType';
  } else if (lowerText.includes('linear') || lowerText.includes('circular') || lowerText.includes('square') || 
             lowerText.includes('spotlight') || lowerText.includes('downlight') || lowerText.includes('floodlight') ||
             lowerText.includes('strip') || lowerText.includes('tube') || lowerText.includes('trimless') ||
             lowerText.includes('round') || lowerText.includes('rectangular') || lowerText.includes('oval') ||
             lowerText.includes('wall') || lowerText.includes('ceiling') || lowerText.includes('floor') ||
             lowerText.includes('step') || lowerText.includes('path') || lowerText.includes('garden') ||
             lowerText.includes('post') || lowerText.includes('bollard') || lowerText.includes('column') ||
             lowerText.includes('pendant') || lowerText.includes('track') || lowerText.includes('surface') ||
             lowerText.includes('recessed') || lowerText.includes('flex') || lowerText.includes('flexible') ||
             lowerText.includes('led') || lowerText.includes('bulb') || lowerText.includes('lamp') ||
             lowerText.includes('fixture') || lowerText.includes('luminaire') || lowerText.includes('lighting')) {
    return 'formFactor';
  } else if (lowerText.includes('custom') || lowerText.includes('customlight') || lowerText.includes('customlights') || 
             lowerText.includes('decorative') || lowerText.includes('decorativelight') || lowerText.includes('decorativelights')) {
    return 'featureLighting';
  }
  return 'applicationType'; // Default
}

// Update field filter state
function updateFieldFilterState(fieldType, value) {
  if (fieldType === 'Wattage') {
    filterState.performanceSpecs.wattage = value;
  } else if (fieldType === 'CCT') {
    filterState.performanceSpecs.cct = value;
  } else if (fieldType === 'Beam') {
    filterState.performanceSpecs.beam = value;
  } else if (fieldType === 'CRI') {
    filterState.performanceSpecs.cri = value;
  } else if (fieldType === 'UGR') {
    filterState.performanceSpecs.ugr = value;
  } else if (fieldType === 'Efficacy') {
    filterState.performanceSpecs.efficacy = value;
  } else if (fieldType === 'IP') {
    filterState.technicalSpecs.ip = value;
  } else if (fieldType === 'IK') {
    filterState.technicalSpecs.ik = value;
  } else if (fieldType === 'Finish Color') {
    filterState.technicalSpecs.finishcolor = value;
  }
}

// Initialize apply filter button
function initializeApplyFilterButton() {
  const applyButton = document.querySelector('.filter-apply-button');
  if (applyButton) {
    applyButton.addEventListener('click', () => {
      closeAllDropdowns();
      applyFilters();
    });
  }
}

// Initialize reset filter button
function initializeResetFilterButton() {
  const resetButton = document.querySelector('.filter-reset-button');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      resetAllFilters();
    });
  }
}

// Reset all filters
function resetAllFilters() {
  // Reset filter state
  filterState.applicationType = [];
  filterState.mountingType = [];
  filterState.formFactor = [];
  filterState.featureLighting = [];
  filterState.performanceSpecs = { wattage: '', cct: '', beam: '', lumen: '', cri: '', ugr: '', efficacy: '' };
  filterState.technicalSpecs = { ip: '', ik: '', outdoor: '', indoor: '', finishcolor: '' };
  
  // Reset checkboxes - remove active class from both wrapper and checkbox
  document.querySelectorAll('.sub-filter-wrapper').forEach(wrapper => {
    wrapper.classList.remove('active');
    const checkmark = wrapper.querySelector('.filter-checkmark');
    if (checkmark) {
      checkmark.classList.remove('active');
    }
  });
  
  // Reset input fields
  document.querySelectorAll('.filter-input-field').forEach(input => {
    input.value = '';
    
    // Reset text label color for input fields
    const wrapper = input.closest('.sub-filter-wrapper');
    if (wrapper) {
      wrapper.classList.remove('has-input');
    }
  });
  
  // Clear main page category filter from URL
  const url = new URL(window.location);
  url.searchParams.delete('category');
  
  // Update URL without page reload
  window.history.replaceState({}, '', url);
  
  // Close all dropdowns
  closeAllDropdowns();
  
  // Show all products
  showAllProducts();
}

// Close all dropdowns (no longer needed but kept for compatibility)
function closeAllDropdowns() {
  // No dropdowns to close in input-only version
}

// Get CMS data from Webflow collection item
function getCMSDataFromCard(card) {
  const cmsData = {
    productCode: '',
    name: '',
    family: '',
    shortDescription: '',
    fullDescription: '',
    wattage: '',
    lumen: '',
    cct: '',
    voltage: '',
    overviewTitle: '',
    ipRating: '',
    ikRating: '',
    beamAngle: '',
    cri: '',
    location: '',
    finishColor: '',
    searchTags: '',
    allText: ''
  };
  
  // Method 1: Try to get data from Webflow's data attributes (exact field names from CSV)
  if (card.dataset) {
    cmsData.productCode = card.dataset.productCode || card.dataset['product-code'] || '';
    cmsData.name = card.dataset.name || card.dataset['name-en'] || '';
    cmsData.family = card.dataset.family || card.dataset.familyname || '';
    cmsData.shortDescription = card.dataset.shortDescription || card.dataset['short-description'] || '';
    cmsData.fullDescription = card.dataset.fullDescription || card.dataset['full-description'] || '';
    cmsData.wattage = card.dataset.wattage || '';
    cmsData.lumen = card.dataset.lumen || '';
    cmsData.cct = card.dataset.cct || '';
    cmsData.voltage = card.dataset.voltage || '';
    cmsData.overviewTitle = card.dataset.overviewTitle || card.dataset['overview-title'] || '';
    cmsData.ipRating = card.dataset.ipRating || card.dataset['ip-rating'] || card.dataset.ip || '';
    cmsData.ikRating = card.dataset.ikRating || card.dataset['ik-rating'] || card.dataset.ik || '';
    cmsData.beamAngle = card.dataset.beamAngle || card.dataset['beam-angle'] || card.dataset.beam || '';
    cmsData.cri = card.dataset.cri || '';
    cmsData.location = card.dataset.location || '';
    cmsData.finishColor = card.dataset.finishColor || card.dataset['finish-color'] || '';
    cmsData.searchTags = card.dataset.searchTags || card.dataset['search-tags'] || card.dataset.tags || '';
  }
  
  // Method 2: Try to get data from Webflow's CMS binding elements
  const searchTagsElement = card.querySelector('[data-wf-cms-bind="search-tags"], [data-wf-cms-bind="searchTags"], [data-wf-cms-bind="tags"]');
  if (searchTagsElement) {
    cmsData.searchTags = searchTagsElement.textContent || searchTagsElement.innerText || '';
  }
  
  // Method 3: Fallback to visible text content
  const allText = card.textContent || card.innerText || '';
  cmsData.allText = allText.toLowerCase();
  
  return cmsData;
}

// Check if a product matches the filter criteria using CMS data
function checkProductMatchWithCMSData(cmsData) {
  
  // Check application type filters
  if (filterState.applicationType.length > 0) {
    const searchText = cmsData.allText;
    const hasMatchingApplication = filterState.applicationType.some(type => 
      searchText.includes(type.toLowerCase())
    );
    if (!hasMatchingApplication) {
      return false;
    }
  }
  
  // Note: Category filtering is now handled by script.js through simulated clicks
  // This ensures proper sync with filterState and visual consistency
  
  // Check mounting type filters
  if (filterState.mountingType.length > 0) {
    const searchText = cmsData.allText;
    const hasMatchingMounting = filterState.mountingType.some(type => 
      searchText.includes(type.toLowerCase())
    );
    if (!hasMatchingMounting) {
      return false;
    }
  }
  
  // Check form factor filters
  if (filterState.formFactor.length > 0) {
    const searchText = cmsData.allText;
    const hasMatchingFormFactor = filterState.formFactor.some(type => 
      searchText.includes(type.toLowerCase())
    );
    if (!hasMatchingFormFactor) {
      return false;
    }
  }

  // Check feature lighting filters
  if (filterState.featureLighting.length > 0) {
    const searchText = cmsData.allText;
    const hasMatchingFeatureLighting = filterState.featureLighting.some(type => 
      searchText.includes(type.toLowerCase())
    );
    if (!hasMatchingFeatureLighting) {
      return false;
    }
  }
  
  // Check performance specs
  for (const [key, value] of Object.entries(filterState.performanceSpecs)) {
    if (value && value.trim() !== '') {
      const searchValue = value.toLowerCase().trim();
      let found = false;
      
      // First priority: Check Search Tags field
      if (cmsData.searchTags) {
        const searchTags = cmsData.searchTags.toLowerCase();
        const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        found = regex.test(searchTags);
      }
      
      // Second priority: Check specific CMS fields
      if (!found) {
        if (key === 'cct' && cmsData.cct) {
          const cctValues = cmsData.cct.toLowerCase().split(',').map(v => v.trim());
          found = cctValues.some(val => val === searchValue);
        }
        
        if (key === 'lumen' && cmsData.lumen) {
          const lumenValues = cmsData.lumen.toLowerCase().split(',').map(v => v.trim());
          found = lumenValues.some(val => val === searchValue);
        }
        
        if (key === 'beam' && cmsData.beamAngle) {
          const beamValues = cmsData.beamAngle.toLowerCase().split(',').map(v => v.trim());
          found = beamValues.some(val => val === searchValue);
        }
        
        if (key === 'cri' && cmsData.cri) {
          const criValues = cmsData.cri.toLowerCase().split(',').map(v => v.trim());
          found = criValues.some(val => val === searchValue);
        }
        
        if (key === 'wattage' && cmsData.wattage) {
          const wattageValues = cmsData.wattage.toLowerCase().split(',').map(v => v.trim());
          found = wattageValues.some(val => val === searchValue);
        }
      }
      
      // Third priority: Check in all text
      if (!found) {
        const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        found = regex.test(cmsData.allText);
      }
      
      if (!found) {
        return false;
      }
    }
  }
  
  // Check technical specs
  for (const [key, value] of Object.entries(filterState.technicalSpecs)) {
    if (value && value.trim() !== '') {
      const searchValue = value.toLowerCase().trim();
      let found = false;
      
      // First priority: Check Search Tags field
      if (cmsData.searchTags) {
        const searchTags = cmsData.searchTags.toLowerCase();
        const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        found = regex.test(searchTags);
      }
      
      // Second priority: Check specific CMS fields
      if (!found) {
        if (key === 'ip' && cmsData.ipRating) {
          const ipValues = cmsData.ipRating.toLowerCase().split(',').map(v => v.trim());
          found = ipValues.some(val => val === searchValue);
        }
        
        if (key === 'ik' && cmsData.ikRating) {
          const ikValues = cmsData.ikRating.toLowerCase().split(',').map(v => v.trim());
          found = ikValues.some(val => val === searchValue);
        }
        
        if (key === 'outdoor' && cmsData.location) {
          found = cmsData.location.toLowerCase() === searchValue;
        }
        
        if (key === 'indoor' && cmsData.location) {
          found = cmsData.location.toLowerCase() === searchValue;
        }
        
        if (key === 'finishcolor' && cmsData.finishColor) {
          const finishValues = cmsData.finishColor.toLowerCase().split(',').map(v => v.trim());
          found = finishValues.some(val => val === searchValue);
        }
      }
      
      // Third priority: Check in all text
      if (!found) {
        const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        found = regex.test(cmsData.allText);
      }
      
      if (!found) {
        return false;
      }
    }
  }
  
  return true;
}

// Apply filters to show/hide products
function applyFilters() {
  
  const cardsContainer = document.querySelector('.cards-container');
  if (!cardsContainer) {
    return;
  }
  
  const productCards = cardsContainer.querySelectorAll('.collection-item, .w-dyn-item');
  const noResultsMessage = document.querySelector('.no-results-message');
  
  let visibleCount = 0;
  
  productCards.forEach(card => {
    const cmsData = getCMSDataFromCard(card);
    const matches = checkProductMatchWithCMSData(cmsData);
    
    if (matches) {
      // Remove any inline display style to let CSS handle the layout
      card.style.removeProperty('display');
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show/hide no results message
  if (noResultsMessage) {
    if (visibleCount === 0) {
      // No cards match the filter
      noResultsMessage.style.display = 'block';
    } else {
      // Cards are visible
      noResultsMessage.style.display = 'none';
    }
  }
  
}

// Show all products
function showAllProducts() {
  const cardsContainer = document.querySelector('.cards-container');
  if (!cardsContainer) return;
  
  const productCards = cardsContainer.querySelectorAll('.collection-item, .w-dyn-item');
  const noResultsMessage = document.querySelector('.no-results-message');
  
  productCards.forEach(card => {
    // Remove any inline display style to let CSS handle the layout
    card.style.removeProperty('display');
  });
  
  // Hide no results message when showing all products
  if (noResultsMessage) {
    noResultsMessage.style.display = 'none';
  }
  
}

// === DUVA public API + URL category bootstrap ===
(function () {
  // normalize helper
  const norm = s => (s || '').toLowerCase().replace(/\s+/g,'').replace(/[-_]/g,'');

  // Public: activate a filter checkbox by its visible label text.
  function activateCheckboxByLabel(label) {
    console.log(`🔍 DUVA API: Looking for filter with label: "${label}"`);
    const wanted = norm(label);
    console.log(`🔍 DUVA API: Normalized to: "${wanted}"`);
    
    const wrappers = document.querySelectorAll('.sub-filter-wrapper');
    console.log(`🔍 DUVA API: Found ${wrappers.length} filter wrappers`);
    
    for (const w of wrappers) {
      const txtEl = w.querySelector('.sub-filter-wattage');
      const check = w.querySelector('.filter-checkmark');
      if (!txtEl || !check) {
        console.log('🔍 DUVA API: Skipping wrapper - missing text or checkbox');
        continue;
      }
      
      const current = norm(txtEl.textContent.trim());
      console.log(`🔍 DUVA API: Checking "${txtEl.textContent.trim()}" -> normalized: "${current}"`);
      
      if (current === wanted) {
        console.log(`✅ DUVA API: Found exact match!`);
        // Only click if not already active (so we don't toggle it off)
        if (!w.classList.contains('active')) {
          console.log('✅ DUVA API: Clicking checkbox...');
          check.click(); // uses existing listeners -> updates filterState + applies filters
        } else {
          console.log('✅ DUVA API: Filter already active, applying filters...');
          // already active, still make sure filters are applied
          applyFilters();
        }
        // Clean URL param so it won't refire
        const url = new URL(window.location);
        url.searchParams.delete('category');
        window.history.replaceState({}, '', url);
        console.log('✅ DUVA API: Success!');
        return true;
      }
    }
    
    console.log(`❌ DUVA API: No match found for "${label}" (normalized: "${wanted}")`);
    return false;
  }

  // Map URL keys to the **visible** checkbox labels on the products page
  const CATEGORY_MAP = {
    // Application Type
    'outdoor': 'Outdoor',
    'indoor': 'Indoor',
    'weatherproof': 'Weatherproof',
    'facade': 'Facade',
    // Mounting (if you want them routed too)
    'flexstrip': 'Flex Strip',
    // Feature lighting / special
    'custom-light': 'Custom Lights',
    'customlight': 'Custom Lights',
    'decorative-light': 'Decorative Lights',
    'decorativelights': 'Decorative Lights'
  };

  // Try to apply ?category=... once filters are ready
  function applyCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('category');
    if (!raw) return;

    const key = raw.trim().toLowerCase();
    const label = CATEGORY_MAP[key] || raw;

    // We need checkboxes to exist & listeners bound
    const tryApply = (tries = 10) => {
      if (document.querySelectorAll('.sub-filter-wrapper .filter-checkmark').length) {
        if (!activateCheckboxByLabel(label)) {
          // fallback: partial match
          const wrappers = document.querySelectorAll('.sub-filter-wrapper');
          for (const w of wrappers) {
            const txt = w.querySelector('.sub-filter-wattage')?.textContent?.trim() || '';
            if (norm(txt).includes(norm(label))) {
              const check = w.querySelector('.filter-checkmark');
              if (!w.classList.contains('active')) check?.click();
              applyFilters();
              const url = new URL(window.location);
              url.searchParams.delete('category');
              window.history.replaceState({}, '', url);
              return;
            }
          }
        }
      } else if (tries > 0) {
        setTimeout(() => tryApply(tries - 1), 200);
      }
    };
    tryApply();
  }

  // Debug function to show all available filter options
  function debugFilterOptions() {
    console.log('🔍 === DUVA FILTER OPTIONS DEBUG ===');
    const wrappers = document.querySelectorAll('.sub-filter-wrapper');
    console.log(`Found ${wrappers.length} filter wrappers:`);
    
    wrappers.forEach((wrapper, index) => {
      const textEl = wrapper.querySelector('.sub-filter-wattage');
      const checkmark = wrapper.querySelector('.filter-checkmark');
      const isActive = wrapper.classList.contains('active');
      
      if (textEl) {
        const text = textEl.textContent.trim();
        const normalized = norm(text);
        console.log(`${index + 1}. Text: "${text}" | Normalized: "${normalized}" | Active: ${isActive} | Has checkbox: ${!!checkmark}`);
      }
    });
    console.log('🔍 === END DUVA DEBUG ===');
  }

  // Expose a tiny public API in case you ever want to call it from elsewhere
  window.DUVA_FILTER = Object.assign(window.DUVA_FILTER || {}, {
    applyCategoryFromURL,
    activateCheckboxByLabel,
    debugFilterOptions
  });

  // Hook into your init flow: run after components are initialized
  const _origInit = initializeFilterComponents;
  window.initializeFilterComponents = function() {
    _origInit.apply(this, arguments);
    // give the DOM a tick so checkboxes/listeners exist
    setTimeout(() => applyCategoryFromURL(), 150);
  };
})();


// Start the filter when the page loads
initializeFilter();

// Note: Category filtering is now handled by script.js through simulated clicks
// This ensures proper sync with filterState and visual consistency
