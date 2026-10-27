import { useSearchParams } from 'react-router-dom';
import ContactForm from '../components/ContactForm.jsx';
import Icon from '../components/Icon.jsx';
import MapCard from '../components/MapCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { company } from '../data/company.js';
import { getServiceBySlug } from '../data/services.js';
import usePageMeta from '../hooks/usePageMeta.js';

const nextSteps = [
  'We review your message and reply within one working day.',
  'We arrange a short call to understand your needs.',
  'We send a clear written proposal with an itemised price.',
];

export default function ContactPage() {
  usePageMeta({
    title: 'Contact us',
    description: `Contact ${company.name} by form, email, phone or WhatsApp. We reply within one working day.`,
  });
  const [params] = useSearchParams();
  const preselected = getServiceBySlug(params.get('service'))?.title ?? '';

  return (
    <>
      <PageHeader
        label="Contact"
        title="Let’s talk about your business"
        intro="Send us a message about your requirements and we will reply within one working day."
      />

      <section className="section section--tight section--alt">
        <div className="container contact-layout">
          <div className="card card--form">
            <ContactForm initialService={preselected} />
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

            <div className="card">
              <h2 className="card__title">What happens next?</h2>
              <ol className="numbered-list">
                {nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>

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
    </>
  );
}
