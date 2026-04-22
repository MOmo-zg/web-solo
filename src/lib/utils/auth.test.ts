import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, register, logout, getUser, isLoggedIn } from './auth';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  localStorageMock.clear();
  mockFetch.mockClear();
});

describe('Auth Functions', () => {
  describe('login', () => {
    it('should login successfully', async () => {
      // Mock response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          user: { id: '1', username: 'testuser', email: 'test@example.com', created_at: new Date().toISOString() },
          token: 'test-token'
        })
      });

      const user = await login('test@example.com', 'password123');
      expect(user).toEqual({ id: '1', username: 'testuser', email: 'test@example.com', created_at: expect.any(String) });
      expect(localStorageMock.getItem('token')).toBe('test-token');
      expect(localStorageMock.getItem('user')).toBeDefined();
    });

    it('should throw error on login failure', async () => {
      // Mock response
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' })
      });

      await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      // Mock response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          user: { id: '1', username: 'newuser', email: 'new@example.com', created_at: new Date().toISOString() }
        })
      });

      const user = await register('newuser', 'new@example.com', 'password123');
      expect(user).toEqual({ id: '1', username: 'newuser', email: 'new@example.com', created_at: expect.any(String) });
      expect(localStorageMock.getItem('user')).toBeDefined();
    });

    it('should throw error on register failure', async () => {
      // Mock response
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Email already exists' })
      });

      await expect(register('newuser', 'existing@example.com', 'password123')).rejects.toThrow('Email already exists');
    });
  });

  describe('logout', () => {
    it('should logout successfully', () => {
      // Set up initial state
      localStorageMock.setItem('token', 'test-token');
      localStorageMock.setItem('user', JSON.stringify({ id: '1', username: 'testuser', email: 'test@example.com', created_at: new Date().toISOString() }));

      logout();

      expect(localStorageMock.getItem('token')).toBeNull();
      expect(localStorageMock.getItem('user')).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return user if logged in', () => {
      const user = { id: '1', username: 'testuser', email: 'test@example.com', created_at: new Date().toISOString() };
      localStorageMock.setItem('user', JSON.stringify(user));

      const result = getUser();
      expect(result).toEqual(user);
    });

    it('should return null if not logged in', () => {
      const result = getUser();
      expect(result).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if logged in', () => {
      localStorageMock.setItem('user', JSON.stringify({ id: '1', username: 'testuser', email: 'test@example.com', created_at: new Date().toISOString() }));
      const result = isLoggedIn();
      expect(result).toBe(true);
    });

    it('should return false if not logged in', () => {
      const result = isLoggedIn();
      expect(result).toBe(false);
    });
  });
});
