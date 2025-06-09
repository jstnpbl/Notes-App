// Main application class
class NotesApp {
  constructor() {
    // DOM elements
    this.notesContainer = document.getElementById('notesContainer');
    this.emptyState = document.getElementById('emptyState');
    this.noteModal = document.getElementById('noteModal');
    this.noteForm = document.getElementById('noteForm');
    this.modalTitle = document.getElementById('modalTitle');
    this.noteTitleInput = document.getElementById('noteTitle');
    this.noteContentInput = document.getElementById('noteContent');
    this.notePinnedInput = document.getElementById('notePinned');
    this.confirmDialog = document.getElementById('confirmDialog');
    this.searchInput = document.getElementById('searchInput');
    this.clearSearchBtn = document.getElementById('clearSearch');
    this.installPrompt = document.getElementById('installPrompt');
    this.offlineIndicator = document.getElementById('offlineIndicator');
    this.toggleThemeBtn = document.getElementById('toggleTheme');
    
    // App state
    this.notes = [];
    this.currentNoteId = null;
    this.deferredPrompt = null;
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    
    // Initialize app
    this.loadNotesFromStorage();
    this.renderNotes();
    this.setupEventListeners();
    this.setupInstallPrompt();
    this.setupOfflineDetection();
    this.applyTheme();
  }
  
  // Setup event listeners
  setupEventListeners() {
    // Add note button
    document.getElementById('addNoteBtn').addEventListener('click', () => this.showNoteModal());
    
    // Close modal buttons
    document.getElementById('closeModal').addEventListener('click', () => this.hideNoteModal());
    document.getElementById('cancelNote').addEventListener('click', () => this.hideNoteModal());
    
    // Note form submission
    this.noteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveNote();
    });
    
    // Delete confirmation
    document.getElementById('closeConfirm').addEventListener('click', () => this.hideConfirmDialog());
    document.getElementById('cancelDelete').addEventListener('click', () => this.hideConfirmDialog());
    document.getElementById('confirmDelete').addEventListener('click', () => {
      this.deleteNote(this.currentNoteId);
      this.hideConfirmDialog();
    });
    
    // Search functionality
    this.searchInput.addEventListener('input', () => this.searchNotes(this.searchInput.value));
    this.clearSearchBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.searchNotes('');
    });
    
    // Install app
    document.getElementById('installApp').addEventListener('click', () => this.installApp());
    document.getElementById('dismissPrompt').addEventListener('click', () => {
      this.installPrompt.classList.add('hidden');
      localStorage.setItem('installPromptDismissed', 'true');
    });
    
    // Toggle theme
    this.toggleThemeBtn.addEventListener('click', () => this.toggleTheme());
  }
  
  // Load notes from localStorage
  loadNotesFromStorage() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      try {
        this.notes = JSON.parse(storedNotes);
      } catch (error) {
        console.error('Error parsing notes from localStorage:', error);
        this.notes = [];
      }
    }
  }
  
  // Save notes to localStorage
  saveNotesToStorage() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }
  
  // Generate a unique ID for notes
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  
  // Format date for display
  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Render all notes
  renderNotes(searchTerm = '') {
    // Clear container
    this.notesContainer.innerHTML = '';
    
    // Filter notes if search term exists
    let filteredNotes = this.notes;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredNotes = this.notes.filter(note => 
        note.title.toLowerCase().includes(term) || 
        note.content.toLowerCase().includes(term)
      );
    }
    
    // Sort notes (pinned first, then by timestamp)
    filteredNotes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.timestamp - a.timestamp;
    });
    
    // Display empty state if no notes
    if (filteredNotes.length === 0) {
      this.emptyState.classList.remove('hidden');
      if (searchTerm) {
        document.querySelector('.empty-state h2').textContent = 'No matching notes';
        document.querySelector('.empty-state p').textContent = 'Try a different search term';
      } else {
        document.querySelector('.empty-state h2').textContent = 'No notes yet';
        document.querySelector('.empty-state p').textContent = 'Create your first note by clicking the "New Note" button';
      }
    } else {
      this.emptyState.classList.add('hidden');
      
      // Render each note
      filteredNotes.forEach(note => {
        const noteElement = this.createNoteElement(note);
        this.notesContainer.appendChild(noteElement);
      });
    }
  }
  
  // Create a note DOM element
  createNoteElement(note) {
    const noteElement = document.createElement('div');
    noteElement.className = `note-card ${note.pinned ? 'pinned' : ''}`;
    noteElement.dataset.id = note.id;
    
    const contentPreview = note.content.length > 200 
      ? note.content.substring(0, 200) + '...' 
      : note.content;
    
    noteElement.innerHTML = `
      <div class="note-card-header">
        <h3 class="note-card-title">${this.escapeHtml(note.title)}</h3>
        <div class="note-card-actions">
          <button class="btn btn-icon edit-note" aria-label="Edit note">✏️</button>
          <button class="btn btn-icon delete-note" aria-label="Delete note">🗑️</button>
        </div>
      </div>
      <div class="note-card-content">${this.escapeHtml(contentPreview)}</div>
      <div class="note-card-date">
        ${this.formatDate(note.timestamp)}
      </div>
    `;
    
    // Add event listeners
    noteElement.querySelector('.edit-note').addEventListener('click', () => {
      this.showNoteModal(note);
    });
    
    noteElement.querySelector('.delete-note').addEventListener('click', () => {
      this.showConfirmDialog(note.id);
    });
    
    // Add click event to the card (excluding buttons)
    noteElement.addEventListener('click', (e) => {
      if (!e.target.closest('.btn')) {
        this.showNoteModal(note);
      }
    });
    
    return noteElement;
  }
  
  // Escape HTML to prevent XSS
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  // Show note modal for adding/editing
  showNoteModal(note = null) {
    // Reset form
    this.noteForm.reset();
    
    if (note) {
      // Edit mode
      this.modalTitle.textContent = 'Edit Note';
      this.noteTitleInput.value = note.title;
      this.noteContentInput.value = note.content;
      this.notePinnedInput.checked = note.pinned;
      this.currentNoteId = note.id;
    } else {
      // Add mode
      this.modalTitle.textContent = 'Add New Note';
      this.currentNoteId = null;
    }
    
    // Show modal
    this.noteModal.classList.add('show');
    this.noteTitleInput.focus();
  }
  
  // Hide note modal
  hideNoteModal() {
    this.noteModal.classList.remove('show');
    this.currentNoteId = null;
  }
  
  // Save note (create or update)
  saveNote() {
    const title = this.noteTitleInput.value.trim();
    const content = this.noteContentInput.value.trim();
    const pinned = this.notePinnedInput.checked;
    
    if (!title || !content) return;
    
    if (this.currentNoteId) {
      // Update existing note
      const noteIndex = this.notes.findIndex(note => note.id === this.currentNoteId);
      if (noteIndex !== -1) {
        this.notes[noteIndex] = {
          ...this.notes[noteIndex],
          title,
          content,
          pinned,
          timestamp: Date.now()
        };
      }
    } else {
      // Create new note
      const newNote = {
        id: this.generateId(),
        title,
        content,
        pinned,
        timestamp: Date.now()
      };
      this.notes.push(newNote);
    }
    
    // Save to storage and update UI
    this.saveNotesToStorage();
    this.renderNotes(this.searchInput.value);
    this.hideNoteModal();
  }
  
  // Show delete confirmation dialog
  showConfirmDialog(noteId) {
    this.currentNoteId = noteId;
    this.confirmDialog.classList.add('show');
  }
  
  // Hide delete confirmation dialog
  hideConfirmDialog() {
    this.confirmDialog.classList.remove('show');
    this.currentNoteId = null;
  }
  
  // Delete note
  deleteNote(noteId) {
    this.notes = this.notes.filter(note => note.id !== noteId);
    this.saveNotesToStorage();
    this.renderNotes(this.searchInput.value);
  }
  
  // Search notes
  searchNotes(term) {
    this.renderNotes(term);
  }
  
  // Setup install prompt for PWA
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      
      // Show the install prompt if not dismissed before
      if (localStorage.getItem('installPromptDismissed') !== 'true') {
        this.installPrompt.classList.remove('hidden');
      }
    });
    
    // Hide install prompt when app is installed
    window.addEventListener('appinstalled', () => {
      this.installPrompt.classList.add('hidden');
      this.deferredPrompt = null;
    });
  }
  
  // Install app
  installApp() {
    if (!this.deferredPrompt) return;
    
    // Show the install prompt
    this.deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      this.installPrompt.classList.add('hidden');
      this.deferredPrompt = null;
    });
  }
  
  // Setup offline detection
  setupOfflineDetection() {
    const updateOfflineStatus = () => {
      if (navigator.onLine) {
        this.offlineIndicator.classList.add('hidden');
      } else {
        this.offlineIndicator.classList.remove('hidden');
      }
    };
    
    window.addEventListener('online', updateOfflineStatus);
    window.addEventListener('offline', updateOfflineStatus);
    
    // Initial check
    updateOfflineStatus();
  }
  
  // Toggle dark/light theme
  toggleTheme() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode);
    this.applyTheme();
  }
  
  // Apply theme based on setting
  applyTheme() {
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
      this.toggleThemeBtn.innerHTML = '☀️';
    } else {
      document.body.classList.remove('dark-mode');
      this.toggleThemeBtn.innerHTML = '🌙';
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new NotesApp();
});