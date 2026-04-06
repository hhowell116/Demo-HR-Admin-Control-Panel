import { useMemo } from 'react';
import { DEMO_EMPLOYEES, DEMO_CAMPAIGNS } from '../data/demoData';
import type { AccessLevel } from '@rco/shared';
import {
  Server, Users, Shield, Monitor, AlertTriangle, CheckCircle,
  Activity, UserCheck, Trophy,
} from 'lucide-react';
import { useRolePermissions, CAPABILITIES } from '../hooks/useRolePermissions';
import type { CapabilityKey } from '../hooks/useRolePermissions';

export function ItOverview() {
  const { matrix, updateAccess } = useRolePermissions();

  const status = useMemo(() => {
    const active = DEMO_EMPLOYEES.filter((e) => e.isActive);
    return {
      employeeCount: active.length,
      employeesWithoutPhotos: active.filter((e) => !e.photoUrl).length,
      employeesWithoutBirthdays: active.filter((e) => !e.birthMonth).length,
      activeCampaigns: DEMO_CAMPAIGNS.filter((c) => c.isActive).length,
      totalCampaigns: DEMO_CAMPAIGNS.length,
    };
  }, []);

  const issues: { level: 'warning' | 'info'; message: string }[] = [];
  if (status.employeesWithoutPhotos > 0) {
    issues.push({ level: 'info', message: `${status.employeesWithoutPhotos} employees missing photos` });
  }
  if (status.employeesWithoutBirthdays > 0) {
    issues.push({ level: 'info', message: `${status.employeesWithoutBirthdays} employees missing birthday data` });
  }

  const warnings = issues.filter((i) => i.level === 'warning');
  const infos = issues.filter((i) => i.level === 'info');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-brand-deep-brown">IT Overview</h2>
        <p className="text-sm text-brand-taupe mt-0.5">System health and data quality at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatusCard icon={Server} label="Firebase Project" value="rco-hr-admin" color="bg-brand-warm-brown" />
        <StatusCard icon={Users} label="Active Employees" value={String(status.employeeCount)} color="bg-brand-gold" />
        <StatusCard icon={Trophy} label="Active Campaigns" value={`${status.activeCampaigns} / ${status.totalCampaigns}`} color="bg-brand-bronze" />
        <StatusCard icon={Monitor} label="Display Slides" value="5" color="bg-brand-taupe" />
      </div>

      {infos.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-blue-600" />
            <h3 className="text-sm font-semibold text-blue-800">Data Completeness</h3>
          </div>
          <ul className="space-y-1">
            {infos.map((info, i) => (
              <li key={i} className="text-sm text-blue-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                {info.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {issues.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600" />
          <p className="text-sm text-green-700 font-medium">All systems healthy -- no issues detected</p>
        </div>
      )}

      {/* Role Access Matrix */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-brand-border bg-brand-off-white flex items-center gap-2">
          <Shield size={16} className="text-brand-taupe" />
          <h3 className="text-sm font-semibold text-brand-deep-brown">Role Access Matrix</h3>
          <span className="ml-auto text-[10px] text-brand-taupe">Click to toggle access levels</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-off-white/50">
                <th className="text-left px-4 py-2.5 font-medium text-brand-taupe">Capability</th>
                <th className="text-center px-3 py-2.5 font-medium text-brand-taupe">
                  <RoleBadge role="it_admin" />
                </th>
                <th className="text-center px-3 py-2.5 font-medium text-brand-taupe">
                  <RoleBadge role="hr" />
                </th>
                <th className="text-center px-3 py-2.5 font-medium text-brand-taupe">
                  <RoleBadge role="csuite" />
                </th>
              </tr>
            </thead>
            <tbody>
              {CAPABILITIES.map((cap) => (
                <tr key={cap.key} className="border-b border-brand-border last:border-0 hover:bg-brand-off-white/30">
                  <td className="px-4 py-2.5 text-brand-text-brown">{cap.label}</td>
                  <td className="text-center px-3 py-2.5">
                    <AccessBadge level="manage" locked />
                  </td>
                  <td className="text-center px-3 py-2.5">
                    <AccessToggle
                      level={matrix.hr[cap.key as CapabilityKey]}
                      onChange={(lvl) => updateAccess('hr', cap.key as CapabilityKey, lvl)}
                    />
                  </td>
                  <td className="text-center px-3 py-2.5">
                    <AccessToggle
                      level={matrix.csuite[cap.key as CapabilityKey]}
                      onChange={(lvl) => updateAccess('csuite', cap.key as CapabilityKey, lvl)}
                    />
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

function StatusCard({ icon: Icon, label, value, color }: { icon: typeof Server; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-brand-border">
      <div className="flex items-center gap-3 mb-3">
        <div className={`${color} w-9 h-9 rounded-lg flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        <span className="text-sm text-brand-taupe">{label}</span>
      </div>
      <p className="text-2xl font-bold text-brand-deep-brown">{value}</p>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    it_admin: 'bg-purple-50 text-purple-700',
    hr: 'bg-brand-cream text-brand-warm-brown',
    csuite: 'bg-amber-50 text-amber-700',
  };
  const labels: Record<string, string> = { it_admin: 'IT Admin', hr: 'HR', csuite: 'C-Suite' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-600'}`}>
      {labels[role] || role}
    </span>
  );
}

const ACCESS_CYCLE: AccessLevel[] = ['none', 'read', 'manage'];
const ACCESS_STYLES: Record<AccessLevel, { bg: string; text: string; label: string }> = {
  manage: { bg: 'bg-green-100', text: 'text-green-700', label: 'Manage' },
  read: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Read Only' },
  none: { bg: 'bg-gray-100', text: 'text-gray-400', label: "Can't See" },
};

function AccessBadge({ level, locked }: { level: AccessLevel; locked?: boolean }) {
  const s = ACCESS_STYLES[level];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${s.bg} ${s.text} ${locked ? 'opacity-60' : ''}`}>
      {s.label}
    </span>
  );
}

function AccessToggle({ level, onChange }: { level: AccessLevel; onChange: (l: AccessLevel) => void }) {
  const cycle = () => {
    const idx = ACCESS_CYCLE.indexOf(level);
    const next = ACCESS_CYCLE[(idx + 1) % ACCESS_CYCLE.length];
    onChange(next);
  };
  const s = ACCESS_STYLES[level];
  return (
    <button
      onClick={cycle}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${s.bg} ${s.text} hover:ring-2 hover:ring-brand-gold/40 transition-all cursor-pointer`}
      title={`Click to change -- currently: ${s.label}`}
    >
      {s.label}
    </button>
  );
}
