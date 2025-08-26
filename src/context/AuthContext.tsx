
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type AdminRole = 'super_admin' | 'admin' | 'technician';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  twoFactorEnabled?: boolean;
  twoFactorVerified?: boolean;
}

interface OAuthConfig {
  microsoftEnabled: boolean;
  microsoftClientId: string;
  microsoftTenantId: string;
  microsoftRedirectUri: string;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isAwaitingTwoFactor: boolean;
  oauthConfig: OAuthConfig;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithMicrosoft: () => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  verifyTwoFactor: (code: string) => Promise<boolean>;
  hasPermission: (requiredPermission: 'manage_admins' | 'manage_users' | 'view_only') => boolean;
  updateOAuthConfig: (config: Partial<OAuthConfig>) => Promise<boolean>;
  enableTwoFactor: () => Promise<{ secret: string, qrCode: string }>;
  disableTwoFactor: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin',
  role: 'super_admin' as AdminRole,
  twoFactorEnabled: false,
};

// Mock OAuth configuration
const DEFAULT_OAUTH_CONFIG: OAuthConfig = {
  microsoftEnabled: false,
  microsoftClientId: '',
  microsoftTenantId: '',
  microsoftRedirectUri: window.location.origin + '/auth/microsoft/callback',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [oauthConfig, setOAuthConfig] = useState<OAuthConfig>(() => {
    const storedConfig = localStorage.getItem('oauthConfig');
    return storedConfig ? JSON.parse(storedConfig) : DEFAULT_OAUTH_CONFIG;
  });
  const [isAwaitingTwoFactor, setIsAwaitingTwoFactor] = useState(false);
  const [pendingAdmin, setPendingAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        // Only set as authenticated if 2FA is not enabled or has been verified
        if (!parsedAdmin.twoFactorEnabled || parsedAdmin.twoFactorVerified) {
          setAdmin(parsedAdmin);
        }
      } catch (error) {
        console.error('Failed to parse stored admin', error);
        localStorage.removeItem('admin');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save OAuth config to localStorage when it changes
    localStorage.setItem('oauthConfig', JSON.stringify(oauthConfig));
  }, [oauthConfig]);

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
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const adminData = await response.json();
        setAdmin(adminData);
        localStorage.setItem('admin', JSON.stringify(adminData));
        toast.success('Login bem-sucedido');
        return true;
      } else {
        toast.error('Credenciais inválidas');
        return false;
      }
    } catch (error) {
      toast.error('Falha no login. Por favor, tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithMicrosoft = async (): Promise<boolean> => {
    if (!oauthConfig.microsoftEnabled || !oauthConfig.microsoftClientId || !oauthConfig.microsoftTenantId) {
      toast.error('Integração com Microsoft não está configurada');
      return false;
    }
    
    setIsLoading(true);
    try {
      // In a real app, this would redirect to Microsoft login
      // For demo, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const microsoftAdmin = {
        id: '2',
        email: 'microsoft@example.com',
        name: 'Microsoft User',
        role: 'admin' as AdminRole,
        twoFactorEnabled: false,
      };
      
      setAdmin(microsoftAdmin);
      localStorage.setItem('admin', JSON.stringify(microsoftAdmin));
      toast.success('Login com Microsoft bem-sucedido');
      return true;
    } catch (error) {
      toast.error('Falha no login com Microsoft');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTwoFactor = async (code: string): Promise<boolean> => {
    if (!pendingAdmin) {
      toast.error('Sessão expirada. Faça login novamente.');
      return false;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call to verify 2FA code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, accept any 6-digit code
      if (code.length === 6 && /^\d+$/.test(code)) {
        const verifiedAdmin = {...pendingAdmin, twoFactorVerified: true};
        setAdmin(verifiedAdmin);
        localStorage.setItem('admin', JSON.stringify(verifiedAdmin));
        setIsAwaitingTwoFactor(false);
        setPendingAdmin(null);
        return true;
      } else {
        toast.error('Código inválido');
        return false;
      }
    } catch (error) {
      toast.error('Falha na verificação. Por favor, tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    setPendingAdmin(null);
    setIsAwaitingTwoFactor(false);
    localStorage.removeItem('admin');
    toast.success('Logout realizado com sucesso');
  };

  const updateOAuthConfig = async (config: Partial<OAuthConfig>): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setOAuthConfig(prev => ({
        ...prev,
        ...config
      }));
      
      toast.success('Configurações de OAuth atualizadas com sucesso');
      return true;
    } catch (error) {
      toast.error('Falha ao atualizar configurações');
      return false;
    }
  };

  const enableTwoFactor = async (): Promise<{ secret: string, qrCode: string }> => {
    try {
      // Simulate API call to generate 2FA secret
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would generate a real secret and QR code
      const mockSecret = 'JBSWY3DPEHPK3PXP';
      const mockQrCode = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/WiFiAuth:admin@example.com?secret=JBSWY3DPEHPK3PXP&issuer=WiFiAuth';
      
      // Update admin with 2FA enabled
      if (admin) {
        const updatedAdmin = {...admin, twoFactorEnabled: true};
        setAdmin(updatedAdmin);
        localStorage.setItem('admin', JSON.stringify(updatedAdmin));
      }
      
      return { secret: mockSecret, qrCode: mockQrCode };
    } catch (error) {
      toast.error('Falha ao configurar autenticação em dois fatores');
      throw error;
    }
  };

  const disableTwoFactor = async (): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update admin with 2FA disabled
      if (admin) {
        const updatedAdmin = {...admin, twoFactorEnabled: false, twoFactorVerified: false};
        setAdmin(updatedAdmin);
        localStorage.setItem('admin', JSON.stringify(updatedAdmin));
      }
      
      toast.success('Autenticação em dois fatores desativada');
      return true;
    } catch (error) {
      toast.error('Falha ao desativar autenticação em dois fatores');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      admin, 
      isAuthenticated: !!admin, 
      isAwaitingTwoFactor,
      oauthConfig,
      login, 
      loginWithMicrosoft,
      logout,
      isLoading,
      verifyTwoFactor,
      hasPermission,
      updateOAuthConfig,
      enableTwoFactor,
      disableTwoFactor
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
