
export interface WifiUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  lastLogin: string | null;
  status: 'active' | 'blocked' | 'pending_approval';
  unitIds: string[];
  // Additional fields
  fullName?: string;
  cpf?: string;
  userType?: string;
  phone?: string;
  registrationNumber?: string;
  profile?: string;
  expirationDate?: string | null;
  temporaryAccess?: boolean;
  temporaryAccessDuration?: number; // in hours
  temporaryAccessStart?: string | null;
  authProvider?: 'local' | 'microsoft';
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
