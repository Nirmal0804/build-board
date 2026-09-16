export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{message}</span>
    </div>
  );
};

export default LoadingSpinner;
