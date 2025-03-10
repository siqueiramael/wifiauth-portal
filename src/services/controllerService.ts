
import { Controller, Site, AccessPoint, ControllerType } from '../types/controller';
import { UnifiService } from './unifiService';
import { OmadaService } from './omadaService';

// Mock data for development
const mockControllers: Controller[] = [
  {
    id: '1',
    name: 'Unifi Controller',
    type: 'unifi',
    url: 'https://unifi.example.com:8443',
    username: 'admin',
    password: 'password',
    status: 'online',
    sites: [
      {
        id: 'site1',
        name: 'Main Office',
        controllerId: '1',
        controllerType: 'unifi',
        accessPoints: [
          {
            id: 'ap1',
            name: 'AP-Office-1',
            siteId: 'site1',
            model: 'U6-Pro',
            mac: '00:11:22:33:44:55',
            status: 'online',
            lastSeen: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Omada Controller',
    type: 'omada',
    url: 'https://omada.example.com:8043',
    username: 'admin',
    password: 'password',
    status: 'offline',
    sites: [
      {
        id: 'site2',
        name: 'Branch Office',
        controllerId: '2',
        controllerType: 'omada',
        accessPoints: [
          {
            id: 'ap2',
            name: 'AP-Branch-1',
            siteId: 'site2',
            model: 'EAP245',
            mac: 'aa:bb:cc:dd:ee:ff',
            status: 'offline',
            lastSeen: new Date().toISOString()
          }
        ]
      }
    ]
  }
];

export class ControllerService {
  private controllers: Map<string, UnifiService | OmadaService> = new Map();

  constructor() {
    // Initialize controllers from mock data
    mockControllers.forEach(controller => {
      this.initializeController(controller);
    });
  }

  private initializeController(controller: Controller) {
    const service = controller.type === 'unifi' 
      ? new UnifiService(controller)
      : new OmadaService(controller);
    this.controllers.set(controller.id, service);
  }

  async getControllers(): Promise<Controller[]> {
    return mockControllers;
  }

  async addController(controller: Controller): Promise<Controller> {
    // Generate an ID if not provided
    if (!controller.id) {
      controller.id = Date.now().toString();
    }
    
    // Set default status
    controller.status = 'offline';
    
    // Add empty sites array if not provided
    if (!controller.sites) {
      controller.sites = [];
    }
    
    mockControllers.push(controller);
    this.initializeController(controller);
    return controller;
  }

  async updateController(controller: Controller): Promise<Controller> {
    const index = mockControllers.findIndex(c => c.id === controller.id);
    if (index === -1) {
      throw new Error('Controller not found');
    }
    
    mockControllers[index] = controller;
    this.initializeController(controller);
    return controller;
  }

  async deleteController(controllerId: string): Promise<void> {
    const index = mockControllers.findIndex(c => c.id === controllerId);
    if (index === -1) {
      throw new Error('Controller not found');
    }
    
    mockControllers.splice(index, 1);
    this.controllers.delete(controllerId);
  }

  async getSitesForController(controllerId: string): Promise<Site[]> {
    const controller = this.controllers.get(controllerId);
    if (!controller) {
      throw new Error('Controller not found');
    }

    const auth = await controller.login();
    return controller.getSites(auth);
  }

  async getAccessPointsForSite(controllerId: string, siteId: string): Promise<AccessPoint[]> {
    const controller = this.controllers.get(controllerId);
    if (!controller) {
      throw new Error('Controller not found');
    }

    const auth = await controller.login();
    return controller.getAccessPoints(auth, siteId);
  }
}

export const controllerService = new ControllerService();
