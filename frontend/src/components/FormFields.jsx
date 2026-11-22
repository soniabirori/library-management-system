import { useId } from 'react';
import Icon from './Icon';

/** Label + control + error message. Every form field goes through this. */
function Field({ id, label, error, hint, required, children }) {
  return (
    <div className={`field ${error ? 'field-error' : ''}`}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="field-required" aria-hidden="true">*</span>}
      </label>
      {children}
      {error ? (
        <p className="field-message" id={`${id}-msg`} role="alert">
          <Icon name="alert" size={14} />
          {error}
        </p>
      ) : (
        hint && (
          <p className="field-hint" id={`${id}-msg`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function TextField({ label, error, hint, required, icon, ...rest }) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required}>
      <div className={`control ${icon ? 'control-with-icon' : ''}`}>
        {icon && <Icon name={icon} size={18} className="control-icon" />}
        <input
          id={id}
          className="input"
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          {...rest}
        />
      </div>
    </Field>
  );
}

/**
 * Dropdown. `options` is a list of { value, label } or, for grouped lists,
 * { group, options: [...] }.
 */
export function SelectField({ label, error, hint, required, options, placeholder, ...rest }) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required}>
      <SelectControl id={id} options={options} placeholder={placeholder} invalid={Boolean(error)}
        describedBy={error || hint ? `${id}-msg` : undefined} {...rest} />
    </Field>
  );
}

/** The bare styled <select>, also used for filters that have no visible label. */
export function SelectControl({ options, placeholder, invalid, describedBy, className = '', ...rest }) {
  return (
    <div className={`control control-select ${className}`}>
      <select className="input" aria-invalid={invalid} aria-describedby={describedBy} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((opt) =>
          opt.group ? (
            <optgroup key={opt.group} label={opt.group}>
              {opt.options.map((o) => (
                <option key={o.value} value={o.value} disabled={o.disabled}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          ) : (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ),
        )}
      </select>
      <Icon name="chevronDown" size={16} className="control-chevron" />
    </div>
  );
}
