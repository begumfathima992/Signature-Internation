import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';

export default function CtaBand({
  title = 'Ready to talk about your project?',
  text = 'Tell us what you need. We will reply within one working day and arrange a short call.',
  to = '/contact',
  label = 'Contact us',
}) {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="cta-band">
          <div>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="button-row">
            <Link to={to} className="button button--primary">
              {label}
            </Link>
            <Link to="/" className="button button--secondary">
              View services
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
