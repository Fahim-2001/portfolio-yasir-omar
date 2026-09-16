import React from 'react';

export function Tag({
  children,
  className = '',
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono border border-border bg-surface text-text-muted transition-colors select-none ${className}`}
    >
      {children}
    </span>
  );
}

export default Tag;
