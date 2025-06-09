# NotesKeeper - Vanilla JavaScript Notes App

## 📝 Overview

NotesKeeper is a fully responsive notes application built with vanilla HTML, CSS, and JavaScript. It provides CRUD functionality for notes management and works offline with Progressive Web App (PWA) capabilities. This project demonstrates how to build a modern, functional web application without relying on frameworks or backend services.

![NotesKeeper App Screenshot](./screenshots/screenshot.png)
*[Screenshot placeholder - Add actual screenshot after deployment]*

## ✨ Features

### Core Functionality
- ✅ Create notes with title and content
- 📋 View all notes in a responsive card layout
- 📝 Edit existing notes via a modal interface
- 🗑️ Delete notes with confirmation
- 🔍 Search notes by title or content
- 📌 Pin important notes to the top
- 💾 Persistent storage using localStorage

### User Experience
- 📱 Fully responsive design for all devices
- 🌓 Dark/light mode toggle with saved preference
- ⚡ Fast loading and smooth animations
- 👆 Intuitive, clean interface

### PWA Features
- 🔄 Works completely offline
- 📲 Installable on supported devices
- 🚀 App-like experience
- 📶 Network status detection

## 🛠️ Tech Stack

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with CSS variables, flexbox, and grid
- **Vanilla JavaScript** - ES6+ with class-based architecture
- **localStorage API** - For data persistence
- **Service Worker API** - For offline capabilities
- **Web App Manifest** - For PWA installation

## 📋 Project Structure

```
notes-app/
├── index.html          # Main HTML document
├── style.css           # Styling
├── app.js              # Core application logic
├── sw.js               # Service worker for offline caching
├── manifest.json       # PWA manifest
├── favicon_io/         # App icons
    ├── icon-192x192.png
    ├── icon-512x512.png
    └── favicon.ico
```

## 🚀 Getting Started

### Installation

1. Clone this repository or download the files:
   ```bash
   git clone https://github.com/jstnpbl/notes_app.git
   ```

2. Open the project folder in your preferred code editor

3. Launch with a local server:
   - Using VS Code's Live Server extension
   - Or Python's built-in server: `python -m http.server`
   - Or any other local development server

### Building from Source

No build step is required as this is a vanilla JavaScript application.

## 📱 PWA Installation

To install NotesKeeper as a PWA on your device:

1. Open the app in a compatible browser (Chrome, Edge, Safari, etc.)
2. Look for the install prompt or use the browser's install option:
   - Chrome/Edge: Click the install icon in the address bar
   - Safari (iOS): Tap Share > Add to Home Screen

## 💻 Usage

### Creating a Note
1. Click the "New Note" button
2. Enter a title and content
3. Optionally check "Pin this note" for important notes
4. Click "Save Note"

### Managing Notes
- **Edit**: Click on a note or its edit (✏️) button
- **Delete**: Click the trash (🗑️) button and confirm deletion
- **Search**: Type in the search box to filter notes
- **Pin/Unpin**: Edit the note and toggle the pin checkbox

### Appearance
- Toggle dark/light mode by clicking the moon/sun icon in the header

## ⚠️ Limitations

- **Storage**: Uses localStorage with limited capacity (typically 5-10MB)
- **No cloud sync**: Data is stored only on the current device
- **Limited rich text**: Only plain text is supported (no formatting)
- **No sharing capabilities**: Notes cannot be directly shared
- **No attachments**: Cannot add images or files to notes
- **No user accounts**: No multi-user support or authentication
- **No encryption**: Data is not encrypted at rest
- **Offline mode**: While offline, all features work but only with data already cached

## 🔧 Browser Compatibility

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Android Chrome)

## 🧪 Testing

Manual testing has been performed across multiple devices and browsers to ensure:
- Responsive design works across various screen sizes
- PWA capabilities function as expected
- All CRUD operations work correctly
- Offline functionality works as intended

## 🛣️ Roadmap

Future enhancements that could be implemented:

- Rich text formatting
- Note categories/tags
- Export/import functionality
- Note sharing capabilities
- Image attachments
- Reminders/notifications
- End-to-end encryption
- Cloud sync (would require backend)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 👏 Acknowledgments

- Design inspiration from Google Keep and Apple Notes
- Icons from native emoji set for maximum compatibility

---

Created with ❤️ using vanilla web technologies