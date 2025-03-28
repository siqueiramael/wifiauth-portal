
import { WifiUser } from '@/models/user';
import { delay, mockUsers, updateMockUsers } from './mockData';

export const fetchUsers = async (): Promise<WifiUser[]> => {
  try {
    // Simulate API call
    await delay(800);
    return [...mockUsers];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

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
  status?: 'active' | 'blocked';
  expirationDate?: Date | null;
}): Promise<WifiUser> => {
  try {
    // Simulate API call
    await delay(800);
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email || u.username === userData.username);
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }
    
    const newUser: WifiUser = {
      id: String(mockUsers.length + 1),
      email: userData.email,
      username: userData.username,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      status: userData.status || 'active',
      unitIds: userData.unitIds || [],
      // Additional fields
      fullName: userData.fullName || '',
      cpf: userData.cpf || '',
      userType: userData.userType || 'wifi_user',
      phone: userData.phone || '',
      registrationNumber: userData.registrationNumber || '',
      profile: userData.profile || 'standard',
      expirationDate: userData.expirationDate ? userData.expirationDate.toISOString() : null,
    };
    
    const updatedUsers = [...mockUsers, newUser];
    updateMockUsers(updatedUsers);
    
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async ({ 
  userId, 
  userData 
}: { 
  userId: string;
  userData: Partial<WifiUser> & { 
    password?: string;
    expirationDate?: Date | string | null;
  };
}): Promise<WifiUser> => {
  try {
    await delay(800);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Process expirationDate if it exists
    let processedExpirationDate = userData.expirationDate;
    if (userData.expirationDate && userData.expirationDate instanceof Date) {
      processedExpirationDate = userData.expirationDate.toISOString();
    }
    
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
    console.error('Error updating user:', error);
    throw error;
  }
};

export const toggleUserStatus = async (userId: string): Promise<WifiUser> => {
  try {
    // Simulate API call
    await delay(600);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
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
    console.error('Error toggling user status:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Simulate API call
    await delay(600);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUsers = [
      ...mockUsers.slice(0, userIndex),
      ...mockUsers.slice(userIndex + 1)
    ];
    
    updateMockUsers(updatedUsers);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUserUnits = async (userId: string, unitIds: string[]): Promise<WifiUser> => {
  try {
    await delay(600);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
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
    console.error('Error updating user units:', error);
    throw error;
  }
};
