import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: Record<string, User & { password: string }> = {
  'admin@demo.com': {
    id: '1',
    email: 'admin@demo.com',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    workspaces: ['workspace-1', 'workspace-2', 'workspace-3'],
    activeWorkspace: 'workspace-1',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  'user@demo.com': {
    id: '2',
    email: 'user@demo.com',
    password: 'user123',
    name: 'John Doe',
    role: 'user',
    workspaces: ['workspace-1', 'workspace-3'],
    activeWorkspace: 'workspace-1',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers[email];
    
    if (!mockUser || mockUser.password !== password) {
      setIsLoading(false);
      throw new Error('Invalid credentials');
    }
    
    const { password: _, ...userWithoutPassword } = mockUser;
    setUser(userWithoutPassword);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const switchWorkspace = (workspaceId: string) => {
    if (user && user.workspaces.includes(workspaceId)) {
      setUser({ ...user, activeWorkspace: workspaceId });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      switchWorkspace
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};