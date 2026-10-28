import { Link } from 'react-router-dom';
import CtaBand from '../components/CtaBand.jsx';
import Icon, { IconBox } from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Photo from '../components/Photo.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import PageMeta from '../components/PageMeta.jsx';
import { approach, mission, teams, values, whoWeAre } from '../data/about.js';
import { images } from '../data/images.js';

export default function AboutPage() {
  return (
    <>
      <PageMeta
        title="About us"
        description="Learn about Signature International Services Limited: who we are, our mission and values, how we work and the specialist teams behind our services."
      />
      <PageHeader
        label="About us"
        title="Business support built on clarity and trust"
        intro="We help organisations plan, grow and present themselves well, with practical advice and dependable delivery."
        actions={
          <Link to="/contact" className="button button--primary">
            Talk to us
          </Link>
        }
        aside={
          <div className="photo-frame photo-frame--decorated">
            <Photo image={images.office} sizes="(min-width: 1024px) 520px, 100vw" priority />
          </div>
        }
      />

      <section className="section" aria-labelledby="who-title">
        <div className="container split">
          <div>
            <SectionHeading id="who-title" eyebrow="Who we are" title={whoWeAre.title} />
            {whoWeAre.paragraphs.map((paragraph) => (
              <p key={paragraph} className="prose">
                {paragraph}
              </p>
            ))}
          </div>
          <Reveal className="mission-card">
            <IconBox name="award" size="lg" />
            <h2>{mission.title}</h2>
            <p>{mission.text}</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="values-title">
        <div className="container">
          <SectionHeading id="values-title" eyebrow="Our values" title="What guides our work" align="center" />
          <ul className="card-grid card-grid--four">
            {values.map((value, index) => (
              <Reveal as="li" key={value.title} delay={index * 80} className="card feature-card">
                <IconBox name={value.icon} />
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="approach-title">
        <div className="container split split--media">
          <Reveal className="photo-frame photo-frame--decorated">
            <Photo image={images.approach} />
          </Reveal>
          <div>
            <SectionHeading id="approach-title" eyebrow="How we work" title={approach.title} intro={approach.intro} />
            <ul className="point-list">
              {approach.points.map((point) => (
                <li key={point}>
                  <span className="checklist__icon">
                    <Icon name="check" size={16} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="teams-title">
        <div className="container">
          <SectionHeading
            id="teams-title"
            eyebrow="Our people"
            title="Our specialist teams"
            intro="Each service is delivered by a dedicated team, coordinated through a single point of contact."
            align="center"
          />
          <Reveal className="photo-frame photo-frame--banner">
            <Photo image={images.teams} sizes="(min-width: 1248px) 1200px, 100vw" />
          </Reveal>
          <ul className="card-grid card-grid--four">
            {teams.map((team, index) => (
              <Reveal as="li" key={team.title} delay={index * 80} className="card feature-card">
                <IconBox name={team.icon} />
                <h3>{team.title}</h3>
                <p>{team.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title="Let’s work together" />
    </>
  );
}
