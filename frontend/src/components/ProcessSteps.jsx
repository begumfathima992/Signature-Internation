import Reveal from './Reveal.jsx';

// Numbered steps shown as a row of cards.
export default function ProcessSteps({ steps }) {
  return (
    <ol className={`steps steps--row steps--${steps.length}`}>
      {steps.map((step, index) => (
        <Reveal as="li" key={step.title} className="steps__item" delay={index * 80}>
          <span className="steps__number" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}
