import { Link, useParams } from 'react-router-dom';
import CtaBand from '../components/CtaBand.jsx';
import Faq from '../components/Faq.jsx';
import { IconBox } from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PageMeta from '../components/PageMeta.jsx';
import Photo from '../components/Photo.jsx';
import ProcessSteps from '../components/ProcessSteps.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import SubServiceCard from '../components/SubServiceCard.jsx';
import { images } from '../data/images.js';
import { getServiceBySlug } from '../data/services.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  if (!service) return <NotFoundPage />;
  return <ServiceDetail service={service} />;
}

function ServiceDetail({ service }) {
  const contactLink = `/contact?service=${service.slug}`;

  return (
    <>
      <PageMeta title={service.title} description={`${service.summary} ${service.overview[0]}`} />
      <PageHeader
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Services', to: '/#services' },
          { label: service.title, to: `/services/${service.slug}` },
        ]}
        label="Service"
        title={service.title}
        intro={service.summary}
        actions={
          <>
            <Link to={contactLink} className="button button--primary">
              Contact us
            </Link>
            <Link to="/" className="button button--secondary">
              All services
            </Link>
          </>
        }
      />

      <div className="container">
        <div className="photo-frame photo-frame--wide">
          <Photo image={images[service.image]} sizes="(min-width: 1248px) 1200px, 100vw" priority />
        </div>
      </div>

      <section className="section section--tight" aria-labelledby="overview-title">
        <div className="container">
          <h2 id="overview-title" className="visually-hidden">
            Overview
          </h2>
          <div className="prose-columns">
            {service.overview.map((paragraph) => (
              <p key={paragraph} className="prose">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="sub-services-title">
        <div className="container">
          <SectionHeading
            id="sub-services-title"
            eyebrow="What we offer"
            title="Choose a service to learn more"
            intro={`${service.subServices.length} specialist ${service.subServices.length === 1 ? 'service' : 'services'} within ${service.title}.`}
          />
          <ul className="card-grid">
            {service.subServices.map((sub, index) => (
              <Reveal as="li" key={sub.slug} delay={(index % 3) * 60} className="card-grid__item">
                <SubServiceCard service={service} sub={sub} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="why-title">
        <div className="container split">
          <div>
            <SectionHeading id="why-title" eyebrow="Why choose us" title="Why choose us for this service" />
            <ul className="point-list point-list--spaced">
              {service.whyChooseUs.map((item) => (
                <li key={item.title}>
                  <IconBox name={item.icon} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="photo-frame">
            <Photo image={images[service.detailImage]} />
          </Reveal>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="how-title">
        <div className="container">
          <SectionHeading id="how-title" eyebrow="How we work" title="A clear, four-step approach" />
          <ProcessSteps steps={service.process} />
        </div>
      </section>

      <section className="section" aria-labelledby="service-faq-title">
        <div className="container split split--faq">
          <SectionHeading id="service-faq-title" eyebrow="FAQ" title="Questions about this service" />
          <Faq items={service.faqs} />
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="related-title">
        <div className="container">
          <SectionHeading id="related-title" eyebrow="Related services" title="Often combined with" />
          <div className="card-grid card-grid--two">
            {service.related.map((relatedSlug) => (
              <div key={relatedSlug} className="card-grid__item">
                <ServiceCard service={getServiceBySlug(relatedSlug)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Interested in this service?"
        text="Send us a few details and we will come back to you within one working day."
        to={contactLink}
        label="Contact us"
      />
    </>
  );
}
