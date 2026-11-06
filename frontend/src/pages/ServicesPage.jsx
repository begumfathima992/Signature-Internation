import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import PageMeta from '../components/PageMeta.jsx';
import Reveal from '../components/Reveal.jsx';
import { company } from '../data/company.js';
import { services } from '../data/services.js';

export default function ServicesPage() {
  return (
    <>
      <PageMeta
        title="Services"
        description="Management consultancy, web development, digital marketing, business advertisement and general business services from Signature International Services Limited."
      />
      {/* The section heading below leads the page; the h1 is for screen readers and search engines. */}
      <h1 className="visually-hidden">Services from {company.name}</h1>

      <section id="services" className="services-section" aria-labelledby="services-title">
        <header className="container services-section__header">
          <p className="services-section__label">Our services</p>
          <h2 id="services-title">Everything your business needs, in one place</h2>
          <p className="services-section__intro">
            From strategy and branding to websites, marketing and travel documentation, we support you at every stage.
          </p>
        </header>

        <div className="service-rows">
          {services.map((service, index) => (
            <ServiceRow key={service.slug} service={service} number={index + 1} />
          ))}
        </div>

        <div className="container">
          <Reveal className="services-cta">
            <div>
              <h3>Not sure which service you need?</h3>
              <p>Book a free consultation and we&rsquo;ll recommend the right solution for your business.</p>
            </div>
            <Link to="/contact" className="button services-cta__button">
              Book a free consultation
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ServiceRow({ service, number }) {
  const serviceUrl = `/services/${service.slug}`;
  return (
    <article className="service-row">
      <Reveal className="container service-row__inner">
        <div>
          <span className="service-row__icon">
            <Icon name={service.icon} size={24} />
          </span>
          <h3 className="service-row__title">
            <span className="service-row__number" aria-hidden="true">
              {String(number).padStart(2, '0')}
            </span>
            {service.title}
          </h3>
          <p className="service-row__summary">{service.summary}</p>
          <Link to={serviceUrl} className="text-link">
            Explore service<span className="visually-hidden">: {service.title}</span>
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>

        <ul className="service-row__list" aria-label={`${service.title} include`}>
          {service.subServices.map((sub) => (
            <li key={sub.slug}>
              <Link to={`${serviceUrl}/${sub.slug}`} className="service-row__link">
                <Icon name="check" size={18} />
                {/* A non-breaking hyphen keeps "Re-engineering" whole when the name wraps. */}
                <span className="service-row__name">{sub.title.replace(/-/g, '‑')}</span>
                <Icon name="arrowRight" size={16} />
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </article>
  );
}
