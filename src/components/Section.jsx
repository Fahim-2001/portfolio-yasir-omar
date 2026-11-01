import React from 'react';

export function Section({ id, children, className = '', containerClassName = '', ...props }) {
  return (
    <section
      id={id}
      className={`relative w-full scroll-mt-20 py-20 md:py-28 lg:py-36 ${className}`}
      {...props}
    >
      <div className={`mx-auto max-w-6xl px-5 sm:px-6 md:px-8 ${containerClassName}`}>{children}</div>
    </section>
  );
}

export default Section;
