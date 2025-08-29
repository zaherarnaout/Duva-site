// === COOKIE CONSENT BANNER SYSTEM ===
/* Dynamic cookie consent banner with user preference management */

(function() {
  'use strict';
  
  console.log('🍪 Initializing Cookie Consent Banner System...');
  
  // Configuration
  const COOKIE_CONFIG = {
    bannerId: 'cookie-consent-banner',
    storageKey: 'duva-cookie-consent',
    bannerDelay: 1000, // Show banner after 1 second
    animationDuration: 300
  };
  
  // Cookie banner HTML template
  function createCookieBannerHTML() {
    return `
      <div id="${COOKIE_CONFIG.bannerId}" class="cookie-banner">
        <div class="cookie-banner-content">
          <div class="cookie-banner-text">
            <h4 class="cookie-banner-title">🍪 We use cookies</h4>
            <p class="cookie-banner-description">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies. 
              <a href="/privacy#cookies" class="cookie-policy-link">Learn more</a>
            </p>
          </div>
          <div class="cookie-banner-actions">
            <button class="cookie-btn cookie-btn-decline" onclick="handleCookieDecline()">
              Decline
            </button>
            <button class="cookie-btn cookie-btn-accept" onclick="handleCookieAccept()">
              Accept All
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  // Check if user has already made a choice
  function hasUserConsented() {
    const consent = localStorage.getItem(COOKIE_CONFIG.storageKey);
    return consent !== null;
  }
  
  // Check if banner should be shown
  function shouldShowBanner() {
    return !hasUserConsented();
  }
  
  // Create and inject the banner
  function createCookieBanner() {
    if (!shouldShowBanner()) {
      console.log('🍪 User has already consented, skipping banner');
      return;
    }
    
    // Create banner HTML
    const bannerHTML = createCookieBannerHTML();
    
    // Inject into body
    document.body.insertAdjacentHTML('beforeend', bannerHTML);
    
    // Show banner after delay
    setTimeout(() => {
      showCookieBanner();
    }, COOKIE_CONFIG.bannerDelay);
    
    console.log('🍪 Cookie banner created and scheduled to show');
  }
  
  // Show banner with animation
  function showCookieBanner() {
    const banner = document.getElementById(COOKIE_CONFIG.bannerId);
    if (!banner) return;
    
    banner.classList.add('cookie-banner-visible');
    console.log('🍪 Cookie banner shown');
  }
  
  // Hide banner with animation
  function hideCookieBanner() {
    const banner = document.getElementById(COOKIE_CONFIG.bannerId);
    if (!banner) return;
    
    banner.classList.remove('cookie-banner-visible');
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (banner && banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }, COOKIE_CONFIG.animationDuration);
    
    console.log('🍪 Cookie banner hidden and removed');
  }
  
  // Handle accept all cookies
  function handleCookieAccept() {
    console.log('🍪 User accepted all cookies');
    
    // Store consent
    localStorage.setItem(COOKIE_CONFIG.storageKey, 'accepted');
    
    // Enable analytics cookies (if you have them)
    enableAnalyticsCookies();
    
    // Hide banner
    hideCookieBanner();
    
    // Show success message
    showCookieMessage('Cookies accepted! 🎉', 'success');
  }
  
  // Handle decline cookies
  function handleCookieDecline() {
    console.log('🍪 User declined cookies');
    
    // Store decline preference
    localStorage.setItem(COOKIE_CONFIG.storageKey, 'declined');
    
    // Disable analytics cookies
    disableAnalyticsCookies();
    
    // Hide banner
    hideCookieBanner();
    
    // Show message
    showCookieMessage('Cookies declined. Some features may be limited.', 'info');
  }
  
  // Enable analytics cookies (placeholder for your analytics)
  function enableAnalyticsCookies() {
    // Add your analytics initialization here
    // Example: Google Analytics, Facebook Pixel, etc.
    console.log('🍪 Analytics cookies enabled');
  }
  
  // Disable analytics cookies
  function disableAnalyticsCookies() {
    // Add your analytics disable logic here
    console.log('🍪 Analytics cookies disabled');
  }
  
  // Show cookie message
  function showCookieMessage(message, type = 'info') {
    // Create temporary message
    const messageDiv = document.createElement('div');
    messageDiv.className = `cookie-message cookie-message-${type}`;
    messageDiv.textContent = message;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Show with animation
    setTimeout(() => {
      messageDiv.classList.add('cookie-message-visible');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      messageDiv.classList.remove('cookie-message-visible');
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.parentNode.removeChild(messageDiv);
        }
      }, 300);
    }, 3000);
  }
  
  // Reset cookie consent (for testing)
  function resetCookieConsent() {
    localStorage.removeItem(COOKIE_CONFIG.storageKey);
    console.log('🍪 Cookie consent reset');
  }
  
  // Get current consent status
  function getCookieConsentStatus() {
    return localStorage.getItem(COOKIE_CONFIG.storageKey) || 'not-set';
  }
  
  // Initialize cookie banner system
  function initializeCookieBanner() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createCookieBanner);
    } else {
      createCookieBanner();
    }
  }
  
  // Make functions globally available
  window.handleCookieAccept = handleCookieAccept;
  window.handleCookieDecline = handleCookieDecline;
  window.resetCookieConsent = resetCookieConsent;
  window.getCookieConsentStatus = getCookieConsentStatus;
  
  // Initialize when script loads
  initializeCookieBanner();
  
  console.log('✅ Cookie Consent Banner System initialized');
})();
