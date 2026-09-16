import React from 'react';

export function Card({
  children,
  className = '',
  hover = true,
  ...props
}) {
  const hoverStyles = hover
    ? 'hover:-translate-y-1 hover:border-neutral-400 dark:hover:border-neutral-500 transition-all duration-300'
    : '';

  return (
    <div
      className={`bg-surface border border-border rounded-2xl p-6 md:p-8 ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
