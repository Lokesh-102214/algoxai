import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../AuthContext';

const TestConsumer = () => {
  const { user, loading, isConfigured } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.email : 'guest'}</span>
      <span data-testid="configured">{String(isConfigured)}</span>
    </div>
  );
};

describe('AuthContext & AuthProvider', () => {
  it('initializes gracefully in demo/guest mode without throwing', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('guest');
  });
});
