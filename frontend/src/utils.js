// Small helpers shared by every page.

const DAY_MS = 24 * 60 * 60 * 1000;

/** Today at midnight (local time). */
export function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Date -> "2026-11-22" (same format the backend's LocalDate uses). */
export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISO(value) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** "2026-11-22" -> "22 Nov 2026" */
export function formatDate(value) {
  if (!value) return '—';
  return parseISO(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Number of days from today to the given ISO date (negative = in the past). */
export function daysFromToday(value) {
  return Math.round((parseISO(value) - today()) / DAY_MS);
}

/** returned | overdue | active */
export function loanStatus(loan) {
  if (loan.returnDate) return 'returned';
  return daysFromToday(loan.dueDate) < 0 ? 'overdue' : 'active';
}

export function newId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** UUID -> "#3B39FB" so ids stay readable in tables. */
export function shortId(id) {
  return '#' + id.replace(/-/g, '').slice(0, 6).toUpperCase();
}

export function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/** Stable number for a string, used to pick a colour for covers and avatars. */
export function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Case-insensitive "contains" across several fields. */
export function matches(query, ...fields) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => String(field ?? '').toLowerCase().includes(q));
}

export function plural(count, word, pluralWord = word + 's') {
  return `${count} ${count === 1 ? word : pluralWord}`;
}
