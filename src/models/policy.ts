
export type WeekdayRange = {
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  startTime: string; // format: "HH:MM" (24-hour)
  endTime: string; // format: "HH:MM" (24-hour)
};

export type PolicyTarget = 'user' | 'group' | 'unit';

export interface UsagePolicy {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  active: boolean;
  
  // Bandwidth limitations (in Mbps)
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  
  // Data usage limitations (in GB)
  dailyDataLimit: number | null;
  monthlyDataLimit: number | null;
  
  // Time-based access control
  allowedTimeRanges: WeekdayRange[];
  
  // Target configuration
  targetType: PolicyTarget;
  targetIds: string[]; // IDs of users, groups, or units this policy applies to
}

export type PolicyFormData = Omit<UsagePolicy, 'id' | 'createdAt'>;
