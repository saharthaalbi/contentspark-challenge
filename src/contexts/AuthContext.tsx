import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Badge } from '@/types';
import { badges } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  updateUserPoints: (points: number) => void;
  incrementTasksCompleted: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('contentboost_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: email.split('@')[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}&backgroundColor=ffdfbf`,
      totalPoints: 0,
      tasksCompleted: 0,
      streak: 0,
      isAI: false,
      badges: [],
    };
    
    setUser(newUser);
    localStorage.setItem('contentboost_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=ffdfbf`,
      totalPoints: 0,
      tasksCompleted: 0,
      streak: 1,
      isAI: false,
      badges: [badges[0]], // First Steps badge
    };
    
    setUser(newUser);
    localStorage.setItem('contentboost_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: `guest-${Date.now()}`,
      username: 'Guest User',
      email: 'guest@contentboost.app',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest&backgroundColor=ffd5dc',
      totalPoints: 50,
      tasksCompleted: 1,
      streak: 1,
      isAI: false,
      badges: [badges[0]],
    };
    
    setUser(guestUser);
    localStorage.setItem('contentboost_user', JSON.stringify(guestUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('contentboost_user');
  };

  const updateUserPoints = (points: number) => {
    if (user) {
      const updatedUser = { ...user, totalPoints: user.totalPoints + points };
      setUser(updatedUser);
      localStorage.setItem('contentboost_user', JSON.stringify(updatedUser));
    }
  };

  const incrementTasksCompleted = () => {
    if (user) {
      const updatedUser = { ...user, tasksCompleted: user.tasksCompleted + 1 };
      setUser(updatedUser);
      localStorage.setItem('contentboost_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      loginAsGuest,
      logout,
      updateUserPoints,
      incrementTasksCompleted,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
