
import { WifiUser } from '@/models/user';
import { delay, mockUsers, updateMockUsers } from './mockData';

/**
 * Helper function to check if a value is a Date object
 */
const isDateObject = (value: any): value is Date => {
  return value && 
         typeof value === 'object' && 
         'toISOString' in value &&
         typeof value.toISOString === 'function';
};

/**
 * Process date values for API compatibility
 */
const processDateForApi = (date: Date | string | null): string | null => {
  if (!date) return null;
  return isDateObject(date) ? date.toISOString() : String(date);
};

/**
 * Fetch all users from the API
 */
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

/**
 * Update an existing user
 */
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
    const processedExpirationDate = processDateForApi(userData.expirationDate);
    
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

/**
 * Create a new user
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
  expirationDate?: Date | string | null;
  temporaryAccess?: boolean;
  temporaryAccessDuration?: number; // in hours
  authProvider?: 'local' | 'microsoft';
}): Promise<WifiUser> => {
  try {
    // Simulate API call
    await delay(800);
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email || u.username === userData.username);
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }
    
    // Process expirationDate
    const processedExpirationDate = processDateForApi(userData.expirationDate);
    
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
      expirationDate: processedExpirationDate,
      temporaryAccess: userData.temporaryAccess || false,
      temporaryAccessDuration: userData.temporaryAccessDuration || 24, // Default 24 hours
      temporaryAccessStart: userData.temporaryAccess ? new Date().toISOString() : null,
      authProvider: userData.authProvider || 'local',
    };
    
    const updatedUsers = [...mockUsers, newUser];
    updateMockUsers(updatedUsers);
    
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Toggle a user's active status
 */
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

/**
 * Delete a user by ID
 */
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

/**
 * Update a user's assigned units
 */
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

/**
 * Create a temporary user (e.g., for Microsoft auth)
 */
export const createTemporaryUser = async (userData: {
  email: string;
  username: string;
  fullName?: string;
  temporaryAccessDuration?: number; // in hours
  authProvider: 'microsoft';
}): Promise<WifiUser> => {
  try {
    const tempExpirationDate = new Date();
    tempExpirationDate.setHours(tempExpirationDate.getHours() + (userData.temporaryAccessDuration || 24));
    
    return createUser({
      email: userData.email,
      username: userData.username,
      fullName: userData.fullName,
      unitIds: [], // No units assigned initially
      status: 'pending_approval',
      temporaryAccess: true,
      temporaryAccessDuration: userData.temporaryAccessDuration || 24,
      expirationDate: tempExpirationDate,
      authProvider: 'microsoft'
    });
  } catch (error) {
    console.error('Error creating temporary user:', error);
    throw error;
  }
};

/**
 * Approve a pending user
 */
export const approveUser = async (userId: string, unitIds: string[]): Promise<WifiUser> => {
  try {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
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
    console.error('Error approving user:', error);
    throw error;
  }
};
