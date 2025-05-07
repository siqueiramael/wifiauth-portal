
import { AccessPoint } from '@/types/controller';
import { delay } from './mockData';
import { mockUnits } from './mockData';
import { controllerService } from '@/services/controllerService';

// Function to get access points for a unit
export const getAccessPointsForUnit = async (unitId: string): Promise<AccessPoint[]> => {
  try {
    await delay(800);
    
    // Find the unit by ID
    const unit = mockUnits.find(u => u.id === unitId);
    if (!unit) {
      throw new Error('Unidade não encontrada');
    }
    
    try {
      // Get access points through the controllerService
      const controllers = await controllerService.getControllers();
      
      // Find the correct controller for this unit
      const controller = controllers.find(c => c.sites.some(s => s.id === unit.siteId));
      if (!controller) {
        throw new Error('Controladora para esta unidade não encontrada');
      }
      
      // Get access points for the site of this unit
      const accessPoints = await controllerService.getAccessPointsForSite(controller.id, unit.siteId);
      
      // Add controller type info to access points
      return accessPoints.map(ap => ({
        ...ap,
        controllerType: controller.type
      }));
    } catch (error) {
      console.error('Erro ao obter pontos de acesso da controladora:', error);
      
      // Simulated data for development
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
          lastSeen: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          controllerType: 'omada'
        }
      ];
    }
  } catch (error) {
    console.error('Erro ao buscar pontos de acesso para a unidade:', error);
    throw error;
  }
};
