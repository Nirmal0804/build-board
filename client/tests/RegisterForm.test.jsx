import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../src/pages/RegisterPage.jsx';
import { AuthContext } from '../src/context/AuthContext.jsx';

describe('RegisterPage Component', () => {
  it('renders all required registration fields', () => {
    const mockAuthContext = {
      register: vi.fn(),
      isAuthenticated: false,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <RegisterPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('validates password minimum length and password mismatch', async () => {
    const mockAuthContext = {
      register: vi.fn(),
      isAuthenticated: false,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <RegisterPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: 'Alex Rivera' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'alex@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'different' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/must be at least 6 characters long/i)).toBeInTheDocument();
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockAuthContext.register).not.toHaveBeenCalled();
  });

  it('calls register on valid registration input', async () => {
    const mockRegister = vi.fn().mockResolvedValue({ id: '1' });
    const mockAuthContext = {
      register: mockRegister,
      isAuthenticated: false,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <RegisterPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: 'Alex Rivera' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'alex@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'securePass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'securePass123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('Alex Rivera', 'alex@example.com', 'securePass123');
    });
  });
});
