console.log("DUVA pdf-export.js loaded!");

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
  if (window.accessoriesModule) {
    window.accessoriesModule.injectSelectedAccessories();
  }
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

function generatePDF() {
  if (isExporting) return; // Prevent double export
  isExporting = true;
  
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
  if (window.productConfiguratorModule) {
    window.productConfiguratorModule.updateProductCodeInjection();
  }
  // === Inject Generated Code into PDF ===
  if (window.productConfiguratorModule) {
    window.productConfiguratorModule.updateGeneratedCodeInjection();
  }
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

// === Update PDF Images Function ===
function updatePdfImages() {
  // This function can be called to update images when CMS data changes
  // For now, we'll just call the main injection function
  injectPdfImages();
}

// Call updateSpecsTable at the end of updateLumenValue and updateOrderingCode
const origUpdateLumenValue = typeof updateLumenValue === 'function' ? updateLumenValue : null;
window.updateLumenValue = function() {
  if (origUpdateLumenValue) origUpdateLumenValue.apply(this, arguments);
  updateSpecsTable();
  if (window.productConfiguratorModule) {
    window.productConfiguratorModule.updateProductCodeInjection();
    window.productConfiguratorModule.updateGeneratedCodeInjection();
  }
  updatePdfImages();
};

const origUpdateOrderingCode = typeof updateOrderingCode === 'function' ? updateOrderingCode : null;
window.updateOrderingCode = function() {
  if (origUpdateOrderingCode) origUpdateOrderingCode.apply(this, arguments);
  updateSpecsTable();
  if (window.productConfiguratorModule) {
    window.productConfiguratorModule.updateProductCodeInjection();
    window.productConfiguratorModule.updateGeneratedCodeInjection();
  }
  updatePdfImages();
};

// Export functions for use in other modules
window.pdfExportModule = {
  generatePDF,
  showPDFContainer,
  hidePDFContainer,
  injectPdfContent,
  injectPdfIcons,
  injectPdfImages,
  updateSpecsTable,
  updatePdfImages
}; 