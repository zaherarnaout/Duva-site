console.log("DUVA script.js loaded!");
console.log("🎯 Flip card functionality should be working!");
console.log("TESTING - If you see this, the script is loading!");

/* === Auto Filter on Page Load via URL === */
function applyCategoryFilterFromURL() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  if (category) {
    // Clean category value (just in case)
    const cleanCategory = category.trim().toLowerCase();
    console.log(`🔍 Auto-filter: Processing category parameter: ${cleanCategory}`);

    // Wait for the filter system to be ready
    let retryCount = 0;
    const maxRetries = 20; // 10 seconds maximum wait time
    
    const waitForFilterSystem = () => {
      console.log(`🔍 Looking for filter matching: ${cleanCategory}`);
      
      // Check if filter system is ready (look for filter checkboxes)
      const filterOptions = document.querySelectorAll('.sub-filter-wrapper');
      console.log(`🔍 Found ${filterOptions.length} filter options`);
      
      // If no filter options found, wait and retry
      if (filterOptions.length === 0) {
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error('❌ Filter system not ready after maximum retries');
          return;
        }
        console.log(`⏳ Filter system not ready yet, retrying in 500ms... (attempt ${retryCount}/${maxRetries})`);
        setTimeout(waitForFilterSystem, 500);
        return;
      }
      
      let foundFilter = false;
      
      filterOptions.forEach((option, index) => {
        const textElement = option.querySelector('.sub-filter-wattage');
        if (textElement) {
          const optionText = textElement.textContent.trim().toLowerCase();
          console.log(`🔍 Filter option ${index}: "${optionText}"`);
          
          if (optionText.includes(cleanCategory) || cleanCategory.includes(optionText)) {
            // Check in ALL filter sections, not just Application Type
            const parentFilter = option.closest('[data-filter]');
            if (parentFilter) {
              const checkmark = option.querySelector('.filter-checkmark');
              if (checkmark && !option.classList.contains('active')) {
                console.log(`✅ Found matching filter: ${optionText} in section: ${parentFilter.getAttribute('data-filter')}`);
                // Simulate the click to trigger the filter
                checkmark.click();
                foundFilter = true;
                console.log(`✅ Auto-filter: Found and activated filter for category: ${cleanCategory}`);
              } else {
                console.log(`⚠️ Filter already active or no checkmark found: ${optionText}`);
              }
            } else {
              console.log(`⚠️ Filter not in any recognized section: ${optionText}`);
            }
          }
        }
      });

      if (!foundFilter) {
        console.warn(`⚠️ Auto-filter: No filter button found for category: ${cleanCategory}`);
        
        // Fallback: Try to use the global search
        const searchInput = document.getElementById('globalSearchInput');
        if (searchInput) {
          searchInput.value = cleanCategory;
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          console.log(`🔍 Auto-filter: Using global search as fallback for category: ${cleanCategory}`);
        }
      }
    };
    
    // Start waiting for filter system
    setTimeout(waitForFilterSystem, 1000); // Initial delay
  }
}

// Initialize auto-filter when DOM is ready
document.addEventListener("DOMContentLoaded", applyCategoryFilterFromURL);

// Also initialize when Webflow loads
if (typeof Webflow !== 'undefined') {
  Webflow.push(function() {
    applyCategoryFilterFromURL();
  });
}

// Retry after a delay to catch late-loading content
setTimeout(applyCategoryFilterFromURL, 3000);

/* === Category Cards Navigation === */
function initializeCategoryCards() {
  console.log('🎯 Initializing category cards navigation...');
  
  // Define category mappings - updated to match actual filter text
  const categoryMappings = {
    'outdoor': 'outdoor',
    'indoor': 'indoor', 
    'flexstrip': 'flex strip',
    'customlight': 'custom lights',
    'decorativelights': 'decorative lights',
    'weatherproof': 'weather proof'
  };
  
  // Find all category cards in the main page categories wrapper
  const categoryCards = document.querySelectorAll('.main-page-categories-wrapper a');
  
  categoryCards.forEach((card, index) => {
    // Get the text content to identify the category
    const textElement = card.querySelector('.text-block-48, .text-block-49, .text-block-50, .text-block-51, .text-block-52, .text-block-53');
    
    if (textElement) {
      const categoryText = textElement.textContent.trim().toLowerCase();
      console.log(`🔍 Found category card: ${categoryText}`);
      
      // Find matching category key
      let categoryKey = null;
      for (const [key, value] of Object.entries(categoryMappings)) {
        if (categoryText.includes(key) || key.includes(categoryText)) {
          categoryKey = key;
          break;
        }
      }
      
      if (categoryKey) {
        console.log(`✅ Mapping category "${categoryText}" to "${categoryKey}"`);
        
        // Add click event listener
        card.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Get the products page URL using the same logic as navigateToProductsPage
          let productsPageURL = 'products.html';
          
          // Check if we can find a products link on the page
          const productsLinks = document.querySelectorAll('a[href*="products"], a[href*="product"], a[href*="collection"]');
          if (productsLinks.length > 0) {
            // Use the first products link found
            productsPageURL = productsLinks[0].getAttribute('href');
            // Ensure it's a relative URL
            if (productsPageURL.startsWith('http')) {
              const url = new URL(productsPageURL);
              productsPageURL = url.pathname;
            }
          }
          
          // Navigate to products page with category filter
          const filteredURL = `${productsPageURL}?category=${categoryKey}`;
          console.log(`🚀 Navigating to: ${filteredURL}`);
          
          // Check if the URL is valid before navigating
          if (productsPageURL === 'products.html') {
            console.warn('⚠️ No products page found, using fallback navigation');
            // Try to navigate to the current page with category parameter
            const currentURL = new URL(window.location.href);
            currentURL.searchParams.set('category', categoryKey);
            window.location.href = currentURL.toString();
          } else {
            // Navigate to the filtered products page
            window.location.href = filteredURL;
          }
        });
        
        // Add visual feedback that it's clickable
        card.style.cursor = 'pointer';
        card.setAttribute('title', `View ${categoryText} products`);
        
        console.log(`✅ Category card "${categoryText}" is now clickable`);
      } else {
        console.warn(`⚠️ No mapping found for category: ${categoryText}`);
      }
    }
  });
  
  console.log(`🎯 Category cards initialization complete. Found ${categoryCards.length} cards.`);
}

// Initialize category cards when DOM is ready
document.addEventListener("DOMContentLoaded", initializeCategoryCards);

// Also initialize when Webflow loads
if (typeof Webflow !== 'undefined') {
  Webflow.push(function() {
    initializeCategoryCards();
  });
}

// Quick test to see if flip card elements exist
setTimeout(() => {
  console.log("TIMEOUT TEST - Script is still running after 1 second");
  const flipCardWrappers = document.querySelectorAll('.flip-card-wrapper');
  const flipCardLinks = document.querySelectorAll('.flip-card-link');
  console.log('🔍 Quick test - Flip card elements found:', {
    wrappers: flipCardWrappers.length,
    links: flipCardLinks.length
  });
}, 1000);

/* === Accessories Image Zoom on Hover (Constrained to Container) === */ 

document.querySelectorAll('.accessory-image').forEach(container => { 

  const img = container.querySelector('img'); 

 

  container.style.overflow = 'hidden'; // Keeps zoomed image inside the box 

 

  container.addEventListener('mouseenter', () => { 

    img.classList.add('zoomed'); 

  }); 

 

  container.addEventListener('mousemove', e => { 

    const rect = container.getBoundingClientRect(); 

    const x = ((e.clientX - rect.left) / rect.width) * 100; 

    const y = ((e.clientY - rect.top) / rect.height) * 100; 

    img.style.transformOrigin = `${x}% ${y}%`; 

  }); 

 

  container.addEventListener('mouseleave', () => { 

    img.classList.remove('zoomed'); 

    img.style.transformOrigin = 'center center'; 

  }); 

}); 

 

/* === 2. Thumbnail Image Selector === */ 
/* REMOVED - Duplicate thumbnail handler, using critical fixes version instead */ 

 

/* === 3. Dropdown + Code Generator + Accessories Logic === */ 

// Full working logic from your working file, manually verified and retained 

 

 

 

  // Thumbnail functionality consolidated with main dropdown logic below 

 

 

 

document.addEventListener("DOMContentLoaded", function () { 

  // === Global Selectors & State === 

  const dropdowns = document.querySelectorAll(".dropdown-wrapper"); 

  const ralInput = document.querySelector("#ral-input"); 

 

  // === RAL Input Initial Setup === 

  if (ralInput) { 

    ralInput.style.display = "none"; 

    ralInput.textContent = "Enter RAL color number (e.g., 1015)"; 

    ralInput.setAttribute("contenteditable", "true"); 

    ralInput.style.color = "#999"; 

    ralInput.style.padding = "12px 16px"; 

    ralInput.style.minHeight = "48px"; 

    ralInput.style.backgroundColor = "#fff"; 

    ralInput.style.borderRadius = "20px"; 

    ralInput.style.cursor = "text"; 
    
    ralInput.style.border = "1px solid var(--border-main-shadow)";
    
    ralInput.style.width = "280px";
    
    ralInput.style.fontSize = "14px";
    
    ralInput.style.fontFamily = "inherit";
    
    ralInput.style.lineHeight = "1.4";
    
    ralInput.style.transition = "all 0.3s ease";
    
    ralInput.style.outline = "none";
    
    ralInput.style.resize = "none";
    
    ralInput.style.overflow = "hidden";

  } 

 

  // === Global Selection State === 

  window.currentSelection = { 

    product: document.querySelector("#product-code-heading")?.textContent.trim() || null, 

    watt: null, 

    cct: null, 

    cri: null, 

    finish: null, 

    defaults: {} 

  }; 

 

  // === Reset Button Setup === 

  const resetButton = document.querySelector(".reset-button"); 

  if (resetButton) { 

    resetButton.style.display = "flex"; 

    resetButton.style.alignItems = "center"; 

    resetButton.style.justifyContent = "center"; 

  } 

 

  // === Reset Button Handler === 

  resetButton?.addEventListener("click", () => { 

    dropdowns.forEach(dropdown => { 

      const type = dropdown.getAttribute("data-type"); 

      const selected = dropdown.querySelector(".selected-value"); 

      const source = dropdown.querySelector(".dropdown-source"); 

 

      if (!type || !selected || !source) return; 

 

      const rawText = source.textContent.trim(); 

      const values = [...new Set(rawText.split(",").map(v => v.trim()).filter(v => v))]; 

      const firstValue = values[0] || "XX"; 

 

      selected.textContent = firstValue; 

      window.currentSelection[type] = firstValue; 

      window.currentSelection.defaults[type] = normalizeValue(type, firstValue); 

 

      // RAL reset logic 

      if (type === "finish") { 

        if (firstValue.toLowerCase() === "ral") { 

          ralInput.style.display = "block"; 

          ralInput.textContent = "Enter RAL number here"; 

          ralInput.style.color = "#999"; 

          window.currentSelection.finish = "RAL"; 

        } else { 

          ralInput.style.display = "none"; 

          ralInput.textContent = "Enter RAL number here"; 

          ralInput.style.color = "#999"; 

        } 

      } 

    }); 

 

    updateLumenValue(); 

    updateOrderingCode(); 

  }); 

 

  // === Dropdown Setup & Interactions === 

  dropdowns.forEach(dropdown => { 

    const type = dropdown.getAttribute("data-type"); 

    const source = dropdown.querySelector(".dropdown-source"); 

    const field = dropdown.querySelector(".dropdown-field"); 

    const selected = dropdown.querySelector(".selected-value"); 

    const arrow = dropdown.querySelector(".dropdown-arrow"); 

 

    if (!field || !selected || !source) return; 

 

    // Disable static dropdowns (e.g., lumen) 

    if (type === "lumen") { 

      dropdown.classList.add("disabled"); 

      arrow && (arrow.style.display = "none"); 

      return; 

    } 

 

    // Parse values 

    const rawText = source.textContent.trim(); 

    const values = [...new Set( 

      rawText.split(",") 

             .map(v => v.trim()) 

             .filter(v => v && !["na", "n/a", "none", "0", "--"].includes(v.toLowerCase())) 

    )]; 

 

    if (values.length === 0) { 

      dropdown.closest(".spec-row")?.remove(); 

      return; 

    } 

 

    // Set default selected value 

    selected.textContent = values[0] || "N/A"; 

    if (type) { 

      window.currentSelection[type] = values[0];

      window.currentSelection.defaults[type] = normalizeValue(type, values[0]);

    } 

 

    if (values.length <= 1) { 

      dropdown.classList.add("disabled"); 

      arrow && (arrow.style.display = "none"); 

      return; 

    } 

 

    // Create dropdown options 

    const optionsBox = document.createElement("div"); 

    optionsBox.className = "dropdown-options"; 

    dropdown.appendChild(optionsBox); 

 

    values.forEach(value => { 

      const opt = document.createElement("div"); 

      opt.className = "dropdown-option"; 

      opt.textContent = value; 

      opt.addEventListener("click", () => { 

        if (selected.textContent === value) return; 

        selected.textContent = value; 

        optionsBox.style.display = "none"; 

        dropdown.classList.remove("open"); 

 

        if (type) { 

          // RAL logic 

          if (type === "finish" && value.toLowerCase() === "ral") { 

            if (ralInput) { 

              ralInput.style.display = "block"; 

              ralInput.textContent = "Enter RAL number here"; 

              ralInput.style.color = "#999"; 

              ralInput.addEventListener("focus", () => { 

                if (ralInput.textContent === "Enter RAL color number (e.g., 1015)") { 

                  ralInput.textContent = ""; 

                  ralInput.style.color = "#111"; 

                } 
                
                // Focus effects
                ralInput.style.borderColor = "var(--duva-red)";
                ralInput.style.boxShadow = "0 0 0 3px rgba(192, 57, 43, 0.1)";

              });
              
              // Hover effects
              ralInput.addEventListener("mouseenter", () => {
                ralInput.style.borderColor = "var(--duva-red)";
              });
              
              ralInput.addEventListener("mouseleave", () => {
                if (document.activeElement !== ralInput) {
                  ralInput.style.borderColor = "var(--border-divider-light)";
                  ralInput.style.boxShadow = "none";
                }
              });
              
              ralInput.addEventListener("blur", () => {
                ralInput.style.borderColor = "var(--border-divider-light)";
                ralInput.style.boxShadow = "none";
              }); 

              ralInput.addEventListener("input", () => { 

                const typedRAL = ralInput.textContent.trim(); 

                window.currentSelection.finish = typedRAL ? "RAL" + typedRAL : "RAL"; 

                updateLumenValue(); 

                updateOrderingCode(); 

              }); 

            } 

            window.currentSelection.finish = "RAL"; 

          } else { 

            if (ralInput) { 

              ralInput.style.display = "none"; 

              ralInput.textContent = "Enter RAL number here"; 

              ralInput.style.color = "#999"; 

            } 

            window.currentSelection[type] = value; 

          } 

        } 

        if (["watt", "cct", "cri"].includes(type)) {
          updateLumenValue();
        }
        updateOrderingCode(); 
      }); 

      optionsBox.appendChild(opt); 

    }); 

 

    // Toggle dropdown 

    arrow?.addEventListener("click", (e) => { 

      e.stopPropagation(); 

      const isOpen = optionsBox.style.display === "block"; 

      document.querySelectorAll(".dropdown-options").forEach(opt => opt.style.display = "none"); 

      document.querySelectorAll(".dropdown-wrapper").forEach(d => d.classList.remove("open")); 

      if (!isOpen) { 

        optionsBox.style.display = "block"; 

        dropdown.classList.add("open"); 

      } 

    }); 

 

    // Close on outside click 

    document.addEventListener("click", () => { 

      optionsBox.style.display = "none"; 

      dropdown.classList.remove("open"); 

    }); 

  }); 

 

  /* === Update Lumen Value Based on Dropdown Selections === */ 

  function updateLumenValue() {
    const { product, watt, cct, cri } = window.currentSelection;
    let match = null;
    const lumenData = Array.from(document.querySelectorAll('.lumen-cms-data'));
    for (const el of lumenData) {
      const matches =
        el.dataset.product === product &&
        el.dataset.watt === watt &&
        el.dataset.cct === cct &&
        (!el.dataset.cri || el.dataset.cri === cri);
      if (matches) {
        match = el;
        break;
      }
    }
    const lumenSelected = document.querySelector('[data-type="lumen"].selected-value, [data-type="lumen"] .selected-value');
    if (lumenSelected) {
      if (match) {
        const lumen = match.dataset.lumen || match.textContent.trim();
        lumenSelected.textContent = lumen;
        lumenSelected.style.color = "#111";
        lumenSelected.style.fontWeight = "bold";
        window.currentSelection.lumen = lumen;
      } else {
        lumenSelected.textContent = "Not Available";
        lumenSelected.style.color = "red";
        lumenSelected.style.fontWeight = "bold";
        window.currentSelection.lumen = null;
      }
    }
  }

  /* === End Update Lumen Value Based on Dropdown Selections === */ 

  // === Normalize Value for Code Generation === 

  function normalizeValue(type, val) { 

    val = val?.toLowerCase(); 

    if (!val) return "XX"; 

 

    if (type === "cct") return val.replace("k", "").substring(0, 2); 

    if (type === "beam") return val.replace("°", ""); 

    if (type === "ip-rating") return val.replace("ip", ""); 

    if (type === "finish") { 

      if (val.startsWith("ral")) { 

        return "RAL" + val.replace("ral", "").replace(/\s+/g, ""); 

      } 

      const colorMap = { 

        "white": "WH", 

        "black": "BK", 

        "grey": "GR", 

        "gray": "GR", 

        "silver": "SV", 

        "satin-nickel": "SN" 

      }; 

      return colorMap[val] || val.toUpperCase(); 

    } 

    return val; 

  } 

 

  // === Get Text Value for a Dropdown === 

  function getTextValue(type) { 

    const el = document.querySelector(`.dropdown-wrapper[data-type="${type}"] .selected-value`); 

    if (!el) return null; 

    if (type === "finish" && window.currentSelection.finish?.startsWith("RAL")) { 

      return window.currentSelection.finish; 

    } 

    return normalizeValue(type, el.textContent.trim()); 

  } 

 

  // === Generate & Display Ordering Code === 

  function updateOrderingCode() { 

    ensureProductCode();
    // Get current product code dynamically from CMS
    const baseCode = getCurrentProductCode();
    console.log("🔄 updateOrderingCode: product =", baseCode); 

    const keys = ["watt", "ip-rating", "beam", "cct", "cri", "finish"]; 

    const labels = ["Wattage", "IP Rating", "Beam", "CCT", "CRI", "Finish"]; 

    const codeElement = document.querySelector(".ordering-code-value"); 
    const pdfCodeElement = document.getElementById("pdf-code"); // <-- Add this

    console.log("🔍 updateOrderingCode: codeElement found =", !!codeElement);
    console.log("🔍 updateOrderingCode: pdfCodeElement found =", !!pdfCodeElement);

  if (codeElement) { 
    const styledParts = keys.map((key, i) => { 
      const val = getTextValue(key) || "XX"; 
      const defaultVal = window.currentSelection.defaults?.[key] || "XX"; 
      const isDefault = val === defaultVal; 
      const color = isDefault ? "#999" : "#C0392B"; 
      return `<span title="${labels[i]}" style="color:${color}; font-weight: bold;">${val}</span>`; 
    }); 

    const newOrderingCode = `<span title="Product Code" style="color: #111; font-weight: bold;">${baseCode}</span>.` + styledParts.join(".");
    console.log("🔄 updateOrderingCode: Setting new ordering code =", newOrderingCode);

    // For on-screen display
    codeElement.innerHTML = newOrderingCode;
    console.log("✅ updateOrderingCode: Ordering code updated successfully");

    // For PDF filename (plain text, no HTML)
    if (pdfCodeElement) {
      // Build plain code string for filename
      const plainParts = keys.map(key => getTextValue(key) || "XX");
      const plainCode = `${baseCode}.${plainParts.join(".")}`;
      pdfCodeElement.textContent = plainCode;
      console.log("📄 updateOrderingCode: PDF code set =", plainCode);
    }
  } else {
    console.log("⚠️ updateOrderingCode: No ordering-code-value element found!");
  } 
} 

 

  // === Trigger Initial Update on Load === 

  setTimeout(() => { 

    updateLumenValue(); 

    updateOrderingCode(); 

  }, 300); 

}); 

 

 

 

document.addEventListener("DOMContentLoaded", function () { 

 

  /* === Main Image Thumbnail Click Logic === */ 
  /* REMOVED - Duplicate thumbnail handler, using critical fixes version instead */ 

 

  /* === Trigger Hidden Webflow Lightbox Gallery === */ 

  const firstGalleryItem = document.querySelector(".first-gallery-image"); 

  if (mainImage && firstGalleryItem) { 

    mainImage.addEventListener("click", () => { 

      firstGalleryItem.click(); 

    }); 

  } 

 

  /* === Dropdown + Configurator Logic === */ 

  const dropdowns = document.querySelectorAll(".dropdown-wrapper"); 

  const ralInput = document.querySelector("#ral-input"); 

 

  // RAL input styling and default setup 

  if (ralInput) { 

    ralInput.style.display = "none"; 

    ralInput.textContent = "Enter RAL number here"; 

    ralInput.setAttribute("contenteditable", "true"); 

    ralInput.style.color = "#999"; 

    ralInput.style.padding = "12px 16px"; 

    ralInput.style.minHeight = "48px"; 

    ralInput.style.backgroundColor = "#fff"; 

    ralInput.style.borderRadius = "20px"; 

    ralInput.style.cursor = "text"; 
    
    ralInput.style.border = "1px solid var(--border-main-shadow)";
    
    ralInput.style.width = "280px";
    
    ralInput.style.fontSize = "14px";
    
    ralInput.style.fontFamily = "inherit";
    
    ralInput.style.lineHeight = "1.4";
    
    ralInput.style.transition = "all 0.3s ease";
    
    ralInput.style.outline = "none";
    
    ralInput.style.resize = "none";
    
    ralInput.style.overflow = "hidden";

  } 

 

  // Global selection state 

  window.currentSelection = { 

    product: document.querySelector("#product-code-heading")?.textContent.trim() || null, 

    watt: null, 

    cct: null, 

    cri: null, 

    finish: null, 

    defaults: {} 

  }; 

 

  /* === Reset Button Logic === */ 

  const resetButton = document.querySelector(".reset-button"); 

  if (resetButton) { 

    resetButton.style.display = "flex"; 

    resetButton.style.alignItems = "center"; 

    resetButton.style.justifyContent = "center"; 

 

    resetButton.addEventListener("click", () => { 

      dropdowns.forEach(dropdown => { 

        const type = dropdown.getAttribute("data-type"); 

        const selected = dropdown.querySelector(".selected-value"); 

        const source = dropdown.querySelector(".dropdown-source"); 

        if (!type || !selected || !source) return; 

 

        const values = source.textContent.split(",").map(v => v.trim()).filter(Boolean); 

        const firstValue = values[0] || "XX"; 

 

        selected.textContent = firstValue; 

        window.currentSelection[type] = firstValue; 

        window.currentSelection.defaults[type] = normalizeValue(type, firstValue); 

 

        if (type === "finish") { 

          if (firstValue.toLowerCase() === "ral") { 

            ralInput.style.display = "block"; 

          } else { 

            ralInput.style.display = "none"; 

          } 

        } 

      }); 

 

      updateLumenValue(); 

      updateOrderingCode(); 

    }); 

  } 

 

  /* === Initialize Each Dropdown === */ 

  dropdowns.forEach(dropdown => { 

    const type = dropdown.getAttribute("data-type"); 

    const field = dropdown.querySelector(".dropdown-field"); 

    const selected = dropdown.querySelector(".selected-value"); 

    const source = dropdown.querySelector(".dropdown-source"); 

    const arrow = dropdown.querySelector(".dropdown-arrow"); 

 

    if (!field || !selected || !source) return; 

 

    const values = source.textContent.split(",").map(v => v.trim()).filter(v => 

      v && !["na", "n/a", "none", "0", "--"].includes(v.toLowerCase()) 

    ); 

 

    if (type === "lumen" || values.length === 0) { 

      dropdown.closest(".spec-row")?.remove(); 

      return; 

    } 

 

    selected.textContent = values[0] || "N/A"; 

    window.currentSelection[type] = values[0]; 
    window.currentSelection.defaults[type] = normalizeValue(type, values[0]); 

 

    if (values.length <= 1) { 

      dropdown.classList.add("disabled"); 

      arrow && (arrow.style.display = "none"); 

      return; 

    } 

 

    const optionsBox = document.createElement("div"); 

    optionsBox.className = "dropdown-options"; 

    dropdown.appendChild(optionsBox); 

 

    values.forEach(value => { 

      const opt = document.createElement("div"); 

      opt.className = "dropdown-option"; 

      opt.textContent = value; 

 

      opt.addEventListener("click", () => { 

        if (selected.textContent === value) return; 

 

        selected.textContent = value; 

        optionsBox.style.display = "none"; 

        dropdown.classList.remove("open"); 

 

        if (type === "finish" && value.toLowerCase() === "ral") { 

          ralInput.style.display = "block"; 

          ralInput.textContent = "Enter RAL number here"; 

          ralInput.style.color = "#999"; 

 

          ralInput.addEventListener("focus", () => { 

            if (ralInput.textContent === "Enter RAL number here") { 

              ralInput.textContent = ""; 

              ralInput.style.color = "#111"; 

            } 

          }); 

 

          ralInput.addEventListener("input", () => { 

            const typedRAL = ralInput.textContent.trim(); 

            window.currentSelection.finish = typedRAL ? "RAL" + typedRAL : "RAL"; 

            updateLumenValue(); 

            updateOrderingCode(); 

          }); 

 

          window.currentSelection.finish = "RAL"; 

        } else { 

          ralInput.style.display = "none"; 

          window.currentSelection[type] = value;

        } 

 

        if (["watt", "cct", "cri"].includes(type)) {
          updateLumenValue();
        }
        updateOrderingCode(); 
      }); 

 

      optionsBox.appendChild(opt); 

    }); 

 

    // Arrow toggle 

    arrow?.addEventListener("click", (e) => { 

      e.stopPropagation(); 

      const isOpen = optionsBox.style.display === "block"; 

      document.querySelectorAll(".dropdown-options").forEach(opt => opt.style.display = "none"); 

      document.querySelectorAll(".dropdown-wrapper").forEach(d => d.classList.remove("open")); 

 

      if (!isOpen) { 

        optionsBox.style.display = "block"; 

        dropdown.classList.add("open"); 

      } 

    }); 

 

    // Close all dropdowns on outside click 

    document.addEventListener("click", () => { 

      optionsBox.style.display = "none"; 

      dropdown.classList.remove("open"); 

    }); 

  }); 

 

  /* === Update Lumen Value === */ 

  function updateLumenValue() {
    const { product, watt, cct, cri } = window.currentSelection;
    let match = null;
    const lumenData = Array.from(document.querySelectorAll('.lumen-cms-data'));
    for (const el of lumenData) {
      const matches =
        el.dataset.product === product &&
        el.dataset.watt === watt &&
        el.dataset.cct === cct &&
        (!el.dataset.cri || el.dataset.cri === cri);
      if (matches) {
        match = el;
        break;
      }
    }
    const lumenSelected = document.querySelector('[data-type="lumen"].selected-value, [data-type="lumen"] .selected-value');
    if (lumenSelected) {
      if (match) {
        const lumen = match.dataset.lumen || match.textContent.trim();
        lumenSelected.textContent = lumen;
        lumenSelected.style.color = "#111";
        lumenSelected.style.fontWeight = "bold";
        window.currentSelection.lumen = lumen;
      } else {
        lumenSelected.textContent = "Not Available";
        lumenSelected.style.color = "red";
        lumenSelected.style.fontWeight = "bold";
        window.currentSelection.lumen = null;
      }
    }
  }

 

  /* === Normalize Value for Code Generation === */ 

  function normalizeValue(type, val) { 

    val = val?.toLowerCase(); 

    if (!val) return "XX"; 

    if (type === "cct") return val.replace("k", "").substring(0, 2); 

    if (type === "beam") return val.replace("°", ""); 

    if (type === "ip-rating") return val.replace("ip", ""); 

    if (type === "finish") { 

      if (val.startsWith("ral")) return "RAL" + val.replace("ral", "").replace(/\s+/g, ""); 

      const map = { white: "WH", black: "BK", grey: "GR", gray: "GR", silver: "SV", "satin-nickel": "SN" }; 

      return map[val] || val.toUpperCase(); 

    } 

    return val; 

  } 

 

  /* === Get Normalized Value for Each Field === */ 

  function getTextValue(type) { 

    const el = document.querySelector(`.dropdown-wrapper[data-type="${type}"] .selected-value`); 

    if (!el) return null; 

    if (type === "finish" && window.currentSelection.finish?.startsWith("RAL")) { 

      return window.currentSelection.finish; 

    } 

    return normalizeValue(type, el.textContent.trim()); 

  } 

 

  /* === Update Ordering Code Display === */ 

  function updateOrderingCode() { 

    // Get current product code dynamically from CMS
    const baseCode = getCurrentProductCode(); 

    const keys = ["watt", "ip-rating", "beam", "cct", "cri", "finish"]; 

    const labels = ["Wattage", "IP Rating", "Beam", "CCT", "CRI", "Finish"]; 

    const codeEl = document.querySelector(".ordering-code-value"); 

 

    if (codeEl) { 

      const parts = keys.map((key, i) => { 

        const val = getTextValue(key) || "XX"; 

        const isDefault = val === window.currentSelection.defaults?.[key]; 

        const color = isDefault ? "#999" : "#C0392B"; 

        return `<span title="${labels[i]}" style="color:${color}; font-weight: bold;">${val}</span>`; 

      }); 

 

      codeEl.innerHTML = `<span title="Product Code" style="color: #111; font-weight: bold;">${baseCode}</span>.${parts.join(".")}`; 

    } 

  } 

 

  // Initial update after load 

  setTimeout(() => { 

    updateLumenValue(); 

    updateOrderingCode(); 

    updateProductCodeInjection();
    updateGeneratedCodeInjection();

  }, 300); 

 

}); 

 

 

 

document.addEventListener('DOMContentLoaded', function () { 

 

  /* === Get Product Code Based on Current Selection === */ 

  function getProductCode() { 

    const selection = window.currentSelection || {}; 

    // Get current product code dynamically from CMS
    const code = getCurrentProductCode(); 

    const watt = selection.watt || '12'; 

    const ip = selection.ip || '65'; 

    const beam = selection.beam || '30'; 

 

    const cctMap = { '2700K': '27', '3000K': '30', '4000K': '40', '5000K': '50' }; 

    const finishMap = { 'White': 'WH', 'Black': 'BK', 'Grey': 'GR', 'Silver': 'SV' }; 

 

    let cct = selection.cct || '30'; 

    let cri = selection.cri || '80'; 

    let finish = selection.finish || 'BK'; 

 

    cct = cctMap[cct] || cct.replace('K', ''); 

    finish = finishMap[finish] || finish; 

 

    return `${code}.${watt}.${ip}.${beam}.${cct}.${cri}.${finish}`; 

  } 

 

  /* === Inject PDF Datasheet URL into First Row === */ 

  const datasheetCode = getProductCode(); 

  const datasheetUrl = `https://duva-lighting.com/pdfs/${datasheetCode}.pdf`; 

 

  const firstRow = document.querySelector('.download-row'); 

  if (firstRow) { 

    const fileDiv = firstRow.querySelector('[data-file]'); 

    if (fileDiv) { 

      fileDiv.setAttribute('data-file', datasheetUrl); 

      firstRow.setAttribute('data-type', 'pdf'); 

    } 

  } 

 

  function updateDatasheetRow() { 

    const code = getProductCode(); 

    const newUrl = `https://duva-lighting.com/pdfs/${code}.pdf`; 

    const row = document.querySelector('.download-row'); 

    const fileDiv = row?.querySelector('[data-file]'); 

    if (fileDiv) { 

      fileDiv.setAttribute('data-file', newUrl); 

    } 

  } 

 

  /* === Watch for Selection Changes and Update File URL === */ 

  document.querySelectorAll('.selected-value').forEach(item => { 

    item.addEventListener('DOMSubtreeModified', () => { 

      updateDatasheetRow(); 

 

      const selection = window.currentSelection || {}; 

      const row = item.closest('.spec-row'); 

      if (!row) return; 

 

      const type = row.getAttribute('data-type'); 

      const value = item.textContent.trim(); 

 

      if (type) { 

        selection[type] = value; 

        window.currentSelection = selection; 

      } 

    }); 

  }); 

 

  /* === Generate PDF Datasheet Dynamically === */ 

  // This function is now handled by html2pdf.generatePDF()

 

  /* === Hide Rows with Missing Files === */ 

  document.querySelectorAll('.download-row').forEach(row => { 

    const fileDiv = row.querySelector('[data-file]'); 

    const fileUrl = fileDiv?.getAttribute('data-file'); 

    const divider = row.nextElementSibling?.classList.contains('download-divider') ? row.nextElementSibling : null; 

 

    if (!fileUrl || fileUrl === 'null' || fileUrl === '0') { 

      row.style.display = 'none'; 

      if (divider) divider.style.display = 'none'; 

    } else { 

      const fileExtension = fileUrl.split('.').pop().toLowerCase(); 

      row.setAttribute('data-type', fileExtension); 

    } 

  }); 

 

  /* === Toggle Checkbox Active Class === */ 

  document.querySelectorAll('.download-checkbox').forEach(box => { 

    box.addEventListener('click', function () { 

      this.classList.toggle('active'); 

    }); 

  }); 

 

  /* === Download Selected Files === */ 

  document.querySelector('#download-selected')?.addEventListener('click', function () { 

    const selectedBoxes = document.querySelectorAll('.download-checkbox.active'); 

    const selectedFiles = []; 

 

    selectedBoxes.forEach(box => { 

      const row = box.closest('.download-row'); 

      if (!row || row.offsetParent === null) return; 

 

      const fileDiv = row.querySelector('[data-file]'); 

      const fileUrl = fileDiv?.getAttribute('data-file'); 

      if (fileUrl) { 

        selectedFiles.push(fileUrl); 

      } 

    }); 

 

    if (selectedFiles.length === 0) { 

      alert('No files selected!'); 

      return; 

    } 

 

    selectedFiles.forEach(url => { 

      const a = document.createElement('a'); 

      a.href = url; 

      a.download = ''; 

      document.body.appendChild(a); 

      a.click(); 

      a.remove(); 

    }); 

  }); 

 

  /* === Download All Files === */ 

  document.querySelector('#download-all')?.addEventListener('click', () => { 

    document.querySelectorAll('.download-row').forEach(row => { 

      if (row.offsetParent === null) return; 

 

      const fileDiv = row.querySelector('[data-file]'); 

      const fileUrl = fileDiv?.getAttribute('data-file'); 

 

      if (fileUrl && fileUrl !== 'null' && fileUrl !== '0' && !fileUrl.includes('undefined')) { 

        const a = document.createElement('a'); 

        a.href = fileUrl; 

        a.download = ''; 

        document.body.appendChild(a); 

        a.click(); 

        a.remove(); 

      } 

    }); 

  }); 

 

  /* === Handle Arrow Download Buttons === */ 

  document.querySelectorAll('.download-arrow').forEach(icon => { 

    icon.addEventListener('click', function () { 

      const row = this.closest('.download-row'); 

      const isGenerated = row === document.querySelector('.download-row'); 

 

      if (isGenerated) { 

        return; // already handled by main export listener

      } 

 

      const fileUrl = this.getAttribute('data-file'); 

      if (fileUrl) { 

        const a = document.createElement('a'); 

        a.href = fileUrl; 

        a.download = ''; 

        document.body.appendChild(a); 

        a.click(); 

        a.remove(); 

      } 

    }); 

  }); 

 

  /* === Inject Accessories Divider (Max Width 2000px) === */ 
  /* DISABLED - Divider removed as requested
  const accessoriesSection = document.querySelector(".accessories-section"); 

  if (accessoriesSection) { 

    const wrapper = document.createElement("div"); 

    wrapper.style.display = "flex"; 

    wrapper.style.justifyContent = "center"; 

    wrapper.style.marginTop = "24px"; 

 

    const divider = document.createElement("div"); 

    divider.style.width = "100%"; 

    divider.style.maxWidth = "2000px"; 

    divider.style.height = "1px"; 

    divider.style.backgroundColor = "#e0e0e0"; 

 

    wrapper.appendChild(divider); 

    accessoriesSection.after(wrapper); 

  }
  */ 

 

}); 

 

 

 

  document.addEventListener("DOMContentLoaded", function () { 

    const toggle = document.querySelector(".accessories-toggle"); 

    const wrapper = document.querySelector(".accessories-wrapper"); 

    const arrow = document.querySelector(".accessories-arrow"); 

    const section = document.querySelector(".accessories-section"); 

 

    if (toggle && wrapper && arrow && section) { 

      toggle.addEventListener("click", function () { 

        const isOpen = section.classList.toggle("open"); 

        arrow.classList.toggle("rotated"); 

 

        if (isOpen) { 

          // Expand to actual scroll height 

          wrapper.style.maxHeight = wrapper.scrollHeight + "px"; 

        } else { 

          // Collapse 

          wrapper.style.maxHeight = "0px"; 

        } 

      }); 

    } 

  }); 

  // === 7. Accessories Checkbox Script === 

document.querySelectorAll('.accessory-checkbox').forEach(box => { 

  box.addEventListener('click', function () { 

    this.classList.toggle('active'); 

  }); 

}); 

// === PDF Export Logic for DUVA ===
let isExporting = false; // Guard to prevent double export
function showPDFContainer() {
  const pdfContainer = document.querySelector('#pdf-container');
  if (pdfContainer) {
    pdfContainer.classList.remove('hidden');
    pdfContainer.style.display = 'block';
    pdfContainer.style.visibility = 'visible';
    pdfContainer.style.opacity = '1';
    pdfContainer.style.position = 'relative';
    pdfContainer.style.left = '0';
    pdfContainer.style.width = '100vw';
  }
}
function hidePDFContainer() {
  const pdfContainer = document.querySelector('#pdf-container');
  if (pdfContainer) {
    pdfContainer.classList.add('hidden');
    pdfContainer.style.display = 'none';
    pdfContainer.style.visibility = 'hidden';
    pdfContainer.style.opacity = '0';
    pdfContainer.style.position = '';
    pdfContainer.style.top = '';
    pdfContainer.style.left = '';
    pdfContainer.style.width = '';
  }
}

function waitForImagesToLoad(container, callback) {
  if (!container) return callback(); // If container is null, just proceed
  const images = container.querySelectorAll('img');
  let loaded = 0;
  if (images.length === 0) return callback();
  images.forEach(img => {
    if (img.complete) {
      loaded++;
      if (loaded === images.length) callback();
    } else {
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === images.length) callback();
      };
    }
  });
}

function injectPdfOrderingCode() {
  // === Inject Generated Ordering Code into PDF ===
  const orderingCode = document.querySelector('#ordering-code-value');
  const pdfCodeTarget = document.querySelector('#pdf-container .generated-code');
  if (orderingCode && pdfCodeTarget) {
    pdfCodeTarget.textContent = orderingCode.textContent.trim();
  }
}

function injectPdfContent() {
  // === Inject Family Name - Updated for vertical layout ===
  const familyName = document.querySelector('.product-title-source');
  const pdfFamilyNameContainer = document.querySelector('#pdf-container .family-name');
  
  if (familyName && pdfFamilyNameContainer) {
    const familyText = familyName.textContent.trim();
    
    // Clear existing family name elements
    pdfFamilyNameContainer.innerHTML = '';
    
    // Create vertical family name elements based on the family name
    // For "ELDORA", we'll create vertical text elements
    const familyWords = familyText.split(' ');
    familyWords.forEach(word => {
      const verticalElement = document.createElement('div');
      verticalElement.className = 'family-name-vertical';
      verticalElement.textContent = word;
      pdfFamilyNameContainer.appendChild(verticalElement);
    });
  }

  // === Inject Product Description - Updated for Webflow template structure ===
  const desc = document.querySelector('.product-description-source');
  const pdfDesc = document.querySelector('#pdf-container .text-block-14');
  if (desc && pdfDesc) {
    pdfDesc.textContent = desc.textContent.trim();
  }

  // === Inject Feature Key / Key Features - Updated for Webflow template structure ===
  const featuresSource = document.querySelector('.product-features');
  const featuresTarget = document.querySelector('#pdf-container .key-features');
  if (featuresSource && featuresTarget) {
    featuresTarget.innerHTML = featuresSource.innerHTML;
  }
  injectPdfIcons();
  injectPdfImages();
  injectSelectedAccessories();
}

// === Dynamic Product Code Functions ===

// Get current product code dynamically from CMS
function getCurrentProductCode() {
  // PRIORITY 1: Check window.currentSelection first (most current)
  if (window.currentSelection && window.currentSelection.product) {
    return window.currentSelection.product;
  }
  
  // PRIORITY 2: Check for visible product code elements (not hidden)
  const visibleSelectors = [
    '.product-code-heading:not([style*="display: none"])',
    '.product-code:not([style*="display: none"])',
    '[data-product-code]:not([style*="display: none"])',
    '.product-title-source:not([style*="display: none"])',
    'h1.product-code:not([style*="display: none"])',
    '.product-title:not([style*="display: none"])'
  ];
  
  for (const selector of visibleSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      return element.textContent.trim();
    }
  }
  
  // PRIORITY 3: Check for any visible element containing a product code pattern
  const allElements = document.querySelectorAll('*:not([style*="display: none"])');
  for (const element of allElements) {
    if (element.textContent && element.textContent.match(/^C\d{3,4}$/)) {
      return element.textContent.trim();
    }
  }
  
  // PRIORITY 4: Fallback to hidden elements (last resort)
  const hiddenSelectors = [
    '#product-code',
    '.product-code-heading',
    '.product-code',
    '[data-product-code]',
    '.product-title-source'
  ];
  
  for (const selector of hiddenSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      return element.textContent.trim();
    }
  }
  
  return 'CXXX';
}

// Get current product family from CMS
function getCurrentProductFamily() {
  // This should pull from your CMS - adjust selector as needed
  const familyElement = document.querySelector('.product-title-source');
  return familyElement ? familyElement.textContent.trim() : null;
}

function generatePDF() {
  if (isExporting) return; // Prevent double export
  isExporting = true;
  
  // --- Accessories block temporarily removed for testing ---
  // const pdfAccessories = document.querySelector('.pdf-accessories');
  // if (pdfAccessories) {
  //   pdfAccessories.innerHTML = '';
  // }
  // document.querySelectorAll('.accessory-checkbox.active').forEach(box => {
  //   const accessoryItem = box.closest('.accessory-item');
  //   if (!accessoryItem) return;
  //   const imageEl = accessoryItem.querySelector('.accessory-image img, img.accessory-image');
  //   const titleEl = accessoryItem.querySelector('.accessory-title');
  //   const descEl  = accessoryItem.querySelector('.accessory-desc');
  //   if (imageEl?.src && !imageEl.src.includes('undefined') && titleEl) {
  //     const wrapper = document.createElement('div');
  //     wrapper.className = 'accessory-item';
  //     wrapper.innerHTML = `
  //       <img src="${imageEl.src}" class="accessory-image">
  //       <div class="accessory-title">${titleEl.textContent}</div>
  //       <div class="accessory-desc">${descEl?.textContent || ''}</div>
  //     `;
  //     pdfAccessories.appendChild(wrapper);
  //   }
  // });
  // --- End accessories block ---
  // 3. Show the PDF container (off-screen but rendered)
  showPDFContainer();
  // 4. Prepare PDF export
  const element = document.querySelector('#pdf-container');
  
  // Get the generated code for filename
  const orderingCodeElement = document.querySelector('.ordering-code-value');
  let code = 'file'; // default fallback
  
  if (orderingCodeElement) {
    // Get the plain text content (without HTML styling)
    const plainText = orderingCodeElement.textContent || orderingCodeElement.innerText;
    code = plainText.trim();
    
    // Sanitize filename for file system compatibility
    code = code.replace(/[<>:"/\\|?*]/g, '_'); // Replace invalid characters
    code = code.replace(/\s+/g, '_'); // Replace spaces with underscores
    code = code.replace(/\.+/g, '.'); // Replace multiple dots with single dot
    
    console.log('📄 PDF filename will be:', code);
  } else {
    console.log('⚠️ Ordering code element not found, using default filename');
  }
  
  if (!element) {
    hidePDFContainer();
    alert('PDF container not found!');
    isExporting = false;
    return;
  }
  // === Inject Product Image Dynamically ===
  const imageElement = document.querySelector('#product-image img'); // or your actual main image selector
  const pdfImageContainer = document.querySelector('#pdf-container .main-product-pdf-img');
  if (imageElement && pdfImageContainer) {
    const imageUrl = imageElement.src;
    pdfImageContainer.innerHTML = `<img src="${imageUrl}" style="max-width: 100%; height: auto;">`;
  }
  // === Inject Product, Dimension, and Photometric Images into PDF ===
  injectPdfImages();
  // === Inject Generated Ordering Code into PDF ===
  injectPdfOrderingCode();
  // === Inject Product Code into PDF ===
  updateProductCodeInjection();
  // === Inject Generated Code into PDF ===
  updateGeneratedCodeInjection();
  // === Update Specifications Table ===
  updateSpecsTable();
  // === Inject Family Name, Subtitle, Description, and Features into PDF ===
  injectPdfContent();
  // 5. Export PDF
  waitForImagesToLoad(document.querySelector('#pdf-container .header-right-wrapper'), function() {
    injectPdfIcons(); // Inject icons into PDF container
    html2pdf()
      .from(element)
      .set({
        margin: 0,
        filename: `${code}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          width: 794,
          height: 1123,
          useCORS: true
        },
        jsPDF: { 
          unit: 'px', 
          format: [794, 1123], 
          orientation: 'portrait' 
        }
      })
      .save()
      .then(() => {
        // 6. Cleanup after export
        // if (pdfAccessories) {
        //   pdfAccessories.innerHTML = '';
        // }
        hidePDFContainer();
        isExporting = false;
      })
      .catch(() => {
        isExporting = false;
      });
  });
}
// === PDF Download Button Binding by Class ===
document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.querySelector(".download-arrow");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      generatePDF(); // Make sure this function exists
    });
  } else {
    console.warn("Download arrow button not found!");
  }
});
// === End PDF Download Button Binding ===

// === Utility: Ensure Product Code is Set from DOM ===
function ensureProductCode() {
  const code = document.querySelector("#product-code-heading")?.textContent.trim();
  console.log("ensureProductCode: found code =", code);
  if (code) {
    window.currentSelection.product = code;
  }
  console.log("window.currentSelection.product =", window.currentSelection.product);
}

// Removed duplicate icon injection - using injectPdfIcons() function instead

function updateSpecsTable() {
  // Get current dropdown values from the DOM
  const getDropdownValue = (type) => {
    const dropdown = document.querySelector(`.dropdown-wrapper[data-type="${type}"] .selected-value`);
    return dropdown ? dropdown.textContent.trim() : null;
  };

  // Get current values from dropdowns or use defaults
  const currentValues = {
    watt: getDropdownValue('watt') || window.currentSelection?.watt || '12',
    lumen: window.currentSelection?.lumen || '1900',
    cct: getDropdownValue('cct') || window.currentSelection?.cct || '3000K',
    cri: getDropdownValue('cri') || window.currentSelection?.cri || '80',
    beam: getDropdownValue('beam') || window.currentSelection?.beam || '24',
    'ip-rating': getDropdownValue('ip-rating') || window.currentSelection?.['ip-rating'] || '65',
    finish: getDropdownValue('finish') || window.currentSelection?.finish || 'White'
  };

  console.log('📊 Current specification values:', currentValues);

  // Update both the main page specs and PDF container specs
  const selectors = [
    '.wattage .text-block-16',
    '#pdf-container .wattage .text-block-16'
  ];

  // Wattage
  selectors.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      const wattValue = currentValues.watt;
      element.innerHTML = `Wattage<br>${wattValue}${wattValue.includes('W') ? '' : 'W'}`;
    }
  });

  // Lumen
  selectors.forEach(selector => {
    const element = document.querySelector(selector.replace('wattage', 'lumen'));
    if (element) {
      const lumenValue = currentValues.lumen;
      element.innerHTML = `Lumen<br>${lumenValue}${lumenValue.includes('lm') ? '' : 'lm'}`;
    }
  });

  // CCT
  selectors.forEach(selector => {
    const element = document.querySelector(selector.replace('wattage', 'cct'));
    if (element) {
      element.innerHTML = `CCT<br>${currentValues.cct}`;
    }
  });

  // CRI
  selectors.forEach(selector => {
    const element = document.querySelector(selector.replace('wattage', 'cri'));
    if (element) {
      const criValue = currentValues.cri;
      element.innerHTML = `CRI<br>&gt;${criValue}`;
    }
  });

  // Beam
  selectors.forEach(selector => {
    const element = document.querySelector(selector.replace('wattage', 'beam-angle'));
    if (element) {
      const beamValue = currentValues.beam;
      element.innerHTML = `Beam<br>${beamValue}${beamValue.includes('°') ? '' : '°'}`;
    }
  });

  // IP Rating
  selectors.forEach(selector => {
    const element = document.querySelector(selector.replace('wattage', 'ip-rating'));
    if (element) {
      element.innerHTML = `IP<br>${currentValues['ip-rating']}`;
    }
  });

  // Finish
  selectors.forEach(selector => {
    const element = document.querySelector(selector.replace('wattage', 'finish-volor'));
    if (element) {
      let finishValue = currentValues.finish;
      if (finishValue && finishValue.toLowerCase().startsWith('ral')) {
        finishValue = 'RAL ' + finishValue.replace(/ral/i, '').trim();
      }
      element.innerHTML = `Finish<br>${finishValue}`;
    }
  });

  console.log('✅ Specifications table updated with current values');
}

// Call updateSpecsTable at the end of updateLumenValue and updateOrderingCode
const origUpdateLumenValue = typeof updateLumenValue === 'function' ? updateLumenValue : null;
window.updateLumenValue = function() {
  if (origUpdateLumenValue) origUpdateLumenValue.apply(this, arguments);
  updateSpecsTable();
  updateProductCodeInjection();
  updateGeneratedCodeInjection();
  updatePdfImages();
};
const origUpdateOrderingCode = typeof updateOrderingCode === 'function' ? updateOrderingCode : null;
window.updateOrderingCode = function() {
  if (origUpdateOrderingCode) origUpdateOrderingCode.apply(this, arguments);
  updateSpecsTable();
  updateProductCodeInjection();
  updateGeneratedCodeInjection();
  updatePdfImages();
};

// === Update PDF Images Function ===
function updatePdfImages() {
  // This function can be called to update images when CMS data changes
  // For now, we'll just call the main injection function
  injectPdfImages();
}

// === Product Code Injection Function ===
function updateProductCodeInjection() {
  // Get the current CMS product code (dynamically updated)
  const cmsProductCode = document.querySelector("#product-code-heading")?.textContent.trim();
  const codeTarget = document.querySelector(".product-code");
  
  if (cmsProductCode && codeTarget) {
    codeTarget.innerHTML = `<span style='color: #C0392B !important;'>${cmsProductCode}</span>`;
    console.log("Product code injected from CMS:", cmsProductCode);
  } else if (codeTarget) {
    // Fallback to static source if CMS element not found
    const codeSource = document.getElementById("product-code");
    if (codeSource) {
      codeTarget.innerHTML = `<span style='color: #C0392B !important;'>${codeSource.textContent}</span>`;
      console.log("Product code injected from static source:", codeSource.textContent);
    }
  }
}

// === Generated Code Injection Function ===
function updateGeneratedCodeInjection() {
  // Get the current dynamically generated ordering code
  const orderingCodeElement = document.querySelector(".ordering-code-value");
  const genTarget = document.querySelector(".generated-code");
  
  if (orderingCodeElement && genTarget) {
    // Get the plain text content (without HTML styling)
    const plainText = orderingCodeElement.textContent || orderingCodeElement.innerText;
    genTarget.textContent = plainText;
    console.log("Generated code injected from dynamic source:", plainText);
  } else if (genTarget) {
    // Fallback to static source if dynamic element not found
    const genSource = document.getElementById("ordering-code-value");
    if (genSource) {
      genTarget.textContent = genSource.textContent;
      console.log("Generated code injected from static source:", genSource.textContent);
    }
  }
}

function updateAccessoriesSectionVisibility() {
  // Find all accessories sections
  const accessoriesSections = document.querySelectorAll('.accessories-pdf-section');
  // Find all selected accessories (customize selector as needed)
  const selectedAccessories = document.querySelectorAll('.accessory-checkbox.active, .accessory-selected, .accessory-item.selected');
  // If none selected, hide all accessories sections
  if (selectedAccessories.length === 0) {
    accessoriesSections.forEach(section => section.style.display = 'none');
  } else {
    accessoriesSections.forEach(section => section.style.display = '');
  }
}

// Call this after any accessory selection change
// Example: document.querySelectorAll('.accessory-checkbox').forEach(cb => cb.addEventListener('change', updateAccessoriesSectionVisibility));
// Or call after updating accessories dynamically

document.addEventListener('DOMContentLoaded', function() {
  updateAccessoriesSectionVisibility();
  // If you have accessory checkboxes, add listeners:
  document.querySelectorAll('.accessory-checkbox').forEach(cb => {
    cb.addEventListener('change', updateAccessoriesSectionVisibility);
  });
  
  // Set up observer to refresh ordering code when content changes
  setupOrderingCodeObserver();
});

// Manual refresh function for ordering code
function refreshOrderingCode() {
  console.log('🔄 Manually refreshing ordering code...');
  setTimeout(() => {
    updateOrderingCode();
    updateProductCodeInjection();
    updateGeneratedCodeInjection();
  }, 100);
}

// Global function that can be called from Webflow
window.refreshProductCode = function() {
  console.log('🌐 Global refresh called from Webflow');
  refreshOrderingCode();
};

// Debug function to test product code detection
window.debugProductCode = function() {
  console.log('🔍 Debugging product code detection...');
  console.log('Current product code:', getCurrentProductCode());
  console.log('Window currentSelection:', window.currentSelection);
  console.log('All elements with product code pattern:');
  document.querySelectorAll('*').forEach(el => {
    if (el.textContent && el.textContent.match(/^C\d{3,4}$/)) {
      console.log('Found:', el.tagName, el.className, el.textContent.trim());
    }
  });
};

// Force refresh function for testing
window.forceRefreshOrderingCode = function() {
  console.log('🔄 Force refreshing ordering code...');
  updateOrderingCode();
  updateProductCodeInjection();
  updateGeneratedCodeInjection();
};

// Test function to simulate product change
window.testProductChange = function(newProductCode) {
  console.log('🧪 Testing product change to:', newProductCode);
  
  // Find and update a product code element
  const selectors = ['#product-code', '.product-code-heading', '.product-code', '.product-title-source'];
  let updated = false;
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = newProductCode;
      console.log(`✅ Updated ${selector} to ${newProductCode}`);
      updated = true;
      break;
    }
  }
  
  if (!updated) {
    console.log('⚠️ No product code element found to update');
  }
  
  // Force refresh
  setTimeout(() => {
    forceRefreshOrderingCode();
  }, 100);
};

// === Related Items Mouse Wheel Scroll Logic ===
// DISABLED - Now using auto-scroll with arrow navigation instead of mouse wheel
document.addEventListener("DOMContentLoaded", function () {
  console.log('✅ Related items mouse wheel scroll logic DISABLED - using auto-scroll instead');
});

// Observer to refresh ordering code when page content changes
function setupOrderingCodeObserver() {
  console.log('🔧 Setting up ordering code observer...');
  
  // Watch for changes in the product code element
  const selectors = ['#product-code', '.product-code-heading', '.product-code', '.product-title-source'];
  let productCodeElement = null;
  
  for (const selector of selectors) {
    productCodeElement = document.querySelector(selector);
    if (productCodeElement) {
      console.log(`✅ Found element to observe: ${selector}`);
      break;
    }
  }
  
  if (productCodeElement) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          console.log('🔄 Product code changed, refreshing ordering code...');
          setTimeout(() => {
            updateOrderingCode();
            updateProductCodeInjection();
            updateGeneratedCodeInjection();
          }, 100);
        }
      });
    });
    
    observer.observe(productCodeElement, {
      childList: true,
      characterData: true,
      subtree: true
    });
    
    console.log('✅ Ordering code observer set up for:', productCodeElement);
  } else {
    console.log('⚠️ No product code element found for observer, setting up periodic check');
    // Set up periodic check as backup
    setInterval(() => {
      const currentCode = getCurrentProductCode();
      if (currentCode !== 'CXXX' && currentCode !== window.lastProductCode) {
        console.log('🔄 Product code changed via periodic check:', currentCode);
        window.lastProductCode = currentCode;
        updateOrderingCode();
        updateProductCodeInjection();
        updateGeneratedCodeInjection();
      }
    }, 2000); // Check every 2 seconds
  }
  
  // Also watch for URL changes (for SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      console.log('🔄 URL changed, refreshing ordering code...');
      setTimeout(() => {
        updateOrderingCode();
        updateProductCodeInjection();
        updateGeneratedCodeInjection();
      }, 500);
    }
  }).observe(document, {subtree: true, childList: true});
}

// === Inject PDF Icons from CMS to #pdf-container ===
function injectPdfIcons() {
  // Find all CMS icons for this product (from the main page, not PDF container)
  const cmsIcons = document.querySelectorAll('#pdf-icons .pdf-cms-icon');
  const targetContainer = document.querySelector('#pdf-container .header-icons-wrapper');

  if (!cmsIcons.length) {
    console.log('⚠️ No CMS icons found in #pdf-icons for this product.');
    return;
  }
  if (!targetContainer) {
    console.log('⚠️ PDF icon target container not found.');
    return;
  }

  // Clear existing icons
  targetContainer.innerHTML = '';

  // Inject all icons into the icons wrapper
  cmsIcons.forEach((icon, i) => {
    const clone = icon.cloneNode(true);
    clone.removeAttribute('id');
    targetContainer.appendChild(clone);
    console.log(`✅ Injected icon #${i+1}:`, clone);
  });

  console.log(`✅ Injected ${cmsIcons.length} icons into PDF container.`);
}

// === Inject Product, Dimension, and Photometric Images into PDF ===
function injectPdfImages() {
  // Product Image
  const productSource = document.querySelector('#main-lightbox-trigger.product-image');
  const pdfImageContainer = document.querySelector('#pdf-container .main-product-pdf-img');
  if (productSource && pdfImageContainer) {
    pdfImageContainer.innerHTML = `<img src="${productSource.src}" style="max-width: 100%; height: auto; width: 180px; height: 180px; object-fit: contain;">`;
    console.log('✅ Product image injected:', productSource.src);
  } else {
    console.log('⚠️ Product image source or container not found');
  }

  // Dimension Image
  const dimensionSource = document.querySelector('#diagram.dimension');
  const pdfDimContainer = document.querySelector('#pdf-container .diagram-pdf-img');
  if (dimensionSource && pdfDimContainer) {
    pdfDimContainer.innerHTML = `<img src="${dimensionSource.src}" style="max-width: 100%; height: auto; width: 180px; height: 180px; object-fit: contain;">`;
    console.log('✅ Dimension image injected:', dimensionSource.src);
  } else {
    console.log('⚠️ Dimension image source or container not found');
  }

  // Photometric Image
  const photometricSource = document.querySelector('#Photometric.photometric');
  const pdfPhotoContainer = document.querySelector('#pdf-container .photometric-pdf-img');
  if (photometricSource && pdfPhotoContainer) {
    pdfPhotoContainer.innerHTML = `<img src="${photometricSource.src}" style="max-width: 100%; height: auto; width: 180px; height: 180px; object-fit: contain;">`;
    console.log('✅ Photometric image injected:', photometricSource.src);
  } else {
    console.log('⚠️ Photometric image source or container not found');
  }
}

function styleSpecLabelsAndValues() {
  const specBlocks = document.querySelectorAll('#pdf-container .specifications-full-width .text-block-16');
  specBlocks.forEach(block => {
    // Split by <br> or line break
    const html = block.innerHTML.trim();
    const parts = html.split(/<br\s*\/?>(.*)/i);
    if (parts.length >= 2) {
      const label = parts[0].replace(/<[^>]+>/g, '').trim();
      const value = parts[1].replace(/<[^>]+>/g, '').trim();
      block.innerHTML = `<span class='label'>${label}</span><br><span class='value'>${value}</span>`;
    }
  });
}
// Call this after PDF content is injected
if (typeof injectPdfContent === 'function') {
  const originalInjectPdfContent = injectPdfContent;
  injectPdfContent = function() {
    originalInjectPdfContent.apply(this, arguments);
    styleSpecLabelsAndValues();
  };
}

// === Accessory Injection for PDF ===
function injectSelectedAccessories() {
  // Find the PDF accessories container
  const pdfAccessoriesContainer = document.querySelector('#pdf-container .accessories-pdf-section');
  if (!pdfAccessoriesContainer) {
    console.log('⚠️ PDF accessories container not found');
    return;
  }

  // Find all selected accessories (checkboxes that are active/checked)
  const selectedAccessories = document.querySelectorAll('.accessory-checkbox.active, .accessory-checkbox.checked, .accessory-checkbox[data-selected="true"]');
  
  console.log('🔍 Found selected accessories:', selectedAccessories.length);
  selectedAccessories.forEach((acc, i) => {
    console.log(`  ${i + 1}. Checkbox:`, acc);
    console.log(`     Classes:`, acc.className);
    console.log(`     Parent item:`, acc.closest('.accessory-item'));
  });
  
  if (selectedAccessories.length === 0) {
    // Hide accessories section if none selected
    pdfAccessoriesContainer.style.display = 'none';
    console.log('ℹ️ No accessories selected, hiding accessories section');
    return;
  }

  // Show accessories section
  pdfAccessoriesContainer.style.display = 'block';
  
  // Clear existing accessories in PDF
  const existingAccessories = pdfAccessoriesContainer.querySelectorAll('.accessory-item');
  console.log('🧹 Clearing existing accessories:', existingAccessories.length);
  existingAccessories.forEach(item => item.remove());

  // Inject each selected accessory
  selectedAccessories.forEach((checkbox, index) => {
    const accessoryItem = checkbox.closest('.accessory-item');
    if (!accessoryItem) {
      console.log(`⚠️ No accessory item found for checkbox ${index + 1}`);
      return;
    }

    // Collect accessory data
    const code = accessoryItem.querySelector('.acc-code')?.textContent?.trim() || '';
    const title = accessoryItem.querySelector('.acc-title')?.textContent?.trim() || '';
    const description = accessoryItem.querySelector('.acc-description')?.textContent?.trim() || '';
    
    console.log(`📋 Accessory ${index + 1} data:`, { code, title, description });
    
    // Get image - try multiple selectors
    const image = accessoryItem.querySelector('.accessory-image .acc-img, .accessory-image img, .acc-img');
    const imageSrc = image?.src || image?.getAttribute('src') || '';
    
    console.log(`🔍 Accessory ${index + 1} image src:`, imageSrc);

    // Create accessory HTML for PDF
    const accessoryHTML = `
      <div class="accessory-item">
        <div class="accessory-image">
          ${imageSrc ? `<img src="${imageSrc}" alt="${title}" style="width: 80px; height: 60px; object-fit: contain; border: 1px solid #ddd; border-radius: 4px; display: block;">` : ''}
        </div>
        <div class="accessory-details">
          <div class="accessory-code">${code}</div>
          <div class="accessory-title">${title}</div>
          <div class="accessory-description">${description}</div>
        </div>
      </div>
    `;

    // Add to PDF container
    pdfAccessoriesContainer.insertAdjacentHTML('beforeend', accessoryHTML);
    console.log(`✅ Injected accessory ${index + 1}: ${title}`);
  });

  console.log(`✅ Total accessories injected: ${selectedAccessories.length}`);
}

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
  
  // Gallery section observer disabled
  
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

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeScrollAnimations();
  
  // Add smooth scroll button if needed (optional)
  const scrollToRelatedBtn = document.querySelector('.scroll-to-related');
  if (scrollToRelatedBtn) {
    scrollToRelatedBtn.addEventListener('click', scrollToRelatedSection);
  }
  
  // Initialize menu panel functionality
  initializeMenuPanel();
  
  // Initialize DUVA logo home button
  initializeLogoHomeButton();
});
    


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

/* === Arrow Hover Effects === */
document.addEventListener('DOMContentLoaded', function() {
  
  // Download arrow hover effects
  document.querySelectorAll('.download-arrow').forEach(arrow => {
    arrow.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.transition = 'transform 0.2s ease';
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
    });
    
    arrow.addEventListener('mouseleave', function() {
      // Reset to default state - let CSS handle the rotation
      this.style.transform = '';
      this.style.transition = '';
    });
  });
});

// Initialize gallery auto-scroll when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Gallery auto-scroll disabled
});

// === Gallery Subscribe Wrapper Parallax Enhancement ===
// Gallery parallax functionality disabled

// Initialize parallax when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Gallery parallax disabled
});

// === Enhanced Mouse Wheel Scrolling ===
// Gallery wheel scrolling functionality disabled

// === Enhanced Mouse Wheel Scrolling ===
// Gallery wheel scrolling functionality disabled

// Initialize enhanced wheel scrolling
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 DOM Content Loaded - Initializing enhanced wheel scrolling...');
  
  // Debug: Check if elements exist
  const relatedContainer = document.querySelector('.collection-list-6');
  const relatedSection = document.querySelector('.related-section');
  
  console.log('🔍 Element Debug:', {
    relatedContainer: !!relatedContainer,
    relatedSection: !!relatedSection
  });
  
  if (relatedContainer) {
    console.log('📦 Related container found:', relatedContainer.className);
  }
  
  // Gallery wheel scrolling functionality disabled
});

// === Seamless Gallery Loop Fix ===
// Gallery seamless loop functionality disabled

// === Accessories Section - Scrolling Removed (Not Needed) ===
// Accessories section displays vertically, no horizontal scrolling required
document.addEventListener("DOMContentLoaded", function () {
  console.log('✅ Accessories section - scrolling functionality removed (not needed)');
});

/* === Flip Card Linking Functionality === */
// Helper function to extract product code from element
function extractProductCode(element) {
  const codeElement = element.querySelector('[class*="code"], [class*="number"], [class*="product"]');
  if (codeElement) {
    const text = codeElement.textContent?.trim();
    if (text) {
      const codeMatch = text.match(/([A-Z]?\d+)/);
      if (codeMatch) {
        return codeMatch[1];
      } else {
        return text.split(' ')[0];
      }
    }
  }
  return null;
}

function initializeFlipCardLinks() {
  console.log('=== initializeFlipCardLinks function called ===');
  console.log('Script is working!');
  
  // ONLY target flip card wrappers - don't affect other sections
  const flipCardWrappers = document.querySelectorAll('.flip-card-wrapper');
  
  console.log('Found flip card wrappers:', flipCardWrappers.length);
  
  // Log what we found to debug
  flipCardWrappers.forEach((wrapper, index) => {
    console.log(`Flip card ${index + 1}:`, wrapper.className, wrapper.tagName);
  });
  
  // Only process flip card wrappers, not related items
  const targetElements = flipCardWrappers;
  
  if (targetElements.length === 0) {
    console.log('No flip card wrappers found, skipping');
    return;
  }
  
  console.log('Processing', targetElements.length, 'target elements');
  
  targetElements.forEach((element, index) => {
    // Check if this element already has a link
    const existingFlipLink = element.querySelector('.flip-card-link') || element.closest('.flip-card-link');
    if (existingFlipLink) {
      console.log(`Element ${index + 1} already has a link, updating URL...`);
      // Update the existing link instead of skipping
      const productCode = extractProductCode(element);
      if (productCode) {
        const newUrl = `/?search=${productCode.toLowerCase()}`;
        existingFlipLink.href = newUrl;
        console.log(`Element ${index + 1} - Updated URL to:`, newUrl);
      }
      return;
    }
    
    // Create the link element
    const link = document.createElement('a');
    link.className = 'flip-card-link';
    
    // Try to get the product URL from various sources
    let productUrl = element.getAttribute('data-product-url') || 
                    element.querySelector('[data-product-url]')?.getAttribute('data-product-url') ||
                    element.getAttribute('href') ||
                    element.querySelector('a')?.getAttribute('href') ||
                    '#';
    
    // Check if this is a flip card with an existing proper URL
    const existingLink = element.querySelector('a');
    if (existingLink && existingLink.href) {
      // Use the existing URL (whether it's product or search)
      productUrl = existingLink.href;
      console.log(`Flip card - using existing URL:`, productUrl);
    } else if (productUrl === '#' || !productUrl) {
      // Only construct search URL if no proper URL exists
      const codeElement = element.querySelector('[class*="code"], [class*="number"], [class*="product"]');
      let productCode = null;
      
      if (codeElement) {
        const text = codeElement.textContent?.trim();
        // Extract just the product code (e.g., "C331", "4709") from the text
        if (text) {
          // Look for patterns like C331, 4709, etc.
          const codeMatch = text.match(/([A-Z]?\d+)/);
          if (codeMatch) {
            productCode = codeMatch[1];
          } else {
            // If no pattern found, use first word
            productCode = text.split(' ')[0];
          }
        }
      }
      
      if (productCode) {
        // For flip cards, use search functionality instead of non-existent product pages
        // Navigate to products page with search parameter to filter to this specific product
        productUrl = `/?search=${productCode.toLowerCase()}`;
        console.log(`Flip card - constructed search URL for ${productCode}:`, productUrl);
      } else {
        console.log('Flip card - no product code found, keeping URL as #');
      }
    }
    
    link.href = productUrl;
    link.setAttribute('data-product-url', productUrl);
    
    console.log(`Element ${index + 1} - URL:`, productUrl);
    
    // Wrap the element in the link
    element.parentNode.insertBefore(link, element);
    link.appendChild(element);
    
    // Add click event listener
    link.addEventListener('click', function(e) {
      console.log('Flip card clicked! URL:', productUrl);
      
      // For flip cards, allow navigation even if URL is '#'
      // This prevents the alert from showing on flip cards
      if (productUrl === '#' || !productUrl) {
        e.preventDefault();
        console.log('Flip card - no URL configured, preventing navigation');
        return;
      }
      
      // Allow navigation for valid URLs
      console.log('Flip card - navigating to:', productUrl);
      
      // Navigate to the URL
      window.location.href = productUrl;
      
      // Optional: Add loading state
      this.style.pointerEvents = 'none';
      setTimeout(() => {
        this.style.pointerEvents = 'auto';
      }, 1000);
    });
    
    // Add hover effects for fade animation
    link.addEventListener('mouseenter', function() {
      console.log('Mouse enter triggered on flip card link');
      this.style.transform = 'translateY(-2px)';
      // Ensure fade animation works
      const flipCard = this.querySelector('.flip-card');
      const flipCardFront = this.querySelector('.flip-card-front');
      const flipCardBack = this.querySelector('.flip-card-back');
      
      console.log('Flip card elements found:', {
        flipCard: !!flipCard,
        flipCardFront: !!flipCardFront,
        flipCardBack: !!flipCardBack
      });
      
      if (flipCard) {
        flipCard.style.transition = 'all 0.6s ease';
      }
      if (flipCardFront) {
        flipCardFront.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        flipCardFront.style.opacity = '0';
        flipCardFront.style.transform = 'translateZ(-10px)';
      }
      if (flipCardBack) {
        // Remove any conflicting inline styles and let CSS handle the display
        flipCardBack.style.removeProperty('display');
        flipCardBack.style.removeProperty('visibility');
        flipCardBack.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        flipCardBack.style.opacity = '1';
        flipCardBack.style.transform = 'translateZ(0)';
        flipCardBack.style.zIndex = '10';
      }
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      // Reset fade animation
      const flipCard = this.querySelector('.flip-card');
      const flipCardFront = this.querySelector('.flip-card-front');
      const flipCardBack = this.querySelector('.flip-card-back');
      
      if (flipCard) {
        flipCard.style.transition = 'all 0.6s ease';
      }
      if (flipCardFront) {
        flipCardFront.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        flipCardFront.style.opacity = '1';
        flipCardFront.style.transform = 'translateZ(0)';
      }
      if (flipCardBack) {
        flipCardBack.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        flipCardBack.style.opacity = '0';
        flipCardBack.style.transform = 'translateZ(-10px)';
        flipCardBack.style.zIndex = '1';
        // Let CSS handle the display/visibility after transition
        setTimeout(() => {
          if (!this.matches(':hover')) {
            flipCardBack.style.display = 'none';
            flipCardBack.style.visibility = 'hidden';
          }
        }, 600);
      }
    });
  });
}

/* === Cards Scroll Animation === */
function initializeCardsScrollAnimation() {
  const cards = document.querySelectorAll('.collection-item');
  
  if (!cards.length) return;
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  cards.forEach(card => {
    observer.observe(card);
  });
}

// Initialize flip card links when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOMContentLoaded - Initializing flip card links');
  initializeFlipCardLinks();
  initializeCardsScrollAnimation();
  
  // Debug test removed for cleanup
});

// Re-initialize when Webflow's dynamic content loads
document.addEventListener('DOMContentLoaded', function() {
  // Wait for Webflow's dynamic content to load
  setTimeout(() => {
    console.log('DOMContentLoaded timeout - Re-initializing flip card links');
    initializeFlipCardLinks();
    initializeCardsScrollAnimation();
    
    // Debug test removed for cleanup
  }, 100);
});

// Also initialize when Webflow's page loads
if (typeof Webflow !== 'undefined') {
  Webflow.push(function() {
    console.log('Webflow.push - Initializing flip card links');
    initializeFlipCardLinks();
    initializeCardsScrollAnimation();
    
    // Debug test removed for cleanup
  });
}

// Debug function removed for cleanup

/* === DUVA Logo Home Button === */
function initializeLogoHomeButton() {
  const logoWrapper = document.querySelector('.duva-logo-wrapper');
  if (logoWrapper) {
    logoWrapper.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Navigate to home page
      window.location.href = '/';
      console.log('🏠 DUVA logo clicked - navigating to home');
    });
    
    // Add visual feedback
    logoWrapper.style.cursor = 'pointer';
    logoWrapper.setAttribute('title', 'Go to Home');
    
    console.log('✅ DUVA logo home button initialized');
  }
}

/* === DUVA Global Live Search Functionality === */

// Initialize global search functionality
function initializeGlobalSearch() {
  // Prevent duplicate initialization
  if (window.globalSearchInitialized) {
    console.log('🔍 Global search already initialized, skipping');
    return;
  }
  
  const searchInput = document.getElementById('globalSearchInput');
  
  if (!searchInput) {
    console.log('🔍 Global search input not found');
    console.log('🔍 Available elements with "search" in ID:', document.querySelectorAll('[id*="search"]'));
    console.log('🔍 Available input elements:', document.querySelectorAll('input'));
    return;
  }
  
  console.log('🔍 Global search input found:', searchInput);
  console.log('🔍 Input type:', searchInput.type);
  console.log('🔍 Input placeholder before:', searchInput.placeholder);
  
  // Add placeholder text if none exists
  if (!searchInput.placeholder) {
    searchInput.placeholder = 'Search products...';
    console.log('🔍 Set placeholder to: Search products...');
  }
  
  console.log('🔍 Input placeholder after:', searchInput.placeholder);
  
  // Check if this is a Webflow embed (div) or actual input
  let actualSearchInput = searchInput;
  if (searchInput.tagName === 'DIV') {
    console.log('🔍 Found Webflow embed div, looking for actual input inside');
    // Look for the actual input element inside the embed
    const actualInput = searchInput.querySelector('input');
    if (actualInput) {
      console.log('🔍 Found actual input inside embed:', actualInput);
      // Use the actual input element instead
      actualSearchInput = actualInput;
    } else {
      console.log('🔍 No input found inside embed div');
      return;
    }
  }
  
  // Check if we landed on products page with search parameter
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  
  // Store the current page URL for navigation back
  let currentPageUrl = window.location.href;
  let isOnProductsPage = window.location.pathname.includes('/products') || 
                         window.location.pathname.includes('/product') || 
                         window.location.pathname.includes('/collection') ||
                         window.location.pathname.includes('products.html') ||
                         document.querySelector('.cards-container') !== null;
  
  // If we're on products page with search parameter, we came from another page
  // Store the original page URL (without search parameter) for navigation back
  if (searchParam && isOnProductsPage) {
    // We came from another page, so we need to store the original page URL
    // For now, we'll use the homepage as the fallback
    currentPageUrl = window.location.origin + '/';
  }
  
  // Store these values globally so they persist after element replacement
  window.globalSearchState = {
    currentPageUrl: currentPageUrl,
    isOnProductsPage: isOnProductsPage
  };
  
  // Mark as initialized to prevent duplicates
  window.globalSearchInitialized = true;
  
  // Add input event listener for real-time search with debounce
  let searchTimeout;
  actualSearchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    // Debounce the search to prevent rapid-fire events
    searchTimeout = setTimeout(() => {
      if (searchTerm === '') {
        // Clear sessionStorage when search is cleared
        sessionStorage.removeItem('globalSearchTerm');
        
        // If search is cleared and we're on products page, show all products
        if (isOnProductsPage) {
          performGlobalSearch(searchTerm);
        } else {
          // Navigate back to original page
          navigateBackToOriginalPage();
        }
      } else {
        // Store search term in sessionStorage
        sessionStorage.setItem('globalSearchTerm', searchTerm);
        
        // If we're not on products page, navigate to products page with search
        if (!isOnProductsPage) {
          navigateToProductsPage(searchTerm);
        } else {
          // We're already on products page, perform search
          performGlobalSearch(searchTerm);
        }
      }
    }, 300); // 300ms debounce delay
  });
  
  // Add focus event to show all products when search is cleared
  actualSearchInput.addEventListener('focus', function(e) {
    if (e.target.value === '') {
      if (isOnProductsPage) {
        showAllProductCards();
      }
    }
  });
  
  // Add blur event to maintain search state
  actualSearchInput.addEventListener('blur', function(e) {
    // Keep current search results
  });
  
  if (searchParam && isOnProductsPage) {
    // Store the search parameter in sessionStorage as backup
    sessionStorage.setItem('globalSearchTerm', searchParam);
    
    // Set the value in the existing input (don't replace it)
    actualSearchInput.value = searchParam;
    
    // Perform search
    setTimeout(() => {
      performGlobalSearch(searchParam);
    }, 100);
  }
  

}

// Navigate to products page with search term
function navigateToProductsPage(searchTerm) {
  // Try to find the products page URL from the site structure
  let productsPageUrl = 'products.html';
  
  // Check if we can find a products link on the page
  const productsLinks = document.querySelectorAll('a[href*="products"], a[href*="product"], a[href*="collection"]');
  if (productsLinks.length > 0) {
    // Use the first products link found
    productsPageUrl = productsLinks[0].getAttribute('href');
    // Ensure it's a relative URL
    if (productsPageUrl.startsWith('http')) {
      const url = new URL(productsPageUrl);
      productsPageUrl = url.pathname;
    }
  }
  
  const searchParam = encodeURIComponent(searchTerm);
  const targetUrl = `${productsPageUrl}?search=${searchParam}`;
  
  console.log(`🔍 Navigating to products page with search: ${targetUrl}`);
  window.location.href = targetUrl;
}

// Navigate back to original page
function navigateBackToOriginalPage() {
  console.log('🔍 navigateBackToOriginalPage called');
  console.log('🔍 Global state:', window.globalSearchState);
  console.log('🔍 Current URL:', window.location.href);
  
  // Remove search parameter from current URL if we're on products page
  if (window.globalSearchState && window.globalSearchState.isOnProductsPage) {
    console.log('🔍 On products page, removing search param and going to homepage');
    // Go to homepage instead of just removing search param
    window.location.href = window.location.origin + '/';
  } else {
    // Navigate back to stored original page
    if (window.globalSearchState && window.globalSearchState.currentPageUrl) {
      console.log('🔍 Navigating back to:', window.globalSearchState.currentPageUrl);
      window.location.href = window.globalSearchState.currentPageUrl;
    } else {
      console.log('🔍 No original page URL found, going to homepage');
      window.location.href = window.location.origin + '/';
    }
  }
}

// Extract all searchable text from a product card
function extractCardText(card) {
  const searchableText = [];
  
  // Get all text content from the card
  const allText = card.textContent || card.innerText || '';
  searchableText.push(allText);
  
  // Get specific fields that might be in data attributes
  const dataFields = [
    'data-product-code', 'data-name', 'data-family', 'data-description',
    'data-wattage', 'data-ip', 'data-cct', 'data-cri', 'data-ordering-code',
    'data-title', 'data-short-description', 'data-full-description'
  ];
  
  dataFields.forEach(field => {
    const value = card.getAttribute(field);
    if (value) {
      searchableText.push(value);
    }
  });
  
  // Get text from specific elements that might contain product info
  const specificSelectors = [
    '.product-title', '.product-name', '.product-code', '.product-family',
    '.product-description', '.product-specs', '.product-details',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'
  ];
  
  specificSelectors.forEach(selector => {
    const elements = card.querySelectorAll(selector);
    elements.forEach(element => {
      const text = element.textContent || element.innerText || '';
      if (text.trim()) {
        searchableText.push(text);
      }
    });
  });
  
  // Get text from Webflow CMS binding elements
  const cmsElements = card.querySelectorAll('[data-wf-cms-bind]');
  cmsElements.forEach(element => {
    const text = element.textContent || element.innerText || '';
    if (text.trim()) {
      searchableText.push(text);
    }
  });
  
  return searchableText.join(' ').toLowerCase();
}

// Perform the global search
function performGlobalSearch(searchTerm) {
  // Target the same elements as the main filter to maintain grid layout
  const cardsContainer = document.querySelector('.cards-container');
  if (!cardsContainer) {
    return;
  }
  
  const productCards = cardsContainer.querySelectorAll('.collection-item, .w-dyn-item');
  
  if (productCards.length === 0) {
    return;
  }
  
  let visibleCount = 0;
  
  productCards.forEach(card => {
    // Extract text from the entire card (both front and back cards)
    const cardText = extractCardText(card);
    const matches = searchTerm === '' || cardText.includes(searchTerm);
    
    if (matches) {
      // Remove any inline display style to let CSS handle the layout
      card.style.removeProperty('display');
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show/hide no results message
  const noResultsMessage = document.querySelector('.no-results-message');
  if (noResultsMessage) {
    if (visibleCount === 0 && searchTerm !== '') {
      noResultsMessage.style.display = 'block';
    } else {
      noResultsMessage.style.display = 'none';
    }
  }
  
  // Update search input placeholder to show results
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) {
    if (searchTerm === '') {
      searchInput.placeholder = 'Search products...';
    } else {
      searchInput.placeholder = `Found ${visibleCount} results...`;
    }
  }
}

// Show all product cards (when search is cleared)
function showAllProductCards() {
  // Target the same elements as the main filter to maintain grid layout
  const cardsContainer = document.querySelector('.cards-container');
  if (!cardsContainer) {
    return;
  }
  
  const productCards = cardsContainer.querySelectorAll('.collection-item, .w-dyn-item');
  
  productCards.forEach(card => {
    // Remove any inline display style to let CSS handle the layout
    card.style.removeProperty('display');
  });
  
  // Hide no results message when showing all products
  const noResultsMessage = document.querySelector('.no-results-message');
  if (noResultsMessage) {
    noResultsMessage.style.display = 'none';
  }
  
  // Reset search input placeholder
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) {
    searchInput.placeholder = 'Search products...';
  }
}

// Initialize global search when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOMContentLoaded - Initializing global search');
  initializeGlobalSearch();
  
  // Re-initialize after a delay to catch late-loading content
  setTimeout(() => {
    console.log('DOMContentLoaded timeout - Re-initializing global search');
    initializeGlobalSearch();
  }, 100);
});

// Also initialize when Webflow's page loads
if (typeof Webflow !== 'undefined') {
  Webflow.push(function() {
    initializeGlobalSearch();
  });
}

// Additional initialization to ensure search parameter is handled
setTimeout(() => {
  const searchInput = document.getElementById('globalSearchInput');
  
  if (searchInput) {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const storedSearchTerm = sessionStorage.getItem('globalSearchTerm');
    const finalSearchTerm = searchParam || storedSearchTerm;
    
    if (finalSearchTerm && searchInput.value === '') {
      searchInput.value = finalSearchTerm;
      searchInput.setAttribute('value', finalSearchTerm);
      performGlobalSearch(finalSearchTerm);
    }
  }
}, 1000);

// Continuous monitoring to maintain search input value
let searchValueMonitor = null;
if (typeof Webflow !== 'undefined') {
  Webflow.push(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const storedSearchTerm = sessionStorage.getItem('globalSearchTerm');
    const finalSearchTerm = searchParam || storedSearchTerm;
    
    if (finalSearchTerm) {
      const searchInput = document.getElementById('globalSearchInput');
      
      if (searchInput) {
        // Clear placeholder first to avoid interference
        searchInput.placeholder = '';
        searchInput.setAttribute('placeholder', '');
        searchInput.removeAttribute('placeholder');
        
        // Remove placeholder from any parent elements
        const parentElements = searchInput.parentElement ? [searchInput.parentElement] : [];
        parentElements.forEach(parent => {
          if (parent.hasAttribute('placeholder')) {
            parent.removeAttribute('placeholder');
          }
        });
        
        // Set the value
        searchInput.value = finalSearchTerm;
        searchInput.setAttribute('value', finalSearchTerm);
        searchInput.defaultValue = finalSearchTerm;
        
        // Force visual refresh
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      // Set up continuous monitoring
      searchValueMonitor = setInterval(() => {
        const searchInput = document.getElementById('globalSearchInput');
        if (searchInput && searchInput.value !== finalSearchTerm) {
          // Clear placeholder first
          searchInput.placeholder = '';
          searchInput.setAttribute('placeholder', '');
          searchInput.removeAttribute('placeholder');
          
          // Set the value
          searchInput.value = finalSearchTerm;
          searchInput.setAttribute('value', finalSearchTerm);
          searchInput.defaultValue = finalSearchTerm;
          
          // Force visual refresh
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 500);
      
      // Stop monitoring after 10 seconds
      setTimeout(() => {
        if (searchValueMonitor) {
          clearInterval(searchValueMonitor);
          searchValueMonitor = null;
        }
      }, 10000);
    }
  });
}



// Let Webflow handle search icon styling naturally
// No CSS overrides needed - using Webflow's default styling

/* === Enhanced Lightbox Gallery Functionality === */
function initializeEnhancedLightbox() {
  console.log('🎨 Initializing enhanced lightbox functionality...');
  
  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function(e) {
    const lightbox = document.querySelector('.w-lightbox-backdrop');
    if (!lightbox || lightbox.style.display === 'none') return;
    
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        const prevButton = document.querySelector('.w-lightbox-left');
        if (prevButton) prevButton.click();
        break;
      case 'ArrowRight':
        e.preventDefault();
        const nextButton = document.querySelector('.w-lightbox-right');
        if (nextButton) nextButton.click();
        break;
      case 'Escape':
        e.preventDefault();
        const closeButton = document.querySelector('.w-lightbox-close');
        if (closeButton) closeButton.click();
        break;
    }
  });
  
  // Enhanced thumbnail interactions
  document.addEventListener('click', function(e) {
    if (e.target.closest('.w-lightbox-thumbnail')) {
      const thumbnails = document.querySelectorAll('.w-lightbox-thumbnail');
      thumbnails.forEach(thumb => thumb.classList.remove('active'));
      e.target.closest('.w-lightbox-thumbnail').classList.add('active');
    }
  });
  
  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const lightbox = document.querySelector('.w-lightbox-backdrop');
    if (!lightbox || lightbox.style.display === 'none') return;
    
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        const nextButton = document.querySelector('.w-lightbox-right');
        if (nextButton) nextButton.click();
      } else {
        // Swipe right - previous image
        const prevButton = document.querySelector('.w-lightbox-left');
        if (prevButton) prevButton.click();
      }
    }
  }
  
  // Enhanced slide animations
  const lightboxImages = document.querySelectorAll('.w-lightbox-image');
  lightboxImages.forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '1';
      this.style.transform = 'translateX(0)';
    });
  });
  
  // Simple zoom functionality for main lightbox image (like accessories)
  const lightboxImageContainers = document.querySelectorAll('.w-lightbox-image');
  lightboxImageContainers.forEach(container => {
    const img = container.querySelector('img');
    if (!img) return;
    
    // Ensure proper image sizing
    img.style.objectFit = 'contain';
    img.style.objectPosition = 'center';
  });
  
  console.log('✅ Enhanced lightbox functionality initialized');
}

// Initialize enhanced lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeEnhancedLightbox();
});

/* === Related Section Auto-Scroll with Arrow Navigation === */
function initializeRelatedSectionAutoScroll() {
  console.log('🔄 Initializing related section auto-scroll and arrow navigation...');
  
  const relatedSection = document.querySelector('.related-section');
  const relatedContainer = document.querySelector('.collection-list-6');
  const arrowRight = document.querySelector('.image-30');
  const arrowLeft = document.querySelector('.image-31');
  
  if (!relatedSection || !relatedContainer) {
    console.log('⚠️ Related section or container not found');
    return;
  }
  
  // Auto-scroll variables
  let isRelatedAutoScrolling = true;
  let relatedScrollInterval = null;
  let relatedScrollSpeed = 1; // pixels per frame
  let relatedScrollDirection = 1; // 1 for right, -1 for left
  
  // Auto-scroll function for related items
  function startRelatedAutoScroll() {
    if (relatedScrollInterval) return; // Already running
    
    // Only auto-scroll if there's content to scroll
    if (relatedContainer.scrollWidth <= relatedContainer.clientWidth) {
      console.log('📏 Related container has no overflow - auto-scroll not needed');
      return;
    }
    
    relatedScrollInterval = setInterval(() => {
      if (isRelatedAutoScrolling) {
        const currentScroll = relatedContainer.scrollLeft;
        const maxScroll = relatedContainer.scrollWidth - relatedContainer.clientWidth;
        
        if (currentScroll >= maxScroll) {
          relatedScrollDirection = -1; // Change direction to left
        } else if (currentScroll <= 0) {
          relatedScrollDirection = 1; // Change direction to right
        }
        
        relatedContainer.scrollLeft += relatedScrollSpeed * relatedScrollDirection;
      }
    }, 50); // 20 FPS for smooth scrolling
    
    console.log('▶️ Related auto-scroll started');
  }
  
  function stopRelatedAutoScroll() {
    if (relatedScrollInterval) {
      clearInterval(relatedScrollInterval);
      relatedScrollInterval = null;
      console.log('⏸️ Related auto-scroll paused');
    }
  }
  
  // Arrow navigation functions
  function scrollRight() {
    const currentScroll = relatedContainer.scrollLeft;
    const maxScroll = relatedContainer.scrollWidth - relatedContainer.clientWidth;
    const scrollAmount = Math.min(300, maxScroll - currentScroll);
    
    if (scrollAmount > 0) {
      relatedContainer.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
      console.log('➡️ Right arrow clicked - scrolling right');
    }
  }
  
  function scrollLeft() {
    const currentScroll = relatedContainer.scrollLeft;
    const scrollAmount = Math.min(300, currentScroll);
    
    if (scrollAmount > 0) {
      relatedContainer.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: 'smooth'
      });
      console.log('⬅️ Left arrow clicked - scrolling left');
    }
  }
  
  // Arrow click events
  if (arrowRight) {
    arrowRight.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      scrollRight();
      console.log('➡️ Right arrow clicked');
    });
    console.log('✅ Right arrow listener added');
  } else {
    console.log('⚠️ Right arrow (image-30) not found');
  }
  
  if (arrowLeft) {
    arrowLeft.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      scrollLeft();
      console.log('⬅️ Left arrow clicked');
    });
    console.log('✅ Left arrow listener added');
  } else {
    console.log('⚠️ Left arrow (image-31) not found');
  }
  
  // Pause auto-scroll on hover
  relatedContainer.addEventListener('mouseenter', () => {
    stopRelatedAutoScroll();
    console.log('🎯 Related auto-scroll paused on hover');
  });
  
  relatedContainer.addEventListener('mouseleave', () => {
    if (isRelatedAutoScrolling) {
      startRelatedAutoScroll();
      console.log('🎯 Related auto-scroll resumed');
    }
  });
  
  // Pause auto-scroll on arrow hover
  if (arrowRight) {
    arrowRight.addEventListener('mouseenter', () => {
      stopRelatedAutoScroll();
      console.log('🎯 Related auto-scroll paused on arrow hover');
    });
    
    arrowRight.addEventListener('mouseleave', () => {
      if (isRelatedAutoScrolling) {
        startRelatedAutoScroll();
        console.log('🎯 Related auto-scroll resumed after arrow hover');
      }
    });
  }
  
  if (arrowLeft) {
    arrowLeft.addEventListener('mouseenter', () => {
      stopRelatedAutoScroll();
      console.log('🎯 Related auto-scroll paused on arrow hover');
    });
    
    arrowLeft.addEventListener('mouseleave', () => {
      if (isRelatedAutoScrolling) {
        startRelatedAutoScroll();
        console.log('🎯 Related auto-scroll resumed after arrow hover');
      }
    });
  }
  
  // Start auto-scroll when related section is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Start auto-scroll after a short delay to ensure content is loaded
        setTimeout(() => {
          if (isRelatedAutoScrolling) {
            startRelatedAutoScroll();
          }
        }, 1000);
      } else {
        stopRelatedAutoScroll();
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(relatedSection);
  
  // Start auto-scroll if section is already visible
  if (relatedSection.getBoundingClientRect().top < window.innerHeight) {
    setTimeout(() => {
      if (isRelatedAutoScrolling) {
        startRelatedAutoScroll();
      }
    }, 1000);
  }
  
  console.log('✅ Related section auto-scroll and arrow navigation initialized');
}

// Initialize related section auto-scroll when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 DOM Content Loaded - Initializing related section auto-scroll...');
  
  // Debug: Check if elements exist
  const relatedSection = document.querySelector('.related-section');
  const relatedContainer = document.querySelector('.collection-list-6');
  const arrowRight = document.querySelector('.image-30');
  const arrowLeft = document.querySelector('.image-31');
  
  console.log('🔍 Related Section Element Debug:', {
    relatedSection: !!relatedSection,
    relatedContainer: !!relatedContainer,
    arrowRight: !!arrowRight,
    arrowLeft: !!arrowLeft
  });
  
  initializeRelatedSectionAutoScroll();
});

// Also initialize when Webflow loads
if (typeof Webflow !== 'undefined') {
  Webflow.push(function() {
    initializeRelatedSectionAutoScroll();
  });
}

// === Menu Panel Debugging ===
function debugMenuPanel() {
  console.log('🔍 === MENU PANEL DEBUGGING ===');
  
  // Check for required elements
  const menuWrapper = document.querySelector('.menu-wrapper');
  const menuPanel = document.querySelector('.menu-panel');
  const menuClose = document.querySelector('.menu-close');
  const menuOverlay = document.querySelector('.menu-overlay');
  
  console.log('📋 Required elements found:', {
    menuWrapper: !!menuWrapper,
    menuPanel: !!menuPanel,
    menuClose: !!menuClose,
    menuOverlay: !!menuOverlay
  });
  
  // Check element properties
  if (menuWrapper) {
    console.log('📋 Menu wrapper properties:', {
      display: getComputedStyle(menuWrapper).display,
      visibility: getComputedStyle(menuWrapper).visibility,
      position: getComputedStyle(menuWrapper).position,
      zIndex: getComputedStyle(menuWrapper).zIndex,
      clickable: menuWrapper.offsetWidth > 0 && menuWrapper.offsetHeight > 0
    });
  }
  
  if (menuPanel) {
    console.log('📋 Menu panel properties:', {
      display: getComputedStyle(menuPanel).display,
      visibility: getComputedStyle(menuPanel).visibility,
      position: getComputedStyle(menuPanel).position,
      zIndex: getComputedStyle(menuPanel).zIndex,
      top: getComputedStyle(menuPanel).top,
      left: getComputedStyle(menuPanel).left,
      width: getComputedStyle(menuPanel).width,
      height: getComputedStyle(menuPanel).height,
      opacity: getComputedStyle(menuPanel).opacity,
      transform: getComputedStyle(menuPanel).transform
    });
  }
  
  if (menuClose) {
    console.log('📋 Menu close button properties:', {
      display: getComputedStyle(menuClose).display,
      visibility: getComputedStyle(menuClose).visibility,
      position: getComputedStyle(menuClose).position,
      clickable: menuClose.offsetWidth > 0 && menuClose.offsetHeight > 0
    });
  }
  
  // Check if menu wrapper is clickable
  if (menuWrapper) {
    menuWrapper.addEventListener('click', function(e) {
      console.log('📋 Menu wrapper clicked!', e);
    });
    console.log('📋 Menu wrapper click listener added for testing');
  }
  
  // Test menu opening manually
  window.testMenuOpen = function() {
    console.log('📋 Testing menu open...');
    if (menuPanel) {
      menuPanel.style.display = 'flex';
      menuPanel.style.visibility = 'visible';
      menuPanel.style.opacity = '1';
      menuPanel.classList.add('active');
      console.log('📋 Menu panel manually activated');
    } else {
      console.log('❌ Menu panel not found');
    }
  };
  
  // Test menu closing manually
  window.testMenuClose = function() {
    console.log('📋 Testing menu close...');
    if (menuPanel) {
      menuPanel.classList.remove('active');
      setTimeout(() => {
        menuPanel.style.display = 'none';
        console.log('📋 Menu panel manually deactivated');
      }, 400);
    } else {
      console.log('❌ Menu panel not found');
    }
  };
  
  console.log('🔍 === MENU PANEL DEBUGGING COMPLETE ===');
  console.log('💡 Use testMenuOpen() and testMenuClose() to test manually');
}

// Call debugging function when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  debugMenuPanel();
});

// === Related Items Single-Click Fix ===
function initializeRelatedItemsSingleClick() {
  console.log('🖱️ Initializing related items single-click fix...');
  
  // ONLY target related items, not flip cards or other sections
  const relatedItems = document.querySelectorAll('.collection-list-6 .w-dyn-item:not(.flip-card-wrapper):not([class*="flip"])');
  
  console.log(`Found ${relatedItems.length} related items to process`);
  
  // Log what we found to debug
  relatedItems.forEach((item, index) => {
    console.log(`Related item ${index + 1}:`, item.className, item.tagName);
  });
  
  relatedItems.forEach((item, index) => {
    // Double-check this is not a flip card
    const isFlipCard = item.closest('.flip-card-wrapper') || item.querySelector('.flip-card') || item.classList.contains('flip-card-wrapper');
    if (isFlipCard) {
      console.log(`Related item ${index + 1} is actually a flip card, skipping`);
      return;
    }
    
    // Check if this item already has a link
    const existingLink = item.querySelector('a');
    if (existingLink) {
      console.log(`Related item ${index + 1} already has a link, skipping`);
      return;
    }
    
    // Create a simple click handler for the item
    item.addEventListener('click', function(e) {
      console.log(`🖱️ Related item ${index + 1} clicked`);
      
      // Prevent default behavior
      e.preventDefault();
      e.stopPropagation();
      
      // Get product code and construct URL (same logic as flip cards)
      const productCode = extractProductCode(item);
      
      if (productCode) {
        // Use search functionality instead of non-existent product pages
        const productUrl = `/?search=${productCode.toLowerCase()}`;
        console.log(`Related item ${index + 1} - navigating to:`, productUrl);
        
        // Navigate to the search results
        window.location.href = productUrl;
      } else {
        console.log(`Related item ${index + 1} - no product code found`);
      }
    });
    
    // Add hover effect for better UX - ONLY for related items, not flip cards
    item.addEventListener('mouseenter', function() {
      // Check if this is a flip card to avoid conflicts
      const isFlipCard = this.closest('.flip-card-wrapper') || this.querySelector('.flip-card');
      if (isFlipCard) {
        console.log('Skipping hover effect for flip card');
        return;
      }
      
      this.style.cursor = 'pointer';
      this.style.transform = 'translateY(-2px)';
      this.style.transition = 'transform 0.2s ease';
    });
    
    item.addEventListener('mouseleave', function() {
      // Check if this is a flip card to avoid conflicts
      const isFlipCard = this.closest('.flip-card-wrapper') || this.querySelector('.flip-card');
      if (isFlipCard) {
        return;
      }
      
      this.style.transform = 'translateY(0)';
    });
  });
  
  console.log(`✅ Single-click fix applied to ${relatedItems.length} related items`);
}

// Initialize single-click fix when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeRelatedItemsSingleClick();
});

// Also initialize when Webflow loads
if (typeof Webflow !== 'undefined') {
  Webflow.push(function() {
    initializeRelatedItemsSingleClick();
  });
}

/**
 * initializePageParallax
 * Adds subtle parallax to key page sections without modifying HTML.
 * - Disabled if prefers-reduced-motion is set
 * - Disabled on small screens (< 768px) for performance
 * - Uses IntersectionObserver + requestAnimationFrame
 */
(function initializePageParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function isParallaxEnabled() {
    const isMobile = window.innerWidth < 768;
    return !prefersReducedMotion.matches && !isMobile;
  }

  const parallaxTargetsConfig = [
    { selector: '.hero-section', speed: 0.06, max: 18 },
    { selector: '.right-hero-wrapper', speed: 0.05, max: 16 },
    { selector: '.related-slider-wrapper', speed: 0.04, max: 14 },
    { selector: '.accessories-section', speed: 0.05, max: 16 },
    { selector: '.footer-section', speed: 0.03, max: 12 }
  ];

  let trackedElements = [];
  let isTicking = false;

  function collectParallaxElements() {
    const elements = [];
    parallaxTargetsConfig.forEach(cfg => {
      document.querySelectorAll(cfg.selector).forEach(el => {
        elements.push({ element: el, speed: cfg.speed, max: cfg.max });
        el.style.willChange = 'transform';
        el.dataset.__parallaxApplied = '1';
      });
    });
    return elements;
  }

  function clearParallaxTransforms() {
    trackedElements.forEach(({ element }) => {
      element.style.transform = '';
      element.style.willChange = '';
      delete element.dataset.__parallaxApplied;
    });
  }

  function applyParallax(scrollY) {
    trackedElements.forEach(({ element, speed, max }) => {
      const rect = element.getBoundingClientRect();
      const elementTopOnPage = scrollY + rect.top;
      const parallaxOffset = Math.max(Math.min((scrollY - elementTopOnPage) * speed, max), -max);
      element.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
    });
  }

  function onScroll() {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        applyParallax(window.scrollY || window.pageYOffset);
        isTicking = false;
      });
      isTicking = true;
    }
  }

  let io;
  function observeVisibility() {
    if (io) io.disconnect();
    io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const target = entry.target;
        if (!target.dataset.__parallaxSpeed) return;
        if (entry.isIntersecting) {
          // Keep in tracked list (no-op here, tracked globally)
        } else {
          // Optional: reset transform when leaving viewport
          target.style.transform = '';
        }
      });
    }, { root: null, threshold: 0 });

    trackedElements.forEach(({ element, speed }) => {
      element.dataset.__parallaxSpeed = String(speed);
      io.observe(element);
    });
  }

  function enableParallax() {
    trackedElements = collectParallaxElements();
    if (trackedElements.length === 0) return;
    observeVisibility();
    applyParallax(window.scrollY || window.pageYOffset);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function disableParallax() {
    window.removeEventListener('scroll', onScroll);
    if (io) io.disconnect();
    clearParallaxTransforms();
    trackedElements = [];
  }

  function reconfigure() {
    disableParallax();
    if (isParallaxEnabled()) enableParallax();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (isParallaxEnabled()) enableParallax();
  });

  prefersReducedMotion.addEventListener('change', reconfigure);
  window.addEventListener('resize', () => {
    // Debounce resize reconfiguration
    clearTimeout(window.__parallaxResizeTimer);
    window.__parallaxResizeTimer = setTimeout(reconfigure, 150);
  });
})();

/**
 * initializeGallerySlider
 * Fades between CMS images inside .gallery-section-cms.
 * - Auto-plays with configurable interval
 * - Pauses on hover over .div-block-15
 * - Left/Right arrows navigate: .gallery-arrow-left / .gallery-right-arrow
 */
(function initializeGallerySlider() {
  const container = document.querySelector('.div-block-15');
  const list = document.querySelector('.gallery-section-cms');
  if (!container || !list) return;

  const items = Array.from(list.querySelectorAll('.collection-item-5'));
  if (items.length === 0) return;

  let current = 0;
  let timer = null;
  const INTERVAL_MS = 4000;
  const FADE_MS = 600; // keep in sync with CSS

  function show(index) {
    items.forEach((el, i) => {
      if (i === index) {
        el.classList.add('is-active');
      } else {
        el.classList.remove('is-active');
      }
    });
    current = index;
  }

  function next() {
    const idx = (current + 1) % items.length;
    show(idx);
  }

  function prev() {
    const idx = (current - 1 + items.length) % items.length;
    show(idx);
  }

  function start() {
    stop();
    timer = setInterval(next, INTERVAL_MS);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Init first slide
  show(0);
  start();

  // Pause on hover
  container.addEventListener('mouseenter', stop);
  container.addEventListener('mouseleave', start);

  // Arrow navigation
  const leftArrow = container.querySelector('.gallery-arrow-left');
  const rightArrow = container.querySelector('.gallery-right-arrow');
  if (leftArrow) leftArrow.addEventListener('click', () => { prev(); restartAfterManual(); });
  if (rightArrow) rightArrow.addEventListener('click', () => { next(); restartAfterManual(); });

  // After manual nav, resume autoplay after a beat
  let resumeTimer = null;
  function restartAfterManual() {
    if (resumeTimer) clearTimeout(resumeTimer);
    stop();
    resumeTimer = setTimeout(start, FADE_MS + 1000);
  }
})();

/* === CRITICAL FIXES FOR GALLERY, ACCESSORIES, AND LIGHTBOX === */
(function () {
  if (window.__criticalFixesApplied) return;
  if (!document.querySelector('.product-page-section')) return;
  window.__criticalFixesApplied = true;

  console.log('🔧 Applying critical fixes for gallery, accessories, and lightbox...');

  // 1. FIX GALLERY IMAGES NOT SHOWING
  function fixGalleryImages() {
    console.log('🖼️ Fixing gallery images...');
    
    // Check for gallery section and ensure it's visible
    const gallerySection = document.querySelector('.gallery-section, .gallery-section-cms');
    if (gallerySection) {
      // Make sure gallery section is visible
      gallerySection.style.display = '';
      gallerySection.style.visibility = '';
      gallerySection.style.opacity = '';
      gallerySection.style.height = '';
      gallerySection.style.overflow = '';
      
      console.log('✅ Gallery section made visible');
    }

    // Check for gallery items and ensure they're visible
    const galleryItems = document.querySelectorAll('.gallery-section img, .gallery-section-cms img, .w-dyn-item img');
    console.log(`🖼️ Found ${galleryItems.length} gallery images`);
    
    galleryItems.forEach((img, index) => {
      // Ensure images are visible and properly loaded
      img.style.display = '';
      img.style.visibility = '';
      img.style.opacity = '';
      
      // Force image loading if needed
      if (!img.complete) {
        img.style.opacity = '0';
        img.onload = function() {
          this.style.opacity = '1';
          console.log(`✅ Gallery image ${index + 1} loaded`);
        };
        img.onerror = function() {
          console.warn(`⚠️ Gallery image ${index + 1} failed to load`);
        };
      }
    });

    // Check for collection items and ensure they're visible
    const collectionItems = document.querySelectorAll('.w-dyn-item, .collection-item');
    console.log(`📦 Found ${collectionItems.length} collection items`);
    
    collectionItems.forEach((item, index) => {
      item.style.display = '';
      item.style.visibility = '';
      item.style.opacity = '';
    });
  }

  // 2. FIX ACCESSORIES SECTION EMPTY
  function fixAccessoriesSection() {
    console.log('🔧 Fixing accessories section...');
    
    // Check for accessories section
    const accessoriesSection = document.querySelector('.accessories-section');
    if (!accessoriesSection) {
      console.log('⚠️ Accessories section not found');
      return;
    }

    // Check for accessories items
    const accessoriesItems = document.querySelectorAll('.accessories-item, .accessory-item, .accessory-checkbox');
    console.log(`🔧 Found ${accessoriesItems.length} accessories items`);
    
    if (accessoriesItems.length === 0) {
      // Try to find accessories in different selectors
      const alternativeItems = document.querySelectorAll('[class*="accessory"], [class*="accessories"]');
      console.log(`🔧 Found ${alternativeItems.length} alternative accessories items`);
      
      if (alternativeItems.length === 0) {
        console.log('⚠️ No accessories items found - section may be empty in CMS');
        // Hide accessories section if truly empty
        accessoriesSection.style.display = 'none';
        return;
      }
    }

    // Ensure accessories section is visible
    accessoriesSection.style.display = '';
    accessoriesSection.style.visibility = '';
    accessoriesSection.style.opacity = '';

    // Re-initialize accessories toggle functionality
    const toggle = accessoriesSection.querySelector('.accessories-toggle');
    const wrapper = accessoriesSection.querySelector('.accessories-wrapper');
    const arrow = accessoriesSection.querySelector('.accessories-arrow');

    if (toggle && wrapper && arrow) {
      // Remove existing listeners to prevent duplicates
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);
      
      newToggle.addEventListener('click', function () {
        const isOpen = accessoriesSection.classList.toggle('open');
        arrow.classList.toggle('rotated');

        if (isOpen) {
          wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
        } else {
          wrapper.style.maxHeight = '0px';
        }
        console.log('✅ Accessories toggle clicked');
      });
      
      console.log('✅ Accessories toggle functionality restored');
    }

    // Re-initialize accessory checkboxes
    const checkboxes = accessoriesSection.querySelectorAll('.accessory-checkbox');
    checkboxes.forEach(box => {
      // Remove existing listeners to prevent duplicates
      const newBox = box.cloneNode(true);
      box.parentNode.replaceChild(newBox, box);
      
      newBox.addEventListener('click', function () {
        this.classList.toggle('active');
        console.log('✅ Accessory checkbox clicked');
      });
    });
    
    console.log(`✅ ${checkboxes.length} accessory checkboxes restored`);
  }

  // 3. FIX LIGHTBOX NAVIGATION ARROWS
  function fixLightboxNavigation() {
    console.log('🖼️ Fixing lightbox navigation...');
    
    // Check for main lightbox trigger
    const mainTrigger = document.getElementById('main-lightbox-trigger');
    console.log('🔍 Main trigger found:', mainTrigger);
    console.log('🔍 Main trigger tag name:', mainTrigger ? mainTrigger.tagName : 'null');
    console.log('🔍 Main trigger classes:', mainTrigger ? mainTrigger.className : 'null');
    
    if (!mainTrigger) {
      console.log('⚠️ Main lightbox trigger not found');
      return;
    }

    // Check for first gallery item (Webflow lightbox) - using the same selector as old working code
    const firstGalleryItem = document.querySelector('.first-gallery-image');
    console.log('🔍 First gallery item found:', firstGalleryItem);
    console.log('🔍 First gallery item tag name:', firstGalleryItem ? firstGalleryItem.tagName : 'null');
    console.log('🔍 First gallery item classes:', firstGalleryItem ? firstGalleryItem.className : 'null');
    
    if (!firstGalleryItem) {
      console.log('⚠️ First gallery item not found');
      return;
    }

    // Simple approach: just add click handler to main image to trigger existing lightbox - exactly like old working code
    mainTrigger.addEventListener('click', () => {
      console.log('🖼️ Main image clicked - triggering lightbox');
      firstGalleryItem.click();
    });
    
    console.log('✅ Main image click handler added');
    
    console.log('✅ Main image lightbox functionality enabled');
    
    // Add a simple test click handler to verify the image is clickable
    const testClickHandler = function(e) {
      console.log('🎯 TEST: Main image clicked!');
      console.log('🎯 Event target:', e.target);
      console.log('🎯 Event type:', e.type);
    };
    
    // Add test handler to the main trigger
    mainTrigger.addEventListener('click', testClickHandler);
    console.log('✅ Test click handler added to main image');

    // Initialize hero section parallax effects
    initializeHeroParallax();
    console.log('✅ Hero parallax effects initialized');

    // Initialize categories parallax effects
    initializeCategoriesParallax();
    console.log('✅ Categories parallax effects initialized');

    // Wait for Webflow lightbox to be ready and add navigation
    setTimeout(() => {
      const lightbox = document.querySelector('.w-lightbox-backdrop');
      if (lightbox) {
        console.log('✅ Webflow lightbox found - adding navigation');
        
        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
          if (lightbox.style.display === 'none') return;
          
          switch(e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              const prevButton = lightbox.querySelector('.w-lightbox-left');
              if (prevButton) prevButton.click();
              break;
            case 'ArrowRight':
              e.preventDefault();
              const nextButton = lightbox.querySelector('.w-lightbox-right');
              if (nextButton) nextButton.click();
              break;
            case 'Escape':
              e.preventDefault();
              const closeButton = lightbox.querySelector('.w-lightbox-close');
              if (closeButton) closeButton.click();
              break;
          }
        });

        // Add touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        lightbox.addEventListener('touchstart', function(e) {
          touchStartX = e.changedTouches[0].screenX;
        });
        
        lightbox.addEventListener('touchend', function(e) {
          touchEndX = e.changedTouches[0].screenX;
          const swipeThreshold = 50;
          const diff = touchStartX - touchEndX;
          
          if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
              const nextButton = lightbox.querySelector('.w-lightbox-right');
              if (nextButton) nextButton.click();
            } else {
              const prevButton = lightbox.querySelector('.w-lightbox-left');
              if (prevButton) prevButton.click();
            }
          }
        });
        
        console.log('✅ Lightbox navigation added');
      } else {
        console.log('⚠️ Webflow lightbox not found');
      }
    }, 1000);
  }

  // 4. FIX THUMBNAIL FUNCTIONALITY
  function fixThumbnailFunctionality() {
    console.log('🖼️ Fixing thumbnail functionality...');
    
    const mainImage = document.getElementById('main-lightbox-trigger');
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    
    if (!mainImage || thumbnails.length === 0) {
      console.log('⚠️ Main image or thumbnails not found');
      return;
    }

    thumbnails.forEach((thumb, index) => {
      // Remove existing listeners to prevent duplicates
      const newThumb = thumb.cloneNode(true);
      thumb.parentNode.replaceChild(newThumb, thumb);
      
      newThumb.addEventListener('click', function () {
        // Get fresh reference to all thumbnails after DOM changes
        const allThumbnails = document.querySelectorAll('.thumbnail-image');
        
        // Remove active class from all thumbnails
        allThumbnails.forEach(t => t.classList.remove('is-active'));
        
        // Add active class to clicked thumbnail
        this.classList.add('is-active');
        
        // Update main image
        const newImg = this.getAttribute('data-image') || this.getAttribute('src');
        if (newImg) {
          if (mainImage.tagName === 'IMG') {
            mainImage.src = newImg;
          } else {
            mainImage.setAttribute('href', newImg);
          }
          console.log(`✅ Thumbnail ${index + 1} clicked - main image updated`);
        }
      });
    });
    
    console.log(`✅ ${thumbnails.length} thumbnails restored`);
  }

  // 5. FIX DOWNLOAD PANEL CHECKBOXES
  function fixDownloadPanelCheckboxes() {
    console.log('📥 Fixing download panel checkboxes...');
    
    const downloadCheckboxes = document.querySelectorAll('.checkbox');
    console.log(`📥 Found ${downloadCheckboxes.length} download checkboxes`);
    
    if (downloadCheckboxes.length === 0) {
      console.log('⚠️ No download checkboxes found');
      return;
    }

    downloadCheckboxes.forEach((box, index) => {
      console.log(`📥 Processing checkbox ${index + 1}:`, box);
      console.log(`📥 Checkbox classes:`, box.className);
      console.log(`📥 Checkbox computed styles:`, window.getComputedStyle(box));
      
      // Remove existing listeners to prevent duplicates
      const newBox = box.cloneNode(true);
      box.parentNode.replaceChild(newBox, box);
      
      // Add multiple event listeners to debug
      newBox.addEventListener('click', function (e) {
        console.log(`🎯 Download checkbox ${index + 1} CLICKED!`);
        console.log(`🎯 Event target:`, e.target);
        console.log(`🎯 Current classes:`, this.className);
        this.classList.toggle('active');
        console.log(`✅ Download checkbox ${index + 1} clicked - active: ${this.classList.contains('active')}`);
        e.preventDefault();
        e.stopPropagation();
      });
      
      newBox.addEventListener('mousedown', function (e) {
        console.log(`🎯 Download checkbox ${index + 1} MOUSEDOWN!`);
      });
      
      newBox.addEventListener('mouseup', function (e) {
        console.log(`🎯 Download checkbox ${index + 1} MOUSEUP!`);
      });
      
      // Force pointer events
      newBox.style.pointerEvents = 'auto';
      newBox.style.cursor = 'pointer';
      newBox.style.zIndex = '10';
    });
    
    console.log(`✅ ${downloadCheckboxes.length} download checkboxes restored`);
  }

  // 6. FIX CATEGORY CARDS NAVIGATION
  function fixCategoryCardsNavigation() {
    console.log('🎯 Fixing category cards navigation...');
    
    // Re-initialize category cards to ensure they work
    try {
      initializeCategoryCards();
      console.log('✅ Category cards navigation restored');
    } catch (error) {
      console.error('❌ Error fixing category cards:', error);
    }
  }

  // Run all fixes
  fixGalleryImages();
  fixAccessoriesSection();
  fixLightboxNavigation();
  fixThumbnailFunctionality();
  fixDownloadPanelCheckboxes();
  fixCategoryCardsNavigation();

  // Re-run fixes after a delay to catch late-loading content
  setTimeout(() => {
    fixGalleryImages();
    fixAccessoriesSection();
    fixLightboxNavigation();
    fixThumbnailFunctionality();
    fixDownloadPanelCheckboxes();
    fixCategoryCardsNavigation();
  }, 2000);

  console.log('✅ All critical fixes applied');
})();

/* === Hero Section Parallax Effects === */
function initializeHeroParallax() {
  const heroWrapper = document.querySelector('.main-page-hero-section-wrapper');
  const heroImg = document.querySelector('.main-page-hero-section-img');
  const textWrapper = document.querySelector('.hero-text-wrapper');
  const logo = document.querySelector('.duva-light-logo');
  const textElements = document.querySelectorAll('.text-block-55, .text-span-4, .text-span-5, .text-span-3, .text-block-70');

  if (!heroWrapper) {
    console.log('⚠️ Hero section not found');
    return;
  }

  let ticking = false;
  let scrollY = 0;

  function updateParallax() {
    // Update CSS custom property for scroll position
    document.documentElement.style.setProperty('--scroll-y', scrollY);

    // Add parallax-active class to elements
    if (heroImg) heroImg.classList.add('parallax-active');
    if (textWrapper) textWrapper.classList.add('parallax-active');
    if (logo) logo.classList.add('parallax-active');
    
    textElements.forEach(element => {
      element.classList.add('parallax-active');
    });

    ticking = false;
  }

  function onScroll() {
    scrollY = window.pageYOffset;
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Add scroll listener
  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial call
  updateParallax();

  console.log('🎯 Hero parallax system active');
}

/* === Categories Section Parallax Effects === */
function initializeCategoriesParallax() {
  const categoriesWrapper = document.querySelector('.main-page-categories-wrapper');
  const categoryCards = document.querySelectorAll('.main-page-categories-wrapper a');

  if (!categoriesWrapper) {
    console.log('⚠️ Categories wrapper not found');
    return;
  }

  // Set card indices for staggered animations
  categoryCards.forEach((card, index) => {
    card.style.setProperty('--card-index', index);
  });

  let ticking = false;
  let scrollY = 0;
  let hasScrolled = false;

  function updateCategoriesParallax() {
    // Only activate parallax after user has started scrolling
    if (hasScrolled) {
      // Add parallax-active class to wrapper
      categoriesWrapper.classList.add('parallax-active');

      // Update individual card parallax based on position
      categoryCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distance = cardCenter - viewportCenter;
        
        // Apply subtle parallax based on card position
        const parallaxOffset = distance * 0.02;
        card.style.transform = `translateY(${parallaxOffset}px)`;
      });
    }

    ticking = false;
  }

  function onCategoriesScroll() {
    scrollY = window.pageYOffset;
    
    // Mark that user has started scrolling
    if (!hasScrolled && scrollY > 10) {
      hasScrolled = true;
      console.log('🎯 Categories parallax activated on scroll');
    }
    
    if (!ticking) {
      requestAnimationFrame(updateCategoriesParallax);
      ticking = true;
    }
  }

  // Add scroll listener
  window.addEventListener('scroll', onCategoriesScroll, { passive: true });

  // Initial call
  updateCategoriesParallax();

  // Add intersection observer for entrance animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  categoryCards.forEach(card => {
    observer.observe(card);
  });

  console.log('🎯 Categories parallax system active');
}
