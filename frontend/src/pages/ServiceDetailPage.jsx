import { Link, useParams } from 'react-router-dom';
import CtaBand from '../components/CtaBand.jsx';
import Faq from '../components/Faq.jsx';
import Icon from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Photo from '../components/Photo.jsx';
import ProcessSteps from '../components/ProcessSteps.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import { images } from '../data/images.js';
import { getServiceBySlug } from '../data/services.js';
import usePageMeta from '../hooks/usePageMeta.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  if (!service) return <NotFoundPage />;
  return <ServiceDetail service={service} />;
}

function ServiceDetail({ service }) {
  usePageMeta({ title: service.title, description: `${service.summary} ${service.overview[0]}` });
  const contactLink = `/contact?service=${service.slug}`;

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: 'Services', to: '/' }, { label: service.title }]}
        label="Service"
        title={service.title}
        intro={service.summary}
        actions={
          <>
            <Link to={contactLink} className="button button--primary">
              Contact us about this service
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

      <section className="section" aria-labelledby="overview-title">
        <div className="container split">
          <div>
            <SectionHeading id="overview-title" eyebrow="Overview" title="What we do" />
            {service.overview.map((paragraph) => (
              <p key={paragraph} className="prose">
                {paragraph}
              </p>
            ))}
          </div>
          <Reveal className="photo-frame">
            <Photo image={images[service.detailImage]} />
          </Reveal>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="included-title">
        <div className="container">
          <SectionHeading id="included-title" eyebrow="What’s included" title="Everything covered in this service" />
          <ul className="checklist">
            {service.included.map((item, index) => (
              <Reveal as="li" key={item} delay={(index % 2) * 60}>
                <span className="checklist__icon">
                  <Icon name="check" size={18} />
                </span>
                {item}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <SectionHeading id="how-title" eyebrow="How we work" title="A clear, four-step approach" />
          <ProcessSteps steps={service.process} />
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="audience-title">
        <div className="container">
          <SectionHeading id="audience-title" eyebrow="Who this is for" title="Is this service right for you?" />
          <ul className="audience-grid">
            {service.audience.map((item, index) => (
              <Reveal as="li" key={item} delay={index * 60} className="audience-grid__item">
                <Icon name="users" size={20} />
                <span>{item}</span>
              </Reveal>
            ))}
          </ul>
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
              <ServiceCard key={relatedSlug} service={getServiceBySlug(relatedSlug)} />
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
