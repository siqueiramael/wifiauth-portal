
import { UsagePolicy, PolicyFormData } from '@/models/policy';
import { delay } from './mockData';

// Mock data for policies
let mockPolicies: UsagePolicy[] = [
  {
    id: '1',
    name: 'Política Padrão',
    description: 'Limitações básicas para usuários comuns',
    createdAt: new Date().toISOString(),
    active: true,
    downloadSpeed: 10,
    uploadSpeed: 5,
    dailyDataLimit: 2,
    monthlyDataLimit: 50,
    allowedTimeRanges: [
      {
        days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        startTime: '08:00',
        endTime: '18:00'
      }
    ],
    targetType: 'group',
    targetIds: ['standard']
  },
  {
    id: '2',
    name: 'Política de Visitantes',
    description: 'Limitações rigorosas para visitantes',
    createdAt: new Date().toISOString(),
    active: true,
    downloadSpeed: 5,
    uploadSpeed: 2,
    dailyDataLimit: 1,
    monthlyDataLimit: 10,
    allowedTimeRanges: [
      {
        days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        startTime: '09:00',
        endTime: '17:00'
      }
    ],
    targetType: 'group',
    targetIds: ['visitor']
  }
];

// Helper to update the mock policies (simulating database update)
const updateMockPolicies = (policies: UsagePolicy[]) => {
  mockPolicies = [...policies];
};

// Fetch all policies
export const fetchPolicies = async (): Promise<UsagePolicy[]> => {
  try {
    await delay(600);
    return [...mockPolicies];
  } catch (error) {
    console.error('Error fetching policies:', error);
    throw new Error('Failed to fetch policies');
  }
};

// Create a new policy
export const createPolicy = async (policyData: PolicyFormData): Promise<UsagePolicy> => {
  try {
    await delay(800);
    
    const newPolicy: UsagePolicy = {
      id: String(mockPolicies.length + 1),
      createdAt: new Date().toISOString(),
      ...policyData
    };
    
    const updatedPolicies = [...mockPolicies, newPolicy];
    updateMockPolicies(updatedPolicies);
    
    return newPolicy;
  } catch (error) {
    console.error('Error creating policy:', error);
    throw error;
  }
};

// Update an existing policy
export const updatePolicy = async (
  policyId: string, 
  policyData: Partial<PolicyFormData>
): Promise<UsagePolicy> => {
  try {
    await delay(800);
    
    const policyIndex = mockPolicies.findIndex(p => p.id === policyId);
    if (policyIndex === -1) {
      throw new Error('Policy not found');
    }
    
    const updatedPolicy = {
      ...mockPolicies[policyIndex],
      ...policyData
    };
    
    const updatedPolicies = [
      ...mockPolicies.slice(0, policyIndex),
      updatedPolicy,
      ...mockPolicies.slice(policyIndex + 1)
    ];
    
    updateMockPolicies(updatedPolicies);
    
    return updatedPolicy;
  } catch (error) {
    console.error('Error updating policy:', error);
    throw error;
  }
};

// Delete a policy
export const deletePolicy = async (policyId: string): Promise<void> => {
  try {
    await delay(600);
    
    const policyIndex = mockPolicies.findIndex(p => p.id === policyId);
    if (policyIndex === -1) {
      throw new Error('Policy not found');
    }
    
    const updatedPolicies = [
      ...mockPolicies.slice(0, policyIndex),
      ...mockPolicies.slice(policyIndex + 1)
    ];
    
    updateMockPolicies(updatedPolicies);
  } catch (error) {
    console.error('Error deleting policy:', error);
    throw error;
  }
};

// Toggle policy active status
export const togglePolicyStatus = async (policyId: string): Promise<UsagePolicy> => {
  try {
    await delay(600);
    
    const policyIndex = mockPolicies.findIndex(p => p.id === policyId);
    if (policyIndex === -1) {
      throw new Error('Policy not found');
    }
    
    const updatedPolicy = {
      ...mockPolicies[policyIndex],
      active: !mockPolicies[policyIndex].active
    };
    
    const updatedPolicies = [
      ...mockPolicies.slice(0, policyIndex),
      updatedPolicy,
      ...mockPolicies.slice(policyIndex + 1)
    ];
    
    updateMockPolicies(updatedPolicies);
    
    return updatedPolicy;
  } catch (error) {
    console.error('Error toggling policy status:', error);
    throw error;
  }
};
