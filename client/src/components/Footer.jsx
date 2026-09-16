import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="navbar-brand">
              <div className="brand-icon">B</div>
              <span>BuildBoard</span>
            </Link>
            <p>
              A community platform for developers to share projects, ask questions, discover opportunities, and learn
              together.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Explore</h4>
              <ul>
                <li>
                  <Link to="/posts">All Discussions</Link>
                </li>
                <li>
                  <Link to="/posts?category=Projects">Projects</Link>
                </li>
                <li>
                  <Link to="/posts?category=Help">Help & QA</Link>
                </li>
                <li>
                  <Link to="/posts?category=Learning">Learning Guides</Link>
                </li>
                <li>
                  <Link to="/posts?category=Opportunities">Opportunities</Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Open Source</h4>
              <ul>
                <li>
                  <a
                    href="https://github.com/buildboard/buildboard"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/buildboard/buildboard/blob/main/CONTRIBUTING.md"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Contribution Guide
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/buildboard/buildboard/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Good First Issues
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/buildboard/buildboard/blob/main/CODE_OF_CONDUCT.md"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Code of Conduct
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            BuildBoard v0.1 &bull; Open Source under the MIT License &bull; Build. Share. Learn.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
