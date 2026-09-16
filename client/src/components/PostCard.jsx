import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate.js';

export const PostCard = ({ post, onLike, isLiking = false }) => {
  const categoryClass = post.category ? `category-${post.category.toLowerCase()}` : '';

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLike && !isLiking) {
      onLike(post.id);
    }
  };

  return (
    <article className="post-card" data-testid="post-card">
      <div className="post-header">
        <div className="post-author-meta">
          <Link to={`/profile/${post.author?.id || post.authorId}`}>
            <img
              src={
                post.author?.avatar ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                  post.author?.name || 'developer'
                )}`
              }
              alt={`${post.author?.name || 'Author'}'s avatar`}
              className="author-avatar"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${post.author?.id || post.authorId}`}
              className="author-name"
            >
              {post.author?.name || 'Anonymous Developer'}
            </Link>
            <div className="post-date">{formatDate(post.createdAt)}</div>
          </div>
        </div>
        <span className={`category-badge ${categoryClass}`}>
          {post.category}
        </span>
      </div>

      <Link to={`/posts/${post.id}`}>
        <h2 className="post-title">{post.title}</h2>
      </Link>

      <p className="post-snippet">{post.content}</p>

      <div className="post-footer">
        <div className="post-stats">
          <button
            type="button"
            className={`like-button ${post.isLiked ? 'liked' : ''}`}
            onClick={handleLikeClick}
            disabled={isLiking}
            aria-label={`Like post, currently ${post.likeCount || 0} likes`}
          >
            <span>{post.isLiked ? '❤️' : '🤍'}</span>
            <span>{post.likeCount || 0}</span>
          </button>
          <span className="stat-item" title="Comments">
            <span>💬</span>
            <span>{post.commentCount || 0}</span>
          </span>
        </div>
        <Link to={`/posts/${post.id}`} className="btn btn-secondary btn-sm">
          Read discussion
        </Link>
      </div>
    </article>
  );
};

export default PostCard;
