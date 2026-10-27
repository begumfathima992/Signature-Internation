import { Link } from 'react-router-dom';
import { images } from '../data/images.js';
import Icon, { IconBox } from './Icon.jsx';
import Photo from './Photo.jsx';

export default function ServiceCard({ service, priority = false, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return (
    <article className="service-card">
      <div className="service-card__media">
        <Photo
          image={images[service.image]}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          priority={priority}
        />
      </div>
      <div className="service-card__body">
        <IconBox name={service.icon} />
        <Heading className="service-card__title">
          {/* The stretched link makes the whole card clickable and keyboard-focusable. */}
          <Link to={`/services/${service.slug}`} className="stretched-link">
            {service.title}
          </Link>
        </Heading>
        <p className="service-card__summary">{service.summary}</p>
        <span className="service-card__more" aria-hidden="true">
          Learn more <Icon name="arrowRight" size={18} />
        </span>
      </div>
    </article>
  );
}
