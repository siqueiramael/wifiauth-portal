
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type AdminRole = 'super_admin' | 'admin' | 'technician';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (requiredPermission: 'manage_admins' | 'manage_users' | 'view_only') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin',
  role: 'super_admin' as AdminRole,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        console.error('Failed to parse stored admin', error);
        localStorage.removeItem('admin');
      }
    }
    setIsLoading(false);
  }, []);

  const hasPermission = (requiredPermission: 'manage_admins' | 'manage_users' | 'view_only'): boolean => {
    if (!admin) return false;
    
    switch (admin.role) {
      case 'super_admin':
        return true; // Super admin has all permissions
      case 'admin':
        return requiredPermission !== 'manage_admins'; // Admin can do everything except manage other admins
      case 'technician':
        return requiredPermission === 'view_only'; // Technicians can only view
      default:
        return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, only allow login with the demo credentials
      if (email === 'admin@example.com' && password === 'password') {
        setAdmin(DEMO_ADMIN);
        localStorage.setItem('admin', JSON.stringify(DEMO_ADMIN));
        toast.success('Login successful');
        return true;
      } else {
        toast.error('Invalid credentials');
        return false;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      admin, 
      isAuthenticated: !!admin, 
      login, 
      logout,
      isLoading,
      hasPermission
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
