import { Link } from 'react-router-dom';

// Light page header with optional breadcrumb, actions and a decorative or photo aside.
export default function PageHeader({ label, title, intro, breadcrumb, actions, aside }) {
  return (
    <section className={`page-header${aside ? ' page-header--split' : ''}`}>
      <div className="container page-header__inner">
        <div className="page-header__text">
          {breadcrumb && (
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol>
                {breadcrumb.map((crumb) => (
                  <li key={crumb.label}>
                    {crumb.to ? (
                      <Link to={crumb.to}>{crumb.label}</Link>
                    ) : (
                      <span aria-current="page">{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {label && <p className="eyebrow">{label}</p>}
          <h1>{title}</h1>
          {intro && <p className="lead">{intro}</p>}
          {actions && <div className="button-row">{actions}</div>}
        </div>
        {aside && <div className="page-header__aside">{aside}</div>}
      </div>
    </section>
  );
}
