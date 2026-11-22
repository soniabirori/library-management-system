import Icon from './Icon';

/**
 * Reusable button.
 * variant: primary | secondary | ghost | danger | soft
 * size: sm | md
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...rest
}) {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, className].join(' ');
  return (
    <button type="button" className={classes} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      {children && <span>{children}</span>}
    </button>
  );
}

/** Square icon-only button for table actions. `label` is used for screen readers and the tooltip. */
export function IconButton({ icon, label, tone = 'default', className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`icon-btn icon-btn-${tone} ${className}`}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon name={icon} size={18} />
    </button>
  );
}
