import { useEffect, useMemo, useRef, useState } from 'react';
import { LoanStatusBadge } from '../components/Badge';
import Button, { IconButton } from '../components/Button';
import DataTable from '../components/DataTable';
import { SelectField } from '../components/FormFields';
import Icon from '../components/Icon';
import { Card, EmptyState, PageHeader } from '../components/Layout';
import { ConfirmDialog } from '../components/Modal';
import { useToast } from '../components/Toast';
import { SearchBox, Tabs } from '../components/Toolbar';
import { Avatar, BookCover, Stack } from '../components/Visuals';
import { LOAN_DAYS, MAX_BOOKS_OUT } from '../data/sampleData';
import { activeCountByMember, activeLoanByBook, indexBy } from '../data/selectors';
import { addDays, daysFromToday, formatDate, loanStatus, matches, newId, shortId, toISO, today } from '../utils';

export default function Loans({ library, intent, clearIntent }) {
  const { loans, books, members, categories, setLoans } = library;
  const notify = useToast();
  const formRef = useRef(null);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [form, setForm] = useState({ memberId: '', bookId: '' });
  const [errors, setErrors] = useState({});
  const [toDelete, setToDelete] = useState(null);

  // "New loan" in the top bar jumps here and focuses the form.
  useEffect(() => {
    if (intent === 'new') {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      formRef.current?.querySelector('select')?.focus({ preventScroll: true });
      clearIntent();
    }
  }, [intent]);

  const memberById = useMemo(() => indexBy(members), [members]);
  const bookById = useMemo(() => indexBy(books, 'isbn'), [books]);
  const outByBook = useMemo(() => activeLoanByBook(loans), [loans]);
  const outByMember = useMemo(() => activeCountByMember(loans), [loans]);

  // ----- borrow form -----
  const memberOptions = [...members]
    .sort((a, b) => a.fullName.localeCompare(b.fullName))
    .map((m) => {
      const out = outByMember.get(m.id) || 0;
      return { value: m.id, label: `${m.fullName} · ${out}/${MAX_BOOKS_OUT} books out` };
    });

  // Only books on the shelf can be borrowed, grouped by category.
  const bookOptions = [...categories]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({
      group: c.name,
      options: books
        .filter((b) => b.categoryId === c.id && !outByBook.has(b.isbn))
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((b) => ({ value: b.isbn, label: `${b.title} — ${b.author}` })),
    }))
    .filter((g) => g.options.length > 0);

  const borrowDate = today();
  const dueDate = addDays(borrowDate, LOAN_DAYS);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function resetForm() {
    setForm({ memberId: '', bookId: '' });
    setErrors({});
  }

  function borrow(e) {
    e.preventDefault();
    const next = {};
    if (!form.memberId) next.memberId = 'Choose a member';
    else if ((outByMember.get(form.memberId) || 0) >= MAX_BOOKS_OUT) next.memberId = 'Member already has 3 books out';
    if (!form.bookId) next.bookId = 'Choose a book';
    else if (outByBook.has(form.bookId)) next.bookId = 'Book is already borrowed';
    if (Object.keys(next).length) return setErrors(next);

    const loan = {
      id: newId(),
      memberId: form.memberId,
      bookId: form.bookId,
      borrowDate: toISO(borrowDate),
      dueDate: toISO(dueDate),
      returnDate: null,
    };
    setLoans((list) => [loan, ...list]);
    notify('Book borrowed successfully');
    resetForm();
    setStatus((s) => (s === 'returned' ? 'all' : s));
  }

  function returnLoan(loan) {
    setLoans((list) => list.map((l) => (l.id === loan.id ? { ...l, returnDate: toISO(today()) } : l)));
    notify(`“${bookById.get(loan.bookId)?.title}” returned successfully`);
  }

  function confirmDelete() {
    setLoans((list) => list.filter((l) => l.id !== toDelete.id));
    notify('Loan deleted successfully');
    setToDelete(null);
  }

  // ----- table -----
  const searched = loans.filter((l) =>
    matches(query, bookById.get(l.bookId)?.title, memberById.get(l.memberId)?.fullName),
  );
  const countBy = (s) => searched.filter((l) => loanStatus(l) === s).length;
  const rows = searched
    .filter((l) => {
      if (status === 'all') return true;
      if (status === 'out') return !l.returnDate;
      return loanStatus(l) === status;
    })
    .sort((a, b) => b.borrowDate.localeCompare(a.borrowDate));

  const columns = [
    {
      key: 'book',
      header: 'Book',
      primary: true,
      sortValue: (l) => bookById.get(l.bookId)?.title ?? '',
      render: (l) => {
        const book = bookById.get(l.bookId);
        return (
          <span className="cell-media">
            <BookCover title={book?.title ?? '?'} />
            <Stack title={book?.title ?? 'Unknown book'} sub={shortId(l.id)} />
          </span>
        );
      },
    },
    {
      key: 'member',
      header: 'Member',
      sortValue: (l) => memberById.get(l.memberId)?.fullName ?? '',
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
    {
      key: 'borrowDate',
      header: 'Borrowed',
      sortValue: (l) => l.borrowDate,
      render: (l) => <span className="date">{formatDate(l.borrowDate)}</span>,
    },
    {
      key: 'dueDate',
      header: 'Due',
      sortValue: (l) => l.dueDate,
      render: (l) => <DueDate loan={l} />,
    },
    {
      key: 'returnDate',
      header: 'Returned',
      sortValue: (l) => l.returnDate ?? '9999',
      render: (l) => <span className="date">{formatDate(l.returnDate)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (l) => loanStatus(l),
      render: (l) => <LoanStatusBadge status={loanStatus(l)} />,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      actions: true,
      render: (l) => (
        <div className="row-actions">
          {l.returnDate ? (
            <span className="returned-mark">
              <Icon name="check" size={16} /> Done
            </span>
          ) : (
            <Button size="sm" variant="soft" icon="undo" onClick={() => returnLoan(l)}>
              Return
            </Button>
          )}
          <IconButton icon="trash" tone="danger" label="Delete loan" onClick={() => setToDelete(l)} />
        </div>
      ),
    },
  ];

  const selectedMember = memberById.get(form.memberId);
  const selectedBook = bookById.get(form.bookId);

  return (
    <>
      <PageHeader title="Loans" description="Lend books to members and record them when they come back." />

      <section className="card borrow" ref={formRef}>
        <header className="borrow-header">
          <span className="borrow-icon">
            <Icon name="loans" size={20} />
          </span>
          <div>
            <h2 className="card-title">Borrow a book</h2>
            <p className="card-subtitle">Pick a member and a book that is on the shelf.</p>
          </div>
        </header>

        <form className="borrow-form" onSubmit={borrow} noValidate>
          <SelectField
            label="Member"
            required
            placeholder="Select a member"
            options={memberOptions}
            value={form.memberId}
            error={errors.memberId}
            onChange={(e) => update('memberId', e.target.value)}
          />
          <SelectField
            label="Book"
            required
            placeholder={bookOptions.length ? 'Select an available book' : 'No books available'}
            options={bookOptions}
            value={form.bookId}
            error={errors.bookId}
            onChange={(e) => update('bookId', e.target.value)}
          />

          <div className="borrow-dates" aria-live="polite">
            <div>
              <span className="borrow-dates-label">Borrow date</span>
              <strong>{formatDate(toISO(borrowDate))}</strong>
            </div>
            <Icon name="arrowRight" size={16} className="borrow-dates-arrow" />
            <div>
              <span className="borrow-dates-label">Due date</span>
              <strong>{formatDate(toISO(dueDate))}</strong>
            </div>
            <p className="borrow-dates-note">
              {selectedMember && selectedBook
                ? `${selectedMember.fullName.split(' ')[0]} gets “${selectedBook.title}” for ${LOAN_DAYS} days.`
                : `Set automatically: ${LOAN_DAYS} days from today.`}
            </p>
          </div>

          <div className="borrow-actions">
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" icon="check">
              Save
            </Button>
          </div>
        </form>
      </section>

      <Card
        title="All loans"
        subtitle="Newest first. Return a book when the member brings it back."
        actions={<SearchBox value={query} onChange={setQuery} placeholder="Search book or member" label="Search loans" />}
      >
        <div className="card-tabs">
          <Tabs
            label="Filter by status"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All', count: searched.length },
              { value: 'out', label: 'Out now', count: countBy('active') + countBy('overdue') },
              { value: 'overdue', label: 'Overdue', count: countBy('overdue') },
              { value: 'returned', label: 'Returned', count: countBy('returned') },
            ]}
          />
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(l) => l.id}
          resetKey={`${query}|${status}`}
          caption="Loans"
          empty={
            <EmptyState
              icon="loans"
              title={query || status !== 'all' ? 'No loans match your filters' : 'No loans yet'}
              text={query || status !== 'all' ? 'Try another search or status.' : 'Use the form above to lend a book.'}
            />
          }
        />
      </Card>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete loan?"
        message={
          <>
            The loan of <strong>{bookById.get(toDelete?.bookId)?.title}</strong> to{' '}
            <strong>{memberById.get(toDelete?.memberId)?.fullName}</strong> will be removed from the records.
          </>
        }
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}

/** Due date plus a hint: "in 3 days", "Due today", "5 days late". */
export function DueDate({ loan }) {
  if (loan.returnDate) return <span className="date">{formatDate(loan.dueDate)}</span>;
  const days = daysFromToday(loan.dueDate);
  let hint = `in ${days} days`;
  let tone = 'muted';
  if (days < 0) {
    hint = `${-days} ${days === -1 ? 'day' : 'days'} late`;
    tone = 'danger';
  } else if (days === 0) {
    hint = 'Due today';
    tone = 'warning';
  } else if (days === 1) {
    hint = 'Tomorrow';
    tone = 'warning';
  } else if (days <= 3) {
    tone = 'warning';
  }
  return (
    <span className="due">
      <span className="date">{formatDate(loan.dueDate)}</span>
      <span className={`due-hint due-${tone}`}>{hint}</span>
    </span>
  );
}
