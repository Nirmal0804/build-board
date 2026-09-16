import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from '../src/components/EmptyState.jsx';

describe('EmptyState Component', () => {
  it('renders custom title, description, and action button', () => {
    const handleAction = vi.fn();

    render(
      <EmptyState
        title="No discussions found"
        description="Try adjusting your search criteria."
        actionText="Reset Search"
        onAction={handleAction}
      />
    );

    expect(screen.getByText('No discussions found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria.')).toBeInTheDocument();
    const actionBtn = screen.getByRole('button', { name: /reset search/i });
    expect(actionBtn).toBeInTheDocument();

    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
