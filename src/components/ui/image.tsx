function Image({
  className,
  source,
  alt,
}: {
  className: string;
  source: string;
  alt: string;
}) {
  return <img src={source} alt={alt} className={className} loading="lazy"/>;
}

export default Image;
