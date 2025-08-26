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

// PDF Preview State
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
let canvas = null;
let ctx = null;
let resizeTimeout = null;
let bookMode = true; // Enable book mode by default
let leftCanvas = null;
let rightCanvas = null;
let leftCtx = null;
let rightCtx = null;
let originalPdfWidth = 623.627;
let originalPdfHeight = 870.236;

// Initialize PDF catalog functionality
function initializePDFCatalog() {
  // Initialize catalog download
  initializeCatalogDownload();
  
  // Initialize catalog preview
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
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  
  const modal = document.createElement('div');
  modal.className = 'catalog-preview-modal';
  modal.innerHTML = `
    <div class="preview-content">
      <div class="preview-header">
        <h3>DUVA Catalog Preview</h3>
        <div class="preview-controls">
          <button class="control-btn zoom-out" title="Zoom Out">−</button>
          <span class="zoom-level">${Math.round(scale * 100)}%</span>
          <button class="control-btn zoom-in" title="Zoom In">+</button>
          <button class="control-btn fit-width" title="Fit to Width">⤢</button>
          <button class="control-btn fit-height" title="Fit to Height">⤡</button>
          <button class="control-btn book-mode" title="Toggle Book Mode">📖</button>
          <button class="control-btn fullscreen" title="Fullscreen">⛶</button>
        </div>
        <button class="close-preview">×</button>
      </div>
      
      <div class="preview-search">
        <input type="text" placeholder="Search in catalog..." class="search-input">
        <button class="search-btn">🔍</button>
      </div>
      
      <div class="preview-navigation">
        <button class="nav-btn prev-page" disabled>‹ Previous</button>
        <span class="page-info">Page <span class="current-page">1</span> of <span class="total-pages">-</span></span>
        <button class="nav-btn next-page">Next ›</button>
      </div>
      
      <div class="pdf-container">
        <div class="pdf-scroll-container">
          <!-- Book mode: Two canvases side by side -->
          <div class="book-pages">
            <canvas id="left-canvas" class="page-canvas"></canvas>
            <canvas id="right-canvas" class="page-canvas"></canvas>
          </div>
          <!-- Single page mode: One canvas -->
          <canvas id="pdf-canvas" class="single-canvas" style="display: none;"></canvas>
        </div>
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

// Initialize PDF viewer
async function initializePDFViewer(modal) {
  try {
    console.log('📄 Loading PDF document...');
    
    // Get canvases and contexts for book mode
    leftCanvas = modal.querySelector('#left-canvas');
    rightCanvas = modal.querySelector('#right-canvas');
    leftCtx = leftCanvas.getContext('2d');
    rightCtx = rightCanvas.getContext('2d');
    
    // Get single canvas for single page mode
    canvas = modal.querySelector('#pdf-canvas');
    ctx = canvas.getContext('2d');
    
    // Load PDF document with options to allow larger rendering
    const loadingTask = pdfjsLib.getDocument({
      url: PDF_CATALOG_CONFIG.catalogUrl,
      maxImageSize: -1, // No limit on image size
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true
    });
    pdfDoc = await loadingTask.promise;
    
    console.log('✅ PDF loaded:', pdfDoc.numPages, 'pages');
    
    // Update page info
    const totalPages = modal.querySelector('.total-pages');
    totalPages.textContent = pdfDoc.numPages;
    
    // Get actual PDF dimensions from first page
    const firstPage = await pdfDoc.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1 });
    originalPdfWidth = viewport.width;
    originalPdfHeight = viewport.height;
    console.log('📄 Actual PDF dimensions:', originalPdfWidth, 'x', originalPdfHeight);
    
    // Wait for container to be ready
    setTimeout(async () => {
      // Calculate initial scale for full width
      const scrollContainer = modal.querySelector('.pdf-scroll-container');
      const containerWidth = scrollContainer.clientWidth;
      const containerHeight = scrollContainer.clientHeight;
      console.log('📏 Container dimensions:', containerWidth, 'x', containerHeight);
      
      // Calculate scale to fit full container (adjusted for book mode)
      if (bookMode) {
        // For book mode, calculate scale to fit both pages within container
        const totalPageWidth = originalPdfWidth * 2 + 20; // Two pages plus gap
        const scaleForWidth = containerWidth / totalPageWidth;
        const scaleForHeight = containerHeight / originalPdfHeight;
        scale = Math.min(scaleForWidth, scaleForHeight);
      } else {
        // For single page mode, fit to container width
        scale = containerWidth / originalPdfWidth;
      }
      console.log('🔍 Calculated initial scale:', scale, 'book mode:', bookMode);
      
      // Update zoom level display
      const zoomLevel = modal.querySelector('.zoom-level');
      zoomLevel.textContent = Math.round(scale * 100) + '%';
      
      // Render first page with new scale
      renderPage(1, modal);
      
      console.log('🎯 Initial render completed, scale is now:', scale);
    }, 100);
    
  } catch (error) {
    console.error('❌ Error loading PDF:', error);
    showPreviewError(modal, 'Failed to load catalog. Please try again.');
  }
}

// Render PDF page
async function renderPage(num, modal) {
  if (pageRendering) {
    console.log('⚠️ Already rendering, skipping...');
    return;
  }
  
  console.log('🎨 Starting render for page', num, 'at scale', scale, 'book mode:', bookMode);
  pageRendering = true;
  
  try {
    if (bookMode) {
      await renderBookPages(num, modal);
    } else {
      await renderSinglePage(num, modal);
    }
    
    pageRendering = false;
    console.log('✅ Render completed, pageRendering set to false');
    
    // Process pending page if any
    if (pageNumPending !== null) {
      const pendingNum = pageNumPending;
      pageNumPending = null;
      console.log('🔄 Processing pending page:', pendingNum);
      setTimeout(() => {
        renderPage(pendingNum, modal);
      }, 100);
    }
    
  } catch (error) {
    console.error('❌ Error rendering page:', error);
    pageRendering = false;
  }
}

// Render single page
async function renderSinglePage(num, modal) {
  const page = await pdfDoc.getPage(num);
  
  // Create viewport with current scale
  const scaledViewport = page.getViewport({ scale: scale });
  
  console.log('🎨 Rendering single page', num, 'at scale', scale);
  console.log('📐 Canvas dimensions:', scaledViewport.width, 'x', scaledViewport.height);
  
  // Set canvas dimensions without any height constraints
  canvas.height = scaledViewport.height;
  canvas.width = scaledViewport.width;
  console.log('📐 Set canvas dimensions to:', canvas.width, 'x', canvas.height);
  
  // Render PDF page with enhanced options
  const renderContext = {
    canvasContext: ctx,
    viewport: scaledViewport,
    enableWebGL: false,
    renderInteractiveForms: false
  };
  
  await page.render(renderContext).promise;
  
  // Update page info
  const currentPage = modal.querySelector('.current-page');
  currentPage.textContent = num;
  
  // Update navigation buttons
  const prevBtn = modal.querySelector('.prev-page');
  const nextBtn = modal.querySelector('.next-page');
  prevBtn.disabled = num <= 1;
  nextBtn.disabled = num >= pdfDoc.numPages;
}

// Render book pages (two pages side by side)
async function renderBookPages(num, modal) {
  console.log('📖 Rendering book pages starting from', num);
  
  // Calculate which pages to show
  let leftPageNum = num;
  let rightPageNum = num + 1;
  
  // If we're on an even page, show previous and current
  if (num % 2 === 0) {
    leftPageNum = num - 1;
    rightPageNum = num;
  }
  
  // Ensure we don't go below page 1
  if (leftPageNum < 1) {
    leftPageNum = 1;
    rightPageNum = 2;
  }
  
  // Ensure we don't go above total pages
  if (rightPageNum > pdfDoc.numPages) {
    rightPageNum = pdfDoc.numPages;
    if (rightPageNum % 2 === 0) {
      leftPageNum = rightPageNum - 1;
    } else {
      leftPageNum = rightPageNum;
    }
  }
  
  console.log('📖 Book pages:', leftPageNum, 'and', rightPageNum);
  
  // Get container dimensions for scaling
  const scrollContainer = modal.querySelector('.pdf-scroll-container');
  const containerWidth = scrollContainer.clientWidth;
  const containerHeight = scrollContainer.clientHeight;
  
  // Calculate scale to fit both pages within the container
  // Use the global scale but ensure it fits within the container
  const totalPageWidth = originalPdfWidth * 2 + 20; // Two pages plus gap
  const maxScaleForWidth = containerWidth / totalPageWidth;
  const maxScaleForHeight = containerHeight / originalPdfHeight;
  const maxScale = Math.min(maxScaleForWidth, maxScaleForHeight);
  
  // Use the larger of: global scale or max scale that fits
  const actualScale = Math.max(scale, maxScale);
  
  console.log('📏 Book mode scale calculation:', {
    containerWidth,
    containerHeight,
    totalPageWidth,
    originalPdfWidth,
    originalPdfHeight,
    maxScaleForWidth,
    maxScaleForHeight,
    maxScale,
    globalScale: scale,
    actualScale
  });
  
  // Render left page
  if (leftPageNum <= pdfDoc.numPages) {
    const leftPage = await pdfDoc.getPage(leftPageNum);
    const leftViewport = leftPage.getViewport({ scale: 1 });
    
    // Use the actual scale for dimensions
    const leftScale = actualScale;
    
    // Set canvas dimensions without height constraints
    leftCanvas.height = leftViewport.height * leftScale;
    leftCanvas.width = leftViewport.width * leftScale;
    
    const leftRenderContext = {
      canvasContext: leftCtx,
      viewport: leftPage.getViewport({ scale: leftScale }),
      enableWebGL: false,
      renderInteractiveForms: false
    };
    
    await leftPage.render(leftRenderContext).promise;
    console.log('📐 Left page dimensions:', leftCanvas.width, 'x', leftCanvas.height, 'at scale:', leftScale);
  }
  
  // Render right page
  if (rightPageNum <= pdfDoc.numPages && rightPageNum !== leftPageNum) {
    const rightPage = await pdfDoc.getPage(rightPageNum);
    const rightViewport = rightPage.getViewport({ scale: 1 });
    
    // Use the actual scale for dimensions
    const rightScale = actualScale;
    
    // Set canvas dimensions without height constraints
    rightCanvas.height = rightViewport.height * rightScale;
    rightCanvas.width = rightViewport.width * rightScale;
    
    const rightRenderContext = {
      canvasContext: rightCtx,
      viewport: rightPage.getViewport({ scale: rightScale }),
      enableWebGL: false,
      renderInteractiveForms: false
    };
    
    await rightPage.render(rightRenderContext).promise;
    console.log('📐 Right page dimensions:', rightCanvas.width, 'x', rightCanvas.height, 'at scale:', rightScale);
  } else {
    // Clear right canvas if no second page
    rightCtx.clearRect(0, 0, rightCanvas.width, rightCanvas.height);
  }
  
  // Update page info to show current page
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
  console.log('🔄 Queue render page:', num, 'current rendering:', pageRendering);
  if (pageRendering) {
    pageNumPending = num;
    console.log('⏳ Page rendering in progress, queued:', num);
  } else {
    pageNum = num; // Update current page number
    console.log('🎯 Starting render for page:', num);
    renderPage(num, modal);
  }
}

// Add preview event listeners
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
        // In book mode, move by 2 pages (except for first page)
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
        // In book mode, move by 2 pages
        const newPage = Math.min(pdfDoc.numPages, pageNum + 2);
        queueRenderPage(newPage, modal);
      } else {
        queueRenderPage(pageNum + 1, modal);
      }
    }
  });
  
  // Zoom controls
  const zoomOutBtn = modal.querySelector('.zoom-out');
  const zoomInBtn = modal.querySelector('.zoom-in');
  const fitWidthBtn = modal.querySelector('.fit-width');
  const fitHeightBtn = modal.querySelector('.fit-height');
  const zoomLevel = modal.querySelector('.zoom-level');
  
  zoomOutBtn.addEventListener('click', () => {
    if (pageRendering) return; // Prevent multiple clicks
    const minScale = 0.5; // Allow smaller scale for zoom out
    scale = Math.max(minScale, scale - 0.25);
    zoomLevel.textContent = Math.round(scale * 100) + '%';
    console.log('🔍 Zoom out clicked, new scale:', scale);
    queueRenderPage(pageNum, modal);
  });
  
  zoomInBtn.addEventListener('click', () => {
    if (pageRendering) return; // Prevent multiple clicks
    scale = Math.min(5, scale + 0.25); // Allow larger scale for zoom in
    zoomLevel.textContent = Math.round(scale * 100) + '%';
    console.log('🔍 Zoom in clicked, new scale:', scale);
    queueRenderPage(pageNum, modal);
  });
  
  fitWidthBtn.addEventListener('click', () => {
    if (pageRendering) return; // Prevent multiple clicks
    const scrollContainer = modal.querySelector('.pdf-scroll-container');
    const containerWidth = scrollContainer.clientWidth;
    
    if (bookMode) {
      // For book mode, calculate scale to fit both pages within container width
      const totalPageWidth = originalPdfWidth * 2 + 20; // Two pages plus gap
      scale = containerWidth / totalPageWidth;
    } else {
      scale = containerWidth / originalPdfWidth;
    }
    
    zoomLevel.textContent = Math.round(scale * 100) + '%';
    console.log('🔍 Fit width clicked, new scale:', scale, 'container width:', containerWidth);
    queueRenderPage(pageNum, modal);
  });
  
  fitHeightBtn.addEventListener('click', () => {
    if (pageRendering) return; // Prevent multiple clicks
    const scrollContainer = modal.querySelector('.pdf-scroll-container');
    const containerHeight = scrollContainer.clientHeight;
    
    if (bookMode) {
      // For book mode, use height but maintain aspect ratio
      const pageHeight = containerHeight - 40; // Account for padding
      scale = pageHeight / originalPdfHeight;
    } else {
      scale = containerHeight / originalPdfHeight;
    }
    
    zoomLevel.textContent = Math.round(scale * 100) + '%';
    console.log('🔍 Fit height clicked, new scale:', scale, 'container height:', containerHeight);
    queueRenderPage(pageNum, modal);
  });
  
  // Book mode toggle button
  const bookModeBtn = modal.querySelector('.book-mode');
  bookModeBtn.addEventListener('click', () => {
    bookMode = !bookMode;
    console.log('📖 Book mode toggled:', bookMode);
    
    // Update button appearance
    bookModeBtn.textContent = bookMode ? '📖' : '📄';
    bookModeBtn.title = bookMode ? 'Single Page Mode' : 'Book Mode';
    
    // Toggle canvas visibility
    const bookPages = modal.querySelector('.book-pages');
    const singleCanvas = modal.querySelector('#pdf-canvas');
    
    if (bookMode) {
      bookPages.style.display = 'flex';
      singleCanvas.style.display = 'none';
    } else {
      bookPages.style.display = 'none';
      singleCanvas.style.display = 'block';
    }
    
    // Re-calculate scale for new mode
    const scrollContainer = modal.querySelector('.pdf-scroll-container');
    const containerWidth = scrollContainer.clientWidth;
    
    if (bookMode) {
      // For book mode, each page takes half the width minus gap
      const pageWidth = containerWidth / 2 - 20;
      scale = pageWidth / originalPdfWidth;
    } else {
      scale = containerWidth / originalPdfWidth;
    }
    
    zoomLevel.textContent = Math.round(scale * 100) + '%';
    console.log('📖 Recalculated scale for new mode:', scale);
    
    // Re-render current page in new mode
    queueRenderPage(pageNum, modal);
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

  // Store resize handler for cleanup
  modal.setAttribute('data-resize-handler', 'true');
}

// Perform search (basic implementation)
function performSearch(query, modal) {
  if (!query.trim()) return;
  
  console.log('🔍 Searching for:', query);
  
  // For now, show a simple message
  // In a full implementation, you'd search through PDF text content
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
  document.body.style.position = '';
  document.body.style.width = '';
  
  // Clear resize timeout
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
    resizeTimeout = null;
  }
  
  // Remove resize handler
  if (modal.hasAttribute('data-resize-handler')) {
    window.removeEventListener('resize', handleResize);
  }
  
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
