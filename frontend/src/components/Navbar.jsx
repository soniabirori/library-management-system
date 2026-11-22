import Icon from './Icon';
import { LOAN_DAYS, MAX_BOOKS_OUT } from '../data/sampleData';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'categories', label: 'Categories', icon: 'category' },
  { id: 'books', label: 'Books', icon: 'book' },
  { id: 'members', label: 'Members', icon: 'members' },
  { id: 'loans', label: 'Loans', icon: 'loans' },
];

export function Logo() {
  return (
    <a href="#/dashboard" className="logo" aria-label="Shelfwise home">
      <span className="logo-mark">
        <Icon name="bookOpen" size={20} strokeWidth={2} />
      </span>
      <span className="logo-text">
        Shelf<span>wise</span>
      </span>
    </a>
  );
}

/** Sidebar on desktop, bottom tab bar on phones. Both use the same links. */
export default function Navbar({ current, counts }) {
  return (
    <>
      <aside className="sidebar">
        <Logo />
        <p className="sidebar-section">Menu</p>
        <nav aria-label="Main">
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#/${item.id}`}
                  className={`nav-link ${current === item.id ? 'is-active' : ''}`}
                  aria-current={current === item.id ? 'page' : undefined}
                >
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                  {counts[item.id] !== undefined && <span className="nav-count">{counts[item.id]}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="policy-card">
          <span className="policy-icon">
            <Icon name="sparkles" size={18} />
          </span>
          <p className="policy-title">Loan policy</p>
          <ul>
            <li>
              <strong>{LOAN_DAYS} days</strong> per loan
            </li>
            <li>
              Up to <strong>{MAX_BOOKS_OUT} books</strong> per member
            </li>
          </ul>
        </div>
      </aside>

      <nav className="bottom-nav" aria-label="Main">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#/${item.id}`}
            className={`bottom-link ${current === item.id ? 'is-active' : ''}`}
            aria-current={current === item.id ? 'page' : undefined}
          >
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
