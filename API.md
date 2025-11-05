# Monica API Documentation

Monica provides a comprehensive API for managing web links and finds through browser extension messages.

## API Overview

All API calls are made using Chrome's messaging system:

```javascript
chrome.runtime.sendMessage({
  action: 'ACTION_NAME',
  // additional parameters
}, (response) => {
  // handle response
});
```

## API Endpoints

### Get All Links

Retrieve all saved links from the database.

```javascript
chrome.runtime.sendMessage({
  action: 'GET_ALL_LINKS'
}, (links) => {
  console.log(links); // Array of link objects
});
```

**Response:**
```json
[
  {
    "id": "1234567890-abc123",
    "url": "https://example.com",
    "title": "Example Site",
    "description": "An example website",
    "tags": ["example", "demo"],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Get Link by ID

Retrieve a specific link by its ID.

```javascript
chrome.runtime.sendMessage({
  action: 'GET_LINK',
  id: 'link-id-here'
}, (link) => {
  console.log(link); // Link object or null
});
```

### Add Link

Add a new link to the database.

```javascript
chrome.runtime.sendMessage({
  action: 'ADD_LINK',
  data: {
    url: 'https://example.com',
    title: 'Example Site',
    description: 'Optional description',
    tags: ['tag1', 'tag2']
  }
}, (newLink) => {
  console.log(newLink); // Created link object
});
```

**Required Fields:**
- `url` (string): The URL of the link
- `title` (string): The title of the link

**Optional Fields:**
- `description` (string): A description of the link
- `tags` (array): Array of tag strings

### Update Link

Update an existing link.

```javascript
chrome.runtime.sendMessage({
  action: 'UPDATE_LINK',
  id: 'link-id-here',
  updates: {
    title: 'New Title',
    tags: ['new-tag']
  }
}, (updatedLink) => {
  console.log(updatedLink); // Updated link object or null
});
```

**Note:** You cannot update `id` or `createdAt` fields.

### Delete Link

Delete a link by its ID.

```javascript
chrome.runtime.sendMessage({
  action: 'DELETE_LINK',
  id: 'link-id-here'
}, (success) => {
  console.log(success); // true or false
});
```

### Search Links

Search for links by query string.

```javascript
chrome.runtime.sendMessage({
  action: 'SEARCH_LINKS',
  query: 'search term'
}, (results) => {
  console.log(results); // Array of matching links
});
```

The search looks in:
- Title
- Description
- URL
- Tags

### Get Links by Tag

Get all links that have a specific tag.

```javascript
chrome.runtime.sendMessage({
  action: 'GET_BY_TAG',
  tag: 'example'
}, (links) => {
  console.log(links); // Array of links with the tag
});
```

### Get All Tags

Retrieve all unique tags from the database.

```javascript
chrome.runtime.sendMessage({
  action: 'GET_ALL_TAGS'
}, (tags) => {
  console.log(tags); // Array of tag strings
});
```

### Save Current Page

Save the currently active page.

```javascript
chrome.runtime.sendMessage({
  action: 'SAVE_CURRENT_PAGE',
  data: {
    description: 'Optional description',
    tags: ['tag1', 'tag2']
  }
}, (link) => {
  console.log(link); // Created link object
});
```

**Note:** The URL and title are automatically extracted from the current tab.

### Clear All Links

Delete all links from the database.

```javascript
chrome.runtime.sendMessage({
  action: 'CLEAR_ALL'
}, (result) => {
  console.log(result); // { success: true }
});
```

## External API Access

Other extensions can interact with Monica using `chrome.runtime.sendMessageExternal`:

```javascript
// From another extension
chrome.runtime.sendMessageExternal(
  'monica-extension-id', // Monica's extension ID
  {
    action: 'GET_ALL_LINKS'
  },
  (response) => {
    console.log(response);
  }
);
```

## Link Object Structure

```typescript
interface Link {
  id: string;              // Unique identifier
  url: string;             // Link URL
  title: string;           // Link title
  description: string;     // Optional description
  tags: string[];          // Array of tags
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

## Error Handling

API responses may include an error object:

```json
{
  "error": "Error message here"
}
```

Always check for the presence of an `error` field in responses.

## Rate Limiting

There are no built-in rate limits, but excessive API calls may affect performance.

## Storage Limits

Monica uses Chrome's local storage, which has a limit of approximately 10MB. For most use cases, this allows for thousands of links.

## Example Use Cases

### Bookmarking Tool

Create a simple bookmarking tool:

```javascript
document.getElementById('saveButton').addEventListener('click', () => {
  chrome.runtime.sendMessage({
    action: 'SAVE_CURRENT_PAGE',
    data: {
      tags: ['bookmark']
    }
  }, (link) => {
    if (link && !link.error) {
      alert('Page saved!');
    }
  });
});
```

### Link Manager

Build a custom link manager:

```javascript
async function displayLinks() {
  chrome.runtime.sendMessage({
    action: 'GET_ALL_LINKS'
  }, (links) => {
    links.forEach(link => {
      console.log(`${link.title}: ${link.url}`);
    });
  });
}
```

### Tag Browser

Browse links by tags:

```javascript
chrome.runtime.sendMessage({
  action: 'GET_ALL_TAGS'
}, async (tags) => {
  for (const tag of tags) {
    chrome.runtime.sendMessage({
      action: 'GET_BY_TAG',
      tag: tag
    }, (links) => {
      console.log(`Tag "${tag}": ${links.length} links`);
    });
  }
});
```
