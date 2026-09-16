import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostCard from '../src/components/PostCard.jsx';

const mockPost = {
  id: 'post-101',
  title: 'Building a Full-Stack Open Source Project',
  content: 'Here is a detailed guide on structuring monorepos with React and Express.',
  category: 'Projects',
  createdAt: '2025-01-15T12:00:00.000Z',
  author: {
    id: 'user-1',
    name: 'Alex Rivera',
    avatar: 'https://avatar.url/alex.png',
  },
  likeCount: 14,
  commentCount: 5,
  isLiked: false,
};

describe('PostCard Component', () => {
  it('renders post title, author name, category, and counters', () => {
    render(
      <BrowserRouter>
        <PostCard post={mockPost} />
      </BrowserRouter>
    );

    expect(screen.getByText('Building a Full-Stack Open Source Project')).toBeInTheDocument();
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('triggers onLike callback when like button is clicked', () => {
    const handleLike = vi.fn();

    render(
      <BrowserRouter>
        <PostCard post={mockPost} onLike={handleLike} />
      </BrowserRouter>
    );

    const likeButton = screen.getByRole('button', { name: /like post/i });
    fireEvent.click(likeButton);

    expect(handleLike).toHaveBeenCalledTimes(1);
    expect(handleLike).toHaveBeenCalledWith('post-101');
  });
});
