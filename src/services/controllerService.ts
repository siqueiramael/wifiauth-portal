
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
    password: 'password'
  },
  {
    id: '2',
    name: 'Omada Controller',
    type: 'omada',
    url: 'https://omada.example.com:8043',
    username: 'admin',
    password: 'password'
  }
];

export class ControllerService {
  private controllers: Map<string, UnifiService | OmadaService> = new Map();

  constructor() {
    // Initialize controllers from mock data
    mockControllers.forEach(controller => {
      this.addController(controller);
    });
  }

  private addController(controller: Controller) {
    const service = controller.type === 'unifi' 
      ? new UnifiService(controller)
      : new OmadaService(controller);
    this.controllers.set(controller.id, service);
  }

  async getControllers(): Promise<Controller[]> {
    return mockControllers;
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
