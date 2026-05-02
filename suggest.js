// suggest.js — handles book suggestion form + local display

const STORAGE_KEY = 'pageturners_suggestions';

// Sample seed suggestions shown by default
const seedSuggestions = [
  {
    title: "The Correspondent",
    author: "Virginia Evans (2025; fiction)",
    notes: "This is an epistolary novel, i.e., told through letters, emails, and notes.  It documents the protagonist’s personal reflections, friendships, and life, etc.
The Pima Public Library system has 150 audiobooks, 106 hard covers, 15 large print copies, and 105 eBooks; all are currently in use.
",
    suggestedBy: "Daphna",
    date: "April 2026"
  },
  {
    title: "The Professor and the Housekeeper ",
    author: "Yoko Ogawa (2003 Japanese/2009 English;  fiction)",
    notes: "The story is about a brilliant mathematician with severe short-term memory loss and the housekeeper hired to care for him, along with her young son.
The Pima Public Library system has 2 books and 2 eBooks; all are currently in use.
",
    suggestedBy: "Daphna",
    date: "April 2026"
  },
  {
    title: "Rebecca Benson's War",
    author: "Patti Rudin Albaugh(paperback; 2021  ",
    notes: "The author lives in SaddleBrooke so we could invite her to a meeting to talk about the book. She wrote in an article in the local paper that she struggled with writing about a war that she had no direct connection to. 
The book is in paperback and inexpensive. Used copies are even less expensive. It is also available in Kindle but not on Audible. I have not checked the local libraries to see if they carry it. 
",
    suggestedBy: "Chris",
    date: "February 2026"
  }
];

function getSuggestions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const userSuggestions = stored ? JSON.parse(stored) : [];
    return [...userSuggestions, ...seedSuggestions];
  } catch {
    return seedSuggestions;
  }
}

function saveSuggestion(suggestion) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const existing = stored ? JSON.parse(stored) : [];
    existing.unshift(suggestion); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Could not save suggestion:', e);
  }
}

function renderSuggestions() {
  const list = document.getElementById('suggestions-list');
  if (!list) return;

  const suggestions = getSuggestions();

  if (suggestions.length === 0) {
    list.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No suggestions yet. Be the first!</p>';
    return;
  }

  list.innerHTML = suggestions.map(s => `
    <div class="suggestion-item">
      <h3>${escapeHtml(s.title)}</h3>
      <p class="s-author">by ${escapeHtml(s.author)}</p>
      ${s.notes ? `<p class="s-notes">${escapeHtml(s.notes)}</p>` : ''}
      <p class="s-suggested-by">Suggested by ${escapeHtml(s.suggestedBy)} · ${escapeHtml(s.date)}</p>
    </div>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str || ''));
  return div.innerHTML;
}

function submitForm(e) {
  e.preventDefault();

  const title = document.getElementById('book-title').value.trim();
  const author = document.getElementById('book-author').value.trim();
  const name = document.getElementById('your-name').value.trim();
  const notes = document.getElementById('book-notes').value.trim();

  if (!title || !author || !name) return;

  const now = new Date();
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const dateStr = `${months[now.getMonth()]} ${now.getFullYear()}`;

  const suggestion = { title, author, notes, suggestedBy: name, date: dateStr };
  saveSuggestion(suggestion);

  // Show success
  document.getElementById('suggest-form').style.display = 'none';
  document.getElementById('success-message').style.display = 'block';

  // Refresh suggestions list
  renderSuggestions();
}

function resetForm() {
  document.getElementById('suggest-form').reset();
  document.getElementById('suggest-form').style.display = 'block';
  document.getElementById('success-message').style.display = 'none';
}

// On page load
document.addEventListener('DOMContentLoaded', renderSuggestions);
