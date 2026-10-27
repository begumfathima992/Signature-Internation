export default function SectionHeading({ id, eyebrow, title, intro, align = 'left' }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {intro && <p className="section-heading__intro">{intro}</p>}
    </div>
  );
}
