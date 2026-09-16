import { Link } from 'react-router-dom';
import Button from './Button.jsx';

export const EmptyState = ({
  icon = '📂',
  title = 'No posts found',
  description = 'Try adjusting your search or category filters.',
  actionText,
  actionTo,
  onAction,
}) => {
  return (
    <div className="empty-state" data-testid="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && actionTo && (
        <Link to={actionTo}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      )}
      {actionText && onAction && !actionTo && (
        <Button variant="secondary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
