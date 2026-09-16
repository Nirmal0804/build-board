export const Textarea = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  rows = 6,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className="form-textarea"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />
      {helperText && !error && (
        <span id={`${id}-helper`} className="form-helper">
          {helperText}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="form-error">
          {error}
        </span>
      )}
    </div>
  );
};

export default Textarea;
