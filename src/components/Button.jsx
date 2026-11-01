import React from 'react';

/**
 * Keycap button: a physical key with an extruded side that presses down on click.
 * Variants: primary | outline | ghost. Sizes: sm | md | icon.
 */
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
  const classes = `key key--${variant} key--${size} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={classes}
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
    <button type={type} className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

export default Button;
