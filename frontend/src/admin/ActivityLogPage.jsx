import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import PageMeta from '../components/PageMeta.jsx';
import Modal from './Modal.jsx';
import { ACTION_LABELS, ENTITY_LABELS, changeRows, describeLog, formatDate } from './auditSummary.js';
import { useAdminRequest } from './useAdminRequest.js';

const PAGE_SIZE = 20;
const emptyFilters = { adminId: '', action: '', entityType: '', from: '', to: '' };

export default function ActivityLogPage() {
  const request = useAdminRequest();
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [selected, setSelected] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    Object.entries(filters).forEach(([key, value]) => value && query.set(key, value));
    setStatus('loading');
    request(`/api/admin/audit-logs?${query}`, { signal: controller.signal })
      .then((result) => {
        setData(result);
        setStatus('ready');
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && error.status !== 401) setStatus('error');
      });
    return () => controller.abort();
  }, [filters, page, request, reloadKey]);

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  }

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <>
      <PageMeta title="Activity log | Admin" noIndex />
      <div className="admin-page-header">
        <div>
          <h1>Activity log</h1>
          <p>Every login and every change to the services, newest first. Entries cannot be edited or deleted.</p>
        </div>
      </div>

      <form className="admin-card log-filters" onSubmit={(event) => event.preventDefault()} aria-label="Filter the log">
        <div className="field">
          <label htmlFor="filter-admin">Admin</label>
          <select id="filter-admin" value={filters.adminId} onChange={(e) => updateFilter('adminId', e.target.value)}>
            <option value="">All admins</option>
            {data?.admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-action">Action</label>
          <select id="filter-action" value={filters.action} onChange={(e) => updateFilter('action', e.target.value)}>
            <option value="">All actions</option>
            {Object.entries(ACTION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-entity">Type</label>
          <select
            id="filter-entity"
            value={filters.entityType}
            onChange={(e) => updateFilter('entityType', e.target.value)}
          >
            <option value="">Everything</option>
            {Object.entries(ENTITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-from">From</label>
          <input
            id="filter-from"
            type="date"
            value={filters.from}
            onChange={(e) => updateFilter('from', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="filter-to">To</label>
          <input
            id="filter-to"
            type="date"
            value={filters.to}
            min={filters.from || undefined}
            onChange={(e) => updateFilter('to', e.target.value)}
          />
        </div>
        <button
          type="button"
          className="button button--ghost button--xs log-filters__clear"
          onClick={() => {
            setFilters(emptyFilters);
            setPage(1);
          }}
          disabled={!hasFilters}
        >
          Clear filters
        </button>
      </form>

      <div className="admin-card admin-card--flush">
        {status === 'error' && (
          <div className="admin-empty" role="alert">
            <p>The activity log could not be loaded.</p>
            <button
              type="button"
              className="button button--secondary button--sm"
              onClick={() => setReloadKey((k) => k + 1)}
            >
              Try again
            </button>
          </div>
        )}
        {status !== 'error' && (
          <div className="table-scroll">
            <table className="log-table" aria-busy={status === 'loading'}>
              <caption className="visually-hidden">Activity log. Select an entry to see what changed.</caption>
              <thead>
                <tr>
                  <th scope="col">Date and time</th>
                  <th scope="col">Admin</th>
                  <th scope="col">Action</th>
                  <th scope="col">What changed</th>
                </tr>
              </thead>
              <tbody>
                {data?.logs.map((log) => (
                  <tr key={log.id}>
                    <td className="log-table__date">{formatDate(log.createdAt)}</td>
                    <td>{log.adminName ?? log.adminEmail}</td>
                    <td>
                      <span className={`badge badge--${log.action.toLowerCase()}`}>{ACTION_LABELS[log.action]}</span>
                    </td>
                    <td>
                      {/* The button stretches over the whole row, so clicking anywhere on it opens the details. */}
                      <button type="button" className="log-table__open" onClick={() => setSelected(log)}>
                        {describeLog(log)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {status === 'ready' && data.logs.length === 0 && (
              <p className="admin-empty">
                {hasFilters ? 'No entries match these filters.' : 'Nothing has been logged yet.'}
              </p>
            )}
          </div>
        )}

        {data && data.total > 0 && (
          <nav className="pagination" aria-label="Activity log pages">
            <span>
              {(data.page - 1) * data.pageSize + 1}–{Math.min(data.page * data.pageSize, data.total)} of {data.total}
            </span>
            <div>
              <button
                type="button"
                className="button button--secondary button--xs"
                onClick={() => setPage((current) => current - 1)}
                disabled={data.page <= 1 || status === 'loading'}
              >
                <Icon name="arrowLeft" size={16} /> Newer
              </button>
              <span className="pagination__page">
                Page {data.page} of {data.totalPages}
              </span>
              <button
                type="button"
                className="button button--secondary button--xs"
                onClick={() => setPage((current) => current + 1)}
                disabled={data.page >= data.totalPages || status === 'loading'}
              >
                Older <Icon name="arrowRight" size={16} />
              </button>
            </div>
          </nav>
        )}
      </div>

      <LogDetails log={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function LogDetails({ log, onClose }) {
  const rows = log ? changeRows(log) : [];
  const isReorder = log?.action === 'REORDER';

  return (
    <Modal open={Boolean(log)} title="Activity details" onClose={onClose} size="lg">
      {log && (
        <>
          <p className="log-details__summary">{describeLog(log)}</p>
          <dl className="log-details__meta">
            <div>
              <dt>When</dt>
              <dd>{formatDate(log.createdAt)}</dd>
            </div>
            <div>
              <dt>Admin</dt>
              <dd>{log.adminName ? `${log.adminName} (${log.adminEmail})` : log.adminEmail}</dd>
            </div>
            <div>
              <dt>Action</dt>
              <dd>
                {ACTION_LABELS[log.action]}
                {log.entityType && ` · ${ENTITY_LABELS[log.entityType]}`}
              </dd>
            </div>
            <div>
              <dt>IP address</dt>
              <dd>{log.ipAddress ?? '—'}</dd>
            </div>
            <div className="log-details__agent">
              <dt>Browser</dt>
              <dd>{log.userAgent ?? '—'}</dd>
            </div>
          </dl>

          {isReorder && (
            <div className="log-details__orders">
              {['before', 'after'].map((key) => (
                <div key={key}>
                  <h3>{key === 'before' ? 'Before' : 'After'}</h3>
                  <ol>
                    {log[key].order.map((entry) => (
                      <li key={entry.id}>{entry.title}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}

          {!isReorder && rows.length > 0 && (
            <table className="change-table">
              <caption className="visually-hidden">Values before and after this change</caption>
              <thead>
                <tr>
                  <th scope="col">Field</th>
                  <th scope="col">Before</th>
                  <th scope="col">After</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.field} className={row.changed ? 'is-changed' : undefined}>
                    <th scope="row">
                      {row.label}
                      {row.changed && <span className="visually-hidden"> (changed)</span>}
                    </th>
                    <td>{row.before}</td>
                    <td>{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isReorder && rows.length === 0 && <p className="log-details__none">No field changes for this event.</p>}
        </>
      )}
    </Modal>
  );
}
