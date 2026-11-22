import { useCallback, useEffect, useState } from 'react';
import * as sample from './data/sampleData';
import Navbar, { Logo, NAV_ITEMS } from './components/Navbar';
import Button from './components/Button';
import { ToastProvider } from './components/Toast';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Books from './pages/Books';
import Members from './pages/Members';
import Loans from './pages/Loans';

const PAGES = { dashboard: Dashboard, categories: Categories, books: Books, members: Members, loans: Loans };

// Tiny hash router: "#/books?new" -> { page: 'books', intent: 'new' }.
// The intent lets one page ask another to open its form straight away.
function readHash() {
  const [page, intent] = window.location.hash.replace(/^#\/?/, '').split('?');
  return { page: PAGES[page] ? page : 'dashboard', intent: intent || null };
}

function useHashRoute() {
  const [route, setRoute] = useState(readHash);

  useEffect(() => {
    const onChange = () => {
      setRoute(readHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((page, intent) => {
    window.location.hash = `#/${page}${intent ? `?${intent}` : ''}`;
  }, []);

  const clearIntent = useCallback(() => {
    setRoute((r) => {
      window.history.replaceState(null, '', `#/${r.page}`);
      return { ...r, intent: null };
    });
  }, []);

  return { ...route, navigate, clearIntent };
}

export default function App() {
  // All data lives here, in memory only. Nothing is sent to the backend.
  const [categories, setCategories] = useState(sample.categories);
  const [books, setBooks] = useState(sample.books);
  const [members, setMembers] = useState(sample.members);
  const [loans, setLoans] = useState(sample.loans);

  const { page, intent, navigate, clearIntent } = useHashRoute();
  const Page = PAGES[page];
  const library = { categories, books, members, loans, setCategories, setBooks, setMembers, setLoans };

  const label = NAV_ITEMS.find((n) => n.id === page).label;
  useEffect(() => {
    document.title = `${label} · Shelfwise Library`;
  }, [label]);

  const counts = {
    categories: categories.length,
    books: books.length,
    members: members.length,
    loans: loans.filter((l) => !l.returnDate).length,
  };

  return (
    <ToastProvider>
      <div className="app">
        <Navbar current={page} counts={counts} />
        <div className="main">
          <Topbar onNewLoan={() => navigate('loans', 'new')} />
          <main className="content" key={page}>
            <Page library={library} navigate={navigate} intent={intent} clearIntent={clearIntent} />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

function Topbar({ onNewLoan }) {
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <Logo />
      </div>
      <p className="topbar-date">
        <span className="pulse" aria-hidden="true" />
        {date}
      </p>
      <div className="topbar-actions">
        <Button icon="plus" onClick={onNewLoan} className="topbar-cta">
          New loan
        </Button>
        <div className="profile">
          <span className="profile-avatar" aria-hidden="true">LB</span>
          <span className="profile-text">
            <strong>Librarian</strong>
            <small>Front desk</small>
          </span>
        </div>
      </div>
    </header>
  );
}
