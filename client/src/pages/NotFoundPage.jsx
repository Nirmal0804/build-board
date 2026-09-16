import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';

export const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 1.5rem', maxWidth: '540px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '1rem 0 0.5rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link to="/">
          <Button variant="primary">Return Home</Button>
        </Link>
        <Link to="/posts">
          <Button variant="secondary">Explore Discussions</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
