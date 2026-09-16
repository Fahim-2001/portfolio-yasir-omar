import React from 'react';

export function SectionHeading({
  number,
  title,
  eyebrow,
  subtitle,
  className = '',
}) {
  const displayEyebrow = eyebrow || (number ? `${number} / ${title}` : null);

  return (
    <div className={`mb-12 md:mb-16 pb-6 md:pb-8 border-b border-border ${className}`}>
      {displayEyebrow && (
        <span className="font-mono text-xs uppercase tracking-widest text-text-muted block mb-2">
          {displayEyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base md:text-lg text-text-muted max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
