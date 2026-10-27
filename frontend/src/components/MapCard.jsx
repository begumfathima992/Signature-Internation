import { useSite } from '../context/site.js';
import { company } from '../data/company.js';
import Icon from './Icon.jsx';

// Shows the Google Maps embed only when the feature flag is on, an embed URL is set,
// and the visitor has accepted cookies. Otherwise shows a light placeholder.
export default function MapCard() {
  const { consent, openCookieSettings } = useSite();
  const { enabled, embedUrl, linkUrl } = company.map;
  const showMap = enabled && embedUrl && consent === 'accepted';

  return (
    <div className="card map-card">
      {showMap ? (
        <iframe
          title={`Map showing the location of ${company.name}`}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="map-card__placeholder">
          <svg className="map-card__art" viewBox="0 0 320 160" aria-hidden="true">
            <path d="M0 110 C60 90 90 130 160 105 S260 70 320 95" />
            <path d="M0 50 C70 70 120 30 190 55 S280 60 320 40" />
            <path d="M110 0 L130 160 M220 0 L200 160" />
          </svg>
          <span className="map-card__pin">
            <Icon name="mapPin" size={22} />
          </span>
          <p className="map-card__address">{company.address.join(', ')}</p>
          <div className="map-card__actions">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="button button--secondary button--sm">
              Open in Google Maps
            </a>
            {enabled && embedUrl && consent !== 'accepted' && (
              <button type="button" className="link-button" onClick={openCookieSettings}>
                Accept cookies to show the map
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
