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
          <div class="cookie-banner-header">
            <div class="cookie-banner-icon">🍪</div>
            <div class="cookie-banner-text">
              <h4 class="cookie-banner-title">We use cookies</h4>
              <p class="cookie-banner-description">
                We use cookies to enhance your experience and analyze our traffic. 
                <a href="/privacy#cookies" class="cookie-policy-link">Learn more</a>
              </p>
            </div>
            <button class="cookie-toggle-btn" onclick="toggleCookiePreferences()">
              <span class="toggle-text">Customize</span>
              <span class="toggle-icon">▼</span>
            </button>
          </div>
          
          <div class="cookie-preferences" id="cookie-preferences">
            <div class="cookie-categories">
              <div class="cookie-category">
                <label class="cookie-checkbox-label">
                  <input type="checkbox" class="cookie-checkbox" id="essential-cookies" checked disabled>
                  <span class="cookie-checkbox-custom"></span>
                  <div class="cookie-category-info">
                    <span class="cookie-category-title">Essential</span>
                    <span class="cookie-category-desc">Required for website functionality</span>
                  </div>
                </label>
              </div>
              
              <div class="cookie-category">
                <label class="cookie-checkbox-label">
                  <input type="checkbox" class="cookie-checkbox" id="analytics-cookies">
                  <span class="cookie-checkbox-custom"></span>
                  <div class="cookie-category-info">
                    <span class="cookie-category-title">Analytics</span>
                    <span class="cookie-category-desc">Help us improve our website</span>
                  </div>
                </label>
              </div>
              
              <div class="cookie-category">
                <label class="cookie-checkbox-label">
                  <input type="checkbox" class="cookie-checkbox" id="marketing-cookies">
                  <span class="cookie-checkbox-custom"></span>
                  <div class="cookie-category-info">
                    <span class="cookie-category-title">Marketing</span>
                    <span class="cookie-category-desc">Personalized ads and campaigns</span>
                  </div>
                </label>
              </div>
              
              <div class="cookie-category">
                <label class="cookie-checkbox-label">
                  <input type="checkbox" class="cookie-checkbox" id="preference-cookies">
                  <span class="cookie-checkbox-custom"></span>
                  <div class="cookie-category-info">
                    <span class="cookie-category-title">Preferences</span>
                    <span class="cookie-category-desc">Remember your settings</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div class="cookie-banner-actions">
            <div class="cookie-action-buttons">
              <button class="cookie-btn cookie-btn-decline" onclick="handleCookieDecline()">
                Decline All
              </button>
              <button class="cookie-btn cookie-btn-save" onclick="handleCookieSave()">
                Save Preferences
              </button>
              <button class="cookie-btn cookie-btn-accept" onclick="handleCookieAccept()">
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Check if user has already made a choice
  function hasUserConsented() {
    const consent = localStorage.getItem(COOKIE_CONFIG.storageKey);
    if (!consent) return false;
    
    try {
      // Handle both old string format and new JSON format
      if (consent === 'accepted' || consent === 'declined') {
        return true; // Old format
      }
      
      const consentData = JSON.parse(consent);
      return consentData && consentData.status;
    } catch (error) {
      console.warn('🍪 Error parsing cookie consent data:', error);
      return false;
    }
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
    
    // Store consent with all cookies enabled
    const consentData = {
      status: 'accepted',
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(COOKIE_CONFIG.storageKey, JSON.stringify(consentData));
    
    // Enable all cookies
    enableAllCookies();
    
    // Hide banner
    hideCookieBanner();
    
    // Show success message
    showCookieMessage('All cookies accepted! 🎉', 'success');
  }
  
  // Handle decline cookies
  function handleCookieDecline() {
    console.log('🍪 User declined all cookies');
    
    // Store consent with only essential cookies
    const consentData = {
      status: 'declined',
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(COOKIE_CONFIG.storageKey, JSON.stringify(consentData));
    
    // Disable non-essential cookies
    disableNonEssentialCookies();
    
    // Hide banner
    hideCookieBanner();
    
    // Show message
    showCookieMessage('Only essential cookies enabled. Some features may be limited.', 'info');
  }
  
  // Handle save preferences
  function handleCookieSave() {
    console.log('🍪 User saved custom preferences');
    
    // Get checkbox values
    const analytics = document.getElementById('analytics-cookies')?.checked || false;
    const marketing = document.getElementById('marketing-cookies')?.checked || false;
    const preferences = document.getElementById('preference-cookies')?.checked || false;
    
    // Store consent with user preferences
    const consentData = {
      status: 'custom',
      essential: true, // Always true
      analytics: analytics,
      marketing: marketing,
      preferences: preferences,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(COOKIE_CONFIG.storageKey, JSON.stringify(consentData));
    
    // Apply user preferences
    applyCookiePreferences(consentData);
    
    // Hide banner
    hideCookieBanner();
    
    // Show success message
    showCookieMessage('Cookie preferences saved! ✅', 'success');
  }
  
  // Apply cookie preferences based on user choices
  function applyCookiePreferences(consentData) {
    if (consentData.analytics) {
      enableAnalyticsCookies();
    } else {
      disableAnalyticsCookies();
    }
    
    if (consentData.marketing) {
      enableMarketingCookies();
    } else {
      disableMarketingCookies();
    }
    
    if (consentData.preferences) {
      enablePreferenceCookies();
    } else {
      disablePreferenceCookies();
    }
    
    // Send consent data to your server (optional)
    sendConsentToServer(consentData);
  }
  
  // Send consent data to your server
  function sendConsentToServer(consentData) {
    // Add your server endpoint
    const endpoint = '/api/cookie-consent';
    
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...consentData,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('🍪 Consent data sent to server:', data);
    })
    .catch(error => {
      console.warn('🍪 Failed to send consent data:', error);
    });
  }
  
  // Enable all cookies
  function enableAllCookies() {
    enableAnalyticsCookies();
    enableMarketingCookies();
    enablePreferenceCookies();
  }
  
  // Disable non-essential cookies
  function disableNonEssentialCookies() {
    disableAnalyticsCookies();
    disableMarketingCookies();
    disablePreferenceCookies();
  }
  
  // Enable analytics cookies (Google Analytics example)
  function enableAnalyticsCookies() {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('consent', 'grant');
    }
    
    console.log('🍪 Analytics cookies enabled');
  }
  
  // Disable analytics cookies
  function disableAnalyticsCookies() {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('consent', 'revoke');
    }
    
    console.log('🍪 Analytics cookies disabled');
  }
  
  // Enable marketing cookies
  function enableMarketingCookies() {
    // Google Ads
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('consent', 'grant');
    }
    
    console.log('🍪 Marketing cookies enabled');
  }
  
  // Disable marketing cookies
  function disableMarketingCookies() {
    // Google Ads
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('consent', 'revoke');
    }
    
    console.log('🍪 Marketing cookies disabled');
  }
  
  // Enable preference cookies
  function enablePreferenceCookies() {
    // Theme preferences
    if (localStorage.getItem('theme-preference')) {
      document.documentElement.setAttribute('data-theme', localStorage.getItem('theme-preference'));
    }
    
    // Language preferences
    if (localStorage.getItem('language-preference')) {
      // Apply language setting
    }
    
    console.log('🍪 Preference cookies enabled');
  }
  
  // Disable preference cookies
  function disablePreferenceCookies() {
    // Clear preference data
    localStorage.removeItem('theme-preference');
    localStorage.removeItem('language-preference');
    
    // Reset to defaults
    document.documentElement.setAttribute('data-theme', 'light');
    
    console.log('🍪 Preference cookies disabled');
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
  
  // Get detailed consent data
  function getCookieConsentData() {
    const consent = localStorage.getItem(COOKIE_CONFIG.storageKey);
    if (!consent) return null;
    
    try {
      return JSON.parse(consent);
    } catch (error) {
      console.warn('🍪 Error parsing consent data:', error);
      return null;
    }
  }
  
  // Check if specific cookie type is enabled
  function isCookieEnabled(cookieType) {
    const consentData = getCookieConsentData();
    if (!consentData) return false;
    
    return consentData[cookieType] === true;
  }
  
  // Get consent statistics
  function getConsentStats() {
    const consentData = getCookieConsentData();
    if (!consentData) return null;
    
    return {
      status: consentData.status,
      enabledCookies: Object.keys(consentData).filter(key => 
        key !== 'status' && key !== 'timestamp' && consentData[key] === true
      ),
      totalCookies: Object.keys(consentData).filter(key => 
        key !== 'status' && key !== 'timestamp'
      ).length,
      timestamp: consentData.timestamp
    };
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
  
  // Toggle cookie preferences visibility
  function toggleCookiePreferences() {
    const preferences = document.getElementById('cookie-preferences');
    const toggleBtn = document.querySelector('.cookie-toggle-btn');
    const toggleIcon = document.querySelector('.toggle-icon');
    const toggleText = document.querySelector('.toggle-text');
    
    if (preferences.classList.contains('preferences-visible')) {
      preferences.classList.remove('preferences-visible');
      toggleIcon.textContent = '▼';
      toggleText.textContent = 'Customize';
    } else {
      preferences.classList.add('preferences-visible');
      toggleIcon.textContent = '▲';
      toggleText.textContent = 'Hide';
    }
  }
  
  // Make functions globally available
  window.handleCookieAccept = handleCookieAccept;
  window.handleCookieDecline = handleCookieDecline;
  window.handleCookieSave = handleCookieSave;
  window.toggleCookiePreferences = toggleCookiePreferences;
  window.resetCookieConsent = resetCookieConsent;
  window.getCookieConsentStatus = getCookieConsentStatus;
  window.getCookieConsentData = getCookieConsentData;
  window.isCookieEnabled = isCookieEnabled;
  window.getConsentStats = getConsentStats;
  
  // Initialize when script loads
  initializeCookieBanner();
  
  console.log('✅ Cookie Consent Banner System initialized');
})();
