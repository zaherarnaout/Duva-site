// === PDF CATALOG SYSTEM ===
// Handles catalog download and preview functionality

// PDF Catalog Configuration
const PDF_CATALOG_CONFIG = {
  // Download Configuration
  catalogUrl: 'https://raw.githubusercontent.com/zaherarnaout/Duva-site/0fb2511fb1e9fa683f222250be56e7ce0092e10f/Pages%20from%20Duva_Catalogue_2023R4.pdf',
  catalogSize: '15.2 MB',
  catalogFormat: 'PDF',
  lastUpdated: '2023',
  requireEmail: false,
  emailEndpoint: '/api/capture-email',
  
  // Preview Configuration
  pdfjsLib: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
  pdfjsWorker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
};

// PDF Preview State - SIMPLIFIED
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.0; // Start with 100% scale
let canvas = null;
let ctx = null;
let bookMode = true;
let leftCanvas = null;
let rightCanvas = null;
let leftCtx = null;
let rightCtx = null;

// Initialize PDF catalog functionality
function initializePDFCatalog() {
  initializeCatalogDownload();
  initializeCatalogPreview();
}

// === CATALOG DOWNLOAD SYSTEM ===
function initializeCatalogDownload() {
  const downloadBtn = document.querySelector('.cata-main-download');
  if (!downloadBtn || downloadBtn.hasAttribute('data-download-initialized')) {
    return;
  }
  
  console.log('📥 Initializing catalog download system...');
  
  // Create progress container
  const progressContainer = document.createElement('div');
  progressContainer.className = 'download-progress-container';
  progressContainer.innerHTML = `
    <div class="download-progress-bar">
      <div class="download-progress-fill"></div>
    </div>
    <div class="download-status">Preparing download...</div>
    <div class="download-info">
      <span>${PDF_CATALOG_CONFIG.catalogSize}</span>
      <span>${PDF_CATALOG_CONFIG.catalogFormat}</span>
      <span>Updated: ${PDF_CATALOG_CONFIG.lastUpdated}</span>
    </div>
  `;
  
  // Insert after download button
  downloadBtn.parentNode.insertBefore(progressContainer, downloadBtn.nextSibling);
  
  // Add hover effects to download button
  downloadBtn.addEventListener('mouseenter', () => {
    downloadBtn.style.transform = 'translateY(-2px)';
    downloadBtn.style.boxShadow = '0 8px 25px rgba(192, 57, 43, 0.3)';
  });
  
  downloadBtn.addEventListener('mouseleave', () => {
    downloadBtn.style.transform = 'translateY(0)';
    downloadBtn.style.boxShadow = '0 4px 12px rgba(192, 57, 43, 0.2)';
  });
  
  // Add click handler to catalog image
  const catalogImage = downloadBtn.querySelector('.image-53');
  if (catalogImage) {
    catalogImage.addEventListener('click', () => {
      startDownload(progressContainer);
    });
  }
  
  // Mark as initialized
  downloadBtn.setAttribute('data-download-initialized', 'true');
}

function startDownload(progressContainer) {
  // Show progress container
  progressContainer.style.display = 'block';
  setTimeout(() => {
    progressContainer.style.opacity = '1';
    progressContainer.style.transform = 'translateY(0)';
  }, 10);
  
  // Update button state
  const downloadBtn = document.querySelector('.cata-main-download');
  const button = downloadBtn.querySelector('.button-3');
  const originalText = button.textContent;
  
  button.textContent = 'Downloading...';
  button.style.backgroundColor = '#D1D1D1';
  button.style.cursor = 'not-allowed';
  
  // Simulate download progress
  const progressFill = progressContainer.querySelector('.download-progress-fill');
  const status = progressContainer.querySelector('.download-status');
  
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      
      // Complete download
      setTimeout(() => {
        // Trigger actual download
        const link = document.createElement('a');
        link.href = PDF_CATALOG_CONFIG.catalogUrl;
        link.download = 'DUVA_Catalogue_2023R4.pdf';
        link.click();
        
        // Show success notification
        showNotification('✅ Catalog downloaded successfully!', 'success');
        
        // Reset UI
        resetDownloadUI(progressContainer, button, originalText);
        
        // Capture email if required
        if (PDF_CATALOG_CONFIG.requireEmail) {
          setTimeout(() => {
            showEmailCaptureModal();
          }, 1000);
        }
      }, 500);
    }
    
    progressFill.style.width = progress + '%';
    status.textContent = `Downloading... ${Math.round(progress)}%`;
  }, 200);
}

function resetDownloadUI(progressContainer, button, originalText) {
  // Reset button
  button.textContent = originalText;
  button.style.backgroundColor = '';
  button.style.cursor = '';
  
  // Hide progress container
  setTimeout(() => {
    progressContainer.style.opacity = '0';
    progressContainer.style.transform = 'translateY(10px)';
    setTimeout(() => {
      progressContainer.style.display = 'none';
    }, 300);
  }, 3000);
}

function showEmailCaptureModal() {
  const modal = document.createElement('div');
  modal.className = 'email-capture-modal';
  modal.innerHTML = `
    <div class="email-capture-content">
      <h4>Stay Updated!</h4>
      <p>Get notified about new products and updates.</p>
      <form class="email-capture-form">
        <input type="email" placeholder="Enter your email" required>
        <button type="submit">Subscribe</button>
      </form>
      <button class="skip-email">Skip</button>
      <button class="close-modal">×</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.remove();
  });
  
  modal.querySelector('.skip-email').addEventListener('click', () => {
    modal.remove();
  });
  
  modal.querySelector('.email-capture-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    // Handle email submission here
    showNotification('✅ Thank you for subscribing!', 'success');
    modal.remove();
  });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `download-notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// === CATALOG PREVIEW SYSTEM ===
function initializeCatalogPreview() {
  const previewBtn = document.querySelector('.cata-preview-btn');
  if (!previewBtn || previewBtn.hasAttribute('data-preview-initialized')) {
    return;
  }
  
  console.log('👁️ Initializing catalog preview system...');
  
  // Add enhanced hover effects
  previewBtn.addEventListener('mouseenter', () => {
    previewBtn.style.transform = 'translateY(-2px) scale(1.02)';
    previewBtn.style.boxShadow = '0 8px 25px rgba(192, 57, 43, 0.3)';
  });
  
  previewBtn.addEventListener('mouseleave', () => {
    previewBtn.style.transform = 'translateY(0) scale(1)';
    previewBtn.style.boxShadow = '0 4px 12px rgba(192, 57, 43, 0.2)';
  });
  
  // Add click handler
  previewBtn.addEventListener('click', handlePreviewClick);
  
  // Mark as initialized
  previewBtn.setAttribute('data-preview-initialized', 'true');
}

async function handlePreviewClick() {
  console.log('📖 Opening catalog preview...');
  
  // Load PDF.js if not already loaded
  if (typeof pdfjsLib === 'undefined') {
    await loadPDFjs();
  }
  
  showPreviewModal();
}

async function loadPDFjs() {
  return new Promise((resolve, reject) => {
    if (typeof pdfjsLib !== 'undefined') {
      resolve();
      return;
    }
    
    // Load PDF.js script
    const script = document.createElement('script');
    script.src = PDF_CATALOG_CONFIG.pdfjsLib;
    script.onload = () => {
      // Set worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_CATALOG_CONFIG.pdfjsWorker;
      console.log('✅ PDF.js loaded successfully');
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function showPreviewModal() {
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  const modal = document.createElement('div');
  modal.className = 'catalog-preview-modal';
  modal.innerHTML = `
    <div class="preview-content">
             <div class="preview-header">
         <div class="header-logo-bg"></div>
                 <div class="preview-controls">
           <button class="control-btn zoom-out" title="Zoom Out">−</button>
           <span class="zoom-level">${Math.round(scale * 100)}%</span>
           <button class="control-btn zoom-in" title="Zoom In">+</button>
           <button class="control-btn book-mode" title="Toggle Book Mode">
             <img src="https://cdn.prod.website-files.com/684a5d9b82bae84c8dbeb42f/68ae8fc9872fdc09277900e8_double%20Page%20icon.svg" alt="Book Mode" class="mode-icon">
           </button>
           <button class="control-btn fullscreen" title="Fullscreen">⛶</button>
         </div>
        <button class="close-preview">×</button>
      </div>
      
             <div class="preview-search">
         <input type="text" placeholder="Search in catalog..." class="search-input">
         <button class="search-btn">
           <img src="https://cdn.prod.website-files.com/684a5d9b82bae84c8dbeb42f/68903738961d84e358c2970d_magnifier-black.svg" alt="Search" class="search-icon">
         </button>
       </div>
      
      <div class="preview-navigation">
        <button class="nav-btn prev-page" disabled>‹ Previous</button>
        <span class="page-info">Page <span class="current-page">1</span> of <span class="total-pages">-</span></span>
        <button class="nav-btn next-page">Next ›</button>
      </div>
      
      <div class="pdf-container">
        <!-- Book mode: Two canvases side by side -->
        <div class="book-pages">
          <canvas id="left-canvas" class="page-canvas"></canvas>
          <canvas id="right-canvas" class="page-canvas"></canvas>
        </div>
        <!-- Single page mode: One canvas -->
        <canvas id="pdf-canvas" class="single-canvas" style="display: none;"></canvas>
        <div class="loading-indicator">Loading catalog...</div>
      </div>
      
      <div class="preview-footer">
        <button class="download-from-preview">Download Full Catalog</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Initialize PDF viewer
  initializePDFViewer(modal);
  
  // Add event listeners
  addPreviewEventListeners(modal);
}

// Initialize PDF viewer - SIMPLIFIED
async function initializePDFViewer(modal) {
  try {
    console.log('📄 Loading PDF document...');
    
    // Get canvases and contexts
    leftCanvas = modal.querySelector('#left-canvas');
    rightCanvas = modal.querySelector('#right-canvas');
    leftCtx = leftCanvas.getContext('2d');
    rightCtx = rightCanvas.getContext('2d');
    
    canvas = modal.querySelector('#pdf-canvas');
    ctx = canvas.getContext('2d');
    
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({
      url: PDF_CATALOG_CONFIG.catalogUrl,
      maxImageSize: -1
    });
    pdfDoc = await loadingTask.promise;
    
    console.log('✅ PDF loaded:', pdfDoc.numPages, 'pages');
    
    // Update page info
    const totalPages = modal.querySelector('.total-pages');
    totalPages.textContent = pdfDoc.numPages;
    
    // Debug container dimensions
    const pdfContainer = modal.querySelector('.pdf-container');
    console.log('📏 PDF Container dimensions:', {
      clientWidth: pdfContainer.clientWidth,
      clientHeight: pdfContainer.clientHeight,
      offsetWidth: pdfContainer.offsetWidth,
      offsetHeight: pdfContainer.offsetHeight,
      scrollWidth: pdfContainer.scrollWidth,
      scrollHeight: pdfContainer.scrollHeight,
      windowInnerWidth: window.innerWidth,
      windowInnerHeight: window.innerHeight
    });
    
         // Calculate initial scale for single page mode
     const firstPage = await pdfDoc.getPage(1);
     const originalViewport = firstPage.getViewport({ scale: 1 });
     const containerWidth = pdfContainer.clientWidth - 40;
     const initialScaleForWidth = containerWidth / originalViewport.width;
     
     // Set initial scale to fit width for single page mode
     scale = Math.max(1.0, initialScaleForWidth);
     console.log('🎯 Initial scale set to:', scale, 'to fit width:', containerWidth);
     
     // Hide loading indicator
     const loadingIndicator = modal.querySelector('.loading-indicator');
     if (loadingIndicator) {
       loadingIndicator.style.display = 'none';
     }
     
     // Render first page
     renderPage(1, modal);
    
  } catch (error) {
    console.error('❌ Error loading PDF:', error);
    showPreviewError(modal, 'Failed to load catalog. Please try again.');
  }
}

// Render PDF page - SIMPLIFIED
async function renderPage(num, modal) {
  if (pageRendering) {
    return;
  }
  
  console.log('🎨 Rendering page', num, 'at scale', scale, 'book mode:', bookMode);
  pageRendering = true;
  
  try {
    if (bookMode) {
      await renderBookPages(num, modal);
    } else {
      await renderSinglePage(num, modal);
    }
    
    pageRendering = false;
    
    // Process pending page if any
    if (pageNumPending !== null) {
      const pendingNum = pageNumPending;
      pageNumPending = null;
      setTimeout(() => {
        renderPage(pendingNum, modal);
      }, 100);
    }
    
  } catch (error) {
    console.error('❌ Error rendering page:', error);
    pageRendering = false;
  }
}

// Render single page - SIMPLIFIED
async function renderSinglePage(num, modal) {
  const page = await pdfDoc.getPage(num);
  
  // Get container width to calculate scale for full width
  const pdfContainer = modal.querySelector('.pdf-container');
  const containerWidth = pdfContainer.clientWidth - 40; // Account for padding
  
  // Calculate scale to fit full width
  const originalViewport = page.getViewport({ scale: 1 });
  const scaleForWidth = containerWidth / originalViewport.width;
  
  // For single page mode, use the current zoom scale directly
  // This allows zoom controls to work properly
  const actualScale = scale;
  
  // Create viewport with actual scale
  const viewport = page.getViewport({ scale: actualScale });
  
  console.log('🎨 Rendering single page at scale:', actualScale, 'viewport:', viewport.width, 'x', viewport.height);
  console.log('📏 Container width:', containerWidth, 'original PDF width:', originalViewport.width, 'scale for width:', scaleForWidth, 'current zoom scale:', scale);
  
  // Set canvas dimensions based on actual PDF size and scale
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  
  // Render PDF page
  const renderContext = {
    canvasContext: ctx,
    viewport: viewport
  };
  
  await page.render(renderContext).promise;
  
  console.log('✅ Single page rendered, canvas size:', canvas.width, 'x', canvas.height);
  
  // Update page info
  const currentPage = modal.querySelector('.current-page');
  currentPage.textContent = num;
  
  // Update navigation buttons
  const prevBtn = modal.querySelector('.prev-page');
  const nextBtn = modal.querySelector('.next-page');
  prevBtn.disabled = num <= 1;
  nextBtn.disabled = num >= pdfDoc.numPages;
}

// Render book pages - SIMPLIFIED
async function renderBookPages(num, modal) {
  // Calculate which pages to show
  let leftPageNum = num;
  let rightPageNum = num + 1;
  
  if (num % 2 === 0) {
    leftPageNum = num - 1;
    rightPageNum = num;
  }
  
  if (leftPageNum < 1) {
    leftPageNum = 1;
    rightPageNum = 2;
  }
  
  if (rightPageNum > pdfDoc.numPages) {
    rightPageNum = pdfDoc.numPages;
    if (rightPageNum % 2 === 0) {
      leftPageNum = rightPageNum - 1;
    } else {
      leftPageNum = rightPageNum;
    }
  }
  
  console.log('📖 Book pages:', leftPageNum, 'and', rightPageNum);
  
  // Render left page
  if (leftPageNum <= pdfDoc.numPages) {
    const leftPage = await pdfDoc.getPage(leftPageNum);
    const leftViewport = leftPage.getViewport({ scale: scale });
    
    leftCanvas.height = leftViewport.height;
    leftCanvas.width = leftViewport.width;
    
    const leftRenderContext = {
      canvasContext: leftCtx,
      viewport: leftViewport
    };
    
    await leftPage.render(leftRenderContext).promise;
  }
  
  // Render right page
  if (rightPageNum <= pdfDoc.numPages && rightPageNum !== leftPageNum) {
    const rightPage = await pdfDoc.getPage(rightPageNum);
    const rightViewport = rightPage.getViewport({ scale: scale });
    
    rightCanvas.height = rightViewport.height;
    rightCanvas.width = rightViewport.width;
    
    const rightRenderContext = {
      canvasContext: rightCtx,
      viewport: rightViewport
    };
    
    await rightPage.render(rightRenderContext).promise;
  } else {
    // Clear right canvas if no second page
    rightCtx.clearRect(0, 0, rightCanvas.width, rightCanvas.height);
  }
  
  // Update page info
  const currentPage = modal.querySelector('.current-page');
  currentPage.textContent = num;
  
  // Update navigation buttons
  const prevBtn = modal.querySelector('.prev-page');
  const nextBtn = modal.querySelector('.next-page');
  prevBtn.disabled = num <= 1;
  nextBtn.disabled = num >= pdfDoc.numPages;
}

// Queue page rendering
function queueRenderPage(num, modal) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    pageNum = num;
    renderPage(num, modal);
  }
}

// Add preview event listeners - SIMPLIFIED
function addPreviewEventListeners(modal) {
  // Close button
  const closeBtn = modal.querySelector('.close-preview');
  closeBtn.addEventListener('click', () => closePreviewModal(modal));
  
  // Navigation buttons
  const prevBtn = modal.querySelector('.prev-page');
  const nextBtn = modal.querySelector('.next-page');
  
  prevBtn.addEventListener('click', () => {
    if (pageNum > 1 && !pageRendering) {
      if (bookMode) {
        const newPage = Math.max(1, pageNum - 2);
        queueRenderPage(newPage, modal);
      } else {
        queueRenderPage(pageNum - 1, modal);
      }
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (pageNum < pdfDoc.numPages && !pageRendering) {
      if (bookMode) {
        const newPage = Math.min(pdfDoc.numPages, pageNum + 2);
        queueRenderPage(newPage, modal);
      } else {
        queueRenderPage(pageNum + 1, modal);
      }
    }
  });
  
  // Zoom controls - SIMPLIFIED
  const zoomOutBtn = modal.querySelector('.zoom-out');
  const zoomInBtn = modal.querySelector('.zoom-in');
  const zoomLevel = modal.querySelector('.zoom-level');
  
  zoomOutBtn.addEventListener('click', () => {
    if (pageRendering) return;
    scale = Math.max(0.25, scale - 0.25);
    zoomLevel.textContent = Math.round(scale * 100) + '%';
    queueRenderPage(pageNum, modal);
  });
  
  zoomInBtn.addEventListener('click', () => {
    if (pageRendering) return;
    scale = Math.min(3, scale + 0.25);
    zoomLevel.textContent = Math.round(scale * 100) + '%';
    queueRenderPage(pageNum, modal);
  });
  
  // Book mode toggle button
  const bookModeBtn = modal.querySelector('.book-mode');
  bookModeBtn.addEventListener('click', () => {
    bookMode = !bookMode;
    console.log('📖 Book mode toggled:', bookMode);
    
         // Update button appearance
     const modeIcon = bookModeBtn.querySelector('.mode-icon');
     if (bookMode) {
       modeIcon.src = 'https://cdn.prod.website-files.com/684a5d9b82bae84c8dbeb42f/68ae8fc9d72450ddb9d34942_single%20Page%20icon.svg';
       bookModeBtn.title = 'Single Page Mode';
     } else {
       modeIcon.src = 'https://cdn.prod.website-files.com/684a5d9b82bae84c8dbeb42f/68ae8fc9872fdc09277900e8_double%20Page%20icon.svg';
       bookModeBtn.title = 'Book Mode';
     }
    
    // Toggle canvas visibility
    const bookPages = modal.querySelector('.book-pages');
    const singleCanvas = modal.querySelector('#pdf-canvas');
    const zoomLevel = modal.querySelector('.zoom-level');
    
    if (bookMode) {
      bookPages.style.display = 'flex';
      singleCanvas.style.display = 'none';
      // Reset scale for book mode
      scale = 1.0;
      zoomLevel.textContent = Math.round(scale * 100) + '%';
      queueRenderPage(pageNum, modal);
         } else {
       bookPages.style.display = 'none';
       singleCanvas.style.display = 'block';
               // Calculate scale to fit width for single page mode
        (async () => {
          const page = await pdfDoc.getPage(pageNum);
          const originalViewport = page.getViewport({ scale: 1 });
          const pdfContainer = modal.querySelector('.pdf-container');
          const containerWidth = pdfContainer.clientWidth - 40;
          const scaleForWidth = containerWidth / originalViewport.width;
          scale = Math.max(1.0, scaleForWidth);
          console.log('📏 Switching to single page mode, scale set to:', scale);
          
          zoomLevel.textContent = Math.round(scale * 100) + '%';
          // Force immediate render for single page mode
          renderPage(pageNum, modal);
        })();
     }
  });
  
  // Fullscreen button
  const fullscreenBtn = modal.querySelector('.fullscreen');
  fullscreenBtn.addEventListener('click', () => {
    toggleFullscreen(modal);
  });
  
  // Search functionality
  const searchInput = modal.querySelector('.search-input');
  const searchBtn = modal.querySelector('.search-btn');
  
  searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value, modal);
  });
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch(searchInput.value, modal);
    }
  });
  
  // Download from preview
  const downloadBtn = modal.querySelector('.download-from-preview');
  downloadBtn.addEventListener('click', () => {
    closePreviewModal(modal);
    // Trigger download
    const link = document.createElement('a');
    link.href = PDF_CATALOG_CONFIG.catalogUrl;
    link.download = 'DUVA_Catalogue_2023R4.pdf';
    link.click();
  });
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePreviewModal(modal);
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'none') {
      if (e.key === 'Escape') {
        closePreviewModal(modal);
      } else if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
        prevBtn.click();
      } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
        nextBtn.click();
      }
    }
  });
}

// Perform search (basic implementation)
function performSearch(query, modal) {
  if (!query.trim()) return;
  console.log('🔍 Searching for:', query);
  showPreviewNotification(modal, `Search for "${query}" - Advanced search coming soon!`);
}

// Show preview error
function showPreviewError(modal, message) {
  const container = modal.querySelector('.pdf-container');
  container.innerHTML = `
    <div class="preview-error">
      <h4>⚠️ Error</h4>
      <p>${message}</p>
      <button onclick="location.reload()">Try Again</button>
    </div>
  `;
}

// Show preview notification
function showPreviewNotification(modal, message) {
  const notification = document.createElement('div');
  notification.className = 'preview-notification';
  notification.textContent = message;
  
  modal.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Toggle fullscreen mode
function toggleFullscreen(modal) {
  const content = modal.querySelector('.preview-content');
  
  if (!document.fullscreenElement) {
    // Enter fullscreen
    if (content.requestFullscreen) {
      content.requestFullscreen();
    } else if (content.webkitRequestFullscreen) {
      content.webkitRequestFullscreen();
    } else if (content.msRequestFullscreen) {
      content.msRequestFullscreen();
    }
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

// Close preview modal
function closePreviewModal(modal) {
  // Restore body scrolling
  document.body.style.overflow = '';
  
  modal.style.opacity = '0';
  setTimeout(() => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }, 300);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializePDFCatalog();
});

// Also initialize on Webflow ready
if (typeof Webflow !== 'undefined') {
  Webflow.push(() => {
    initializePDFCatalog();
  });
}

// === END PDF CATALOG SYSTEM ===
