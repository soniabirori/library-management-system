import Icon from './Icon';

/** Search input with an icon and a clear button. */
export function SearchBox({ value, onChange, placeholder = 'Search…', label = 'Search' }) {
  return (
    <div className="search">
      <Icon name="search" size={18} className="search-icon" />
      <input
        type="search"
        className="search-input"
        value={value}
        placeholder={placeholder}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="search-clear" onClick={() => onChange('')} aria-label="Clear search">
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}

/** Pill-style filter tabs, e.g. All / Available / On loan. */
export function Tabs({ options, value, onChange, label }) {
  return (
    <div className="tabs" role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`tab ${value === opt.value ? 'is-active' : ''}`}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
          {opt.count !== undefined && <span className="tab-count">{opt.count}</span>}
        </button>
      ))}
    </div>
  );
}
