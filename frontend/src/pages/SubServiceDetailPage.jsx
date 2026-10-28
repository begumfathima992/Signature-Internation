import { Link, useParams } from 'react-router-dom';
import CtaBand from '../components/CtaBand.jsx';
import Faq from '../components/Faq.jsx';
import Icon, { IconBox } from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PageMeta from '../components/PageMeta.jsx';
import Photo from '../components/Photo.jsx';
import ProcessSteps from '../components/ProcessSteps.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import SubServiceCard from '../components/SubServiceCard.jsx';
import { images } from '../data/images.js';
import { getServiceBySlug, getSubService } from '../data/services.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function SubServiceDetailPage() {
  const { slug, subSlug } = useParams();
  const service = getServiceBySlug(slug);
  const sub = getSubService(service, subSlug);
  if (!sub) return <NotFoundPage />;
  return <SubServiceDetail service={service} sub={sub} />;
}

function SubServiceDetail({ service, sub }) {
  const serviceUrl = `/services/${service.slug}`;
  const contactLink = `/contact?service=${service.slug}&topic=${sub.slug}`;
  const related = service.subServices.filter((item) => item.slug !== sub.slug);

  return (
    <>
      <PageMeta title={sub.title} description={`${sub.shortDescription} Part of our ${service.title}.`} />
      <PageHeader
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Services', to: '/#services' },
          { label: service.title, to: serviceUrl },
          { label: sub.title, to: `${serviceUrl}/${sub.slug}` },
        ]}
        label={service.title}
        title={sub.title}
        intro={sub.shortDescription}
        actions={
          <>
            <Link to={contactLink} className="button button--primary">
              Contact us
            </Link>
            <Link to={serviceUrl} className="button button--secondary">
              <Icon name="arrowLeft" size={18} /> Back to {service.title}
            </Link>
          </>
        }
        aside={
          <div className="photo-frame">
            <Photo image={images[sub.image]} sizes="(min-width: 1024px) 560px, 100vw" priority />
          </div>
        }
      />

      <section className="section section--alt" aria-labelledby="overview-title">
        <div className="container split split--top">
          <div>
            <SectionHeading id="overview-title" eyebrow="Overview" title={`About ${sub.title}`} />
            {sub.overview.map((paragraph) => (
              <p key={paragraph} className="prose">
                {paragraph}
              </p>
            ))}
          </div>
          <Reveal className="card">
            <h2 className="card__title">What’s included</h2>
            <ul className="point-list">
              {sub.whatsIncluded.map((item) => (
                <li key={item}>
                  <span className="checklist__icon">
                    <Icon name="check" size={16} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <SectionHeading id="how-title" eyebrow="How we work" title="How this service runs" />
          <ProcessSteps steps={sub.process} />
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="benefits-title">
        <div className="container">
          <SectionHeading id="benefits-title" eyebrow="Benefits" title="What you gain" />
          <ul className={`feature-grid feature-grid--${sub.benefits.length}`}>
            {sub.benefits.map((benefit, index) => (
              <Reveal as="li" key={benefit.title} delay={index * 60} className="card feature-card">
                <IconBox name="badgeCheck" />
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="audience-title">
        <div className="container">
          <SectionHeading id="audience-title" eyebrow="Who this is for" title="Is this right for you?" />
          <ul className="audience-grid">
            {sub.whoItIsFor.map((item, index) => (
              <Reveal as="li" key={item} delay={index * 60} className="audience-grid__item">
                <Icon name="users" size={20} />
                <span>{item}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="sub-faq-title">
        <div className="container split split--faq">
          <SectionHeading id="sub-faq-title" eyebrow="FAQ" title={`Questions about ${sub.title}`} />
          <Faq items={sub.faqs} />
        </div>
      </section>

      <section className="section" aria-labelledby="related-title">
        <div className="container">
          <div className="section-heading-row">
            <SectionHeading id="related-title" eyebrow="Related sub-services" title={`More from ${service.title}`} />
            <Link to={serviceUrl} className="text-link text-link--back">
              <Icon name="arrowLeft" size={18} /> Back to {service.title}
            </Link>
          </div>
          <ul className="card-grid">
            {related.map((item, index) => (
              <Reveal as="li" key={item.slug} delay={(index % 3) * 60} className="card-grid__item">
                <SubServiceCard service={service} sub={item} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title={`Talk to us about ${sub.title}`}
        text="Send us a few details and we will come back to you within one working day."
        to={contactLink}
        label="Contact us"
      />
    </>
  );
}
