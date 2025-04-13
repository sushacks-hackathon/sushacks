
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data when the app loads
    const storedUser = localStorage.getItem('ipdriveUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call - in a real app, you'd validate with a backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check local storage for user data (simulating a database)
      const users = JSON.parse(localStorage.getItem('ipdriveUsers') || '[]');
      const foundUser = users.find((u: any) => 
        u.username === username && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid username or password');
      }
      
      // Create a sanitized user object (without password)
      const authenticatedUser = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('ipdriveUser', JSON.stringify(authenticatedUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call - in a real app, you'd register with a backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if username already exists
      const users = JSON.parse(localStorage.getItem('ipdriveUsers') || '[]');
      if (users.some((u: any) => u.username === username)) {
        throw new Error('Username already exists');
      }
      
      if (users.some((u: any) => u.email === email)) {
        throw new Error('Email already registered');
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        username,
        email,
        password, // In a real app, this would be hashed
        savedInternships: [],
        savedJobs: [],
        calendarEvents: []
      };
      
      // Save to "database" (localStorage)
      users.push(newUser);
      localStorage.setItem('ipdriveUsers', JSON.stringify(users));
      
      // Create a sanitized user object (without password)
      const authenticatedUser = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('ipdriveUser', JSON.stringify(authenticatedUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ipdriveUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
