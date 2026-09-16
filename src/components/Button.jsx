import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  external = false,
  download = false,
  type = 'button',
  ...props
}) {
  const baseStyles =
    'group inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
  }[size] || 'px-5 py-2.5 text-sm gap-2';

  const variantStyles = {
    primary:
      'bg-text text-bg border border-text hover:opacity-90 active:scale-[0.98]',
    outline:
      'border border-border bg-transparent text-text hover:border-text hover:bg-surface active:scale-[0.98]',
    ghost:
      'bg-transparent text-text-muted hover:text-text hover:bg-surface active:scale-[0.98]',
  }[variant] || '';

  const combinedClasses = `${baseStyles} ${sizeStyles} ${variantStyles} ${className}`;

  if (href) {
    const isAnchor = href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:');
    return (
      <a
        href={href}
        className={combinedClasses}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        download={download ? true : undefined}
        onClick={onClick}
        {...props}
      >
        {children}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
