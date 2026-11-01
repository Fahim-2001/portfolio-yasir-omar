import React from 'react';

/** Low-profile keycap chip for metadata and tech stacks. */
export function Tag({ children, className = '', size = 'md', strong = false, icon: Icon, as: Element = 'span' }) {
  return (
    <Element className={`tag ${size === 'lg' ? 'tag--lg' : ''} ${strong ? 'tag--strong' : ''} ${className}`}>
      {Icon && <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
      {children}
    </Element>
  );
}

export default Tag;
