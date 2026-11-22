import { useEffect, useMemo, useState } from 'react';
import Button, { IconButton } from '../components/Button';
import DataTable from '../components/DataTable';
import { TextField } from '../components/FormFields';
import { Card, EmptyState, PageHeader } from '../components/Layout';
import { ConfirmDialog, FormModal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { SearchBox } from '../components/Toolbar';
import { CategoryTile, Stack } from '../components/Visuals';
import { activeLoanByBook } from '../data/selectors';
import { matches, newId, plural, shortId } from '../utils';

export default function Categories({ library, intent, clearIntent }) {
  const { categories, books, loans, setCategories } = library;
  const notify = useToast();

  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, {} = new, category = edit
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    if (intent === 'new') {
      openForm({});
      clearIntent();
    }
  }, [intent]);

  const outByBook = useMemo(() => activeLoanByBook(loans), [loans]);

  const rows = useMemo(
    () =>
      categories
        .filter((c) => matches(query, c.name))
        .map((c) => {
          const catBooks = books.filter((b) => b.categoryId === c.id);
          return { ...c, bookCount: catBooks.length, outCount: catBooks.filter((b) => outByBook.has(b.isbn)).length };
        }),
    [categories, books, outByBook, query],
  );

  function openForm(category) {
    setEditing(category);
    setName(category.name || '');
    setError('');
  }

  function save() {
    const trimmed = name.trim();
    if (!trimmed) return setError('Category name is required');
    const taken = categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== editing.id);
    if (taken) return setError('Category already exists');

    if (editing.id) {
      setCategories((list) => list.map((c) => (c.id === editing.id ? { ...c, name: trimmed } : c)));
      notify('Category updated successfully');
    } else {
      setCategories((list) => [{ id: newId(), name: trimmed }, ...list]);
      notify('Category saved successfully');
    }
    setEditing(null);
  }

  function askDelete(category) {
    if (category.bookCount > 0) {
      notify('Category has books, cannot delete', 'error');
      return;
    }
    setToDelete(category);
  }

  function confirmDelete() {
    setCategories((list) => list.filter((c) => c.id !== toDelete.id));
    notify('Category deleted successfully');
    setToDelete(null);
  }

  const columns = [
    {
      key: 'name',
      header: 'Category',
      primary: true,
      sortValue: (c) => c.name,
      render: (c) => (
        <span className="cell-media">
          <CategoryTile name={c.name} />
          <Stack title={c.name} sub={shortId(c.id)} />
        </span>
      ),
    },
    {
      key: 'books',
      header: 'Books',
      sortValue: (c) => c.bookCount,
      render: (c) => <span className="num">{plural(c.bookCount, 'book')}</span>,
    },
    {
      key: 'usage',
      header: 'On loan',
      sortValue: (c) => (c.bookCount ? c.outCount / c.bookCount : 0),
      render: (c) => <UsageBar out={c.outCount} total={c.bookCount} />,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      actions: true,
      render: (c) => (
        <div className="row-actions">
          <IconButton icon="edit" label={`Edit ${c.name}`} onClick={() => openForm(c)} />
          <IconButton icon="trash" tone="danger" label={`Delete ${c.name}`} onClick={() => askDelete(c)} />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Categories"
        description="Group books by subject. Every book belongs to one category."
        actions={
          <Button icon="plus" onClick={() => openForm({})}>
            Add category
          </Button>
        }
      />

      <Card
        title="All categories"
        subtitle={`${plural(categories.length, 'category', 'categories')} in the catalogue`}
        actions={<SearchBox value={query} onChange={setQuery} placeholder="Search categories" />}
      >
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(c) => c.id}
          resetKey={query}
          caption="Categories"
          empty={
            <EmptyState
              icon="category"
              title={query ? 'No matching categories' : 'No categories yet'}
              text={query ? `Nothing matches “${query}”.` : 'Add your first category to start organising books.'}
            />
          }
        />
      </Card>

      <FormModal
        open={editing !== null}
        title={editing?.id ? 'Edit category' : 'Add category'}
        subtitle={editing?.id ? 'Rename this category.' : 'Create a new subject for books.'}
        icon="category"
        onClose={() => setEditing(null)}
        onSubmit={save}
      >
        <TextField
          label="Category name"
          required
          placeholder="e.g. Computer Science"
          value={name}
          error={error}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
        />
      </FormModal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete category?"
        message={
          <>
            <strong>{toDelete?.name}</strong> will be removed. This cannot be undone.
          </>
        }
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}

function UsageBar({ out, total }) {
  const percent = total ? Math.round((out / total) * 100) : 0;
  return (
    <span className="usage">
      <span className="usage-track">
        <span className="usage-fill" style={{ width: `${percent}%` }} />
      </span>
      <span className="usage-text">
        {out}/{total}
      </span>
    </span>
  );
}
