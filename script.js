console.log("DUVA script.js loaded!");

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

 

/* === 3. Dropdown + Code Generator + Accessories Logic === */ 

// Full working logic from your working file, manually verified and retained 

document.querySelectorAll('.accessory-image').forEach(container => { 

    const img = container.querySelector('img'); 

 

    // Zoom in on hover 

    container.addEventListener('mouseenter', () => { 

      img.classList.add('zoomed'); 

    }); 

 

    // Track mouse position for dynamic zoom focus 

    container.addEventListener('mousemove', e => { 

      const rect = container.getBoundingClientRect(); 

      const x = ((e.clientX - rect.left) / rect.width) * 100; 

      const y = ((e.clientY - rect.top) / rect.height) * 100; 

      img.style.transformOrigin = `${x}% ${y}%`; 

    }); 

 

    // Reset on mouse leave 

    container.addEventListener('mouseleave', () => { 

      img.classList.remove('zoomed'); 

      img.style.transformOrigin = 'center center'; 

    }); 

  }); 

 

 

 

  document.addEventListener("DOMContentLoaded", function () { 

    const mainImage = document.getElementById("main-lightbox-trigger"); 

    const thumbnails = document.querySelectorAll(".thumbnail-image"); 

 

    thumbnails.forEach((thumb) => { 

      thumb.addEventListener("click", function () { 

        // === Get the source of the clicked thumbnail 

        const newSrc = thumb.getAttribute("src"); 

 

        // === Update the main image 

        if (newSrc && mainImage) { 

          mainImage.setAttribute("src", newSrc); 

        } 

      }); 

    }); 

  }); 

 

 

 

  document.addEventListener("DOMContentLoaded", function () { 

    const mainTrigger = document.getElementById("main-lightbox-trigger"); 

    const firstGalleryItem = document.querySelector(".first-gallery-image"); 

 

    // === When main image is clicked, open the Webflow lightbox 

    if (mainTrigger && firstGalleryItem) { 

      mainTrigger.addEventListener("click", () => { 

        firstGalleryItem.click(); 

      }); 

    } 

  }); 

 

 

 

document.addEventListener("DOMContentLoaded", function () { 

  // === Global Selectors & State === 

  const dropdowns = document.querySelectorAll(".dropdown-wrapper"); 

  const ralInput = document.querySelector("#ral-input"); 

 

  // === RAL Input Initial Setup === 

  if (ralInput) { 

    ralInput.style.display = "none"; 

    ralInput.textContent = "Enter RAL number here"; 

    ralInput.setAttribute("contenteditable", "true"); 

    ralInput.style.color = "#999"; 

    ralInput.style.padding = "6px 8px"; 

    ralInput.style.minHeight = "48px"; 

    ralInput.style.backgroundColor = "#f8f8f8"; 

    ralInput.style.borderRadius = "6px"; 

    ralInput.style.cursor = "text"; 

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
    console.log("updateOrderingCode: product =", window.currentSelection.product);
    const baseCode = window.currentSelection.product || "CXXX"; 

    const keys = ["watt", "ip-rating", "beam", "cct", "cri", "finish"]; 

    const labels = ["Wattage", "IP Rating", "Beam", "CCT", "CRI", "Finish"]; 

    const codeElement = document.querySelector(".ordering-code-value"); 
    const pdfCodeElement = document.getElementById("pdf-code"); // <-- Add this

  if (codeElement) { 
    const styledParts = keys.map((key, i) => { 
      const val = getTextValue(key) || "XX"; 
      const defaultVal = window.currentSelection.defaults?.[key] || "XX"; 
      const isDefault = val === defaultVal; 
      const color = isDefault ? "#999" : "#C0392B"; 
      return `<span title="${labels[i]}" style="color:${color}; font-weight: bold;">${val}</span>`; 
    }); 

    // For on-screen display
    codeElement.innerHTML = `<span title="Product Code" style="color: #111; font-weight: bold;">${baseCode}</span>.` + styledParts.join(".");

    // For PDF filename (plain text, no HTML)
    if (pdfCodeElement) {
      // Build plain code string for filename
      const plainParts = keys.map(key => getTextValue(key) || "XX");
      pdfCodeElement.textContent = `${baseCode}.${plainParts.join(".")}`;
      console.log("updateOrderingCode: pdfCodeElement.textContent =", pdfCodeElement.textContent);
    }
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

 

  /* === Dropdown + Configurator Logic === */ 

  const dropdowns = document.querySelectorAll(".dropdown-wrapper"); 

  const ralInput = document.querySelector("#ral-input"); 

 

  // RAL input styling and default setup 

  if (ralInput) { 

    ralInput.style.display = "none"; 

    ralInput.textContent = "Enter RAL number here"; 

    ralInput.setAttribute("contenteditable", "true"); 

    ralInput.style.color = "#999"; 

    ralInput.style.padding = "6px 8px"; 

    ralInput.style.minHeight = "48px"; 

    ralInput.style.backgroundColor = "#f8f8f8"; 

    ralInput.style.borderRadius = "6px"; 

    ralInput.style.cursor = "text"; 

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

    const baseCode = window.currentSelection.product || "CXXX"; 

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

  }, 300); 

 

}); 

 

 

 

document.addEventListener('DOMContentLoaded', function () { 

 

  /* === Get Product Code Based on Current Selection === */ 

  function getProductCode() { 

    const selection = window.currentSelection || {}; 

    const code = selection.code || 'C329'; 

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
  const pdfContainer = document.querySelector('.pdf-container');
  if (pdfContainer) {
    pdfContainer.classList.remove('hidden');
    pdfContainer.classList.add('visible');
    pdfContainer.style.position = 'relative';
    // pdfContainer.style.top = '-9999px'; // TEMP: Disabled for debug
    pdfContainer.style.left = '0';
    pdfContainer.style.width = '100vw';
  }
}
function hidePDFContainer() {
  const pdfContainer = document.querySelector('.pdf-container');
  if (pdfContainer) {
    pdfContainer.classList.remove('visible');
    pdfContainer.classList.add('hidden');
    pdfContainer.style.position = '';
    pdfContainer.style.top = '';
    pdfContainer.style.left = '';
    pdfContainer.style.width = '';
  }
}

function generatePDF() {
  if (isExporting) return; // Prevent double export
  isExporting = true;
  // 1. Clear previous accessories
  const pdfAccessories = document.querySelector('.pdf-accessories');
  if (pdfAccessories) {
    pdfAccessories.innerHTML = '';
  }
  // 2. Loop through selected accessories and build export list
  document.querySelectorAll('.accessory-checkbox.active').forEach(box => {
    const accessoryItem = box.closest('.accessory-item');
    if (!accessoryItem) return;
    const imageEl = accessoryItem.querySelector('.accessory-image img, img.accessory-image');
    const titleEl = accessoryItem.querySelector('.accessory-title');
    const descEl  = accessoryItem.querySelector('.accessory-desc');
    if (imageEl?.src && !imageEl.src.includes('undefined') && titleEl) {
      const wrapper = document.createElement('div');
      wrapper.className = 'accessory-item';
      wrapper.innerHTML = `
        <img src="${imageEl.src}" class="accessory-image">
        <div class="accessory-title">${titleEl.textContent}</div>
        <div class="accessory-desc">${descEl?.textContent || ''}</div>
      `;
      pdfAccessories.appendChild(wrapper);
    }
  });
  // 3. Show the PDF container (off-screen but rendered)
  showPDFContainer();
  // 4. Prepare PDF export
  const element = document.querySelector('.pdf-container');
  const code = document.getElementById('pdf-code')?.textContent?.replace(/^Code:\s*/i, '').trim() || 'file';
  if (!element) {
    hidePDFContainer();
    alert('PDF container not found!');
    isExporting = false;
    return;
  }
  // === Inject Product Image Dynamically ===
  const imageElement = document.querySelector('#product-image img'); // or your actual main image selector
  const pdfImageContainer = document.getElementById('pdf-image');
  if (imageElement && pdfImageContainer) {
    const imageUrl = imageElement.src;
    pdfImageContainer.innerHTML = `<img src="${imageUrl}" style="max-width: 100%;">`;
  }
  // 5. Export PDF
  html2pdf()
    .from(element)
    .set({
      margin: 0,
      filename: `${code}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .save()
    .then(() => {
      // 6. Cleanup after export
      if (pdfAccessories) {
        pdfAccessories.innerHTML = '';
      }
      hidePDFContainer();
      isExporting = false;
    })
    .catch(() => {
      isExporting = false;
    });
}
// Attach the event listener ONCE, after DOM is ready
const exportButtons = document.querySelectorAll('.download-button, .download-arrow');
exportButtons.forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    generatePDF();
  });
});

// === Utility: Ensure Product Code is Set from DOM ===
function ensureProductCode() {
  const code = document.querySelector("#product-code-heading")?.textContent.trim();
  console.log("ensureProductCode: found code =", code);
  if (code) {
    window.currentSelection.product = code;
  }
  console.log("window.currentSelection.product =", window.currentSelection.product);
}
