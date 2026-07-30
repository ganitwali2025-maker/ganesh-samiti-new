import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { Receipt, Plus, ArrowUpCircle, Filter } from 'lucide-react';
import { formatCurrency } from '../utils/format';

export function ExpenseScreen() {
  const { transactions } = useCommitteeData();
  const expenses = transactions.filter(t => t.type === 'EXPENSE');

  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <PageHeader 
        title="खर्च विवरण" 
        subtitle="समिति के सभी खर्च"
        rightAction={
          <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform border border-white/10">
            <Filter className="w-4 h-4 text-white" strokeWidth={2.5} />
          </button>
        }
      />

      <div className="p-5 flex-1 overflow-y-auto">
        {/* Total Expense Card */}
        <div className="bg-rose-50 rounded-[28px] p-5 flex items-center justify-between mb-6 shadow-sm border border-rose-100">
          <div>
             <p className="text-[12px] font-bold text-rose-600 mb-1">कुल खर्च (Total Expense)</p>
             <h3 className="text-2xl font-extrabold text-rose-500">₹68,450</h3>
          </div>
          <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center">
            <Receipt className="w-7 h-7 text-rose-600" />
          </div>
        </div>

        {/* Categories Horizontal */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x mb-2">
          {['सभी (All)', 'मूर्ति (Idol)', 'सजावट (Decor)', 'प्रसाद (Food)', 'अन्य (Other)'].map((cat, i) => (
            <button key={i} className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[12px] font-bold snap-center transition-colors ${i === 0 ? 'bg-[#FF7A00] text-white shadow-md' : 'bg-white text-slate-500 border border-slate-100'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Expense List */}
        <div className="space-y-3 pb-20">
          {expenses.map(t => (
            <div key={t.id} className="bg-white p-4 rounded-3xl shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-[16px] bg-rose-50 flex items-center justify-center text-rose-500">
                <ArrowUpCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-[14px]">{t.category}</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{t.description}</p>
              </div>
              <div className="text-right">
                <span className="text-[15px] font-bold text-rose-500">{formatCurrency(t.amount)}</span>
                <p className="text-[9px] text-slate-400 font-medium mt-1">{new Date(t.date).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Add Expense Button */}
      <button className="absolute bottom-24 right-5 w-14 h-14 bg-rose-500 rounded-[20px] flex items-center justify-center text-white shadow-[0_8px_20px_rgb(244,63,94,0.4)] active:scale-95 transition-transform z-10">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
