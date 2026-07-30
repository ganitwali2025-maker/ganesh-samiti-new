import { PageHeader } from '../components/PageHeader';
import { PiggyBank, Target, Plus, CheckCircle2 } from 'lucide-react';

export function SavingsScreen() {
  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <PageHeader title="बचत" subtitle="समिति की कुल बचत" />

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="bg-pink-50 rounded-[32px] p-6 shadow-sm border border-pink-100 flex flex-col items-center justify-center text-center mb-8">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <PiggyBank className="w-10 h-10 text-pink-500" />
          </div>
          <p className="text-pink-600 text-[12px] font-bold mb-1">कुल बचत (Total Savings)</p>
          <h2 className="text-3xl font-extrabold text-pink-600 mb-2">₹45,000</h2>
          <p className="text-pink-400 text-xs font-medium">For next year's festival</p>
        </div>

        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-bold text-slate-800 text-[15px]">बचत लक्ष्य (Savings Goals)</h3>
          <button className="text-[12px] font-bold text-[#FF7A00] flex items-center gap-1">
            <Plus className="w-4 h-4" /> नया लक्ष्य
          </button>
        </div>

        <div className="space-y-4 pb-20">
          <div className="bg-white p-5 rounded-3xl shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[14px] bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">आपातकालीन फंड</h4>
                <p className="text-xs text-slate-400 font-medium">Emergency Fund</p>
              </div>
            </div>
            
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-emerald-500">₹20,000 (100%)</span>
              <span className="text-slate-400">Target: ₹20,000</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-full"></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-50 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[14px] bg-blue-50 flex items-center justify-center text-blue-500">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">अगले साल की मूर्ति</h4>
                <p className="text-xs text-slate-400 font-medium">Next Year's Idol</p>
              </div>
            </div>
            
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-blue-500">₹25,000 (50%)</span>
              <span className="text-slate-400">Target: ₹50,000</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full w-[50%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
