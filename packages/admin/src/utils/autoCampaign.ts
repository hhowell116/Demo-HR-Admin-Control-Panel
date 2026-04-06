import type { Employee } from '@rco/shared';

/**
 * Demo mode: no-op — original syncs employee campaigns to Firestore.
 */
export async function syncEmployeeCampaigns(
  _emp: { id: string } & Partial<Employee>,
  _userId: string
) {
  console.log('[Demo] syncEmployeeCampaigns is a no-op in demo mode');
}
