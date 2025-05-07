import { Unit } from '@/models/user';
import { AccessPoint } from '@/types/controller';
import { delay, mockUnits, updateMockUnits, mockUsers, updateMockUsers } from './mockData';
import { controllerService } from '@/services/controllerService';

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

// Nova função para obter pontos de acesso para uma unidade
export const getAccessPointsForUnit = async (unitId: string): Promise<AccessPoint[]> => {
  try {
    await delay(800);
    
    // Encontra a unidade pelo ID
    const unit = mockUnits.find(u => u.id === unitId);
    if (!unit) {
      throw new Error('Unidade não encontrada');
    }
    
    try {
      // Obtém os pontos de acesso através do controllerService
      const controllers = await controllerService.getControllers();
      
      // Encontrar o controller correto para esta unidade
      const controller = controllers.find(c => c.sites.some(s => s.id === unit.siteId));
      if (!controller) {
        throw new Error('Controladora para esta unidade não encontrada');
      }
      
      // Obter os pontos de acesso para o site desta unidade
      const accessPoints = await controllerService.getAccessPointsForSite(controller.id, unit.siteId);
      
      // Adicionar informação sobre o tipo de controladora aos pontos de acesso
      return accessPoints.map(ap => ({
        ...ap,
        controllerType: controller.type
      }));
    } catch (error) {
      console.error('Erro ao obter pontos de acesso da controladora:', error);
      
      // Dados simulados para desenvolvimento
      return [
        {
          id: `ap-${unitId}-1`,
          name: `AP-${unit.name}-1`,
          siteId: unit.siteId,
          model: 'U6-Pro',
          mac: '00:11:22:33:44:55',
          status: 'online',
          lastSeen: new Date().toISOString(),
          controllerType: 'unifi'
        },
        {
          id: `ap-${unitId}-2`,
          name: `AP-${unit.name}-2`,
          siteId: unit.siteId,
          model: 'U6-LR',
          mac: 'AA:BB:CC:DD:EE:FF',
          status: 'online',
          lastSeen: new Date().toISOString(),
          controllerType: 'unifi'
        },
        {
          id: `ap-${unitId}-3`,
          name: `AP-${unit.name}-3`,
          siteId: unit.siteId,
          model: 'EAP245',
          mac: '11:22:33:44:55:66',
          status: 'offline',
          lastSeen: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
          controllerType: 'omada'
        }
      ];
    }
  } catch (error) {
    console.error('Erro ao buscar pontos de acesso para a unidade:', error);
    throw error;
  }
};
