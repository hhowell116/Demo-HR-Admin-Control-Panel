import { useState } from 'react';
import type { AccessLevel, UserRole } from '@rco/shared';

export const CAPABILITIES = [
  { key: 'viewDashboard', label: 'View dashboard & displays' },
  { key: 'manageRoster', label: 'Employee roster' },
  { key: 'manageContent', label: 'Birthdays & anniversaries' },
  { key: 'manageCampaigns', label: 'Campaigns & display settings' },
  { key: 'manageUsers', label: 'User management' },
  { key: 'viewItOverview', label: 'IT Overview' },
] as const;

export type CapabilityKey = (typeof CAPABILITIES)[number]['key'];

const DEFAULTS: Record<UserRole, Record<CapabilityKey, AccessLevel>> = {
  it_admin: {
    viewDashboard: 'manage',
    manageRoster: 'manage',
    manageContent: 'manage',
    manageCampaigns: 'manage',
    manageUsers: 'manage',
    viewItOverview: 'manage',
  },
  hr: {
    viewDashboard: 'manage',
    manageRoster: 'manage',
    manageContent: 'manage',
    manageCampaigns: 'manage',
    manageUsers: 'none',
    viewItOverview: 'none',
  },
  csuite: {
    viewDashboard: 'read',
    manageRoster: 'read',
    manageContent: 'read',
    manageCampaigns: 'read',
    manageUsers: 'none',
    viewItOverview: 'none',
  },
};

export type RoleAccessMap = Record<UserRole, Record<CapabilityKey, AccessLevel>>;

export function useRolePermissions() {
  const [matrix, setMatrix] = useState<RoleAccessMap>(DEFAULTS);
  const [loading] = useState(false);

  const updateAccess = async (role: UserRole, capability: CapabilityKey, level: AccessLevel) => {
    if (role === 'it_admin') return;
    const updated = { ...matrix[role], [capability]: level };
    setMatrix((prev) => ({ ...prev, [role]: updated }));
    console.log('[Demo] Updated access:', role, capability, level);
  };

  return { matrix, loading, updateAccess };
}

export function accessToBoolean(access: Record<CapabilityKey, AccessLevel>) {
  const result: Record<string, boolean> = {};
  for (const cap of CAPABILITIES) {
    result[cap.key] = access[cap.key] !== 'none';
  }
  return result;
}
