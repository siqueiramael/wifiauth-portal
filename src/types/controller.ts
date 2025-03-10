
export type ControllerType = 'unifi' | 'omada';

export interface Controller {
  id: string;
  name: string;
  type: ControllerType;
  url: string;
  username: string;
  password: string;
}

export interface Site {
  id: string;
  name: string;
  controllerId: string;
  controllerType: ControllerType;
}

export interface AccessPoint {
  id: string;
  name: string;
  siteId: string;
  model: string;
  mac: string;
  status: 'online' | 'offline';
  lastSeen: string;
}
