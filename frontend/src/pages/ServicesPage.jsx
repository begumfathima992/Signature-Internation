import { useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import PageMeta from '../components/PageMeta.jsx';
import { useServices } from '../context/services.js';
import { company } from '../data/company.js';

const ACCORDION_QUERY = '(max-width: 575px)';

function subscribeToAccordionQuery(onChange) {
  const query = window.matchMedia(ACCORDION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

export default function ServicesPage() {
  const { services, status } = useServices();
  const accordion = useSyncExternalStore(
    subscribeToAccordionQuery,
    () => window.matchMedia(ACCORDION_QUERY).matches,
    () => false,
  );

  return (
    <>
      <PageMeta
        title="Services"
        description="Management consultancy, web development, digital marketing, business advertisement and general business services from Signature International Services Limited."
      />
      {/* The section heading below leads the page; the h1 is for screen readers and search engines. */}
      <h1 className="visually-hidden">Services from {company.name}</h1>

      <section id="services" className="services-section" aria-labelledby="services-title">
        <div className="services-section__inner">
          <header className="services-section__header">
            <div>
              <p className="services-section__label">Our services</p>
              <h2 id="services-title">Complete business support, under one roof</h2>
            </div>
            <p className="services-section__intro">
              Consultancy, digital, branding and travel documentation services for UK businesses.
            </p>
          </header>

          <div className="services-grid" aria-busy={status === 'loading'}>
            {status === 'loading'
              ? [7, 3, 2, 4, 2].map((count, index) => <SkeletonColumn key={index} count={count} />)
              : services.map((service, index) => (
                  <ServiceColumn key={service.slug} service={service} index={index} accordion={accordion} />
                ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceColumn({ service, index, accordion }) {
  const [open, setOpen] = useState(false);
  const serviceUrl = `/services/${service.slug}`;
  const panelId = `${service.slug}-panel`;

  return (
    <article className={`service-column${open ? ' is-open' : ''}`} style={{ '--column-index': index }}>
      {accordion ? (
        <h3 className="service-column__title">
          <button
            type="button"
            className="service-column__toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((current) => !current)}
          >
            <ServiceIcon name={service.icon} />
            <span>{service.title}</span>
            <Icon name="chevronDown" size={20} />
          </button>
        </h3>
      ) : (
        <div className="service-column__header">
          <ServiceIcon name={service.icon} />
          <h3 className="service-column__title">
            <Link to={serviceUrl}>{service.title}</Link>
          </h3>
        </div>
      )}

      <div id={panelId} className="service-column__panel" hidden={accordion && !open}>
        <ul className="service-column__list" aria-label={`${service.title} include`}>
          {service.subServices.map((sub) => (
            <li key={sub.slug}>
              <Link to={`${serviceUrl}/${sub.slug}`} className="service-column__link">
                {/* A non-breaking hyphen keeps "Re-engineering" whole when the name wraps. */}
                <span>{sub.title.replace(/-/g, '‑')}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

// Placeholder shown while the services load, shaped like a real column so nothing jumps.
function SkeletonColumn({ count }) {
  return (
    <div className="service-column service-column--skeleton" aria-hidden="true">
      <div className="service-column__header">
        <span className="skeleton skeleton--icon" />
        <span className="skeleton skeleton--title" />
      </div>
      <div className="service-column__list">
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className="skeleton skeleton--line" />
        ))}
      </div>
    </div>
  );
}

function ServiceIcon({ name }) {
  return (
    <span className="service-column__icon">
      <Icon name={name} size={20} />
    </span>
  );
}
