import ServiceCard from '../components/ServiceCard.jsx';
import PageMeta from '../components/PageMeta.jsx';
import { company } from '../data/company.js';
import { services } from '../data/services.js';

export default function ServicesPage() {
  return (
    <>
      <PageMeta
        title="Services"
        description="Management consultancy, web development, digital marketing, business advertisement and general business services from Signature International Services Limited."
      />
      <section id="services" className="section services-intro" aria-labelledby="services-title">
        <div className="container">
          {/* The cards lead the page; the heading is for screen readers and search engines. */}
          <h1 id="services-title" className="visually-hidden">
            Services from {company.name}
          </h1>
          {/* On wide screens the first card spans both rows, so all five cards fit on one screen. */}
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={service.slug} className="services-grid__item">
                <ServiceCard service={service} priority={index === 0} headingLevel={2} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
