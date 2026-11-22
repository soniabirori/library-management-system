import Icon from './Icon';

/** Title row at the top of each page, with breadcrumb and actions. */
export function PageHeader({ title, description, actions }) {
  return (
    <div className="page-header">
      <div>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="#/dashboard">Home</a>
          <Icon name="chevronRight" size={14} />
          <span aria-current="page">{title}</span>
        </nav>
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

/** White rounded panel used for tables, forms and lists. */
export function Card({ title, subtitle, actions, className = '', children }) {
  return (
    <section className={`card ${className}`}>
      {(title || actions) && (
        <header className="card-header">
          <div>
            {title && <h2 className="card-title">{title}</h2>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function EmptyState({ icon = 'inbox', title, text, action }) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon name={icon} size={26} />
      </span>
      <p className="empty-title">{title}</p>
      {text && <p className="empty-text">{text}</p>}
      {action}
    </div>
  );
}

/** Summary number on the dashboard. tone: violet | blue | amber | rose */
export function StatCard({ icon, label, value, note, tone = 'violet' }) {
  return (
    <article className={`stat stat-${tone}`}>
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className="stat-icon">
          <Icon name={icon} size={20} />
        </span>
      </div>
      <p className="stat-value">{value}</p>
      {note && <p className="stat-note">{note}</p>}
    </article>
  );
}
