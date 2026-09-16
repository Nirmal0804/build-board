import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { postService } from '../services/postService.js';
import { CATEGORIES } from '../utils/constants.js';
import CategoryCard from '../components/CategoryCard.jsx';
import PostCard from '../components/PostCard.jsx';
import Button from '../components/Button.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const data = await postService.getPosts({ limit: 5 });
        setLatestPosts(data.posts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/posts?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/posts');
    }
  };

  const handleCreatePostClick = () => {
    if (isAuthenticated) {
      navigate('/posts/create');
    } else {
      navigate('/login', { state: { from: { pathname: '/posts/create' } } });
    }
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const post = latestPosts.find((p) => p.id === postId);
      if (post?.isLiked) {
        const result = await postService.unlikePost(postId);
        setLatestPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, isLiked: false, likeCount: result.likeCount } : p
          )
        );
      } else {
        const result = await postService.likePost(postId);
        setLatestPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, isLiked: true, likeCount: result.likeCount } : p
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-tagline">
          Build. <span>Share.</span> Learn.
        </h1>
        <p className="hero-subtitle">
          A community for developers to share projects, ask questions, and discover opportunities.
        </p>

        <div className="hero-actions">
          <Link to="/posts">
            <Button variant="primary" size="lg">
              Explore Posts
            </Button>
          </Link>
          <Button variant="secondary" size="lg" onClick={handleCreatePostClick}>
            Create Post
          </Button>
        </div>
      </section>

      {/* Quick Search */}
      <section style={{ maxWidth: '640px', margin: '0 auto 3rem' }}>
        <form onSubmit={handleSearchSubmit} className="search-container">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            placeholder="Search discussions, topics, or projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search posts"
          />
        </form>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">Explore by Category</h2>
          <Link to="/posts" className="section-link">
            View all &rarr;
          </Link>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Latest Discussions */}
      <section style={{ marginTop: '3.5rem' }}>
        <div className="section-header">
          <h2 className="section-title">Latest Discussions</h2>
          <Link to="/posts" className="section-link">
            Explore more &rarr;
          </Link>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        {loading ? (
          <LoadingSpinner message="Loading latest discussions..." />
        ) : latestPosts.length === 0 ? (
          <EmptyState
            title="No discussions yet"
            description="Be the first developer to start a discussion!"
            actionText="Create Post"
            onAction={handleCreatePostClick}
          />
        ) : (
          <div className="posts-grid">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
