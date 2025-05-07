
export type ControllerType = 'unifi' | 'omada';
export type ControllerStatus = 'online' | 'offline';

export interface Controller {
  id: string;
  name: string;
  type: ControllerType;
  url: string;
  username: string;
  password: string;
  status: ControllerStatus;
  sites: Site[];
}

export interface Site {
  id: string;
  name: string;
  controllerId: string;
  controllerType: ControllerType;
  accessPoints: AccessPoint[];
}

export interface AccessPoint {
  id: string;
  name: string;
  siteId: string;
  model: string;
  mac: string;
  status: 'online' | 'offline';
  lastSeen: string;
  controllerType?: ControllerType; // Added this property as optional
}
