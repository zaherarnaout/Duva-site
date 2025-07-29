console.log("DUVA product-configurator.js loaded!");

/* === Dropdown + Code Generator + Accessories Logic === */ 
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
    ralInput.style.border = "1px solid #e4e3e3";
    ralInput.style.width = "280px";
    ralInput.style.fontSize = "14px";
    ralInput.style.fontFamily = "inherit";
    ralInput.style.lineHeight = "1.4";
    ralInput.style.transition = "all 0.3s ease";
    ralInput.style.outline = "none";
    ralInput.style.resize = "none";
    ralInput.style.overflow = "hidden";
    
    // Additional CSS to prevent blue border
    ralInput.style.setProperty("outline", "none", "important");
    ralInput.style.setProperty("border-color", "#e4e3e3", "important");
    ralInput.style.setProperty("box-shadow", "none", "important");
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
                
                // Focus effects - ensure no blue border
                ralInput.style.borderColor = "#e4e3e3";
                ralInput.style.border = "1px solid #e4e3e3";
                ralInput.style.outline = "none";
                ralInput.style.boxShadow = "none";

              });
              
              // Hover effects
              ralInput.addEventListener("mouseenter", () => {
                ralInput.style.borderColor = "#e4e3e3";
              });
              
              ralInput.addEventListener("mouseleave", () => {
                if (document.activeElement !== ralInput) {
                  ralInput.style.borderColor = "#e4e3e3";
                  ralInput.style.boxShadow = "none";
                }
              });
              
              ralInput.addEventListener("blur", () => {
                ralInput.style.borderColor = "#e4e3e3";
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

// === Dynamic Product Code Functions ===

// Get current product code dynamically from CMS
function getCurrentProductCode() {
  console.log('🔍 Searching for current product code...');
  
  // PRIORITY 1: Check window.currentSelection first (most current)
  if (window.currentSelection && window.currentSelection.product) {
    console.log('✅ Using product code from window.currentSelection:', window.currentSelection.product);
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
    console.log(`🔍 Checking visible selector "${selector}":`, element);
    if (element && element.textContent.trim()) {
      const code = element.textContent.trim();
      console.log(`✅ Found visible product code from ${selector}:`, code);
      return code;
    }
  }
  
  // PRIORITY 3: Check for any visible element containing a product code pattern
  const allElements = document.querySelectorAll('*:not([style*="display: none"])');
  for (const element of allElements) {
    if (element.textContent && element.textContent.match(/^C\d{3,4}$/)) {
      const code = element.textContent.trim();
      console.log(`✅ Found visible product code pattern in element:`, element, 'Code:', code);
      return code;
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
    console.log(`🔍 Checking hidden selector "${selector}":`, element);
    if (element && element.textContent.trim()) {
      const code = element.textContent.trim();
      console.log(`⚠️ Using hidden product code from ${selector}:`, code);
      return code;
    }
  }
  
  console.log('⚠️ No product code found, using fallback: CXXX');
  return 'CXXX';
}

// Get current product family from CMS
function getCurrentProductFamily() {
  // This should pull from your CMS - adjust selector as needed
  const familyElement = document.querySelector('.product-title-source');
  return familyElement ? familyElement.textContent.trim() : null;
}

// === Utility: Ensure Product Code is Set from DOM ===
function ensureProductCode() {
  const code = document.querySelector("#product-code-heading")?.textContent.trim();
  console.log("ensureProductCode: found code =", code);
  if (code) {
    window.currentSelection.product = code;
  }
  console.log("window.currentSelection.product =", window.currentSelection.product);
}

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

// Initialize observer when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setupOrderingCodeObserver();
});

// Export functions for use in other modules
window.productConfiguratorModule = {
  getCurrentProductCode,
  getCurrentProductFamily,
  ensureProductCode,
  refreshOrderingCode,
  setupOrderingCodeObserver,
  updateProductCodeInjection,
  updateGeneratedCodeInjection
}; 