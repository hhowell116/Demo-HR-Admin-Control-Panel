import { useMemo } from 'react';
import { DEMO_EMPLOYEES } from '../data/demoData';
import { useNavigate } from 'react-router-dom';
import { MONTHS } from '@rco/shared';
import { ArrowLeft, Cake, Award, Sparkles } from 'lucide-react';

export function QuickCampaign() {
  const navigate = useNavigate();
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthName = MONTHS[now.getMonth()];

  const birthdays = useMemo(
    () => DEMO_EMPLOYEES.filter((e) => e.isActive && e.birthMonth === currentMonth)
      .sort((a, b) => (a.birthDay || 0) - (b.birthDay || 0)),
    [currentMonth]
  );

  const anniversaries = useMemo(() => {
    return DEMO_EMPLOYEES
      .filter((e) => {
        if (!e.isActive || !e.hireDate) return false;
        const hire = new Date(e.hireDate as string);
        return hire.getMonth() + 1 === currentMonth;
      })
      .map((e) => {
        const hire = new Date(e.hireDate as string);
        let years = currentYear - hire.getFullYear();
        return { ...e, years: Math.max(0, years) };
      })
      .filter((e) => e.years > 0);
  }, [currentMonth, currentYear]);

  return (
    <div>
      <button
        onClick={() => navigate('/campaigns')}
        className="flex items-center gap-1.5 text-sm text-brand-warm-brown hover:text-brand-deep-brown mb-4"
      >
        <ArrowLeft size={16} /> Back to Campaigns
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-brand-deep-brown">
          Quick Generate -- {monthName} {currentYear}
        </h2>
        <p className="text-sm text-brand-taupe mt-0.5">
          Auto-create birthday and anniversary campaigns from employee data
        </p>
      </div>

      <div className="bg-white rounded-xl border border-brand-border mb-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center">
              <Cake size={20} className="text-brand-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-deep-brown">{monthName} Birthdays</h3>
              <p className="text-xs text-brand-taupe">{birthdays.length} employees</p>
            </div>
          </div>
          <button
            onClick={() => console.log('[Demo] Generate birthday campaign')}
            disabled={birthdays.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-warm-brown text-white text-sm font-medium hover:bg-brand-deep-brown transition-colors disabled:opacity-50"
          >
            <Sparkles size={15} /> Generate Campaign
          </button>
        </div>
        {birthdays.length > 0 ? (
          <div className="px-5 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {birthdays.map((emp) => (
              <div key={emp.id} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-cream flex items-center justify-center text-[10px] font-medium text-brand-warm-brown">
                  {emp.firstName?.[0]}{emp.lastName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-deep-brown">{emp.firstName} {emp.lastName}</p>
                  <p className="text-[10px] text-brand-taupe">{monthName} {emp.birthDay}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-6 text-center text-sm text-brand-taupe">
            No employees have birthday data for {monthName}.
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-bronze/10 flex items-center justify-center">
              <Award size={20} className="text-brand-bronze" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-deep-brown">{monthName} Work Anniversaries</h3>
              <p className="text-xs text-brand-taupe">{anniversaries.length} employees</p>
            </div>
          </div>
          <button
            onClick={() => console.log('[Demo] Generate anniversary campaign')}
            disabled={anniversaries.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-warm-brown text-white text-sm font-medium hover:bg-brand-deep-brown transition-colors disabled:opacity-50"
          >
            <Sparkles size={15} /> Generate Campaign
          </button>
        </div>
        {anniversaries.length > 0 ? (
          <div className="px-5 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {anniversaries.map((emp) => (
              <div key={emp.id} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-cream flex items-center justify-center text-[10px] font-medium text-brand-warm-brown">
                  {emp.firstName?.[0]}{emp.lastName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-deep-brown">{emp.firstName} {emp.lastName}</p>
                  <p className="text-[10px] text-brand-bronze font-semibold">{(emp as any).years} Year Anniversary</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-6 text-center text-sm text-brand-taupe">
            No employees have hire date data for {monthName}.
          </div>
        )}
      </div>
    </div>
  );
}
