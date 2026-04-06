import { useState } from 'react';
import seedData from '../data/rockstar-seed.json';
import { ArrowLeft, Upload, CheckCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SeedEntry {
  firstName: string;
  lastName: string;
  displayName: string;
  department: string;
  initials: string;
  tenure: string;
  month: string;
  quote: string;
  photoUrl: string | null;
}

export function SeedData() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');

  const runSeed = async () => {
    setStatus('running');
    await new Promise((r) => setTimeout(r, 1500));
    console.log('[Demo] Seed data import simulated');
    setStatus('done');
  };

  return (
    <div>
      <button
        onClick={() => navigate('/it-overview')}
        className="flex items-center gap-1.5 text-sm text-brand-warm-brown hover:text-brand-deep-brown mb-4"
      >
        <ArrowLeft size={16} />
        Back to IT Overview
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-brand-deep-brown">Seed Rockstar Data</h2>
        <p className="text-sm text-brand-taupe mt-0.5">
          Import the {(seedData as SeedEntry[]).length} existing rockstar employees with photos
        </p>
      </div>

      <div className="bg-white rounded-xl border border-brand-border mb-6 overflow-hidden">
        <div className="px-4 py-3 border-b border-brand-border bg-brand-off-white">
          <h3 className="text-sm font-semibold text-brand-deep-brown">Data Preview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left px-4 py-2 font-medium text-brand-taupe">Photo</th>
                <th className="text-left px-4 py-2 font-medium text-brand-taupe">Name</th>
                <th className="text-left px-4 py-2 font-medium text-brand-taupe">Title</th>
                <th className="text-left px-4 py-2 font-medium text-brand-taupe">Month</th>
              </tr>
            </thead>
            <tbody>
              {(seedData as SeedEntry[]).slice(0, 10).map((emp, i) => (
                <tr key={i} className="border-b border-brand-border last:border-0">
                  <td className="px-4 py-2">
                    {emp.photoUrl ? (
                      <img src={emp.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-light-gray" />
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium text-brand-deep-brown">{emp.displayName}</td>
                  <td className="px-4 py-2 text-brand-text-brown">{emp.department}</td>
                  <td className="px-4 py-2 text-brand-taupe">{emp.month}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {status === 'idle' && (
        <button
          onClick={runSeed}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-warm-brown text-white font-medium hover:bg-brand-deep-brown transition-colors"
        >
          <Upload size={18} />
          Import All Rockstars (Demo)
        </button>
      )}
      {status === 'running' && (
        <div className="flex items-center gap-3 text-sm text-brand-warm-brown">
          <Loader size={18} className="animate-spin" /> Importing...
        </div>
      )}
      {status === 'done' && (
        <div className="flex items-center gap-2 text-sm text-green-700">
          <CheckCircle size={18} /> Import complete (demo)!
        </div>
      )}
    </div>
  );
}
