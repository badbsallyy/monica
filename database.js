/**
 * Database module for managing web links and finds
 * Uses Chrome Storage API for persistence
 */

class LinkDatabase {
  constructor() {
    this.storageKey = 'monica_links';
  }

  /**
   * Initialize the database
   */
  async init() {
    const data = await this.getAll();
    if (!data) {
      await chrome.storage.local.set({ [this.storageKey]: [] });
    }
  }

  /**
   * Get all links from the database
   * @returns {Promise<Array>} Array of link objects
   */
  async getAll() {
    const result = await chrome.storage.local.get(this.storageKey);
    return result[this.storageKey] || [];
  }

  /**
   * Get a link by ID
   * @param {string} id - Link ID
   * @returns {Promise<Object|null>} Link object or null
   */
  async getById(id) {
    const links = await this.getAll();
    return links.find(link => link.id === id) || null;
  }

  /**
   * Add a new link to the database
   * @param {Object} linkData - Link data (url, title, description, tags)
   * @returns {Promise<Object>} Created link object
   */
  async add(linkData) {
    const links = await this.getAll();
    const newLink = {
      id: this._generateId(),
      url: linkData.url,
      title: linkData.title || '',
      description: linkData.description || '',
      tags: linkData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    links.push(newLink);
    await chrome.storage.local.set({ [this.storageKey]: links });
    return newLink;
  }

  /**
   * Update an existing link
   * @param {string} id - Link ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated link or null
   */
  async update(id, updates) {
    const links = await this.getAll();
    const index = links.findIndex(link => link.id === id);
    
    if (index === -1) return null;
    
    links[index] = {
      ...links[index],
      ...updates,
      id: links[index].id, // Preserve ID
      createdAt: links[index].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };
    
    await chrome.storage.local.set({ [this.storageKey]: links });
    return links[index];
  }

  /**
   * Delete a link by ID
   * @param {string} id - Link ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const links = await this.getAll();
    const filteredLinks = links.filter(link => link.id !== id);
    
    if (filteredLinks.length === links.length) return false;
    
    await chrome.storage.local.set({ [this.storageKey]: filteredLinks });
    return true;
  }

  /**
   * Search links by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} Matching links
   */
  async search(query) {
    const links = await this.getAll();
    const lowerQuery = query.toLowerCase();
    
    return links.filter(link => 
      link.title.toLowerCase().includes(lowerQuery) ||
      link.description.toLowerCase().includes(lowerQuery) ||
      link.url.toLowerCase().includes(lowerQuery) ||
      link.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get links by tag
   * @param {string} tag - Tag name
   * @returns {Promise<Array>} Links with the tag
   */
  async getByTag(tag) {
    const links = await this.getAll();
    return links.filter(link => link.tags.includes(tag));
  }

  /**
   * Get all unique tags
   * @returns {Promise<Array>} Array of unique tags
   */
  async getAllTags() {
    const links = await this.getAll();
    const tagsSet = new Set();
    links.forEach(link => {
      link.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }

  /**
   * Clear all links from the database
   * @returns {Promise<void>}
   */
  async clear() {
    await chrome.storage.local.set({ [this.storageKey]: [] });
  }

  /**
   * Generate a unique ID
   * @private
   * @returns {string} Unique ID
   */
  _generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LinkDatabase;
}
