import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { postService } from '../services/postService.js';
import { CATEGORIES } from '../utils/constants.js';
import PostCard from '../components/PostCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Button from '../components/Button.jsx';

export const ExplorePostsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const activeCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [likingPostId, setLikingPostId] = useState(null);

  const fetchPosts = useCallback(async (cat, searchStr, pageNum) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: pageNum,
        limit: 10,
      };

      if (cat && cat !== 'All') {
        params.category = cat;
      }
      if (searchStr && searchStr.trim()) {
        params.search = searchStr.trim();
      }

      const data = await postService.getPosts(params);
      setPosts(data.posts || []);
      setPagination(data.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(activeCategory, searchParams.get('search') || '', page);
  }, [activeCategory, searchParams, page, fetchPosts]);

  const handleCategorySelect = (category) => {
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setPage(1);
    setSearchParams({});
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setLikingPostId(postId);
      const post = posts.find((p) => p.id === postId);
      if (post?.isLiked) {
        const result = await postService.unlikePost(postId);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, isLiked: false, likeCount: result.likeCount } : p
          )
        );
      } else {
        const result = await postService.likePost(postId);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, isLiked: true, likeCount: result.likeCount } : p
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle like on post:', err);
    } finally {
      setLikingPostId(null);
    }
  };

  return (
    <div className="explore-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Explore Discussions
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Discover projects, get help from the community, find tutorials, and discover opportunities.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="search-container" style={{ marginBottom: '1.25rem' }}>
        <span className="search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          type="search"
          placeholder="Search by title (e.g. React, Express, SQL, Hackathon)..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input"
          aria-label="Search posts by title"
        />
      </form>

      {/* Category Tabs */}
      <div className="filter-tabs" role="tablist" aria-label="Filter posts by category">
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === 'All'}
          className={`filter-tab ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => handleCategorySelect('All')}
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            className={`filter-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategorySelect(cat.id)}
          >
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Searching discussions..." />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="We couldn't find any posts matching your current filters."
          actionText="Clear all filters"
          onAction={handleClearFilters}
        />
      ) : (
        <>
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                isLiking={likingPostId === post.id}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '2.5rem',
              }}
            >
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                &larr; Previous
              </Button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              >
                Next &rarr;
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExplorePostsPage;
