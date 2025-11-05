/**
 * Content script for Monica extension
 * Runs on all web pages to capture link information
 */

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_PAGE_INFO') {
    sendResponse({
      url: window.location.href,
      title: document.title,
      description: getPageDescription(),
      selectedText: window.getSelection().toString()
    });
  }
  return true;
});

/**
 * Extract page description from meta tags
 * @returns {string} Page description
 */
function getPageDescription() {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    return metaDescription.getAttribute('content');
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    return ogDescription.getAttribute('content');
  }
  
  // Fallback to first paragraph
  const firstParagraph = document.querySelector('p');
  if (firstParagraph) {
    return firstParagraph.textContent.substring(0, 200);
  }
  
  return '';
}

/**
 * Add visual feedback when a link is saved
 */
function showSavedFeedback() {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
  `;
  notification.textContent = '✓ Saved to Monica';
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s';
    setTimeout(() => notification.remove(), 500);
  }, 2000);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getPageDescription, showSavedFeedback };
}
