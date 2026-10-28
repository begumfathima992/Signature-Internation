import { Link } from 'react-router-dom';
import { images } from '../data/images.js';
import Icon, { IconBox } from './Icon.jsx';
import Photo from './Photo.jsx';

// A sub-service card for service pages: same look as ServiceCard, linking to the sub-service page.
export default function SubServiceCard({ service, sub }) {
  return (
    <article className="service-card service-card--sub">
      <div className="service-card__media">
        <Photo image={images[sub.image]} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" />
      </div>
      <div className="service-card__body">
        <IconBox name={sub.icon} />
        <h3 className="service-card__title">
          <Link to={`/services/${service.slug}/${sub.slug}`} className="stretched-link">
            {sub.title}
          </Link>
        </h3>
        <p className="service-card__summary">{sub.shortDescription}</p>
        <span className="service-card__more" aria-hidden="true">
          Learn more <Icon name="arrowRight" size={18} />
        </span>
      </div>
    </article>
  );
}
