/**
 * Popup UI controller for Monica extension
 */

let currentLinks = [];
let currentTags = [];
let selectedLink = null;

// API helper function
async function sendMessage(action, data = {}) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action, ...data }, resolve);
  });
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadLinks();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Save current page
  document.getElementById('saveCurrentPage').addEventListener('click', saveCurrentPage);

  // Search
  document.getElementById('searchBtn').addEventListener('click', performSearch);
  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  // Add link form
  document.getElementById('addLinkForm').addEventListener('submit', handleAddLink);

  // Footer actions
  document.getElementById('exportBtn').addEventListener('click', exportLinks);
  document.getElementById('clearBtn').addEventListener('click', clearAllLinks);

  // Modal
  document.querySelector('.close').addEventListener('click', closeModal);
  document.getElementById('modalEdit').addEventListener('click', editCurrentLink);
  document.getElementById('modalDelete').addEventListener('click', deleteCurrentLink);
  window.addEventListener('click', (e) => {
    if (e.target.id === 'linkModal') closeModal();
  });
}

// Load all links
async function loadLinks() {
  currentLinks = await sendMessage('GET_ALL_LINKS');
  currentTags = await sendMessage('GET_ALL_TAGS');
  renderLinks(currentLinks);
  renderTags(currentTags);
  updateLinkCount();
}

// Render links list
function renderLinks(links) {
  const linksList = document.getElementById('linksList');
  
  if (links.length === 0) {
    linksList.innerHTML = '<p class="empty-state">No links found.</p>';
    return;
  }

  linksList.innerHTML = links.map(link => `
    <div class="link-item" data-id="${link.id}">
      <div class="link-header">
        <h3 class="link-title">${escapeHtml(link.title)}</h3>
        <span class="link-date">${formatDate(link.createdAt)}</span>
      </div>
      <a href="${escapeHtml(link.url)}" class="link-url" target="_blank">${escapeHtml(link.url)}</a>
      ${link.description ? `<p class="link-description">${escapeHtml(link.description)}</p>` : ''}
      ${link.tags.length > 0 ? `
        <div class="link-tags">
          ${link.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');

  // Add click listeners
  linksList.querySelectorAll('.link-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.classList.contains('link-url')) {
        showLinkDetails(item.dataset.id);
      }
    });
  });
}

// Render tags
function renderTags(tags) {
  const tagsList = document.getElementById('tagsList');
  
  if (tags.length === 0) {
    tagsList.innerHTML = '<p class="empty-state">No tags yet.</p>';
    return;
  }

  tagsList.innerHTML = tags.map(tag => `
    <button class="tag tag-button" data-tag="${escapeHtml(tag)}">
      ${escapeHtml(tag)}
    </button>
  `).join('');

  // Add click listeners
  tagsList.querySelectorAll('.tag-button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const links = await sendMessage('GET_BY_TAG', { tag: btn.dataset.tag });
      switchTab('all');
      renderLinks(links);
    });
  });
}

// Switch tabs
function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}${tabName === 'all' ? 'Links' : ''}Tab`).classList.add('active');
}

// Save current page
async function saveCurrentPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Get page info from content script
  chrome.tabs.sendMessage(tab.id, { action: 'GET_PAGE_INFO' }, async (pageInfo) => {
    const link = await sendMessage('SAVE_CURRENT_PAGE', {
      data: {
        description: pageInfo?.description || '',
        tags: []
      }
    });
    
    if (link && !link.error) {
      showNotification('Page saved successfully!');
      await loadLinks();
    } else {
      showNotification('Error saving page', 'error');
    }
  });
}

// Perform search
async function performSearch() {
  const query = document.getElementById('searchInput').value.trim();
  
  if (!query) {
    renderLinks(currentLinks);
    return;
  }

  const results = await sendMessage('SEARCH_LINKS', { query });
  switchTab('all');
  renderLinks(results);
}

// Handle add link form
async function handleAddLink(e) {
  e.preventDefault();
  
  const url = document.getElementById('linkUrl').value;
  const title = document.getElementById('linkTitle').value;
  const description = document.getElementById('linkDescription').value;
  const tagsInput = document.getElementById('linkTags').value;
  const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);

  const link = await sendMessage('ADD_LINK', {
    data: { url, title, description, tags }
  });

  if (link && !link.error) {
    showNotification('Link added successfully!');
    document.getElementById('addLinkForm').reset();
    await loadLinks();
    switchTab('all');
  } else {
    showNotification('Error adding link', 'error');
  }
}

// Show link details in modal
function showLinkDetails(linkId) {
  const link = currentLinks.find(l => l.id === linkId);
  if (!link) return;

  selectedLink = link;
  document.getElementById('modalTitle').textContent = link.title;
  document.getElementById('modalUrl').textContent = link.url;
  document.getElementById('modalDescription').textContent = link.description || 'No description';
  document.getElementById('modalTags').innerHTML = link.tags.length > 0
    ? link.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')
    : 'No tags';
  document.getElementById('modalOpen').href = link.url;
  
  document.getElementById('linkModal').style.display = 'block';
}

// Close modal
function closeModal() {
  document.getElementById('linkModal').style.display = 'none';
  selectedLink = null;
}

// Edit current link
function editCurrentLink() {
  if (!selectedLink) return;
  
  // Switch to Add Link tab and populate with current data
  closeModal();
  switchTab('add');
  
  // Fill form with current link data
  document.getElementById('linkUrl').value = selectedLink.url;
  document.getElementById('linkTitle').value = selectedLink.title;
  document.getElementById('linkDescription').value = selectedLink.description || '';
  document.getElementById('linkTags').value = selectedLink.tags.join(', ');
  
  // Update form submit to edit instead of add
  const form = document.getElementById('addLinkForm');
  const oldHandler = form.onsubmit;
  
  form.onsubmit = async (e) => {
    e.preventDefault();
    
    const url = document.getElementById('linkUrl').value;
    const title = document.getElementById('linkTitle').value;
    const description = document.getElementById('linkDescription').value;
    const tagsInput = document.getElementById('linkTags').value;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);

    const updatedLink = await sendMessage('UPDATE_LINK', {
      id: selectedLink.id,
      updates: { url, title, description, tags }
    });

    if (updatedLink && !updatedLink.error) {
      showNotification('Link updated successfully!');
      document.getElementById('addLinkForm').reset();
      await loadLinks();
      switchTab('all');
      
      // Restore original form handler
      form.onsubmit = handleAddLink;
    } else {
      showNotification('Error updating link', 'error');
    }
  };
}

// Delete current link
async function deleteCurrentLink() {
  if (!selectedLink) return;
  
  if (confirm(`Delete "${selectedLink.title}"?`)) {
    await sendMessage('DELETE_LINK', { id: selectedLink.id });
    closeModal();
    await loadLinks();
    showNotification('Link deleted');
  }
}

// Export links
function exportLinks() {
  const dataStr = JSON.stringify(currentLinks, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `monica-links-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showNotification('Links exported');
}

// Clear all links
async function clearAllLinks() {
  if (confirm('Delete ALL links? This cannot be undone.')) {
    await sendMessage('CLEAR_ALL');
    await loadLinks();
    showNotification('All links cleared');
  }
}

// Update link count
function updateLinkCount() {
  document.getElementById('linkCount').textContent = `${currentLinks.length} link${currentLinks.length !== 1 ? 's' : ''}`;
}

// Show notification
function showNotification(message, type = 'success') {
  // Simple notification - could be enhanced
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 10px 15px;
    background: ${type === 'error' ? '#f44336' : '#4CAF50'};
    color: white;
    border-radius: 4px;
    z-index: 10000;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}
