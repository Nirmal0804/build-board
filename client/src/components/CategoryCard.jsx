import { Link } from 'react-router-dom';

export const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/posts?category=${encodeURIComponent(category.id)}`}
      className="category-card"
    >
      <div
        className="category-icon"
        style={{
          backgroundColor: category.bgColor || '#f1f5f9',
          color: category.color || '#4f46e5',
        }}
      >
        {category.icon || '📌'}
      </div>
      <h3 className="category-title">{category.name}</h3>
      <p className="category-desc">{category.description}</p>
    </Link>
  );
};

export default CategoryCard;
