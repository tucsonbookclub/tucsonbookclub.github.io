// suggest.js — handles book suggestion form + local display

const STORAGE_KEY = 'pageturners_suggestions';

// Sample seed suggestions shown by default
const seedSuggestions = [
  {
    title: "The Frozen River",
    author: "Ariel Lawhon",
    notes: "A wonderful historical novel about a midwife in 18th-century Maine. Very atmospheric and beautifully written.",
    suggestedBy: "Ruth K.",
    date: "April 2025"
  },
  {
    title: "North Woods",
    author: "Daniel Mason",
    notes: "This book is set in the same house in Massachusetts across several centuries. Unique and fascinating!",
    suggestedBy: "Joan P.",
    date: "March 2025"
  },
  {
    title: "The Serviceberry",
    author: "Robin Wall Kimmerer",
    notes: "A short but profound book about indigenous wisdom and our relationship with nature. Very thought-provoking.",
    suggestedBy: "Dorothy C.",
    date: "February 2025"
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
