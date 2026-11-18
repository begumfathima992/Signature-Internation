import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.webp';
import { useContactDetails } from '../context/contact.js';
import { useServices } from '../context/services.js';
import { useSite } from '../context/site.js';
import { company } from '../data/company.js';
import Icon from './Icon.jsx';

const quickLinks = [
  { to: '/', label: 'Services' },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact us' },
];

export default function Footer() {
  const { pathname } = useLocation();
  const { openLegal, openCookieSettings } = useSite();
  const { services } = useServices();
  const { contact, status: contactStatus } = useContactDetails();
  const hideUntilLoaded = contactStatus === 'loading' ? ' is-loading' : '';

  return (
    <footer className="site-footer">
      {pathname !== '/contact' && (
        <section className="contact-strip" aria-labelledby="contact-strip-title">
          <div className="container contact-strip__inner">
            <div>
              <h2 id="contact-strip-title">Get in touch</h2>
              <p>Tell us what you need and we will reply within one working day.</p>
            </div>
            <div className="contact-strip__actions">
              <a className={`contact-strip__link${hideUntilLoaded}`} href={`tel:${contact.phoneHref}`}>
                <Icon name="phone" size={18} /> {contact.phone}
              </a>
              <Link to="/contact" className="button button--primary">
                Send a message
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="brand">
            <img className="brand__logo" src={logo} alt="" width="192" height="48" />
            <span>{company.name}</span>
          </Link>
          <p>{company.tagline}</p>
        </div>

        <nav aria-labelledby="footer-links">
          <h2 id="footer-links" className="footer__heading">
            Quick links
          </h2>
          <ul className="footer__list">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className="footer__heading">
            Services
          </h2>
          <ul className="footer__list">
            {services.map((service) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`}>{service.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="footer__heading">Contact</h2>
          <ul className={`footer__list footer__contact${hideUntilLoaded}`}>
            <li>
              <Icon name="mail" size={18} />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>
              <Icon name="phone" size={18} />
              <a href={`tel:${contact.phoneHref}`}>{contact.phone}</a>
            </li>
            <li>
              <Icon name="mapPin" size={18} />
              <address>{contact.address.join(', ')}</address>
            </li>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="footer__bottom">
          <p>
            &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <ul className="footer__legal">
            <li>
              <button type="button" className="link-button" onClick={() => openLegal('privacy')}>
                Privacy Policy
              </button>
            </li>
            <li>
              <button type="button" className="link-button" onClick={() => openLegal('terms')}>
                Terms of Use
              </button>
            </li>
            <li>
              <button type="button" className="link-button" onClick={openCookieSettings}>
                Cookie settings
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
