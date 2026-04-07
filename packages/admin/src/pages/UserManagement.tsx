import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import type { AppUser, UserRole } from '@rco/shared';
import { ShieldCheck } from 'lucide-react';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'it_admin', label: 'IT Admin' },
  { value: 'hr', label: 'HR' },
  { value: 'csuite', label: 'C-Suite' },
];

const ROLE_LABELS: Record<string, string> = {
  it_admin: 'IT Admin',
  hr: 'HR',
  csuite: 'C-Suite',
};

const DEMO_USERS: AppUser[] = [
  {
    uid: 'demo',
    email: 'admin@demo.com',
    displayName: 'Demo Admin',
    role: 'it_admin',
    createdAt: '2024-01-01' as any,
    lastLogin: new Date().toISOString() as any,
    createdBy: 'bootstrap',
  },
  {
    uid: 'user-2',
    email: 'hr.manager@demo.com',
    displayName: 'HR Manager',
    role: 'hr',
    createdAt: '2024-02-15' as any,
    lastLogin: '2026-04-05' as any,
    createdBy: 'system',
  },
  {
    uid: 'user-3',
    email: 'exec@demo.com',
    displayName: 'Executive User',
    role: 'csuite',
    createdAt: '2024-03-01' as any,
    lastLogin: '2026-04-01' as any,
    createdBy: 'system',
  },
];

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AppUser[]>(DEMO_USERS);

  const changeRole = async (uid: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
    );
    console.log('[Demo] Changed role for', uid, 'to', newRole);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-brand-deep-brown">User Management</h2>
        <p className="text-sm text-brand-taupe mt-0.5">
          Manage who has access and what they can do. Users are auto-created on first sign-in.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-off-white">
                <th className="text-left px-4 py-3 font-medium text-brand-taupe">User</th>
                <th className="text-left px-4 py-3 font-medium text-brand-taupe">Role</th>
                <th className="text-left px-4 py-3 font-medium text-brand-taupe hidden md:table-cell">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.uid} className="border-b border-brand-border last:border-0 hover:bg-brand-off-white/50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-brand-deep-brown">{u.displayName}</p>
                      <p className="text-xs text-brand-taupe">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {u.uid === currentUser?.uid ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-cream text-brand-warm-brown">
                        <ShieldCheck size={12} />
                        {ROLE_LABELS[u.role] || u.role} (you)
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.uid, e.target.value as UserRole)}
                        className="text-sm px-2 py-1 rounded-lg border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-brand-text-brown hidden md:table-cell">
                    {typeof u.lastLogin === 'string' ? new Date(u.lastLogin).toLocaleDateString() : 'Recently'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
