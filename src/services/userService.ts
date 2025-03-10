
import { toast } from 'sonner';

export interface WifiUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  lastLogin: string | null;
  status: 'active' | 'blocked';
}

let mockUsers: WifiUser[] = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'john.doe',
    createdAt: '2023-10-15T09:24:00Z',
    lastLogin: '2023-11-05T14:30:00Z',
    status: 'active'
  },
  {
    id: '2',
    email: 'maria@example.com',
    username: 'maria.silva',
    createdAt: '2023-09-20T11:15:00Z',
    lastLogin: '2023-11-04T08:45:00Z',
    status: 'active'
  },
  {
    id: '3',
    email: 'alex@example.com',
    username: 'alex.wang',
    createdAt: '2023-10-28T16:42:00Z',
    lastLogin: '2023-11-03T17:20:00Z',
    status: 'blocked'
  },
  {
    id: '4',
    email: 'sarah@example.com',
    username: 'sarah.jones',
    createdAt: '2023-08-05T13:10:00Z',
    lastLogin: '2023-11-01T11:05:00Z',
    status: 'active'
  },
  {
    id: '5',
    email: 'michael@example.com',
    username: 'michael.brown',
    createdAt: '2023-11-01T10:35:00Z',
    lastLogin: null,
    status: 'active'
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

export const createUser = async (userData: { email: string; username: string; password: string }): Promise<WifiUser> => {
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
      status: 'active' as const
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
