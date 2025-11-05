# Monica API Examples

This file contains practical examples of using the Monica API.

## Basic Operations

### Example 1: Adding Links

```javascript
// Add a simple link
chrome.runtime.sendMessage({
  action: 'ADD_LINK',
  data: {
    url: 'https://github.com',
    title: 'GitHub',
    description: 'Where the world builds software',
    tags: ['development', 'git']
  }
}, (response) => {
  if (response && !response.error) {
    console.log('Link added successfully:', response);
  } else {
    console.error('Error adding link:', response.error);
  }
});
```

### Example 2: Getting All Links

```javascript
// Retrieve all saved links
chrome.runtime.sendMessage({
  action: 'GET_ALL_LINKS'
}, (links) => {
  console.log(`Total links: ${links.length}`);
  links.forEach(link => {
    console.log(`- ${link.title}: ${link.url}`);
  });
});
```

### Example 3: Searching Links

```javascript
// Search for links containing "javascript"
chrome.runtime.sendMessage({
  action: 'SEARCH_LINKS',
  query: 'javascript'
}, (results) => {
  console.log(`Found ${results.length} links matching "javascript"`);
  results.forEach(link => {
    console.log(`- ${link.title}`);
  });
});
```

## Advanced Examples

### Example 4: Tag-Based Organization

```javascript
// Get all unique tags
chrome.runtime.sendMessage({
  action: 'GET_ALL_TAGS'
}, (tags) => {
  console.log('Available tags:', tags);
  
  // Get links for each tag
  tags.forEach(tag => {
    chrome.runtime.sendMessage({
      action: 'GET_BY_TAG',
      tag: tag
    }, (links) => {
      console.log(`Tag "${tag}": ${links.length} links`);
    });
  });
});
```

### Example 5: Updating Links

```javascript
// Update a link's title and tags
const linkId = 'your-link-id-here';

chrome.runtime.sendMessage({
  action: 'UPDATE_LINK',
  id: linkId,
  updates: {
    title: 'Updated Title',
    tags: ['new-tag', 'updated']
  }
}, (updatedLink) => {
  if (updatedLink) {
    console.log('Link updated:', updatedLink);
  } else {
    console.log('Link not found');
  }
});
```

### Example 6: Deleting Links

```javascript
// Delete a link by ID
const linkId = 'your-link-id-here';

chrome.runtime.sendMessage({
  action: 'DELETE_LINK',
  id: linkId
}, (success) => {
  if (success) {
    console.log('Link deleted successfully');
  } else {
    console.log('Link not found or could not be deleted');
  }
});
```

## Practical Use Cases

### Example 7: Bookmark Current Page

```html
<!-- Create a simple bookmark button in your extension -->
<button id="bookmarkBtn">Bookmark This Page</button>

<script>
document.getElementById('bookmarkBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({
    action: 'SAVE_CURRENT_PAGE',
    data: {
      tags: ['bookmark', 'important']
    }
  }, (link) => {
    if (link && !link.error) {
      alert(`Saved: ${link.title}`);
    }
  });
});
</script>
```

### Example 8: Reading List Manager

```javascript
// Add to reading list
function addToReadingList(url, title) {
  chrome.runtime.sendMessage({
    action: 'ADD_LINK',
    data: {
      url: url,
      title: title,
      tags: ['reading-list', 'unread']
    }
  }, (link) => {
    console.log('Added to reading list:', link.title);
  });
}

// Get all unread items
function getReadingList() {
  chrome.runtime.sendMessage({
    action: 'GET_BY_TAG',
    tag: 'reading-list'
  }, (links) => {
    const unread = links.filter(link => link.tags.includes('unread'));
    console.log(`Reading list: ${unread.length} unread items`);
  });
}

// Mark as read
function markAsRead(linkId) {
  chrome.runtime.sendMessage({
    action: 'GET_LINK',
    id: linkId
  }, (link) => {
    if (link) {
      const newTags = link.tags.filter(tag => tag !== 'unread');
      newTags.push('read');
      
      chrome.runtime.sendMessage({
        action: 'UPDATE_LINK',
        id: linkId,
        updates: { tags: newTags }
      }, (updated) => {
        console.log('Marked as read:', updated.title);
      });
    }
  });
}
```

### Example 9: Research Tool

```javascript
// Organize research links by project
class ResearchManager {
  constructor(projectName) {
    this.projectName = projectName;
    this.projectTag = `project-${projectName}`;
  }
  
  async addLink(url, title, notes) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: 'ADD_LINK',
        data: {
          url: url,
          title: title,
          description: notes,
          tags: [this.projectTag, 'research']
        }
      }, resolve);
    });
  }
  
  async getProjectLinks() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: 'GET_BY_TAG',
        tag: this.projectTag
      }, resolve);
    });
  }
  
  async searchProject(query) {
    const links = await this.getProjectLinks();
    const lowerQuery = query.toLowerCase();
    return links.filter(link => 
      link.title.toLowerCase().includes(lowerQuery) ||
      link.description.toLowerCase().includes(lowerQuery)
    );
  }
}

// Usage
const myProject = new ResearchManager('machine-learning');
myProject.addLink(
  'https://arxiv.org/paper',
  'Important ML Paper',
  'Key findings about neural networks'
);
```

### Example 10: Link Statistics

```javascript
// Get statistics about your saved links
chrome.runtime.sendMessage({
  action: 'GET_ALL_LINKS'
}, (links) => {
  // Total count
  console.log(`Total links: ${links.length}`);
  
  // Links per tag
  const tagCounts = {};
  links.forEach(link => {
    link.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  console.log('Links per tag:', tagCounts);
  
  // Most recent links
  const recent = links
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  console.log('5 most recent:', recent.map(l => l.title));
  
  // Domain analysis
  const domains = {};
  links.forEach(link => {
    try {
      const domain = new URL(link.url).hostname;
      domains[domain] = (domains[domain] || 0) + 1;
    } catch (e) {}
  });
  console.log('Top domains:', domains);
});
```

### Example 11: Bulk Operations

```javascript
// Import links from an array
async function bulkImport(linksArray) {
  for (const linkData of linksArray) {
    await new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: 'ADD_LINK',
        data: linkData
      }, resolve);
    });
  }
  console.log(`Imported ${linksArray.length} links`);
}

// Example usage
const linksToImport = [
  {
    url: 'https://example1.com',
    title: 'Example 1',
    tags: ['imported']
  },
  {
    url: 'https://example2.com',
    title: 'Example 2',
    tags: ['imported']
  }
];

bulkImport(linksToImport);
```

### Example 12: Content Script Integration

```javascript
// In your content script (content.js or custom content script)
// Automatically save links from a specific website

// Listen for link clicks
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' && e.target.href) {
    const url = e.target.href;
    const title = e.target.textContent || url;
    
    // Save interesting links (e.g., from specific domain)
    if (url.includes('interesting-domain.com')) {
      chrome.runtime.sendMessage({
        action: 'ADD_LINK',
        data: {
          url: url,
          title: title,
          description: `Clicked on ${window.location.href}`,
          tags: ['auto-saved', 'interesting-domain']
        }
      }, (response) => {
        console.log('Auto-saved link:', response);
      });
    }
  }
});
```

### Example 13: Export/Import Helper

```javascript
// Export all links to JSON file
function exportLinks() {
  chrome.runtime.sendMessage({
    action: 'GET_ALL_LINKS'
  }, (links) => {
    const dataStr = JSON.stringify(links, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monica-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

// Import links from JSON file
function importLinks(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const links = JSON.parse(e.target.result);
      
      // Clear existing links (optional)
      chrome.runtime.sendMessage({ action: 'CLEAR_ALL' }, () => {
        // Import each link
        links.forEach(link => {
          chrome.runtime.sendMessage({
            action: 'ADD_LINK',
            data: {
              url: link.url,
              title: link.title,
              description: link.description,
              tags: link.tags
            }
          });
        });
        console.log(`Imported ${links.length} links`);
      });
    } catch (error) {
      console.error('Error importing links:', error);
    }
  };
  reader.readAsText(file);
}
```

## Error Handling Example

```javascript
// Robust error handling wrapper
async function safeApiCall(action, data = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action, ...data },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response && response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      }
    );
  });
}

// Usage with async/await
async function addLinkSafely() {
  try {
    const link = await safeApiCall('ADD_LINK', {
      data: {
        url: 'https://example.com',
        title: 'Example'
      }
    });
    console.log('Success:', link);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Testing

All examples can be tested in the browser console while the Monica extension is loaded:
1. Load Monica extension
2. Open browser console (F12)
3. Copy and paste any example
4. Check results

For content script examples, inject them on a web page where the content script runs.
