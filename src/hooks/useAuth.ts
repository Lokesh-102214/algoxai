/**
 * AlgoX.ai — Cognito Auth Hook
 * Uses raw Cognito REST API — no Amplify dependency required.
 * Pool: eu-north-1_Oqk1eSJFQ | Client: 33lsmrlllsr4u9pchjgl3elnb7
 */

import { useState, useCallback, useEffect } from 'react';

const COGNITO_REGION = import.meta.env.VITE_COGNITO_REGION ?? 'eu-north-1';
const CLIENT_ID = import.meta.env.VITE_COGNITO_APP_CLIENT_ID ?? '33lsmrlllsr4u9pchjgl3elnb7';
const COGNITO_ENDPOINT = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`;

export interface AuthUser {
  userId: string;       // Cognito sub
  email: string;
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresAt: number;    // epoch ms
}

type AuthState = 'loading' | 'unauthenticated' | 'authenticated';

// ── helpers ───────────────────────────────────────────────────────────────────

async function cognitoPost(target: string, body: Record<string, unknown>) {
  const res = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': target,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message ?? data.__type ?? `Cognito error ${res.status}`);
  }
  return data;
}

function parseJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

const STORAGE_KEY = 'algoxai_auth';

function loadAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const user: AuthUser = JSON.parse(raw);
    if (user.expiresAt < Date.now()) return null; // expired
    return user;
  } catch {
    return null;
  }
}

function saveAuth(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem('algoxai_user_id', user.userId);
  } else {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('algoxai_user_id');
  }
}

// ── hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadAuth();
    if (saved) {
      setUser(saved);
      setAuthState('authenticated');
    } else {
      setAuthState('unauthenticated');
    }
  }, []);

  // ── sign up ────────────────────────────────────────────────────────────────
  const signUp = useCallback(async (email: string, password: string): Promise<{ needsConfirmation: boolean }> => {
    setError(null);
    try {
      await cognitoPost('AWSCognitoIdentityProviderService.SignUp', {
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [{ Name: 'email', Value: email }],
      });
      return { needsConfirmation: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign up failed';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  // ── confirm sign up ────────────────────────────────────────────────────────
  const confirmSignUp = useCallback(async (email: string, code: string) => {
    setError(null);
    try {
      await cognitoPost('AWSCognitoIdentityProviderService.ConfirmSignUp', {
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Confirmation failed';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  // ── sign in ────────────────────────────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const data = await cognitoPost('AWSCognitoIdentityProviderService.InitiateAuth', {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: CLIENT_ID,
        AuthParameters: { USERNAME: email, PASSWORD: password },
      });

      const result = data.AuthenticationResult;
      if (!result) throw new Error('No auth result returned');

      const payload = parseJwtPayload(result.IdToken);
      const authUser: AuthUser = {
        userId: payload.sub as string,
        email: (payload.email as string) ?? email,
        accessToken: result.AccessToken,
        idToken: result.IdToken,
        refreshToken: result.RefreshToken,
        expiresAt: Date.now() + (result.ExpiresIn ?? 3600) * 1000,
      };

      saveAuth(authUser);
      setUser(authUser);
      setAuthState('authenticated');
      return authUser;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign in failed';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  // ── refresh token ──────────────────────────────────────────────────────────
  const refreshSession = useCallback(async (currentUser: AuthUser) => {
    try {
      const data = await cognitoPost('AWSCognitoIdentityProviderService.InitiateAuth', {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: CLIENT_ID,
        AuthParameters: { REFRESH_TOKEN: currentUser.refreshToken },
      });

      const result = data.AuthenticationResult;
      if (!result) return;

      const refreshed: AuthUser = {
        ...currentUser,
        accessToken: result.AccessToken,
        idToken: result.IdToken,
        expiresAt: Date.now() + (result.ExpiresIn ?? 3600) * 1000,
      };
      saveAuth(refreshed);
      setUser(refreshed);
    } catch {
      // refresh failed — sign out
      signOut();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh 5 min before expiry
  useEffect(() => {
    if (!user) return;
    const msUntilExpiry = user.expiresAt - Date.now() - 5 * 60 * 1000;
    if (msUntilExpiry <= 0) {
      refreshSession(user);
      return;
    }
    const timer = setTimeout(() => refreshSession(user), msUntilExpiry);
    return () => clearTimeout(timer);
  }, [user, refreshSession]);

  // ── sign out ───────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    if (user) {
      try {
        await cognitoPost('AWSCognitoIdentityProviderService.GlobalSignOut', {
          AccessToken: user.accessToken,
        });
      } catch { /* ignore — local sign-out still works */ }
    }
    saveAuth(null);
    setUser(null);
    setAuthState('unauthenticated');
  }, [user]);

  // ── forgot password ────────────────────────────────────────────────────────
  const forgotPassword = useCallback(async (email: string) => {
    setError(null);
    try {
      await cognitoPost('AWSCognitoIdentityProviderService.ForgotPassword', {
        ClientId: CLIENT_ID,
        Username: email,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Request failed';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  // ── confirm forgot password ────────────────────────────────────────────────
  const confirmNewPassword = useCallback(async (email: string, code: string, newPassword: string) => {
    setError(null);
    try {
      await cognitoPost('AWSCognitoIdentityProviderService.ConfirmForgotPassword', {
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Password reset failed';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  return {
    user,
    authState,
    isAuthenticated: authState === 'authenticated',
    isLoading: authState === 'loading',
    error,
    signUp,
    confirmSignUp,
    signIn,
    signOut,
    refreshSession,
    forgotPassword,
    confirmNewPassword,
  };
}
