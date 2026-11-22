/** Small coloured pill. tone: violet | success | warning | danger | info | neutral */
export default function Badge({ tone = 'neutral', dot = false, children }) {
  return (
    <span className={`badge badge-${tone}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

const LOAN_STATUS = {
  active: { tone: 'violet', label: 'On loan' },
  overdue: { tone: 'danger', label: 'Overdue' },
  returned: { tone: 'success', label: 'Returned' },
};

export function LoanStatusBadge({ status }) {
  const { tone, label } = LOAN_STATUS[status];
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}

export function BookStatusBadge({ available }) {
  return available ? (
    <Badge tone="success" dot>
      Available
    </Badge>
  ) : (
    <Badge tone="warning" dot>
      On loan
    </Badge>
  );
}

export function RoleBadge({ role }) {
  return <Badge tone={role === 'STAFF' ? 'info' : 'violet'}>{role === 'STAFF' ? 'Staff' : 'Student'}</Badge>;
}
