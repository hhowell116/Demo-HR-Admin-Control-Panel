import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Upload, FileSpreadsheet, CheckCircle,
  Loader, X, Search,
} from 'lucide-react';

interface ParsedRow {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  birthMonth: number;
  birthDay: number;
  hireDate: string;
}

const TEMPLATE_HEADERS = [
  'First Name', 'Last Name', 'Email', 'Department', 'Job Title',
  'Employee ID', 'Birth Month', 'Birth Day', 'Hire Date', 'Phone Last 4', 'Location',
];

const EXAMPLE_ROW = [
  'Jane', 'Smith', 'jane.smith@demo.com', 'Production', 'Production Specialist',
  'EMP-001', '4', '15', '2023-06-01', '1234', 'Texarkana',
];

function downloadTemplate() {
  const lines = [TEMPLATE_HEADERS.join(','), EXAMPLE_ROW.join(',')];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'employee_import_template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function parseLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { fields.push(current); current = ''; }
    else { current += ch; }
  }
  fields.push(current);
  return fields;
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const header = parseLine(lines[0]).map((h) => h.trim().toLowerCase());
  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const fields = parseLine(lines[i]);
    const get = (keys: string[]) => {
      for (const k of keys) {
        const idx = header.indexOf(k);
        if (idx >= 0 && fields[idx]?.trim()) return fields[idx].trim();
      }
      return '';
    };
    rows.push({
      firstName: get(['first name', 'firstname', 'first']),
      lastName: get(['last name', 'lastname', 'last']),
      email: get(['email', 'e-mail']),
      department: get(['department', 'dept']),
      birthMonth: parseInt(get(['birth month', 'birthmonth'])) || 0,
      birthDay: parseInt(get(['birth day'])) || 0,
      hireDate: get(['hire date', 'hiredate', 'start date']),
    });
  }
  return rows.filter((r) => r.firstName || r.lastName);
}

export function CsvImport() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'idle' | 'preview' | 'done'>('idle');

  const filtered = useMemo(() => {
    if (!search) return rows.slice(0, 50);
    return rows.filter((r) =>
      `${r.firstName} ${r.lastName} ${r.department} ${r.email}`
        .toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50);
  }, [rows, search]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setRows(parseCSV(reader.result as string));
      setStatus('preview');
    };
    reader.readAsText(file);
  };

  const runImport = async () => {
    console.log('[Demo] CSV import simulated for', rows.length, 'employees');
    setStatus('done');
  };

  return (
    <div>
      <button
        onClick={() => navigate('/employees')}
        className="flex items-center gap-1.5 text-sm text-brand-warm-brown hover:text-brand-deep-brown mb-4"
      >
        <ArrowLeft size={16} /> Back to Employee Roster
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-brand-deep-brown">Import Employees from CSV</h2>
        <p className="text-sm text-brand-taupe mt-0.5">Upload a CSV file to bulk-import employees.</p>
      </div>

      <div className="bg-white rounded-xl border border-brand-border p-5 mb-4">
        <h3 className="text-sm font-semibold text-brand-deep-brown mb-2">Step 1: Download Template</h3>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-border text-sm text-brand-text-brown hover:bg-brand-off-white transition-colors"
        >
          <Download size={15} /> Download Template (.csv)
        </button>
      </div>

      <div className="bg-white rounded-xl border border-brand-border p-5 mb-4">
        <h3 className="text-sm font-semibold text-brand-deep-brown mb-2">Step 2: Upload CSV</h3>
        {status === 'idle' ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-brand-border rounded-lg p-8 text-center cursor-pointer hover:border-brand-taupe transition-colors"
          >
            <FileSpreadsheet size={32} className="text-brand-light-gray mx-auto mb-2" />
            <p className="text-sm text-brand-taupe">Click to select a CSV file</p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <FileSpreadsheet size={20} className="text-brand-warm-brown" />
            <p className="text-sm font-medium text-brand-deep-brown">{fileName} - {rows.length} employees</p>
          </div>
        )}
        <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} className="hidden" />
      </div>

      {status === 'preview' && rows.length > 0 && (
        <div className="bg-white rounded-xl border border-brand-border mb-4 overflow-hidden">
          <div className="px-4 py-3 border-b border-brand-border bg-brand-off-white">
            <h3 className="text-sm font-semibold text-brand-deep-brown">Step 3: Review & Import</h3>
          </div>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-brand-border">
                  <th className="text-left px-3 py-2 font-medium text-brand-taupe">Name</th>
                  <th className="text-left px-3 py-2 font-medium text-brand-taupe">Email</th>
                  <th className="text-left px-3 py-2 font-medium text-brand-taupe">Department</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i} className="border-b border-brand-border last:border-0">
                    <td className="px-3 py-1.5 font-medium text-brand-deep-brown">{row.firstName} {row.lastName}</td>
                    <td className="px-3 py-1.5 text-brand-taupe">{row.email || '--'}</td>
                    <td className="px-3 py-1.5 text-brand-taupe">{row.department || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-brand-border">
            <button
              onClick={runImport}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-warm-brown text-white text-sm font-medium hover:bg-brand-deep-brown transition-colors"
            >
              <Upload size={16} /> Import {rows.length} Employees (Demo)
            </button>
          </div>
        </div>
      )}

      {status === 'done' && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle size={16} /> Import simulated successfully!
          <button onClick={() => navigate('/employees')} className="ml-2 text-brand-warm-brown hover:underline">
            View Roster
          </button>
        </div>
      )}
    </div>
  );
}
