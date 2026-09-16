import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage.jsx';
import { AuthContext } from '../src/context/AuthContext.jsx';

describe('LoginPage Component', () => {
  it('renders email and password inputs and login button', () => {
    const mockAuthContext = {
      login: vi.fn(),
      isAuthenticated: false,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('displays validation errors when submitting empty form', async () => {
    const mockAuthContext = {
      login: vi.fn(),
      isAuthenticated: false,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
    expect(mockAuthContext.login).not.toHaveBeenCalled();
  });

  it('calls login function on valid form submission', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ id: '1', name: 'Alex' });
    const mockAuthContext = {
      login: mockLogin,
      isAuthenticated: false,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'alex@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('alex@example.com', 'password123');
    });
  });
});
