
export interface WifiUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  lastLogin: string | null;
  status: 'active' | 'blocked';
  unitIds: string[];
}

export interface Unit {
  id: string;
  name: string;
  siteId: string;
  controllerName: string;
  siteName: string;
  createdAt: string;
}

export interface Stats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  newUsersToday: number;
}
