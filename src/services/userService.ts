import { toast } from 'sonner';
import { Site } from '@/types/controller';

export interface WifiUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  lastLogin: string | null;
  status: 'active' | 'blocked';
  unitIds: string[];
}

export interface Unit {
  id: string;
  name: string;
  siteId: string;
  controllerName: string;
  siteName: string;
  createdAt: string;
}

let mockUnits: Unit[] = [
  {
    id: '1',
    name: 'Matriz',
    siteId: 'site-123',
    controllerName: 'Controller Principal',
    siteName: 'Site Principal',
    createdAt: '2023-10-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Filial Sul',
    siteId: 'site-456',
    controllerName: 'Controller Secundário',
    siteName: 'Site Sul',
    createdAt: '2023-11-05T14:30:00Z'
  }
];

let mockUsers: WifiUser[] = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'john.doe',
    createdAt: '2023-10-15T09:24:00Z',
    lastLogin: '2023-11-05T14:30:00Z',
    status: 'active',
    unitIds: ['1']
  },
  {
    id: '2',
    email: 'maria@example.com',
    username: 'maria.silva',
    createdAt: '2023-09-20T11:15:00Z',
    lastLogin: '2023-11-04T08:45:00Z',
    status: 'active',
    unitIds: ['1', '2']
  },
  {
    id: '3',
    email: 'alex@example.com',
    username: 'alex.wang',
    createdAt: '2023-10-28T16:42:00Z',
    lastLogin: '2023-11-03T17:20:00Z',
    status: 'blocked',
    unitIds: ['2']
  },
  {
    id: '4',
    email: 'sarah@example.com',
    username: 'sarah.jones',
    createdAt: '2023-08-05T13:10:00Z',
    lastLogin: '2023-11-01T11:05:00Z',
    status: 'active',
    unitIds: []
  },
  {
    id: '5',
    email: 'michael@example.com',
    username: 'michael.brown',
    createdAt: '2023-11-01T10:35:00Z',
    lastLogin: null,
    status: 'active',
    unitIds: ['1']
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  password: string;
  unitIds: string[];
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
      status: 'active' as const,
      unitIds: userData.unitIds || []
    };
    
    mockUsers = [...mockUsers, newUser];
    
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
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
    
    mockUsers = [
      ...mockUsers.slice(0, userIndex),
      updatedUser,
      ...mockUsers.slice(userIndex + 1)
    ];
    
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
    
    mockUsers = [
      ...mockUsers.slice(0, userIndex),
      ...mockUsers.slice(userIndex + 1)
    ];
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getStats = async (): Promise<{
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  newUsersToday: number;
}> => {
  // Simulate API call
  await delay(600);
  
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const blockedUsers = mockUsers.filter(u => u.status === 'blocked').length;
  
  // Calculate "new users today" (for demo purposes, let's say 1 user was created today)
  const newUsersToday = 1;
  
  return {
    totalUsers,
    activeUsers,
    blockedUsers,
    newUsersToday
  };
};

export const fetchUnits = async (): Promise<Unit[]> => {
  try {
    await delay(600);
    return [...mockUnits];
  } catch (error) {
    console.error('Error fetching units:', error);
    throw new Error('Failed to fetch units');
  }
};

export const createUnit = async (unitData: { 
  name: string;
  siteId: string;
  controllerName: string;
  siteName: string;
}): Promise<Unit> => {
  try {
    await delay(600);
    
    const newUnit: Unit = {
      id: String(mockUnits.length + 1),
      name: unitData.name,
      siteId: unitData.siteId,
      controllerName: unitData.controllerName,
      siteName: unitData.siteName,
      createdAt: new Date().toISOString()
    };
    
    mockUnits = [...mockUnits, newUnit];
    
    return newUnit;
  } catch (error) {
    console.error('Error creating unit:', error);
    throw error;
  }
};

export const updateUnit = async (unitId: string, unitData: Partial<Unit>): Promise<Unit> => {
  try {
    await delay(600);
    
    const unitIndex = mockUnits.findIndex(u => u.id === unitId);
    if (unitIndex === -1) {
      throw new Error('Unit not found');
    }
    
    const updatedUnit = {
      ...mockUnits[unitIndex],
      ...unitData
    };
    
    mockUnits = [
      ...mockUnits.slice(0, unitIndex),
      updatedUnit,
      ...mockUnits.slice(unitIndex + 1)
    ];
    
    return updatedUnit;
  } catch (error) {
    console.error('Error updating unit:', error);
    throw error;
  }
};

export const deleteUnit = async (unitId: string): Promise<void> => {
  try {
    await delay(600);
    
    const unitIndex = mockUnits.findIndex(u => u.id === unitId);
    if (unitIndex === -1) {
      throw new Error('Unit not found');
    }
    
    mockUnits = [
      ...mockUnits.slice(0, unitIndex),
      ...mockUnits.slice(unitIndex + 1)
    ];
    
    // Remove this unit from all users
    mockUsers = mockUsers.map(user => ({
      ...user,
      unitIds: user.unitIds.filter(id => id !== unitId)
    }));
  } catch (error) {
    console.error('Error deleting unit:', error);
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
    
    mockUsers = [
      ...mockUsers.slice(0, userIndex),
      updatedUser,
      ...mockUsers.slice(userIndex + 1)
    ];
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user units:', error);
    throw error;
  }
};
