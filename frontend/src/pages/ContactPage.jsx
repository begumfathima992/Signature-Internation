import { useSearchParams } from 'react-router-dom';
import ContactForm from '../components/ContactForm.jsx';
import Faq from '../components/Faq.jsx';
import Icon, { IconBox } from '../components/Icon.jsx';
import MapCard from '../components/MapCard.jsx';
import PageMeta from '../components/PageMeta.jsx';
import ProcessSteps from '../components/ProcessSteps.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { company } from '../data/company.js';
import { servicesFaqs } from '../data/faqs.js';
import { whyChooseUs } from '../data/highlights.js';
import { process } from '../data/process.js';
import { getServiceBySlug, getSubService } from '../data/services.js';

const nextSteps = [
  'We review your message and reply within one working day.',
  'We arrange a short call to understand your needs.',
  'We send a clear written proposal with an itemised price.',
];

export default function ContactPage() {
  const [params] = useSearchParams();
  const service = getServiceBySlug(params.get('service'));
  const topic = getSubService(service, params.get('topic'));

  return (
    <>
      <PageMeta
        title="Contact us"
        description={`Request an appointment with ${company.name}, or contact us by email, phone or WhatsApp. We reply within one working day.`}
      />
      <section className="section contact-section section--alt">
        <div className="container contact-layout">
          <div className="contact-main">
            <div className="card card--form">
              <ContactForm initialService={service?.title ?? ''} topic={topic?.title} />
            </div>

            <div className="card">
              <h2 className="card__title">What happens next?</h2>
              <ol className="numbered-list">
                {nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="contact-aside">
            <div className="card">
              <h2 className="card__title">Contact details</h2>
              <ul className="detail-list">
                <li>
                  <span className="detail-list__icon">
                    <Icon name="mail" />
                  </span>
                  <div>
                    <h3>Email</h3>
                    <a href={`mailto:${company.email}`}>{company.email}</a>
                  </div>
                </li>
                <li>
                  <span className="detail-list__icon">
                    <Icon name="phone" />
                  </span>
                  <div>
                    <h3>Phone</h3>
                    <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
                  </div>
                </li>
                <li>
                  <span className="detail-list__icon">
                    <Icon name="mapPin" />
                  </span>
                  <div>
                    <h3>Address</h3>
                    <address>
                      {company.address.map((line) => (
                        <span key={line}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </address>
                  </div>
                </li>
                <li>
                  <span className="detail-list__icon">
                    <Icon name="clock" />
                  </span>
                  <div>
                    <h3>Opening hours</h3>
                    <dl className="hours">
                      {company.hours.map((row) => (
                        <div key={row.days}>
                          <dt>{row.days}</dt>
                          <dd>{row.time}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              </ul>
            </div>

            <MapCard />

            <div className="quick-contact">
              <a href={`tel:${company.phoneHref}`} className="button button--secondary">
                <Icon name="phone" size={18} /> Call us
              </a>
              <a
                href={`https://wa.me/${company.whatsapp}`}
                className="button button--secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="messageCircle" size={18} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="why-title">
        <div className="container">
          <SectionHeading id="why-title" eyebrow="Why clients choose us" title="Straightforward to work with" />
          <ul className="feature-strip">
            {whyChooseUs.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 80} className="feature-strip__item">
                <IconBox name={item.icon} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="process-title">
        <div className="container">
          <SectionHeading
            id="process-title"
            eyebrow="Our process"
            title="How every project runs"
            intro="The same clear four steps, whichever service you choose."
          />
          <ProcessSteps steps={process} />
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="container split split--faq">
          <SectionHeading
            id="faq-title"
            eyebrow="FAQ"
            title="Common questions"
            intro="If your question is not answered here, get in touch and we will be happy to help."
          />
          <Faq items={servicesFaqs} />
        </div>
      </section>
    </>
  );
}
