import { TopAppBar } from '../components/TopAppBar';
import { BarChart3, Download, Share2, FileText, PieChart } from 'lucide-react';

export function ReportsScreen() {
  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <TopAppBar title="रिपोर्ट (Reports)" />

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="flex justify-between items-end mb-6 px-1">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Financial<br/>Summary</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Ganesh Utsav 2025</p>
          </div>
          <div className="w-12 h-12 bg-[#FF7A00]/10 rounded-2xl flex items-center justify-center text-[#FF7A00]">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-50">
            <p className="text-[11px] font-bold text-slate-400 mb-1">कुल जमा</p>
            <h3 className="text-lg font-bold text-emerald-500 mb-3">₹1,25,600</h3>
            <div className="h-1.5 bg-emerald-50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[100%] rounded-full"></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-50">
            <p className="text-[11px] font-bold text-slate-400 mb-1">कुल खर्च</p>
            <h3 className="text-lg font-bold text-rose-500 mb-3">₹68,450</h3>
            <div className="h-1.5 bg-rose-50 rounded-full overflow-hidden">
              <div className="h-full bg-rose-400 w-[55%] rounded-full"></div>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-slate-800 text-[15px] mb-4 px-1">Download Reports</h3>
        
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-3xl shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-50 flex items-center gap-4 active:scale-[0.98] transition-transform">
            <div className="w-12 h-12 rounded-[16px] bg-indigo-50 flex items-center justify-center text-indigo-500">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-[14px]">Full Ledger</h4>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">PDF • 2.4 MB</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
              <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-50 flex items-center gap-4 active:scale-[0.98] transition-transform">
            <div className="w-12 h-12 rounded-[16px] bg-emerald-50 flex items-center justify-center text-emerald-500">
              <PieChart className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-[14px]">Expense Summary</h4>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Excel • 1.1 MB</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
