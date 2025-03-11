
import { WifiUser, Unit } from '@/models/user';

// Simulate network delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export let mockUsers: WifiUser[] = [
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

export let mockUnits: Unit[] = [
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

// Function to update our mock data (used by other services)
export const updateMockUsers = (newUsers: WifiUser[]) => {
  mockUsers = newUsers;
};

export const updateMockUnits = (newUnits: Unit[]) => {
  mockUnits = newUnits;
};
