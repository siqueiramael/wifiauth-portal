
import { delay } from './mockData';
import { AdminRole } from '@/context/AuthContext';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  lastLogin: string | null;
  active: boolean;
}

// Initial mock admin users
let mockAdmins: AdminUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Super Admin',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    active: true
  },
  {
    id: '2',
    email: 'admin2@example.com',
    name: 'Regular Admin',
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    active: true
  },
  {
    id: '3',
    email: 'tech@example.com',
    name: 'Tech Support',
    role: 'technician',
    createdAt: new Date().toISOString(),
    lastLogin: null,
    active: true
  }
];

// Function to update the mock admin users
export const updateMockAdmins = (admins: AdminUser[]) => {
  mockAdmins = [...admins];
};

// Fetch all admin users
export const fetchAdmins = async (): Promise<AdminUser[]> => {
  try {
    await delay(800);
    return [...mockAdmins];
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw new Error('Failed to fetch admin users');
  }
};

// Create a new admin user
export const createAdmin = async (adminData: {
  email: string;
  name: string;
  password: string;
  role: AdminRole;
}): Promise<AdminUser> => {
  try {
    await delay(800);
    
    // Check if admin already exists
    const existingAdmin = mockAdmins.find(a => a.email === adminData.email);
    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }
    
    const newAdmin: AdminUser = {
      id: String(mockAdmins.length + 1),
      email: adminData.email,
      name: adminData.name,
      role: adminData.role,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      active: true
    };
    
    const updatedAdmins = [...mockAdmins, newAdmin];
    updateMockAdmins(updatedAdmins);
    
    return newAdmin;
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
};

// Update an admin user
export const updateAdmin = async (adminId: string, updates: Partial<AdminUser>): Promise<AdminUser> => {
  try {
    await delay(600);
    
    const adminIndex = mockAdmins.findIndex(a => a.id === adminId);
    if (adminIndex === -1) {
      throw new Error('Admin not found');
    }
    
    const updatedAdmin = {
      ...mockAdmins[adminIndex],
      ...updates
    };
    
    const updatedAdmins = [
      ...mockAdmins.slice(0, adminIndex),
      updatedAdmin,
      ...mockAdmins.slice(adminIndex + 1)
    ];
    
    updateMockAdmins(updatedAdmins);
    
    return updatedAdmin;
  } catch (error) {
    console.error('Error updating admin:', error);
    throw error;
  }
};

// Delete an admin user
export const deleteAdmin = async (adminId: string): Promise<void> => {
  try {
    await delay(600);
    
    const adminIndex = mockAdmins.findIndex(a => a.id === adminId);
    if (adminIndex === -1) {
      throw new Error('Admin not found');
    }
    
    // Check if this is the last super_admin
    const isLastSuperAdmin = 
      mockAdmins[adminIndex].role === 'super_admin' && 
      mockAdmins.filter(a => a.role === 'super_admin').length === 1;
    
    if (isLastSuperAdmin) {
      throw new Error('Cannot delete the last Super Admin');
    }
    
    const updatedAdmins = [
      ...mockAdmins.slice(0, adminIndex),
      ...mockAdmins.slice(adminIndex + 1)
    ];
    
    updateMockAdmins(updatedAdmins);
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error;
  }
};

// Toggle admin active status
export const toggleAdminStatus = async (adminId: string): Promise<AdminUser> => {
  try {
    await delay(600);
    
    const adminIndex = mockAdmins.findIndex(a => a.id === adminId);
    if (adminIndex === -1) {
      throw new Error('Admin not found');
    }
    
    // Check if this is the last active super_admin
    const isLastActiveSuperAdmin = 
      mockAdmins[adminIndex].role === 'super_admin' && 
      mockAdmins[adminIndex].active && 
      mockAdmins.filter(a => a.role === 'super_admin' && a.active).length === 1;
    
    if (isLastActiveSuperAdmin) {
      throw new Error('Cannot deactivate the last active Super Admin');
    }
    
    const updatedAdmin = {
      ...mockAdmins[adminIndex],
      active: !mockAdmins[adminIndex].active
    };
    
    const updatedAdmins = [
      ...mockAdmins.slice(0, adminIndex),
      updatedAdmin,
      ...mockAdmins.slice(adminIndex + 1)
    ];
    
    updateMockAdmins(updatedAdmins);
    
    return updatedAdmin;
  } catch (error) {
    console.error('Error toggling admin status:', error);
    throw error;
  }
};
