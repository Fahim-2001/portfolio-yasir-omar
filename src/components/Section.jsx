import React from 'react';

export function Section({
  id,
  children,
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 lg:py-32 w-full relative ${className}`}
      {...props}
    >
      <div className={`max-w-6xl mx-auto px-6 md:px-8 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}

export default Section;
