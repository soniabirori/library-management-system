import { useEffect, useMemo, useState } from 'react';
import { BookStatusBadge } from '../components/Badge';
import Button, { IconButton } from '../components/Button';
import DataTable from '../components/DataTable';
import { SelectControl, SelectField, TextField } from '../components/FormFields';
import { Card, EmptyState, PageHeader } from '../components/Layout';
import { ConfirmDialog, FormModal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { SearchBox, Tabs } from '../components/Toolbar';
import { BookCover, Stack } from '../components/Visuals';
import { activeLoanByBook, indexBy } from '../data/selectors';
import { matches, newId, plural, shortId } from '../utils';

const EMPTY_FORM = { title: '', author: '', categoryId: '' };

export default function Books({ library, navigate, intent, clearIntent }) {
  const { books, categories, loans, setBooks } = library;
  const notify = useToast();

  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [status, setStatus] = useState('all');

  const [editing, setEditing] = useState(null); // null = closed, {} = new, book = edit
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    if (intent === 'new') {
      openForm({});
      clearIntent();
    }
  }, [intent]);

  const categoryById = useMemo(() => indexBy(categories), [categories]);
  const outByBook = useMemo(() => activeLoanByBook(loans), [loans]);

  const inCategory = books.filter((b) => !categoryFilter || b.categoryId === categoryFilter);
  const searched = inCategory.filter((b) => matches(query, b.title, b.author));
  const availableCount = searched.filter((b) => !outByBook.has(b.isbn)).length;
  const rows = searched.filter((b) => {
    if (status === 'available') return !outByBook.has(b.isbn);
    if (status === 'out') return outByBook.has(b.isbn);
    return true;
  });

  const categoryOptions = categories
    .map((c) => ({ value: c.id, label: c.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  function openForm(book) {
    setEditing(book);
    setForm(book.isbn ? { title: book.title, author: book.author, categoryId: book.categoryId } : EMPTY_FORM);
    setErrors({});
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function save() {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.author.trim()) next.author = 'Author is required';
    if (!form.categoryId) next.categoryId = 'Category is required';
    if (Object.keys(next).length) return setErrors(next);

    const data = { title: form.title.trim(), author: form.author.trim(), categoryId: form.categoryId };
    if (editing.isbn) {
      setBooks((list) => list.map((b) => (b.isbn === editing.isbn ? { ...b, ...data } : b)));
      notify('Book updated successfully');
    } else {
      setBooks((list) => [{ isbn: newId(), ...data }, ...list]);
      notify('Book saved successfully');
    }
    setEditing(null);
  }

  function askDelete(book) {
    if (loans.some((l) => l.bookId === book.isbn)) {
      notify('Book has loans, cannot delete', 'error');
      return;
    }
    setToDelete(book);
  }

  function confirmDelete() {
    setBooks((list) => list.filter((b) => b.isbn !== toDelete.isbn));
    notify('Book deleted successfully');
    setToDelete(null);
  }

  const columns = [
    {
      key: 'title',
      header: 'Title',
      primary: true,
      sortValue: (b) => b.title,
      render: (b) => (
        <span className="cell-media">
          <BookCover title={b.title} />
          <Stack title={b.title} sub={shortId(b.isbn)} />
        </span>
      ),
    },
    { key: 'author', header: 'Author', sortValue: (b) => b.author, render: (b) => b.author },
    {
      key: 'category',
      header: 'Category',
      sortValue: (b) => categoryById.get(b.categoryId)?.name ?? '',
      render: (b) => <span className="chip">{categoryById.get(b.categoryId)?.name ?? '—'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (b) => (outByBook.has(b.isbn) ? 1 : 0),
      render: (b) => <BookStatusBadge available={!outByBook.has(b.isbn)} />,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      actions: true,
      render: (b) => (
        <div className="row-actions">
          <IconButton icon="edit" label={`Edit ${b.title}`} onClick={() => openForm(b)} />
          <IconButton icon="trash" tone="danger" label={`Delete ${b.title}`} onClick={() => askDelete(b)} />
        </div>
      ),
    },
  ];

  const filtersOn = query || categoryFilter || status !== 'all';

  return (
    <>
      <PageHeader
        title="Books"
        description="Every title in the library, with its category and whether it is on the shelf."
        actions={
          <Button icon="plus" onClick={() => openForm({})}>
            Add book
          </Button>
        }
      />

      <Card
        title="All books"
        subtitle={`${plural(books.length, 'book')} · ${books.length - outByBook.size} available`}
        actions={
          <div className="toolbar">
            <SearchBox value={query} onChange={setQuery} placeholder="Search by title or author" label="Search books" />
            <SelectControl
              aria-label="Filter by category"
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder="All categories"
              options={categoryOptions}
            />
          </div>
        }
      >
        <div className="card-tabs">
          <Tabs
            label="Filter by status"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All', count: searched.length },
              { value: 'available', label: 'Available', count: availableCount },
              { value: 'out', label: 'On loan', count: searched.length - availableCount },
            ]}
          />
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(b) => b.isbn}
          resetKey={`${query}|${categoryFilter}|${status}`}
          caption="Books"
          empty={
            <EmptyState
              icon="book"
              title={filtersOn ? 'No books match your filters' : 'No books yet'}
              text={filtersOn ? 'Try another search or category.' : 'Add the first book to the catalogue.'}
              action={
                filtersOn && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setQuery('');
                      setCategoryFilter('');
                      setStatus('all');
                    }}
                  >
                    Clear filters
                  </Button>
                )
              }
            />
          }
        />
      </Card>

      <FormModal
        open={editing !== null}
        title={editing?.isbn ? 'Edit book' : 'Add book'}
        subtitle={editing?.isbn ? `Update the details of ${editing.title}.` : 'Add a new title to the catalogue.'}
        icon="book"
        onClose={() => setEditing(null)}
        onSubmit={save}
      >
        <TextField
          label="Title"
          required
          placeholder="e.g. Things Fall Apart"
          value={form.title}
          error={errors.title}
          onChange={(e) => update('title', e.target.value)}
        />
        <TextField
          label="Author"
          required
          placeholder="e.g. Chinua Achebe"
          value={form.author}
          error={errors.author}
          onChange={(e) => update('author', e.target.value)}
        />
        <SelectField
          label="Category"
          required
          placeholder="Select a category"
          options={categoryOptions}
          value={form.categoryId}
          error={errors.categoryId}
          hint={
            categories.length === 0 ? (
              <>
                No categories yet.{' '}
                <button type="button" className="link" onClick={() => navigate('categories', 'new')}>
                  Create one first
                </button>
              </>
            ) : undefined
          }
          onChange={(e) => update('categoryId', e.target.value)}
        />
      </FormModal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete book?"
        message={
          <>
            <strong>{toDelete?.title}</strong> by {toDelete?.author} will be removed from the catalogue.
          </>
        }
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
