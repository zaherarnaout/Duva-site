// === PDF CATALOG SYSTEM ===
// Handles catalog download and preview functionality

// PDF Catalog Configuration
const PDF_CATALOG_CONFIG = {
  // Download Configuration
  catalogUrl: 'https://raw.githubusercontent.com/zaherarnaout/Duva-site/main/Pages%20from%20Duva_Catalogue_2023R4.pdf',
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
            <button class="control-btn fit-width" title="Fit Width">↔</button>
            <button class="control-btn fit-height" title="Fit Height">↕</button>
            <button class="control-btn book-mode" title="Toggle Book Mode">
              <div class="mode-icon book-icon"></div>
            </button>
            <button class="control-btn fullscreen" title="Fullscreen">⛶</button>
          </div>
        <button class="close-preview">×</button>
      </div>
      
             <div class="preview-search">
         <input type="text" placeholder="Search in catalog..." class="search-input">
                   <button class="search-btn">
            <div class="search-icon"></div>
          </button>
       </div>
      
      <div class="preview-navigation">
        <button class="nav-btn prev-page" disabled>‹ Previous</button>
        <span class="page-info">Page <span class="current-page">1</span> of <span class="total-pages">-</span></span>
        <button class="nav-btn next-page">Next ›</button>
      </div>
      
             <div class="pdf-viewer-layout">
                   <!-- Sidebar with thumbnails -->
          <div class="pdf-sidebar">
            <div class="sidebar-header">
              <h4>Pages</h4>
              <div class="page-jump">
                <input type="number" class="page-jump-input" placeholder="Page" min="1" max="${pdfDoc ? pdfDoc.numPages : 150}">
                <button class="page-jump-btn" title="Go to Page">Go</button>
              </div>
              <button class="toggle-sidebar" title="Toggle Sidebar">◀</button>
            </div>
           <div class="thumbnails-container">
             <div class="thumbnails-list">
               <!-- Thumbnails will be populated here -->
             </div>
           </div>
         </div>
         
         <!-- Main PDF container -->
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
     
     // Generate thumbnails
     generateThumbnails(modal);
     
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
  
  // Add text layer for text selection
  await addTextLayer(page, viewport, canvas, modal);
  
  console.log('✅ Single page rendered, canvas size:', canvas.width, 'x', canvas.height);
  
  // Update page info
  const currentPage = modal.querySelector('.current-page');
  currentPage.textContent = num;
  
  // Update active thumbnail
  updateActiveThumbnail(modal, num);
  
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
    
    // Add text layer for left page
    await addTextLayer(leftPage, leftViewport, leftCanvas, modal);
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
    
    // Add text layer for right page
    await addTextLayer(rightPage, rightViewport, rightCanvas, modal);
  } else {
    // Clear right canvas if no second page
    rightCtx.clearRect(0, 0, rightCanvas.width, rightCanvas.height);
  }
  
  // Update page info
  const currentPage = modal.querySelector('.current-page');
  currentPage.textContent = num;
  
  // Update active thumbnail
  updateActiveThumbnail(modal, num);
  
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
  
     // Zoom controls - ENHANCED
   const zoomOutBtn = modal.querySelector('.zoom-out');
   const zoomInBtn = modal.querySelector('.zoom-in');
   const fitWidthBtn = modal.querySelector('.fit-width');
   const fitHeightBtn = modal.querySelector('.fit-height');
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
   
       fitWidthBtn.addEventListener('click', async () => {
      if (pageRendering) return;
      const pdfContainer = modal.querySelector('.pdf-container');
      const containerWidth = pdfContainer.clientWidth - 40;
      
      if (bookMode) {
        // For book mode, we need to account for two pages side by side
        const leftPage = await pdfDoc.getPage(pageNum);
        const rightPage = await pdfDoc.getPage(Math.min(pageNum + 1, pdfDoc.numPages));
        
        const leftViewport = leftPage.getViewport({ scale: 1 });
        const rightViewport = rightPage.getViewport({ scale: 1 });
        
        // Calculate total width of both pages plus gap
        const totalPageWidth = leftViewport.width + rightViewport.width + 20; // 20px gap
        scale = containerWidth / totalPageWidth;
      } else {
        // For single page mode, use the original calculation
        const page = await pdfDoc.getPage(pageNum);
        const originalViewport = page.getViewport({ scale: 1 });
        scale = containerWidth / originalViewport.width;
      }
      
      zoomLevel.textContent = Math.round(scale * 100) + '%';
      queueRenderPage(pageNum, modal);
    });
   
   fitHeightBtn.addEventListener('click', async () => {
     if (pageRendering) return;
     const page = await pdfDoc.getPage(pageNum);
     const originalViewport = page.getViewport({ scale: 1 });
     const pdfContainer = modal.querySelector('.pdf-container');
     const containerHeight = pdfContainer.clientHeight - 40;
     scale = containerHeight / originalViewport.height;
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
        modeIcon.className = 'mode-icon single-icon';
        bookModeBtn.title = 'Single Page Mode';
      } else {
        modeIcon.className = 'mode-icon book-icon';
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
  
  // Add keyboard shortcuts for search navigation
  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'none' && searchState.isActive) {
      if (e.key === 'F3' || (e.ctrlKey && e.key === 'f')) {
        e.preventDefault();
        searchInput.focus();
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        navigateToMatch(modal, 'prev');
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        navigateToMatch(modal, 'next');
      }
    }
  });
  
         // Page jump functionality
    const pageJumpInput = modal.querySelector('.page-jump-input');
    const pageJumpBtn = modal.querySelector('.page-jump-btn');
    
         pageJumpBtn.addEventListener('click', async () => {
       const targetPage = parseInt(pageJumpInput.value);
       if (targetPage && targetPage >= 1 && targetPage <= pdfDoc.numPages) {
         pageNum = targetPage;
         queueRenderPage(targetPage, modal);
         
         // Generate thumbnail on-demand if it doesn't exist
         await generateThumbnailOnDemand(modal, targetPage);
         
         pageJumpInput.value = ''; // Clear input after jump
       } else {
         showPreviewNotification(modal, `Please enter a valid page number (1-${pdfDoc.numPages})`);
       }
     });
    
    // Allow Enter key to trigger page jump
    pageJumpInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        pageJumpBtn.click();
      }
    });
    
    // Sidebar toggle
    const toggleSidebarBtn = modal.querySelector('.toggle-sidebar');
    const sidebar = modal.querySelector('.pdf-sidebar');
    
    toggleSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const isCollapsed = sidebar.classList.contains('collapsed');
      toggleSidebarBtn.textContent = isCollapsed ? '▶' : '◀';
      toggleSidebarBtn.title = isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar';
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

// Browser-like search state
let searchState = {
  query: '',
  currentMatch: 0,
  totalMatches: 0,
  matches: [],
  isActive: false
};

// Perform browser-like search
async function performSearch(query, modal) {
  if (!query.trim()) {
    clearSearch(modal);
    return;
  }
  
  console.log('🔍 Starting browser-like search for:', query);
  
  // Clear previous search
  clearSearch(modal);
  
  // Update search state
  searchState.query = query;
  searchState.currentMatch = 0;
  searchState.matches = [];
  searchState.isActive = true;
  
  // Show searching notification
  showPreviewNotification(modal, `Searching for "${query}"...`);
  
  try {
    // Search ALL pages for matches
    const allMatches = await searchAllPages(query);
    
    if (allMatches.length === 0) {
      // Check if this is because there's no text content at all
      const hasAnyTextContent = await checkForAnyTextContent();
      
      if (!hasAnyTextContent) {
        showPreviewNotification(modal, 'Text search unavailable - PDF appears to have text converted to vector paths');
      } else {
        showPreviewNotification(modal, `No results found for "${query}"`);
      }
      searchState.isActive = false;
      return;
    }
    
    // Update search state with all matches
    searchState.matches = allMatches;
    searchState.totalMatches = allMatches.length;
    searchState.currentMatch = 1;
    
    // Navigate to first match
    await navigateToFirstMatch(modal);
    
    // Update search UI
    updateSearchUI(modal);
    showPreviewNotification(modal, `Found ${searchState.totalMatches} match${searchState.totalMatches !== 1 ? 'es' : ''} across ${new Set(allMatches.map(m => m.page)).size} pages`);
    
  } catch (error) {
    console.error('❌ Search error:', error);
    showPreviewNotification(modal, 'Search failed. Please try again.');
    searchState.isActive = false;
  }
}

// Search ALL pages for matches
async function searchAllPages(query) {
  const searchTerm = query.toLowerCase();
  const allMatches = [];
  let totalTextItems = 0;
  
  console.log('🔍 Searching all pages for:', searchTerm);
  
  // Search through all pages
  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    try {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      totalTextItems += textContent.items.length;
      
      // Check if this page has meaningful text content
      const hasTextContent = textContent.items.length > 0 && 
                            textContent.items.some(item => item.str.trim().length > 0);
      
      if (!hasTextContent) {
        console.log(`⚠️ Page ${pageNum}: No text content found (likely vector paths)`);
        continue;
      }
      
      // Extract text items with their positions using viewport transform
      const viewport = page.getViewport({ scale: 1 });
      const textItems = textContent.items.map(item => {
        // Transform PDF coordinates to viewport coordinates
        const transform = pdfjsLib.Util.transform(viewport.transform, item.transform);
        return {
          text: item.str,
          x: transform[4],
          y: transform[5],
          width: item.width,
          height: item.height,
          originalX: item.transform[4],
          originalY: item.transform[5]
        };
      });
      
      // Find matches in this page
      textItems.forEach((item, index) => {
        const itemText = item.text.toLowerCase();
        if (itemText.includes(searchTerm)) {
          allMatches.push({
            page: pageNum,
            text: item.text,
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
            originalX: item.originalX,
            originalY: item.originalY,
            index: index
          });
        }
      });
      
    } catch (error) {
      console.error(`Error searching page ${pageNum}:`, error);
    }
  }
  
  console.log('🔍 Search summary:', {
    totalPages: pdfDoc.numPages,
    totalTextItems: totalTextItems,
    matchesFound: allMatches.length,
    hasTextContent: totalTextItems > 0
  });
  
  if (totalTextItems === 0) {
    console.log('⚠️ No text content found in entire PDF - this appears to be an Illustrator PDF with text converted to vector paths');
  }
  
  return allMatches;
}

// Check if the PDF has any text content at all
async function checkForAnyTextContent() {
  try {
    // Check first few pages for text content
    const pagesToCheck = Math.min(5, pdfDoc.numPages);
    
    for (let pageNum = 1; pageNum <= pagesToCheck; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      if (textContent.items.length > 0 && 
          textContent.items.some(item => item.str.trim().length > 0)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking for text content:', error);
    return false;
  }
}

// Navigate to first match
async function navigateToFirstMatch(modal) {
  if (searchState.matches.length === 0) return;
  
  const firstMatch = searchState.matches[0];
  
  // Navigate to the page with the first match
  if (firstMatch.page !== pageNum) {
    pageNum = firstMatch.page;
    await queueRenderPage(firstMatch.page, modal);
    
    // Generate thumbnail on-demand if needed
    await generateThumbnailOnDemand(modal, firstMatch.page);
  }
  
  // Highlight the first match
  setTimeout(() => {
    highlightCurrentMatch(modal);
  }, 500); // Wait for page to render
}

// Highlight current match on the page
function highlightCurrentMatch(modal) {
  if (!searchState.isActive || searchState.matches.length === 0) return;
  
  const currentMatch = searchState.matches[searchState.currentMatch - 1];
  if (!currentMatch) return;
  
  // Create or update highlight overlay
  let highlightOverlay = modal.querySelector('.search-highlight-overlay');
  if (!highlightOverlay) {
    highlightOverlay = document.createElement('div');
    highlightOverlay.className = 'search-highlight-overlay';
    modal.querySelector('.pdf-container').appendChild(highlightOverlay);
  }
  
  // Get the correct canvas based on current mode and page
  let targetCanvas = null;
  let canvasContainer = null;
  
  if (bookMode) {
    // For book mode, determine which canvas to highlight based on page number
    const leftCanvas = modal.querySelector('#left-canvas');
    const rightCanvas = modal.querySelector('#right-canvas');
    
    // Determine which page is on which canvas
    let leftPageNum = pageNum;
    let rightPageNum = pageNum + 1;
    
    if (pageNum % 2 === 0) {
      leftPageNum = pageNum - 1;
      rightPageNum = pageNum;
    }
    
    if (currentMatch.page === leftPageNum) {
      targetCanvas = leftCanvas;
      canvasContainer = leftCanvas.parentElement;
    } else if (currentMatch.page === rightPageNum) {
      targetCanvas = rightCanvas;
      canvasContainer = rightCanvas.parentElement;
    } else {
      // Fallback to left canvas
      targetCanvas = leftCanvas;
      canvasContainer = leftCanvas.parentElement;
    }
  } else {
    // For single page mode
    targetCanvas = modal.querySelector('#pdf-canvas');
    canvasContainer = targetCanvas.parentElement;
  }
  
  if (!targetCanvas || !canvasContainer) return;
  
  // Get the PDF container for positioning reference
  const pdfContainer = modal.querySelector('.pdf-container');
  
  // Calculate highlight position relative to the PDF container
  // Use the canvas position within the PDF container
  const canvasRect = targetCanvas.getBoundingClientRect();
  const pdfContainerRect = pdfContainer.getBoundingClientRect();
  
  // Calculate the offset of the canvas within the PDF container
  const canvasOffsetLeft = canvasRect.left - pdfContainerRect.left;
  const canvasOffsetTop = canvasRect.top - pdfContainerRect.top;
  
  // Calculate highlight position using PDF coordinates scaled to current viewport
  const highlightLeft = canvasOffsetLeft + (currentMatch.x * scale);
  const highlightTop = canvasOffsetTop + (currentMatch.y * scale);
  
  highlightOverlay.style.cssText = `
    position: absolute;
    left: ${highlightLeft}px;
    top: ${highlightTop}px;
    width: ${currentMatch.width * scale}px;
    height: ${currentMatch.height * scale}px;
    background: rgba(255, 255, 0, 0.6);
    border: 2px solid #ff6b35;
    border-radius: 2px;
    pointer-events: none;
    z-index: 1000;
    animation: searchPulse 1s ease-in-out infinite alternate;
  `;
  
  console.log('🎯 Highlight positioned at:', highlightLeft, highlightTop, 'for match:', currentMatch.text);
  console.log('📏 Canvas offset:', canvasOffsetLeft, canvasOffsetTop, 'PDF coords:', currentMatch.x, currentMatch.y, 'scale:', scale);
}

// Update search UI with match counter
function updateSearchUI(modal) {
  const searchContainer = modal.querySelector('.preview-search');
  
  // Remove existing search controls
  const existingControls = searchContainer.querySelector('.search-controls');
  if (existingControls) {
    existingControls.remove();
  }
  
  // Create search controls
  const searchControls = document.createElement('div');
  searchControls.className = 'search-controls';
  searchControls.innerHTML = `
    <span class="search-counter">${searchState.currentMatch} of ${searchState.totalMatches}</span>
    <button class="search-nav-btn prev-match" title="Previous Match">‹</button>
    <button class="search-nav-btn next-match" title="Next Match">›</button>
    <button class="search-close-btn" title="Close Search">×</button>
  `;
  
  searchContainer.appendChild(searchControls);
  
  // Add event listeners
  const prevBtn = searchControls.querySelector('.prev-match');
  const nextBtn = searchControls.querySelector('.next-match');
  const closeBtn = searchControls.querySelector('.search-close-btn');
  
  prevBtn.addEventListener('click', () => navigateToMatch(modal, 'prev'));
  nextBtn.addEventListener('click', () => navigateToMatch(modal, 'next'));
  closeBtn.addEventListener('click', () => clearSearch(modal));
  
  // Update button states
  prevBtn.disabled = searchState.currentMatch <= 1;
  nextBtn.disabled = searchState.currentMatch >= searchState.totalMatches;
}

// Navigate to next/previous match
async function navigateToMatch(modal, direction) {
  if (!searchState.isActive || searchState.matches.length === 0) return;
  
  if (direction === 'next') {
    searchState.currentMatch = Math.min(searchState.currentMatch + 1, searchState.totalMatches);
  } else {
    searchState.currentMatch = Math.max(searchState.currentMatch - 1, 1);
  }
  
  // Get current match
  const currentMatch = searchState.matches[searchState.currentMatch - 1];
  if (!currentMatch) return;
  
  // Navigate to the page with this match if needed
  if (currentMatch.page !== pageNum) {
    pageNum = currentMatch.page;
    await queueRenderPage(currentMatch.page, modal);
    
    // Generate thumbnail on-demand if needed
    await generateThumbnailOnDemand(modal, currentMatch.page);
  }
  
  // Highlight current match after page loads
  setTimeout(() => {
    highlightCurrentMatch(modal);
  }, 300);
  
  // Update search UI
  updateSearchUI(modal);
}

// Clear search
function clearSearch(modal) {
  searchState.isActive = false;
  searchState.query = '';
  searchState.currentMatch = 0;
  searchState.totalMatches = 0;
  searchState.matches = [];
  
  // Remove highlight overlay
  const highlightOverlay = modal.querySelector('.search-highlight-overlay');
  if (highlightOverlay) {
    highlightOverlay.remove();
  }
  
  // Remove search controls
  const searchControls = modal.querySelector('.search-controls');
  if (searchControls) {
    searchControls.remove();
  }
  
  // Clear search input
  const searchInput = modal.querySelector('.search-input');
  if (searchInput) {
    searchInput.value = '';
  }
}

// Search PDF content
async function searchPDFContent(query) {
  const results = [];
  const searchTerm = query.toLowerCase();
  
  console.log('🔍 Starting PDF search for:', searchTerm);
  
  // Search through all pages
  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    try {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text from the page
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ')
        .toLowerCase();
      
      // Check if search term exists in this page
      if (pageText.includes(searchTerm)) {
        // Find the context around the search term
        const context = extractSearchContext(pageText, searchTerm);
        
        results.push({
          page: pageNum,
          context: context,
          matches: countMatches(pageText, searchTerm)
        });
      }
    } catch (error) {
      console.error(`Error searching page ${pageNum}:`, error);
    }
  }
  
  console.log('🔍 Search completed. Found', results.length, 'results');
  return results;
}

// Extract context around search term
function extractSearchContext(pageText, searchTerm) {
  const index = pageText.indexOf(searchTerm);
  if (index === -1) return '';
  
  const start = Math.max(0, index - 50);
  const end = Math.min(pageText.length, index + searchTerm.length + 50);
  
  let context = pageText.substring(start, end);
  
  // Add ellipsis if we're not at the beginning/end
  if (start > 0) context = '...' + context;
  if (end < pageText.length) context = context + '...';
  
  return context;
}

// Count matches in text
function countMatches(text, searchTerm) {
  const regex = new RegExp(searchTerm, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

// Show search results
function showSearchResults(modal, results, query) {
  // Create search results modal
  const searchModal = document.createElement('div');
  searchModal.className = 'search-results-modal';
  searchModal.innerHTML = `
    <div class="search-results-content">
      <div class="search-results-header">
        <h4>Search Results for "${query}"</h4>
        <span class="results-count">${results.length} result${results.length !== 1 ? 's' : ''}</span>
        <button class="close-search-results">×</button>
      </div>
      <div class="search-results-list">
        ${results.map(result => `
          <div class="search-result-item" data-page="${result.page}">
            <div class="result-page-info">
              <span class="page-number">Page ${result.page}</span>
              <span class="match-count">${result.matches} match${result.matches !== 1 ? 'es' : ''}</span>
            </div>
            <div class="result-context">${highlightSearchTerm(result.context, query)}</div>
            <button class="go-to-page-btn">Go to Page</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.body.appendChild(searchModal);
  
  // Add event listeners
  const closeBtn = searchModal.querySelector('.close-search-results');
  closeBtn.addEventListener('click', () => {
    searchModal.remove();
  });
  
  // Go to page buttons
  const goToPageBtns = searchModal.querySelectorAll('.go-to-page-btn');
  goToPageBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const resultItem = btn.closest('.search-result-item');
      const targetPage = parseInt(resultItem.getAttribute('data-page'));
      
      // Close search results
      searchModal.remove();
      
      // Navigate to the page
      pageNum = targetPage;
      queueRenderPage(targetPage, modal);
      
      // Generate thumbnail on-demand if needed
      await generateThumbnailOnDemand(modal, targetPage);
      
      // Show notification
      showPreviewNotification(modal, `Navigated to page ${targetPage}`);
    });
  });
  
  // Close on outside click
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.remove();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape') {
      searchModal.remove();
      document.removeEventListener('keydown', closeOnEscape);
    }
  });
}

// Highlight search term in context
function highlightSearchTerm(context, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return context.replace(regex, '<mark>$1</mark>');
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

 // Generate thumbnails for sidebar
 async function generateThumbnails(modal) {
   const thumbnailsList = modal.querySelector('.thumbnails-list');
   const totalPages = pdfDoc.numPages;
   
   // Clear existing thumbnails
   thumbnailsList.innerHTML = '';
   
     // Smart thumbnail generation: Generate first 30 pages immediately, then on-demand
  const initialThumbnails = Math.min(30, totalPages);
  
  // Add loading indicator
  const loadingText = document.createElement('div');
  loadingText.textContent = 'Generating thumbnails...';
  loadingText.style.cssText = 'text-align: center; padding: 20px; color: var(--duva-text-secondary); font-family: var(--btn-font);';
  thumbnailsList.appendChild(loadingText);
  
  // Generate initial thumbnails (first 30 pages)
  for (let i = 1; i <= initialThumbnails; i++) {
      try {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 }); // Increased scale for better quality
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail-item';
        thumbnail.setAttribute('data-page', i);
        thumbnail.innerHTML = `
          <canvas class="thumbnail-canvas"></canvas>
          <span class="thumbnail-number">${i}</span>
        `;
        
        const thumbnailCanvas = thumbnail.querySelector('.thumbnail-canvas');
        thumbnailCanvas.width = viewport.width;
        thumbnailCanvas.height = viewport.height;
        thumbnailCanvas.getContext('2d').drawImage(canvas, 0, 0);
       
               // Add click handler to navigate to page
        thumbnail.addEventListener('click', () => {
          const thumbPage = parseInt(thumbnail.getAttribute('data-page'));
          pageNum = thumbPage;
          queueRenderPage(thumbPage, modal);
          updateActiveThumbnail(modal, thumbPage);
        });
       
               thumbnailsList.appendChild(thumbnail);
        
      } catch (error) {
        console.error(`Error generating thumbnail for page ${i}:`, error);
      }
    }
    
    // Remove loading text
    if (loadingText.parentNode) {
      loadingText.parentNode.removeChild(loadingText);
    }
    
    // Set first thumbnail as active
    updateActiveThumbnail(modal, 1);
 }
 
   // Update active thumbnail
  function updateActiveThumbnail(modal, pageNum) {
    const thumbnails = modal.querySelectorAll('.thumbnail-item');
    thumbnails.forEach((thumb) => {
      const thumbPage = parseInt(thumb.getAttribute('data-page'));
      thumb.classList.toggle('active', thumbPage === pageNum);
    });
  }
  
  // Generate thumbnail on-demand
  async function generateThumbnailOnDemand(modal, pageNum) {
    const thumbnailsList = modal.querySelector('.thumbnails-list');
    const existingThumbnail = thumbnailsList.querySelector(`[data-page="${pageNum}"]`);
    
    // If thumbnail already exists, just highlight it
    if (existingThumbnail) {
      updateActiveThumbnail(modal, pageNum);
      return;
    }
    
    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.5 });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      const thumbnail = document.createElement('div');
      thumbnail.className = 'thumbnail-item';
      thumbnail.setAttribute('data-page', pageNum);
      thumbnail.innerHTML = `
        <canvas class="thumbnail-canvas"></canvas>
        <span class="thumbnail-number">${pageNum}</span>
      `;
      
      const thumbnailCanvas = thumbnail.querySelector('.thumbnail-canvas');
      thumbnailCanvas.width = viewport.width;
      thumbnailCanvas.height = viewport.height;
      thumbnailCanvas.getContext('2d').drawImage(canvas, 0, 0);
      
      // Add click handler to navigate to page
      thumbnail.addEventListener('click', () => {
        const thumbPage = parseInt(thumbnail.getAttribute('data-page'));
        pageNum = thumbPage;
        queueRenderPage(thumbPage, modal);
        updateActiveThumbnail(modal, thumbPage);
      });
      
      // Insert thumbnail in correct position
      const allThumbnails = thumbnailsList.querySelectorAll('.thumbnail-item');
      let insertAfter = null;
      
      for (let i = 0; i < allThumbnails.length; i++) {
        const currentPage = parseInt(allThumbnails[i].getAttribute('data-page'));
        if (pageNum < currentPage) {
          insertAfter = allThumbnails[i - 1] || null;
          break;
        }
      }
      
      if (insertAfter) {
        insertAfter.after(thumbnail);
      } else {
        thumbnailsList.appendChild(thumbnail);
      }
      
      // Update active state
      updateActiveThumbnail(modal, pageNum);
      
    } catch (error) {
      console.error(`Error generating thumbnail for page ${pageNum}:`, error);
    }
  }
 
 // Add text layer for text selection
async function addTextLayer(page, viewport, canvas, modal) {
  try {
    // Get text content
    const textContent = await page.getTextContent();
    
    console.log('🔍 Text content analysis:', {
      totalItems: textContent.items.length,
      hasText: textContent.items.some(item => item.str.trim()),
      sampleText: textContent.items.slice(0, 3).map(item => item.str)
    });
    
         // Create text layer container for this specific canvas
     const canvasContainer = canvas.parentElement;
     canvasContainer.style.position = 'relative';
     
     let textLayer = canvasContainer.querySelector('.text-layer');
     if (!textLayer) {
       textLayer = document.createElement('div');
       textLayer.className = 'text-layer';
       canvasContainer.appendChild(textLayer);
     }
    
    // Clear existing text
    textLayer.innerHTML = '';
    
    // Set text layer dimensions
    textLayer.style.width = viewport.width + 'px';
    textLayer.style.height = viewport.height + 'px';
    
    // Check if we have meaningful text content
    const hasTextContent = textContent.items.length > 0 && 
                          textContent.items.some(item => item.str.trim().length > 0);
    
    if (!hasTextContent) {
      console.log('⚠️ No text content found - this may be an Illustrator PDF with text converted to paths');
      console.log('💡 Solution: Re-export PDF from Illustrator with "Preserve Text" option enabled');
      
      // Show a helpful message to the user
      const noTextMessage = document.createElement('div');
      noTextMessage.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(255, 193, 7, 0.9);
        color: #000;
        padding: 8px 12px;
        border-radius: 4px;
        font-family: var(--btn-font);
        font-size: 12px;
        z-index: 1000;
        max-width: 300px;
        line-height: 1.4;
      `;
      noTextMessage.innerHTML = `
        <strong>Text Selection Unavailable</strong><br>
        This PDF appears to have text converted to vector paths.<br>
        <small>To enable text selection, re-export from Illustrator with "Preserve Text" enabled.</small>
      `;
      
      // Remove any existing message
      const existingMessage = modal.querySelector('.no-text-message');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      noTextMessage.className = 'no-text-message';
      modal.appendChild(noTextMessage);
      
      // Auto-remove message after 5 seconds
      setTimeout(() => {
        if (noTextMessage.parentNode) {
          noTextMessage.remove();
        }
      }, 5000);
      
      return;
    }
    
    // Remove any existing no-text message
    const existingMessage = modal.querySelector('.no-text-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create text elements with corrected positioning
    const textDivs = textContent.items.map(item => {
      // Only create text elements for non-empty text
      if (!item.str.trim()) return null;
      
      // Use the viewport transform to get correct positioning
      const transform = pdfjsLib.Util.transform(viewport.transform, item.transform);
      const style = textContent.styles[item.fontName];
      
      const fontSize = Math.sqrt((transform[0] * transform[0]) + (transform[1] * transform[1]));
      const fontFamily = style ? style.fontFamily : 'sans-serif';
      
      const textDiv = document.createElement('div');
      textDiv.style.cssText = `
        position: absolute;
        left: ${transform[4]}px;
        top: ${transform[5]}px;
        font-size: ${fontSize}px;
        font-family: ${fontFamily};
        white-space: pre;
        cursor: text;
        user-select: text;
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        pointer-events: auto;
        color: transparent;
        background: transparent;
        min-width: ${item.width}px;
        min-height: ${item.height}px;
        width: ${item.width}px;
        height: ${item.height}px;
      `;
      textDiv.textContent = item.str;
      
      return textDiv;
    }).filter(div => div !== null); // Remove null elements
    
    // Add text elements to layer
    textDivs.forEach(div => textLayer.appendChild(div));
    
    console.log('✅ Text layer added with', textDivs.length, 'text items');
  } catch (error) {
    console.error('❌ Error adding text layer:', error);
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
