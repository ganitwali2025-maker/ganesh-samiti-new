import { PageHeader } from '../components/PageHeader';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { formatCurrency } from '../utils/format';

export function BudgetScreen() {
  const { getStats } = useCommitteeData();
  const stats = getStats();
  const TOTAL_BUDGET = 150000;
  const remaining = TOTAL_BUDGET - stats.totalExpenses;
  const spentPercent = Math.min(100, (stats.totalExpenses / TOTAL_BUDGET) * 100);
  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <PageHeader title="बजट" subtitle="समिति का बजट" />

      <div className="p-5 flex-1 overflow-y-auto">
        {/* Main Budget Card */}
        <div className="bg-[#6C4CF1] rounded-[32px] p-6 text-white shadow-[0_12px_24px_rgb(108,76,241,0.25)] relative overflow-hidden mb-6">
          <div className="absolute -right-10 -top-10 opacity-20">
            <Target className="w-40 h-40" />
          </div>
          <div className="relative z-10">
            <p className="text-indigo-200 text-xs font-bold mb-1">कुल बजट (Total Budget)</p>
            <h2 className="text-3xl font-extrabold mb-6">{formatCurrency(TOTAL_BUDGET)}</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-2">
                  <span className="text-indigo-100">खर्च हुआ (Spent)</span>
                  <span>{formatCurrency(stats.totalExpenses)}</span>
                </div>
                <div className="h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${spentPercent}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-2">
                  <span className="text-indigo-100">शेष (Remaining)</span>
                  <span>{formatCurrency(remaining)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-slate-800 text-[15px] mb-4 px-1">श्रेणी के अनुसार (By Category)</h3>
        
        <div className="space-y-4">
          {[
            { label: 'मूर्ति (Idol)', allocated: 50000, spent: 0, color: 'bg-orange-500', bg: 'bg-orange-100' },
            { label: 'सजावट (Decor)', allocated: 40000, spent: 0, color: 'bg-pink-500', bg: 'bg-pink-100' },
            { label: 'साउंड (Sound)', allocated: 20000, spent: 0, color: 'bg-blue-500', bg: 'bg-blue-100' },
            { label: 'प्रसाद (Prasad)', allocated: 30000, spent: 0, color: 'bg-emerald-500', bg: 'bg-emerald-100' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-50">
              <div className="flex justify-between items-end mb-3">
                <span className="font-bold text-slate-700 text-sm">{item.label}</span>
                <span className="text-[11px] font-bold text-slate-400">{formatCurrency(item.spent)} / {formatCurrency(item.allocated)}</span>
              </div>
              <div className={`h-2.5 ${item.bg} rounded-full overflow-hidden`}>
                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.spent / item.allocated) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
