import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { postService } from '../services/postService.js';
import { commentService } from '../services/commentService.js';
import { formatDate } from '../utils/formatDate.js';
import CommentCard from '../components/CommentCard.jsx';
import Button from '../components/Button.jsx';
import Textarea from '../components/Textarea.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Modal from '../components/Modal.jsx';

export const PostDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comment state
  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  // Like state
  const [isLiking, setIsLiking] = useState(false);

  // Delete Post Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await postService.getPostById(id);
        setPost(data);
      } catch (err) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const isOwner = user && post && (post.authorId === user.id || post.author?.id === user.id);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/posts/${id}` } } });
      return;
    }

    try {
      setIsLiking(true);
      if (post.isLiked) {
        const res = await postService.unlikePost(id);
        setPost((prev) => ({ ...prev, isLiked: false, likeCount: res.likeCount }));
      } else {
        const res = await postService.likePost(id);
        setPost((prev) => ({ ...prev, isLiked: true, likeCount: res.likeCount }));
      }
    } catch (err) {
      console.error('Failed to like post:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/posts/${id}` } } });
      return;
    }

    if (!commentContent.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    if (commentContent.trim().length > 1000) {
      setCommentError('Comment cannot exceed 1000 characters');
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentError(null);
      const newComment = await commentService.createComment(id, commentContent.trim());
      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
        commentCount: (prev.commentCount || 0) + 1,
      }));
      setCommentContent('');
    } catch (err) {
      setCommentError(err.message || 'Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setDeletingCommentId(commentId);
      await commentService.deleteComment(commentId);
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c.id !== commentId),
        commentCount: Math.max(0, (prev.commentCount || 1) - 1),
      }));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleDeletePost = async () => {
    try {
      setDeletingPost(true);
      await postService.deletePost(id);
      navigate('/posts');
    } catch (err) {
      setError(err.message || 'Failed to delete post');
      setDeleteModalOpen(false);
    } finally {
      setDeletingPost(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading discussion..." />;
  }

  if (error || !post) {
    return (
      <div style={{ maxWidth: '640px', margin: '3rem auto' }}>
        <ErrorMessage message={error || 'Discussion not found'} />
        <Link to="/posts">
          <Button variant="secondary">&larr; Back to Explore</Button>
        </Link>
      </div>
    );
  }

  const categoryClass = post.category ? `category-${post.category.toLowerCase()}` : '';

  return (
    <div className="post-detail-container">
      <Link to="/posts" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
        &larr; Back to Discussions
      </Link>

      <article className="post-detail-card">
        <div className="post-header" style={{ marginBottom: '1rem' }}>
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
              <Link to={`/profile/${post.author?.id || post.authorId}`} className="author-name">
                {post.author?.name || 'Developer'}
              </Link>
              <div className="post-date">Published on {formatDate(post.createdAt)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={`category-badge ${categoryClass}`}>{post.category}</span>
            {isOwner && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/posts/${post.id}/edit`}>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        <h1 className="post-detail-title">{post.title}</h1>

        <div className="post-detail-body">{post.content}</div>

        <div className="post-footer" style={{ marginTop: '2rem' }}>
          <div className="post-stats">
            <button
              type="button"
              className={`like-button ${post.isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={isLiking}
              aria-label={`Like post, currently ${post.likeCount || 0} likes`}
            >
              <span>{post.isLiked ? '❤️' : '🤍'}</span>
              <span>{post.likeCount || 0} Likes</span>
            </button>
            <span className="stat-item">
              <span>💬</span>
              <span>{post.comments?.length || 0} Comments</span>
            </span>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="comments-section">
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Discussion ({post.comments?.length || 0})
        </h2>

        {/* New Comment Form */}
        {isAuthenticated ? (
          <form
            onSubmit={handleAddComment}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <Textarea
              id="commentContent"
              label="Join the discussion"
              value={commentContent}
              onChange={(e) => {
                setCommentContent(e.target.value);
                setCommentError(null);
              }}
              placeholder="Share constructive feedback, answer questions, or add insights..."
              error={commentError}
              rows={3}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
              <Button type="submit" variant="primary" disabled={submittingComment}>
                {submittingComment ? 'Posting comment...' : 'Post Comment'}
              </Button>
            </div>
          </form>
        ) : (
          <div
            style={{
              padding: '1.5rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              You need to be logged in to participate in this discussion.
            </p>
            <Link to="/login" state={{ from: { pathname: `/posts/${id}` } }}>
              <Button variant="primary" size="sm">
                Log In to Comment
              </Button>
            </Link>
          </div>
        )}

        {/* Comments List */}
        {post.comments && post.comments.length > 0 ? (
          <div>
            {post.comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                onDelete={handleDeleteComment}
                isDeleting={deletingCommentId === comment.id}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: '1rem 0' }}>
            No comments yet. Start the conversation!
          </p>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Delete Post"
        onClose={() => setDeleteModalOpen(false)}
        confirmText="Delete Post"
        confirmVariant="danger"
        isConfirming={deletingPost}
        onConfirm={handleDeletePost}
      >
        <p>Are you sure you want to permanently delete this post?</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          This action cannot be undone and will remove all associated comments and likes.
        </p>
      </Modal>
    </div>
  );
};

export default PostDetailPage;
