import { useEffect, useState } from 'react';
import Icon from './Icon';
import { SelectControl } from './FormFields';
import { EmptyState } from './Layout';

const PAGE_SIZES = [5, 8, 10, 20];

/**
 * Reusable table with sorting and pagination.
 *
 * columns: [{ key, header, render(row), sortValue?(row), align?, primary?, actions?, hideOnMobile? }]
 *  - primary: shown as the card heading on small screens
 *  - actions: the buttons column, shown at the bottom of the card on small screens
 * resetKey: when it changes (e.g. the search text), go back to page 1.
 */
export default function DataTable({
  columns,
  rows,
  rowKey,
  pageSize: initialPageSize = 8,
  paginate = true,
  resetKey,
  empty,
  caption,
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState({ key: null, dir: 'asc' });

  useEffect(() => setPage(1), [resetKey]);

  const sortColumn = columns.find((c) => c.key === sort.key);
  const sorted = sortColumn
    ? [...rows].sort((a, b) => {
        const x = sortColumn.sortValue(a);
        const y = sortColumn.sortValue(b);
        const result = typeof x === 'number' ? x - y : String(x).localeCompare(String(y));
        return sort.dir === 'asc' ? result : -result;
      })
    : rows;

  const totalPages = paginate ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const current = Math.min(page, totalPages);
  const visible = paginate ? sorted.slice((current - 1) * pageSize, current * pageSize) : sorted;

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  if (rows.length === 0) {
    return empty ?? <EmptyState title="Nothing here yet" />;
  }

  return (
    <>
      <div className="table-wrap">
        <table className="table">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`${col.align ? `align-${col.align}` : ''}`}
                  aria-sort={sort.key === col.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {col.sortValue ? (
                    <button type="button" className="th-sort" onClick={() => toggleSort(col.key)}>
                      {col.header}
                      <Icon
                        name="chevronDown"
                        size={14}
                        className={`sort-icon ${sort.key === col.key ? `is-${sort.dir}` : ''}`}
                      />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    data-label={col.header}
                    className={[
                      col.align ? `align-${col.align}` : '',
                      col.primary ? 'cell-primary' : '',
                      col.actions ? 'cell-actions' : '',
                      col.hideOnMobile ? 'hide-mobile' : '',
                    ].join(' ')}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginate && (
        <Pagination
          page={current}
          totalPages={totalPages}
          total={sorted.length}
          pageSize={pageSize}
          onPage={setPage}
          onPageSize={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      )}
    </>
  );
}

/** [1, '…', 4, 5, 6, '…', 20] */
function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('…');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push('…');
  pages.push(total);
  return pages;
}

function Pagination({ page, totalPages, total, pageSize, onPage, onPageSize }) {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <div className="pagination">
      <p className="pagination-info">
        Showing <strong>{from}–{to}</strong> of <strong>{total}</strong>
      </p>
      <nav className="pagination-pages" aria-label="Pagination">
        <button type="button" className="page-btn" onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="Previous page">
          <Icon name="chevronLeft" size={16} />
        </button>
        {pageList(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="page-gap">…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`page-btn ${p === page ? 'is-active' : ''}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          ),
        )}
        <button type="button" className="page-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages} aria-label="Next page">
          <Icon name="chevronRight" size={16} />
        </button>
      </nav>
      <SelectControl
        className="pagination-size"
        aria-label="Rows per page"
        value={pageSize}
        onChange={(e) => onPageSize(Number(e.target.value))}
        options={PAGE_SIZES.map((s) => ({ value: s, label: `${s} / page` }))}
      />
    </div>
  );
}
