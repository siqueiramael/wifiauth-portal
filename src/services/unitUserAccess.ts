
import { delay, mockUsers, updateMockUsers } from './mockData';
import { mockUnits } from './mockData';

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
