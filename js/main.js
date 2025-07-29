console.log("DUVA main.js loaded!");

// === Main Initialization and Coordination ===

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing DUVA application...');
  
  // Initialize all modules
  if (window.animationsModule) {
    window.animationsModule.initializeScrollAnimations();
  }
  
  if (window.menuModule) {
    window.menuModule.initializeMenuPanel();
  }
  
  if (window.imageLoadingModule) {
    window.imageLoadingModule.initializeSkeletonLoaders();
    window.imageLoadingModule.handleDynamicImages();
    window.imageLoadingModule.preloadCriticalImages();
  }
  
  if (window.galleryModule) {
    window.galleryModule.initializeGalleryAutoScroll();
  }
  
  console.log('✅ All modules initialized');
});

// === Utility Functions ===

// Global utility function to check if all modules are loaded
window.checkModulesLoaded = function() {
  const modules = [
    'accessoriesModule',
    'galleryModule', 
    'productConfiguratorModule',
    'pdfExportModule',
    'animationsModule',
    'menuModule',
    'imageLoadingModule'
  ];
  
  const loadedModules = modules.filter(module => window[module]);
  const missingModules = modules.filter(module => !window[module]);
  
  console.log('📦 Loaded modules:', loadedModules);
  if (missingModules.length > 0) {
    console.log('⚠️ Missing modules:', missingModules);
  }
  
  return {
    loaded: loadedModules,
    missing: missingModules,
    allLoaded: missingModules.length === 0
  };
};

// Global function to reload all modules
window.reloadAllModules = function() {
  console.log('🔄 Reloading all modules...');
  
  // Trigger module initializations
  if (window.animationsModule) {
    window.animationsModule.initializeScrollAnimations();
  }
  
  if (window.productConfiguratorModule) {
    window.productConfiguratorModule.setupOrderingCodeObserver();
  }
  
  if (window.galleryModule) {
    window.galleryModule.initializeGalleryAutoScroll();
  }
  
  console.log('✅ All modules reloaded');
};

// Global function to get application status
window.getAppStatus = function() {
  return {
    modules: window.checkModulesLoaded(),
    currentSelection: window.currentSelection || {},
    productCode: window.productConfiguratorModule?.getCurrentProductCode?.() || 'Not available',
    isExporting: window.pdfExportModule?.isExporting || false
  };
};

// === Error Handling and Debugging ===

// Global error handler
window.addEventListener('error', function(e) {
  console.error('🚨 Global error caught:', e.error);
  console.error('Error details:', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
  console.error('🚨 Unhandled promise rejection:', e.reason);
});

// === Performance Monitoring ===

// Track module load times
window.moduleLoadTimes = {};

// Function to track module load time
window.trackModuleLoad = function(moduleName, startTime) {
  const loadTime = performance.now() - startTime;
  window.moduleLoadTimes[moduleName] = loadTime;
  console.log(`⏱️ ${moduleName} loaded in ${loadTime.toFixed(2)}ms`);
};

// Get performance metrics
window.getPerformanceMetrics = function() {
  return {
    moduleLoadTimes: window.moduleLoadTimes,
    totalLoadTime: Object.values(window.moduleLoadTimes).reduce((a, b) => a + b, 0),
    moduleCount: Object.keys(window.moduleLoadTimes).length
  };
};

// === Development Helpers ===

// Debug function to show all available functions
window.showAvailableFunctions = function() {
  const functions = {
    'checkModulesLoaded()': 'Check if all modules are loaded',
    'reloadAllModules()': 'Reload all modules',
    'getAppStatus()': 'Get current application status',
    'getPerformanceMetrics()': 'Get performance metrics',
    'refreshProductCode()': 'Refresh product code (from Webflow)',
    'debugProductCode()': 'Debug product code detection',
    'forceRefreshOrderingCode()': 'Force refresh ordering code',
    'testProductChange(newCode)': 'Test product change simulation'
  };
  
  console.log('🔧 Available global functions:');
  Object.entries(functions).forEach(([func, desc]) => {
    console.log(`  ${func}: ${desc}`);
  });
  
  return functions;
};

// === Module Communication ===

// Global event system for module communication
window.duvaEvents = {
  listeners: {},
  
  on: function(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },
  
  emit: function(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  },
  
  off: function(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
};

// === Application Lifecycle ===

// Application ready event
window.duvaReady = false;

// Mark application as ready when all critical modules are loaded
function markAppReady() {
  if (!window.duvaReady) {
    window.duvaReady = true;
    console.log('🎉 DUVA application ready!');
    window.duvaEvents.emit('app:ready');
  }
}

// Check if app is ready after a delay
setTimeout(() => {
  const status = window.checkModulesLoaded();
  if (status.allLoaded) {
    markAppReady();
  } else {
    console.log('⏳ Waiting for modules to load...');
    // Check again after a longer delay
    setTimeout(() => {
      markAppReady();
    }, 2000);
  }
}, 1000);

// === Export Main Module ===

window.mainModule = {
  checkModulesLoaded,
  reloadAllModules,
  getAppStatus,
  getPerformanceMetrics,
  showAvailableFunctions,
  markAppReady
};

console.log('✅ DUVA main.js module loaded and ready'); 