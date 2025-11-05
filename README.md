# Monica - Web Links Manager

A browser extension for managing web finds and links with a powerful database and API.

## Features

- 📚 **Database Storage**: Store unlimited web links and finds locally
- 🔍 **Search**: Quickly find links by title, description, URL, or tags
- 🏷️ **Tags**: Organize links with custom tags
- 🌐 **Browser Integration**: Save pages with a single click or right-click menu
- 💾 **Export/Import**: Export your links as JSON for backup
- 🔌 **API Access**: Full API for programmatic access to your link database
- ⚡ **Fast & Lightweight**: Built with vanilla JavaScript for maximum performance

## Installation

### Chrome/Edge/Brave

1. Download or clone this repository
2. Open your browser and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `monica` directory

### Firefox

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the `monica` directory

## Usage

### Saving Links

**Method 1: Extension Popup**
- Click the Monica icon in your browser toolbar
- Click "Save Current Page" to save the active tab

**Method 2: Right-Click Menu**
- Right-click on any link or page
- Select "Save to Monica"

**Method 3: Manual Entry**
- Click the Monica icon
- Go to the "Add Link" tab
- Fill in the URL, title, description, and tags
- Click "Add Link"

### Managing Links

**View All Links**
- Click the Monica icon
- Browse your saved links in the "All Links" tab
- Click on any link to see details

**Search Links**
- Use the search box at the top of the popup
- Search by title, URL, description, or tags

**Browse by Tags**
- Click on the "Tags" tab
- Click on any tag to see all links with that tag

**Edit/Delete Links**
- Click on a link to open its details
- Use the Edit or Delete buttons in the modal

### Export Links

- Click the "Export" button at the bottom of the popup
- Your links will be downloaded as a JSON file

## API Usage

Monica provides a comprehensive API for programmatic access. See [API.md](API.md) for complete documentation.

### Quick Example

```javascript
// Get all links
chrome.runtime.sendMessage({
  action: 'GET_ALL_LINKS'
}, (links) => {
  console.log('All links:', links);
});

// Add a new link
chrome.runtime.sendMessage({
  action: 'ADD_LINK',
  data: {
    url: 'https://example.com',
    title: 'Example',
    description: 'An example website',
    tags: ['example', 'demo']
  }
}, (newLink) => {
  console.log('Link added:', newLink);
});

// Search links
chrome.runtime.sendMessage({
  action: 'SEARCH_LINKS',
  query: 'example'
}, (results) => {
  console.log('Search results:', results);
});
```

## Architecture

Monica consists of several components:

- **manifest.json**: Extension configuration and permissions
- **database.js**: Database layer using Chrome Storage API
- **background.js**: Service worker handling API requests and browser events
- **popup.html/js/css**: User interface for managing links
- **content.js**: Content script for page interaction
- **API.md**: Complete API documentation

## Storage

Monica uses Chrome's `chrome.storage.local` API for data persistence. This provides:
- Approximately 10MB of storage (sufficient for thousands of links)
- Automatic synchronization across browser sessions
- Fast read/write operations

## Development

### File Structure

```
monica/
├── manifest.json       # Extension manifest
├── database.js         # Database module
├── background.js       # Service worker
├── content.js          # Content script
├── popup.html          # Popup UI
├── popup.js            # Popup logic
├── popup.css           # Popup styles
├── API.md             # API documentation
├── icons/             # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # This file
```

### Building

No build step is required. The extension runs directly from the source files.

### Testing

The extension can be tested by:
1. Loading it as an unpacked extension
2. Opening the popup and testing features
3. Using the browser console to test API calls

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this code for your own projects.

## Privacy

Monica stores all data locally in your browser. No data is sent to external servers. Your links and browsing history remain completely private.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.