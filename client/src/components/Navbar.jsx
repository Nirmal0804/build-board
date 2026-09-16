import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from './Modal.jsx';
import Button from './Button.jsx';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="navbar" aria-label="Main Navigation">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" onClick={closeMobile}>
            <div className="brand-icon">B</div>
            <span>BuildBoard</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="navbar-links">
            <NavLink to="/posts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Explore
            </NavLink>
            <NavLink to="/posts?view=categories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Categories
            </NavLink>
            <button
              type="button"
              className="nav-link"
              onClick={() => setAboutModalOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              About
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <Link to="/posts/create">
                  <Button variant="primary" size="sm">
                    + Create Post
                  </Button>
                </Link>
                <Link to={`/profile/${user?.id}`} className="nav-link">
                  Profile
                </Link>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink to="/posts" className="nav-link" onClick={closeMobile}>
            Explore Posts
          </NavLink>
          <button
            type="button"
            className="nav-link"
            style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => {
              setAboutModalOpen(true);
              closeMobile();
            }}
          >
            About BuildBoard
          </button>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.25rem 0' }} />
          {isAuthenticated ? (
            <>
              <Link to="/posts/create" onClick={closeMobile}>
                <Button variant="primary" size="sm" style={{ width: '100%', marginBottom: '0.5rem' }}>
                  + Create Post
                </Button>
              </Link>
              <Link to={`/profile/${user?.id}`} className="nav-link" onClick={closeMobile}>
                My Profile ({user?.name})
              </Link>
              <Button variant="secondary" size="sm" onClick={handleLogout} style={{ width: '100%' }}>
                Logout
              </Button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <Link to="/login" onClick={closeMobile} style={{ flex: 1 }}>
                <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={closeMobile} style={{ flex: 1 }}>
                <Button variant="primary" size="sm" style={{ width: '100%' }}>
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* About Modal */}
      <Modal
        isOpen={aboutModalOpen}
        title="About BuildBoard"
        onClose={() => setAboutModalOpen(false)}
        confirmText="Got it"
        onConfirm={() => setAboutModalOpen(false)}
      >
        <p style={{ marginBottom: '1rem' }}>
          <strong>BuildBoard</strong> is an open-source community platform where developers share projects, ask technical
          questions, explore hackathons, and learn together.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Tagline: <em>Build. Share. Learn.</em>
        </p>
        <p>
          Built with React, Vite, Node.js, Express, and Prisma ORM. Designed to be a beginner-friendly open-source project
          for real contributors.
        </p>
      </Modal>
    </>
  );
};

export default Navbar;
