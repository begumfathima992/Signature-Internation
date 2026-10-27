// Decorative 404 illustration.
export default function Illustration() {
  return (
    <svg className="illustration" viewBox="0 0 360 240" aria-hidden="true">
      <rect x="20" y="30" width="320" height="190" rx="20" className="ill-surface" />
      <rect x="20" y="30" width="320" height="40" rx="20" className="ill-tint" />
      <circle cx="48" cy="50" r="6" className="ill-dot" />
      <circle cx="68" cy="50" r="6" className="ill-dot" />
      <circle cx="88" cy="50" r="6" className="ill-dot" />
      <text x="180" y="160" textAnchor="middle" className="ill-text">
        404
      </text>
      <path d="M90 190 h180" className="ill-line" />
    </svg>
  );
}
