import { Link } from 'react-router-dom';
import Illustration from '../components/Illustration.jsx';
import { services } from '../data/services.js';
import usePageMeta from '../hooks/usePageMeta.js';

export default function NotFoundPage() {
  usePageMeta({
    title: 'Page not found',
    description: 'The page you were looking for could not be found.',
    noIndex: true,
  });

  return (
    <section className="section not-found">
      <div className="container not-found__inner">
        <Illustration />
        <p className="eyebrow">Error 404</p>
        <h1>We can’t find that page</h1>
        <p className="lead">The page may have moved, or the link may be incorrect. Try one of these instead.</p>
        <div className="button-row button-row--center">
          <Link to="/" className="button button--primary">
            View our services
          </Link>
          <Link to="/contact" className="button button--secondary">
            Contact us
          </Link>
        </div>
        <ul className="not-found__links">
          {services.map((service) => (
            <li key={service.slug}>
              <Link to={`/services/${service.slug}`}>{service.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
