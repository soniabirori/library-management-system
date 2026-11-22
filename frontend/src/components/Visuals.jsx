// Small visual building blocks: book covers, avatars and category tiles.
// Colours are picked from the name, so the same item always looks the same.
import { hashString, initials } from '../utils';

const COVERS = [
  ['#7c3aed', '#a78bfa'],
  ['#4f46e5', '#818cf8'],
  ['#db2777', '#f472b6'],
  ['#0891b2', '#67e8f9'],
  ['#ea580c', '#fdba74'],
  ['#059669', '#6ee7b7'],
  ['#9333ea', '#f0abfc'],
  ['#1e293b', '#64748b'],
];

const SOFT = [
  { bg: '#f3eefe', fg: '#6d28d9' },
  { bg: '#e8f1fe', fg: '#1d5fd1' },
  { bg: '#fdecf4', fg: '#be185d' },
  { bg: '#e6f7f4', fg: '#0f766e' },
  { bg: '#fff1e6', fg: '#c2410c' },
  { bg: '#eef0ff', fg: '#4338ca' },
];

export function BookCover({ title, size = 'md' }) {
  const [from, to] = COVERS[hashString(title) % COVERS.length];
  return (
    <span
      className={`book-cover book-cover-${size}`}
      style={{ background: `linear-gradient(150deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      <span className="book-cover-letter">{title.trim()[0]}</span>
    </span>
  );
}

export function Avatar({ name, size = 'md' }) {
  const { bg, fg } = SOFT[hashString(name) % SOFT.length];
  return (
    <span className={`avatar avatar-${size}`} style={{ background: bg, color: fg }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

export function CategoryTile({ name }) {
  const { bg, fg } = SOFT[hashString(name) % SOFT.length];
  return (
    <span className="category-tile" style={{ background: bg, color: fg }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

/** Text with a muted second line, e.g. a title and its id. */
export function Stack({ title, sub }) {
  return (
    <span className="stack">
      <span className="stack-title">{title}</span>
      {sub && <span className="stack-sub">{sub}</span>}
    </span>
  );
}
