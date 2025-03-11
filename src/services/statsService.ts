
import { Stats } from '@/models/user';
import { delay, mockUsers } from './mockData';

export const getStats = async (): Promise<Stats> => {
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
