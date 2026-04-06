import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, X, Trash2, QrCode, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { PhotoSubmission } from '@rco/shared';

const UPLOAD_URL = 'https://rco-hr-display.web.app/upload';

type Tab = 'pending' | 'reviewed' | 'qr';

const DEMO_SUBMISSIONS: PhotoSubmission[] = [
  {
    id: 'sub-001',
    employeeId: 'emp-002',
    employeeName: 'James Carter',
    photoData: '',
    status: 'pending',
    submittedAt: '2026-04-05T10:30:00Z' as any,
    reviewedAt: null,
    reviewedBy: null,
  },
];

export function PhotoSubmissions() {
  const [submissions, setSubmissions] = useState<PhotoSubmission[]>(DEMO_SUBMISSIONS);
  const [tab, setTab] = useState<Tab>('pending');

  const pending = submissions.filter((s) => s.status === 'pending');
  const reviewed = submissions.filter((s) => s.status !== 'pending');

  const handleApprove = async (sub: PhotoSubmission) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, status: 'approved' as const } : s))
    );
    console.log('[Demo] Approved photo for', sub.employeeName);
  };

  const handleReject = async (sub: PhotoSubmission) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, status: 'rejected' as const } : s))
    );
    console.log('[Demo] Rejected photo for', sub.employeeName);
  };

  const handleDelete = async (sub: PhotoSubmission) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== sub.id));
    console.log('[Demo] Deleted submission for', sub.employeeName);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-brand-deep-brown">Photo Submissions</h2>
          <p className="text-sm text-brand-taupe mt-0.5">
            {pending.length} pending review
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-white rounded-lg border border-brand-border p-0.5 mb-5 w-fit">
        {([
          { key: 'pending' as Tab, label: 'Pending', icon: Clock, count: pending.length },
          { key: 'reviewed' as Tab, label: 'Reviewed', icon: CheckCircle, count: reviewed.length },
          { key: 'qr' as Tab, label: 'QR Code', icon: QrCode, count: null },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
              tab === t.key
                ? 'bg-brand-cream text-brand-warm-brown font-medium'
                : 'text-brand-taupe hover:text-brand-text-brown'
            }`}
          >
            <t.icon size={13} />
            {t.label}
            {t.count !== null && t.count > 0 && (
              <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                t.key === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'qr' && (
        <div className="bg-white rounded-xl border border-brand-border p-8 max-w-md">
          <div className="text-center">
            <h3 className="text-lg font-serif font-bold text-brand-deep-brown mb-2">
              Employee Photo Upload QR Code
            </h3>
            <p className="text-sm text-brand-taupe mb-6">
              Print this QR code and display it in a common area. Employees can scan it to upload their own profile photo.
            </p>
            <div className="inline-block bg-white p-4 rounded-xl border border-brand-border">
              <QRCodeSVG
                value={UPLOAD_URL}
                size={220}
                bgColor="#ffffff"
                fgColor="#473C31"
                level="M"
              />
            </div>
            <p className="text-xs text-brand-taupe mt-4 break-all select-all font-mono bg-brand-off-white rounded-lg px-3 py-2">
              {UPLOAD_URL}
            </p>
          </div>
        </div>
      )}

      {tab === 'pending' && (
        <>
          {pending.length === 0 ? (
            <div className="bg-white rounded-xl border border-brand-border p-8 text-center text-sm text-brand-taupe">
              No pending photo submissions. Share the QR code with employees to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pending.map((sub) => (
                <div key={sub.id} className="bg-white rounded-xl border border-brand-border overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center text-lg font-medium text-brand-warm-brown">
                        {sub.employeeName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-brand-deep-brown">{sub.employeeName}</p>
                        <p className="text-xs text-brand-taupe">Submitted recently</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(sub)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        <Check size={15} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(sub)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        <X size={15} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'reviewed' && (
        <>
          {reviewed.length === 0 ? (
            <div className="bg-white rounded-xl border border-brand-border p-8 text-center text-sm text-brand-taupe">
              No reviewed submissions yet.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-off-white">
                    <th className="text-left px-4 py-3 font-medium text-brand-taupe">Employee</th>
                    <th className="text-left px-4 py-3 font-medium text-brand-taupe">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-brand-taupe">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewed.map((sub) => (
                    <tr key={sub.id} className="border-b border-brand-border last:border-0">
                      <td className="px-4 py-3 font-medium text-brand-deep-brown">{sub.employeeName}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          sub.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                        }`}>
                          {sub.status === 'approved' ? <CheckCircle size={11} /> : <XCircle size={11} />}
                          {sub.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(sub)}
                          className="p-1.5 rounded hover:bg-red-50 text-brand-taupe hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
