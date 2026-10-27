// Responsive, lazy-loaded photo. Pass `priority` for the main above-the-fold image.
export default function Photo({ image, sizes = '(min-width: 1024px) 50vw, 100vw', priority = false, className }) {
  return (
    <img
      className={className}
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  );
}
