import { useMemo } from 'react';
import { LoanStatusBadge } from '../components/Badge';
import Button from '../components/Button';
import DataTable from '../components/DataTable';
import Icon from '../components/Icon';
import { Card, EmptyState, StatCard } from '../components/Layout';
import { Avatar, BookCover, Stack } from '../components/Visuals';
import { activeLoanByBook, indexBy } from '../data/selectors';
import { daysFromToday, formatDate, loanStatus, plural } from '../utils';
import { DueDate } from './Loans';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard({ library, navigate }) {
  const { books, members, categories, loans } = library;

  const bookById = useMemo(() => indexBy(books, 'isbn'), [books]);
  const memberById = useMemo(() => indexBy(members), [members]);
  const outByBook = useMemo(() => activeLoanByBook(loans), [loans]);

  const openLoans = loans.filter((l) => !l.returnDate);
  const overdue = openLoans.filter((l) => loanStatus(l) === 'overdue');
  const staff = members.filter((m) => m.role === 'STAFF').length;

  const recent = [...loans].sort((a, b) => b.borrowDate.localeCompare(a.borrowDate)).slice(0, 6);
  const dueSoon = [...openLoans].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);

  const perCategory = categories
    .map((c) => {
      const inCat = books.filter((b) => b.categoryId === c.id);
      return { ...c, total: inCat.length, out: inCat.filter((b) => outByBook.has(b.isbn)).length };
    })
    .sort((a, b) => b.total - a.total);
  const maxPerCategory = Math.max(1, ...perCategory.map((c) => c.total));
  const biggest = perCategory[0];

  const columns = [
    {
      key: 'book',
      header: 'Book',
      primary: true,
      render: (l) => {
        const book = bookById.get(l.bookId);
        return (
          <span className="cell-media">
            <BookCover title={book?.title ?? '?'} />
            <Stack title={book?.title ?? 'Unknown book'} sub={book?.author} />
          </span>
        );
      },
    },
    {
      key: 'member',
      header: 'Member',
      render: (l) => {
        const member = memberById.get(l.memberId);
        return (
          <span className="cell-media cell-media-sm">
            <Avatar name={member?.fullName ?? '?'} size="sm" />
            <span>{member?.fullName ?? 'Unknown member'}</span>
          </span>
        );
      },
    },
    { key: 'borrowed', header: 'Borrowed', render: (l) => <span className="date">{formatDate(l.borrowDate)}</span> },
    { key: 'due', header: 'Due', render: (l) => <DueDate loan={l} /> },
    { key: 'status', header: 'Status', render: (l) => <LoanStatusBadge status={loanStatus(l)} /> },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="hero-eyebrow">{greeting()}, Librarian</p>
          <h1 className="hero-title">Here is what is happening in the library today.</h1>
          <p className="hero-sub">
            {plural(openLoans.length, 'book is', 'books are')} out on loan
            {overdue.length > 0 ? (
              <>
                , and <strong>{overdue.length} overdue</strong>.
              </>
            ) : (
              ' and nothing is overdue.'
            )}
          </p>
          <div className="hero-actions">
            <Button variant="light" icon="loans" onClick={() => navigate('loans', 'new')}>
              Lend a book
            </Button>
            <Button variant="glass" icon="plus" onClick={() => navigate('books', 'new')}>
              Add book
            </Button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-book hero-book-1" />
          <span className="hero-book hero-book-2" />
          <span className="hero-book hero-book-3" />
          <span className="hero-book hero-book-4" />
          <span className="hero-shelf" />
        </div>
      </section>

      <div className="stats">
        <StatCard
          icon="book"
          label="Total books"
          value={books.length}
          note={`${books.length - outByBook.size} on the shelf`}
          tone="violet"
        />
        <StatCard
          icon="members"
          label="Members"
          value={members.length}
          note={`${members.length - staff} students · ${staff} staff`}
          tone="blue"
        />
        <StatCard
          icon="category"
          label="Categories"
          value={categories.length}
          note={biggest && biggest.total ? `Largest: ${biggest.name}` : 'No books yet'}
          tone="amber"
        />
        <StatCard
          icon="loans"
          label="Books out"
          value={openLoans.length}
          note={overdue.length ? `${overdue.length} overdue` : 'All on time'}
          tone="rose"
        />
      </div>

      <div className="dash-grid">
        <Card
          className="dash-recent"
          title="Recent loans"
          subtitle="The latest books borrowed"
          actions={
            <a className="link-arrow" href="#/loans">
              View all <Icon name="arrowRight" size={16} />
            </a>
          }
        >
          <DataTable
            columns={columns}
            rows={recent}
            rowKey={(l) => l.id}
            paginate={false}
            caption="Recent loans"
            empty={<EmptyState icon="loans" title="No loans yet" text="Borrowed books will show up here." />}
          />
        </Card>

        <div className="dash-side">
          <Card title="Due back next" subtitle="Open loans by due date">
            {dueSoon.length === 0 ? (
              <EmptyState icon="check" title="Nothing to chase" text="Every book is on the shelf." />
            ) : (
              <ul className="mini-list">
                {dueSoon.map((l) => {
                  const days = daysFromToday(l.dueDate);
                  const book = bookById.get(l.bookId);
                  return (
                    <li key={l.id} className="mini-item">
                      <BookCover title={book?.title ?? '?'} size="sm" />
                      <Stack title={book?.title} sub={memberById.get(l.memberId)?.fullName} />
                      <span className={`day-chip ${days < 0 ? 'is-late' : days <= 3 ? 'is-soon' : ''}`}>
                        {days < 0 ? `${-days}d late` : days === 0 ? 'Today' : `${days}d`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card title="Books by category" subtitle="Bar shows how many are out">
            <ul className="bars">
              {perCategory.map((c) => (
                <li key={c.id} className="bar-row">
                  <span className="bar-label">{c.name}</span>
                  <span className="bar-track" title={`${c.out} of ${c.total} on loan`}>
                    <span className="bar-total" style={{ width: `${(c.total / maxPerCategory) * 100}%` }}>
                      <span className="bar-out" style={{ width: c.total ? `${(c.out / c.total) * 100}%` : 0 }} />
                    </span>
                  </span>
                  <span className="bar-value">{c.total}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
