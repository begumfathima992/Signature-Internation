import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';
import PageMeta from './PageMeta.jsx';

// The page for a service or sub-service added in the admin area, which has no detailed content in
// data/services.js yet: its title and description, any items it contains, and a way to get in touch.
export default function SimpleServicePage({ breadcrumb, label, title, intro, items = [], contactLink, back }) {
  return (
    <>
      <PageMeta title={title} description={intro || `${title} from Signature International Services Limited.`} />
      <PageHeader
        breadcrumb={breadcrumb}
        label={label}
        title={title}
        intro={intro}
        actions={
          <>
            <Link to={contactLink} className="button button--primary">
              Contact us
            </Link>
            <Link to={back.to} className="button button--secondary">
              <Icon name="arrowLeft" size={18} /> {back.label}
            </Link>
          </>
        }
      />

      {items.length > 0 && (
        <section className="section section--alt" aria-labelledby="simple-items-title">
          <div className="container">
            <h2 id="simple-items-title" className="simple-service__heading">
              What we offer
            </h2>
            <ul className="simple-service__list">
              {items.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>
                    <Icon name={item.icon} size={20} />
                    <span>{item.title}</span>
                    <Icon name="arrowRight" size={18} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
