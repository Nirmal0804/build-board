import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ExplorePostsPage from '../src/pages/ExplorePostsPage.jsx';
import { AuthContext } from '../src/context/AuthContext.jsx';

vi.mock('../src/services/postService.js', () => ({
  postService: {
    getPosts: vi.fn().mockResolvedValue({
      posts: [],
      pagination: { total: 0, page: 1, totalPages: 1 },
    }),
  },
}));

describe('Category Filter on Explore Page', () => {
  it('renders all categories tabs and allows switching category', async () => {
    const mockAuthContext = {
      isAuthenticated: false,
      user: null,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <ExplorePostsPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByRole('tab', { name: /all categories/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /help/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /learning/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /opportunities/i })).toBeInTheDocument();

    const helpTab = screen.getByRole('tab', { name: /help/i });
    fireEvent.click(helpTab);

    expect(helpTab).toHaveClass('active');
  });
});
