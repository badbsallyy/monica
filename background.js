/**
 * Background service worker for Monica extension
 * Handles API requests and manages the link database
 */

// Import database
importScripts('database.js');

const db = new LinkDatabase();

// Initialize database on install
chrome.runtime.onInstalled.addListener(async () => {
  await db.init();
  console.log('Monica extension installed and database initialized');
  
  // Create context menu
  chrome.contextMenus.create({
    id: 'saveLinkToMonica',
    title: 'Save to Monica',
    contexts: ['link', 'page']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'saveLinkToMonica') {
    const url = info.linkUrl || info.pageUrl;
    const title = info.selectionText || tab.title;
    
    const link = await db.add({
      url: url,
      title: title,
      description: `Saved from ${tab.url}`,
      tags: []
    });
    
    // Show notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Link Saved',
      message: `"${title}" has been saved to Monica`
    });
  }
});

/**
 * API message handler
 * Processes requests from popup and content scripts
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handleAsync = async () => {
    try {
      switch (request.action) {
        case 'GET_ALL_LINKS':
          return await db.getAll();
          
        case 'GET_LINK':
          return await db.getById(request.id);
          
        case 'ADD_LINK':
          return await db.add(request.data);
          
        case 'UPDATE_LINK':
          return await db.update(request.id, request.updates);
          
        case 'DELETE_LINK':
          return await db.delete(request.id);
          
        case 'SEARCH_LINKS':
          return await db.search(request.query);
          
        case 'GET_BY_TAG':
          return await db.getByTag(request.tag);
          
        case 'GET_ALL_TAGS':
          return await db.getAllTags();
          
        case 'CLEAR_ALL':
          await db.clear();
          return { success: true };
          
        case 'SAVE_CURRENT_PAGE':
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          return await db.add({
            url: tab.url,
            title: tab.title,
            description: request.data?.description || '',
            tags: request.data?.tags || []
          });
          
        default:
          throw new Error(`Unknown action: ${request.action}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      return { error: error.message };
    }
  };
  
  // Handle async response
  handleAsync().then(sendResponse);
  return true; // Keep message channel open for async response
});

/**
 * API endpoint for external requests
 * Allows other extensions or scripts to interact with the database
 */
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  // Handle external requests with the same logic as internal requests
  const handleAsync = async () => {
    try {
      switch (request.action) {
        case 'GET_ALL_LINKS':
          return await db.getAll();
          
        case 'GET_LINK':
          return await db.getById(request.id);
          
        case 'ADD_LINK':
          return await db.add(request.data);
          
        case 'UPDATE_LINK':
          return await db.update(request.id, request.updates);
          
        case 'DELETE_LINK':
          return await db.delete(request.id);
          
        case 'SEARCH_LINKS':
          return await db.search(request.query);
          
        case 'GET_BY_TAG':
          return await db.getByTag(request.tag);
          
        case 'GET_ALL_TAGS':
          return await db.getAllTags();
          
        default:
          throw new Error(`Unknown action: ${request.action}`);
      }
    } catch (error) {
      console.error('External API Error:', error);
      return { error: error.message };
    }
  };
  
  handleAsync().then(sendResponse);
  return true;
});

console.log('Monica background service worker initialized');
