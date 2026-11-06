import { useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import PageMeta from '../components/PageMeta.jsx';
import { company } from '../data/company.js';
import { services } from '../data/services.js';

const ACCORDION_QUERY = '(max-width: 575px)';

function subscribeToAccordionQuery(onChange) {
  const query = window.matchMedia(ACCORDION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

export default function ServicesPage() {
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

          <div className="services-grid">
            {services.map((service) => (
              <ServiceColumn key={service.slug} service={service} accordion={accordion} />
            ))}
          </div>

          <div className="services-cta">
            <p>Not sure which service you need? Get free advice from our team.</p>
            <Link to="/contact" className="button button--sm services-cta__button">
              Book a free consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceColumn({ service, accordion }) {
  const [open, setOpen] = useState(false);
  const serviceUrl = `/services/${service.slug}`;
  const panelId = `${service.slug}-panel`;

  return (
    <article className="service-column">
      {accordion ? (
        <h3 className="service-column__title">
          <button
            type="button"
            className={`service-column__toggle${open ? ' is-open' : ''}`}
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
        <>
          <ServiceIcon name={service.icon} />
          <h3 className="service-column__title">{service.title}</h3>
        </>
      )}

      <div id={panelId} className="service-column__panel" hidden={accordion && !open}>
        <p className="service-column__summary">{service.columnSummary ?? service.summary}</p>
        <ul className="service-column__list" aria-label={`${service.title} include`}>
          {service.subServices.map((sub) => (
            <li key={sub.slug}>
              <Link to={`${serviceUrl}/${sub.slug}`} className="service-column__link">
                <Icon name="check" size={14} />
                {/* A non-breaking hyphen keeps "Re-engineering" whole when the name wraps. */}
                <span>{sub.title.replace(/-/g, '‑')}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to={serviceUrl} className="text-link service-column__explore">
          Explore<span className="visually-hidden"> {service.title}</span>
          <Icon name="arrowRight" size={14} />
        </Link>
      </div>
    </article>
  );
}

function ServiceIcon({ name }) {
  return (
    <span className="service-column__icon">
      <Icon name={name} size={20} />
    </span>
  );
}
