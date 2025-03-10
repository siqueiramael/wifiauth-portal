
import { Controller, Site, AccessPoint } from '../types/controller';

export class OmadaService {
  private controller: Controller;
  private token: string = '';

  constructor(controller: Controller) {
    this.controller = controller;
  }

  async login(): Promise<string> {
    try {
      const response = await fetch(`${this.controller.url}/api/v2/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.controller.username,
          password: this.controller.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to login to Omada Controller');
      }

      const data = await response.json();
      this.token = data.token;
      return this.token;
    } catch (error) {
      console.error('Error logging into Omada Controller:', error);
      throw error;
    }
  }

  async getSites(token: string): Promise<Site[]> {
    try {
      const response = await fetch(`${this.controller.url}/api/v2/sites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Omada sites');
      }

      const data = await response.json();
      return data.result.map((site: any) => ({
        id: site.id,
        name: site.name,
        controllerId: this.controller.id,
        controllerType: 'omada' as const,
      }));
    } catch (error) {
      console.error('Error fetching Omada sites:', error);
      throw error;
    }
  }

  async getAccessPoints(token: string, siteId: string): Promise<AccessPoint[]> {
    try {
      const response = await fetch(`${this.controller.url}/api/v2/sites/${siteId}/devices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Omada access points');
      }

      const data = await response.json();
      return data.result
        .filter((device: any) => device.type === 'ap')
        .map((ap: any) => ({
          id: ap.id,
          name: ap.name,
          siteId,
          model: ap.model,
          mac: ap.mac,
          status: ap.status === 'connected' ? 'online' : 'offline',
          lastSeen: new Date(ap.lastSeen).toISOString(),
        }));
    } catch (error) {
      console.error('Error fetching Omada access points:', error);
      throw error;
    }
  }
}
