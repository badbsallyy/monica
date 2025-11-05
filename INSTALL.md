# Installation Guide

## Quick Start

### Chrome, Edge, Brave, or other Chromium-based browsers

1. **Download the extension**
   - Clone this repository or download it as a ZIP and extract it

2. **Open Extensions Page**
   - Navigate to `chrome://extensions/` in your browser
   - Or click the puzzle piece icon → "Manage Extensions"

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `monica` directory (the folder containing manifest.json)

5. **Start Using Monica**
   - Click the Monica icon in your toolbar
   - Or right-click on any page and select "Save to Monica"

### Firefox

1. **Download the extension**
   - Clone this repository or download it as a ZIP and extract it

2. **Open Debugging Page**
   - Navigate to `about:debugging#/runtime/this-firefox`

3. **Load Temporary Add-on**
   - Click "Load Temporary Add-on..."
   - Navigate to the `monica` directory and select `manifest.json`

**Note**: In Firefox, temporary add-ons are removed when the browser closes. For permanent installation, the extension would need to be signed.

### Opera

1. **Download the extension**
   - Clone this repository or download it as a ZIP and extract it

2. **Open Extensions Page**
   - Navigate to `opera://extensions/`

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `monica` directory

## Verifying Installation

After installation, you should see:
- The Monica icon in your browser toolbar
- When you right-click on a page, "Save to Monica" option in the context menu

## First Use

1. **Click the Monica icon** in your toolbar
2. **Save your first page** by clicking "Save Current Page"
3. **Browse your saved links** in the "All Links" tab
4. **Add tags** to organize your links better

## Troubleshooting

### Extension not loading
- Make sure you selected the correct directory (it should contain manifest.json)
- Check the browser console for error messages
- Verify all files are present in the directory

### Icon not showing
- Try reloading the extension
- Check if extensions are visible in your toolbar settings
- Pin the extension to always show it

### Context menu not working
- Reload the extension
- Make sure the extension has proper permissions
- Try on different websites

### Storage issues
- Check if you have enough storage space
- The extension uses approximately 10MB of local storage
- Try clearing and re-importing your links

## Updating

If you update the extension code:
1. Go to your extensions page
2. Click the refresh icon on the Monica extension card
3. Or disable and re-enable the extension

## Uninstalling

To remove Monica:
1. Go to your extensions page (`chrome://extensions/`)
2. Find Monica - Web Links Manager
3. Click "Remove"
4. Confirm the removal

**Note**: All your saved links will be deleted when you uninstall the extension. Export your links first if you want to keep them.

## Data Backup

Before uninstalling or updating, consider exporting your links:
1. Open Monica popup
2. Click "Export" button
3. Save the JSON file
4. After reinstalling, you can manually import links using the API

## Getting Help

If you encounter issues:
1. Check this installation guide
2. Review the README.md for usage instructions
3. Check the browser console for error messages
4. Open an issue on GitHub with details about your problem

## Browser Compatibility

Monica is compatible with:
- ✅ Google Chrome (version 88+)
- ✅ Microsoft Edge (version 88+)
- ✅ Brave Browser
- ✅ Opera
- ✅ Firefox (with limitations on temporary add-ons)
- ✅ Any Chromium-based browser

**Manifest Version**: This extension uses Manifest V3, the latest standard for browser extensions.
