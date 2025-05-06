
import { WifiUser } from '@/models/user';
import { delay, mockUsers, updateMockUsers } from './mockData';
import { format, addDays } from 'date-fns';

/**
 * Processa data para formato compatível com a API
 */
const processDateForApi = (date: Date | string | null): string | null => {
  if (!date) return null;
  
  try {
    // Se for um objeto Date, converte para string ISO
    if (date instanceof Date) {
      return date.toISOString();
    }
    // Se já for uma string, retorna como está
    return String(date);
  } catch (error) {
    console.error('Erro ao processar data:', error);
    return null;
  }
};

/**
 * Busca todos os usuários
 */
export const fetchUsers = async (): Promise<WifiUser[]> => {
  try {
    await delay(800);
    return [...mockUsers];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error('Falha ao buscar usuários');
  }
};

/**
 * Atualiza um usuário existente
 */
export const updateUser = async ({ 
  userId, 
  userData 
}: { 
  userId: string;
  userData: Partial<WifiUser> & { 
    password?: string;
    expirationDate?: string | null;
  };
}): Promise<WifiUser> => {
  try {
    await delay(800);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }
    
    // Não precisamos mais processar a data, pois ela já deve vir como string
    const processedExpirationDate = userData.expirationDate;
    
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      expirationDate: processedExpirationDate
    };
    
    const updatedUsers = [
      ...mockUsers.slice(0, userIndex),
      updatedUser,
      ...mockUsers.slice(userIndex + 1)
    ];
    
    updateMockUsers(updatedUsers);
    
    return updatedUser;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

/**
 * Cria um novo usuário
 */
export const createUser = async (userData: { 
  email: string; 
  username: string; 
  password?: string;
  unitIds: string[];
  fullName?: string;
  cpf?: string;
  userType?: string;
  phone?: string;
  registrationNumber?: string;
  grantWifiAccess?: boolean;
  profile?: string;
  status?: 'active' | 'blocked' | 'pending_approval';
  expirationDate?: string | null;
  temporaryAccess?: boolean;
  temporaryAccessDuration?: number;
  authProvider?: 'local' | 'microsoft';
}): Promise<WifiUser> => {
  try {
    await delay(800);
    
    // Verifica se o usuário já existe
    const existingUser = mockUsers.find(u => u.email === userData.email || u.username === userData.username);
    if (existingUser) {
      throw new Error('Usuário com este email ou nome de usuário já existe');
    }
    
    // Não precisamos mais processar a data, pois ela já deve vir como string
    const processedExpirationDate = userData.expirationDate;
    
    const newUser: WifiUser = {
      id: String(mockUsers.length + 1),
      email: userData.email,
      username: userData.username,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      status: userData.status || 'active',
      unitIds: userData.unitIds || [],
      // Campos adicionais
      fullName: userData.fullName || '',
      cpf: userData.cpf || '',
      userType: userData.userType || 'wifi_user',
      phone: userData.phone || '',
      registrationNumber: userData.registrationNumber || '',
      profile: userData.profile || 'standard',
      expirationDate: processedExpirationDate,
      temporaryAccess: userData.temporaryAccess || false,
      temporaryAccessDuration: userData.temporaryAccessDuration || 24, // Padrão 24 horas
      temporaryAccessStart: userData.temporaryAccess ? new Date().toISOString() : null,
      authProvider: userData.authProvider || 'local',
    };
    
    const updatedUsers = [...mockUsers, newUser];
    updateMockUsers(updatedUsers);
    
    return newUser;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

/**
 * Alterna o status de um usuário
 */
export const toggleUserStatus = async (userId: string): Promise<WifiUser> => {
  try {
    await delay(600);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }
    
    const updatedUser = {
      ...mockUsers[userIndex],
      status: mockUsers[userIndex].status === 'active' ? 'blocked' as const : 'active' as const
    };
    
    const updatedUsers = [
      ...mockUsers.slice(0, userIndex),
      updatedUser,
      ...mockUsers.slice(userIndex + 1)
    ];
    
    updateMockUsers(updatedUsers);
    
    return updatedUser;
  } catch (error) {
    console.error('Erro ao alternar status do usuário:', error);
    throw error;
  }
};

/**
 * Exclui um usuário pelo ID
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await delay(600);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }
    
    const updatedUsers = [
      ...mockUsers.slice(0, userIndex),
      ...mockUsers.slice(userIndex + 1)
    ];
    
    updateMockUsers(updatedUsers);
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
};

/**
 * Atualiza as unidades atribuídas a um usuário
 */
export const updateUserUnits = async (userId: string, unitIds: string[]): Promise<WifiUser> => {
  try {
    await delay(600);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }
    
    const updatedUser = {
      ...mockUsers[userIndex],
      unitIds
    };
    
    const updatedUsers = [
      ...mockUsers.slice(0, userIndex),
      updatedUser,
      ...mockUsers.slice(userIndex + 1)
    ];
    
    updateMockUsers(updatedUsers);
    
    return updatedUser;
  } catch (error) {
    console.error('Erro ao atualizar unidades do usuário:', error);
    throw error;
  }
};

/**
 * Cria um usuário temporário (ex: para autenticação Microsoft)
 */
export const createTemporaryUser = async (userData: {
  email: string;
  username: string;
  fullName?: string;
  temporaryAccessDuration?: number;
  authProvider: 'microsoft';
}): Promise<WifiUser> => {
  try {
    const tempExpirationDate = new Date();
    tempExpirationDate.setHours(tempExpirationDate.getHours() + (userData.temporaryAccessDuration || 24));
    
    return createUser({
      email: userData.email,
      username: userData.username,
      fullName: userData.fullName,
      unitIds: [],
      status: 'pending_approval',
      temporaryAccess: true,
      temporaryAccessDuration: userData.temporaryAccessDuration || 24,
      expirationDate: tempExpirationDate,
      authProvider: 'microsoft'
    });
  } catch (error) {
    console.error('Erro ao criar usuário temporário:', error);
    throw error;
  }
};

/**
 * Aprova um usuário pendente
 */
export const approveUser = async (userId: string, unitIds: string[]): Promise<WifiUser> => {
  try {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }
    
    const updatedUser = {
      ...mockUsers[userIndex],
      status: 'active' as const,
      temporaryAccess: false,
      temporaryAccessStart: null,
      unitIds
    };
    
    const updatedUsers = [
      ...mockUsers.slice(0, userIndex),
      updatedUser,
      ...mockUsers.slice(userIndex + 1)
    ];
    
    updateMockUsers(updatedUsers);
    
    return updatedUser;
  } catch (error) {
    console.error('Erro ao aprovar usuário:', error);
    throw error;
  }
};
