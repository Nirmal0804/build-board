import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate.js';
import Button from './Button.jsx';

export const CommentCard = ({
  comment,
  currentUserId,
  onDelete,
  isDeleting = false,
}) => {
  const isAuthor = currentUserId && (comment.authorId === currentUserId || comment.author?.id === currentUserId);

  return (
    <div className="comment-card" data-testid="comment-card">
      <div className="comment-header">
        <div className="post-author-meta">
          <Link to={`/profile/${comment.author?.id || comment.authorId}`}>
            <img
              src={
                comment.author?.avatar ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                  comment.author?.name || 'user'
                )}`
              }
              alt={`${comment.author?.name || 'Author'}'s avatar`}
              className="author-avatar"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${comment.author?.id || comment.authorId}`}
              className="author-name"
            >
              {comment.author?.name || 'Developer'}
            </Link>
            <div className="post-date">{formatDate(comment.createdAt)}</div>
          </div>
        </div>

        {isAuthor && onDelete && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(comment.id)}
            disabled={isDeleting}
            aria-label="Delete comment"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        )}
      </div>

      <p className="comment-content">{comment.content}</p>
    </div>
  );
};

export default CommentCard;
