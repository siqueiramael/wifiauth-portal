
import { Unit } from '@/models/user';
import { delay, mockUnits, updateMockUnits, mockUsers, updateMockUsers } from './mockData';

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
    
    const updatedUnits = [...mockUnits, newUnit];
    updateMockUnits(updatedUnits);
    
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
    
    const updatedUnits = [
      ...mockUnits.slice(0, unitIndex),
      updatedUnit,
      ...mockUnits.slice(unitIndex + 1)
    ];
    
    updateMockUnits(updatedUnits);
    
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
    
    const updatedUnits = [
      ...mockUnits.slice(0, unitIndex),
      ...mockUnits.slice(unitIndex + 1)
    ];
    
    updateMockUnits(updatedUnits);
    
    // Remove this unit from all users
    const updatedUsers = mockUsers.map(user => ({
      ...user,
      unitIds: user.unitIds.filter(id => id !== unitId)
    }));
    
    updateMockUsers(updatedUsers);
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};

export const updateUserAccessToUnit = async (
  unitId: string, 
  userIds: string[], 
  hasAccess: boolean
): Promise<void> => {
  try {
    await delay(600);
    
    // Make sure the unit exists
    const unit = mockUnits.find(u => u.id === unitId);
    if (!unit) {
      throw new Error('Unit not found');
    }
    
    // Update users' access to the unit
    const updatedUsers = mockUsers.map(user => {
      if (userIds.includes(user.id)) {
        if (hasAccess) {
          // Add unitId if it doesn't exist in user's unitIds
          return {
            ...user,
            unitIds: user.unitIds.includes(unitId) 
              ? user.unitIds 
              : [...user.unitIds, unitId]
          };
        } else {
          // Remove unitId from user's unitIds
          return {
            ...user,
            unitIds: user.unitIds.filter(id => id !== unitId)
          };
        }
      }
      return user;
    });
    
    updateMockUsers(updatedUsers);
  } catch (error) {
    console.error('Error updating user access to unit:', error);
    throw error;
  }
};
