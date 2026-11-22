import { useEffect, useMemo, useState } from 'react';
import { LoanStatusBadge, RoleBadge } from '../components/Badge';
import Button, { IconButton } from '../components/Button';
import DataTable from '../components/DataTable';
import { SelectField, TextField } from '../components/FormFields';
import { Card, EmptyState, PageHeader } from '../components/Layout';
import Modal, { ConfirmDialog, FormModal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { SearchBox, Tabs } from '../components/Toolbar';
import { Avatar, BookCover, Stack } from '../components/Visuals';
import { MAX_BOOKS_OUT, ROLES } from '../data/sampleData';
import { activeCountByMember, indexBy } from '../data/selectors';
import { formatDate, loanStatus, matches, newId, plural, shortId } from '../utils';

const EMPTY_FORM = { fullName: '', email: '', role: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Members({ library, intent, clearIntent }) {
  const { members, loans, books, setMembers } = library;
  const notify = useToast();

  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toDelete, setToDelete] = useState(null);
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    if (intent === 'new') {
      openForm({});
      clearIntent();
    }
  }, [intent]);

  const outByMember = useMemo(() => activeCountByMember(loans), [loans]);

  const searched = members.filter((m) => matches(query, m.fullName, m.email));
  const studentCount = searched.filter((m) => m.role === 'STUDENT').length;
  const rows = role === 'all' ? searched : searched.filter((m) => m.role === role);

  function openForm(member) {
    setEditing(member);
    setForm(member.id ? { fullName: member.fullName, email: member.email, role: member.role } : EMPTY_FORM);
    setErrors({});
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function save() {
    const next = {};
    const email = form.email.trim();
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!email) next.email = 'Email is required';
    else if (!EMAIL_PATTERN.test(email)) next.email = 'Enter a valid email address';
    else if (members.some((m) => m.email.toLowerCase() === email.toLowerCase() && m.id !== editing.id))
      next.email = 'Email already registered';
    if (!form.role) next.role = 'Role is required';
    if (Object.keys(next).length) return setErrors(next);

    const data = { fullName: form.fullName.trim(), email, role: form.role };
    if (editing.id) {
      setMembers((list) => list.map((m) => (m.id === editing.id ? { ...m, ...data } : m)));
      notify('Member updated successfully');
    } else {
      setMembers((list) => [{ id: newId(), ...data }, ...list]);
      notify('Member saved successfully');
    }
    setEditing(null);
  }

  function askDelete(member) {
    if (loans.some((l) => l.memberId === member.id)) {
      notify('Member has loans, cannot delete', 'error');
      return;
    }
    setToDelete(member);
  }

  function confirmDelete() {
    setMembers((list) => list.filter((m) => m.id !== toDelete.id));
    notify('Member deleted successfully');
    setToDelete(null);
  }

  const columns = [
    {
      key: 'name',
      header: 'Name',
      primary: true,
      sortValue: (m) => m.fullName,
      render: (m) => (
        <span className="cell-media">
          <Avatar name={m.fullName} />
          <Stack title={m.fullName} sub={shortId(m.id)} />
        </span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortValue: (m) => m.email,
      render: (m) => (
        <a className="email" href={`mailto:${m.email}`}>
          {m.email}
        </a>
      ),
    },
    { key: 'role', header: 'Role', sortValue: (m) => m.role, render: (m) => <RoleBadge role={m.role} /> },
    {
      key: 'out',
      header: 'Books out',
      sortValue: (m) => outByMember.get(m.id) || 0,
      render: (m) => <BooksOut count={outByMember.get(m.id) || 0} />,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      actions: true,
      render: (m) => (
        <div className="row-actions">
          <IconButton icon="loans" label={`View loans of ${m.fullName}`} onClick={() => setViewing(m)} />
          <IconButton icon="edit" label={`Edit ${m.fullName}`} onClick={() => openForm(m)} />
          <IconButton icon="trash" tone="danger" label={`Delete ${m.fullName}`} onClick={() => askDelete(m)} />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Members"
        description="Students and staff registered to borrow books."
        actions={
          <Button icon="plus" onClick={() => openForm({})}>
            Add member
          </Button>
        }
      />

      <Card
        title="All members"
        subtitle={`${plural(members.length, 'member')} registered`}
        actions={<SearchBox value={query} onChange={setQuery} placeholder="Search by name or email" label="Search members" />}
      >
        <div className="card-tabs">
          <Tabs
            label="Filter by role"
            value={role}
            onChange={setRole}
            options={[
              { value: 'all', label: 'All', count: searched.length },
              { value: 'STUDENT', label: 'Students', count: studentCount },
              { value: 'STAFF', label: 'Staff', count: searched.length - studentCount },
            ]}
          />
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(m) => m.id}
          resetKey={`${query}|${role}`}
          caption="Members"
          empty={
            <EmptyState
              icon="members"
              title={query || role !== 'all' ? 'No members match your filters' : 'No members yet'}
              text={query ? `Nothing matches “${query}”.` : 'Register a student or staff member.'}
            />
          }
        />
      </Card>

      <FormModal
        open={editing !== null}
        title={editing?.id ? 'Edit member' : 'Add member'}
        subtitle={editing?.id ? `Update ${editing.fullName}'s details.` : 'Register a new student or staff member.'}
        icon="members"
        onClose={() => setEditing(null)}
        onSubmit={save}
      >
        <TextField
          label="Full name"
          required
          placeholder="e.g. Aline Uwase"
          autoComplete="off"
          value={form.fullName}
          error={errors.fullName}
          onChange={(e) => update('fullName', e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          required
          icon="mail"
          placeholder="name@auca.ac.rw"
          autoComplete="off"
          value={form.email}
          error={errors.email}
          onChange={(e) => update('email', e.target.value)}
        />
        <SelectField
          label="Role"
          required
          placeholder="Select a role"
          options={ROLES.map((r) => ({ value: r, label: r }))}
          value={form.role}
          error={errors.role}
          onChange={(e) => update('role', e.target.value)}
        />
      </FormModal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete member?"
        message={
          <>
            <strong>{toDelete?.fullName}</strong> ({toDelete?.email}) will be removed.
          </>
        }
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />

      <MemberLoans member={viewing} loans={loans} books={books} onClose={() => setViewing(null)} />
    </>
  );
}

function BooksOut({ count }) {
  return (
    <span className="books-out" aria-label={`${count} of ${MAX_BOOKS_OUT} books out`}>
      {Array.from({ length: MAX_BOOKS_OUT }, (_, i) => (
        <span key={i} className={`books-out-dot ${i < count ? 'is-on' : ''} ${count >= MAX_BOOKS_OUT ? 'is-full' : ''}`} />
      ))}
      <span className="books-out-text">
        {count}/{MAX_BOOKS_OUT}
      </span>
    </span>
  );
}

/** The loans of one member, newest first (like GET /api/members/{id}/loans). */
function MemberLoans({ member, loans, books, onClose }) {
  const bookById = useMemo(() => indexBy(books, 'isbn'), [books]);
  const list = member
    ? loans.filter((l) => l.memberId === member.id).sort((a, b) => b.borrowDate.localeCompare(a.borrowDate))
    : [];

  return (
    <Modal
      open={member !== null}
      title={member?.fullName}
      subtitle={member && `${member.email} · ${plural(list.length, 'loan')}`}
      icon="loans"
      onClose={onClose}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      {list.length === 0 ? (
        <EmptyState icon="book" title="No loans yet" text="This member has not borrowed any books." />
      ) : (
        <ul className="mini-list">
          {list.map((l) => {
            const book = bookById.get(l.bookId);
            return (
              <li key={l.id} className="mini-item">
                <BookCover title={book?.title ?? '?'} size="sm" />
                <Stack
                  title={book?.title ?? 'Unknown book'}
                  sub={`${formatDate(l.borrowDate)} → ${l.returnDate ? formatDate(l.returnDate) : `due ${formatDate(l.dueDate)}`}`}
                />
                <LoanStatusBadge status={loanStatus(l)} />
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
