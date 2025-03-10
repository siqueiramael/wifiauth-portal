
import { Controller, Site, AccessPoint } from '../types/controller';

export class UnifiService {
  private controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
  }

  async login(): Promise<string> {
    try {
      const response = await fetch(`${this.controller.url}/api/login`, {
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
        throw new Error('Failed to login to Unifi Controller');
      }

      const cookie = response.headers.get('set-cookie');
      return cookie || '';
    } catch (error) {
      console.error('Error logging into Unifi Controller:', error);
      throw error;
    }
  }

  async getSites(cookie: string): Promise<Site[]> {
    try {
      const response = await fetch(`${this.controller.url}/api/self/sites`, {
        headers: {
          'Cookie': cookie,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Unifi sites');
      }

      const data = await response.json();
      return data.data.map((site: any) => ({
        id: site._id,
        name: site.name || site.desc,
        controllerId: this.controller.id,
        controllerType: 'unifi' as const,
      }));
    } catch (error) {
      console.error('Error fetching Unifi sites:', error);
      throw error;
    }
  }

  async getAccessPoints(cookie: string, siteId: string): Promise<AccessPoint[]> {
    try {
      const response = await fetch(`${this.controller.url}/api/s/${siteId}/stat/device`, {
        headers: {
          'Cookie': cookie,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Unifi access points');
      }

      const data = await response.json();
      return data.data
        .filter((device: any) => device.type === 'uap')
        .map((ap: any) => ({
          id: ap._id,
          name: ap.name,
          siteId,
          model: ap.model,
          mac: ap.mac,
          status: ap.state === 1 ? 'online' : 'offline',
          lastSeen: new Date(ap.last_seen * 1000).toISOString(),
        }));
    } catch (error) {
      console.error('Error fetching Unifi access points:', error);
      throw error;
    }
  }
}
