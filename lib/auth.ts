export interface User {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'manager';
}

// Simple in-memory users for demo
const demoUsers: User[] = [
  {
    id: '1',
    name: 'Dev Mer',
    email: 'dev@company.com',
    role: 'developer'
  },
  {
    id: '2',
    name: 'DJ',
    email: 'DJ@company.com',
    role: 'manager'
  }
];

// Simple in-memory auth state
let currentUser: User | null = null;

export const login = (email: string, password: string): User | null => {
  // Simple demo authentication
  const user = demoUsers.find(u => u.email === email);
  if (user && password === 'password123') {
    currentUser = user;
    return user;
  }
  return null;
};

export const logout = (): void => {
  currentUser = null;
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const isAuthenticated = (): boolean => {
  return currentUser !== null;
};