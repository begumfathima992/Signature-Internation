import CtaBand from '../components/CtaBand.jsx';
import Faq from '../components/Faq.jsx';
import { IconBox } from '../components/Icon.jsx';
import ProcessSteps from '../components/ProcessSteps.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import PageMeta from '../components/PageMeta.jsx';
import { servicesFaqs } from '../data/faqs.js';
import { company } from '../data/company.js';
import { whyChooseUs } from '../data/highlights.js';
import { process } from '../data/process.js';
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
          <div className="card-grid">
            {services.map((service, index) => (
              <div key={service.slug} className="card-grid__item">
                <ServiceCard service={service} priority={index === 0} headingLevel={2} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="why-title">
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

      <section className="section" aria-labelledby="process-title">
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

      <section className="section section--alt" aria-labelledby="faq-title">
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

      <CtaBand
        title="Not sure which service you need?"
        text="Tell us about your business and we will recommend the right starting point."
      />
    </>
  );
}
