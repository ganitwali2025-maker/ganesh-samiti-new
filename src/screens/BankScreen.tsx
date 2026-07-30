import { TopAppBar } from '../components/TopAppBar';
import { Building2, Copy, Download, Share2 } from 'lucide-react';

export function BankScreen() {
  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <TopAppBar title="बैंक विवरण (Bank Details)" />

      <div className="p-5 flex-1 overflow-y-auto">
        {/* ATM Card UI */}
        <div className="w-full aspect-[1.6] bg-gradient-to-br from-slate-800 to-slate-900 rounded-[28px] p-6 text-white shadow-[0_16px_32px_rgba(0,0,0,0.3)] relative overflow-hidden mb-8">
          {/* Card Design Elements */}
          <div className="absolute right-[-20%] top-[-20%] w-[60%] h-[150%] bg-white/5 -rotate-12 pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          
          <div className="flex justify-between items-start relative z-10">
            <h3 className="font-bold text-lg tracking-widest text-slate-200">STATE BANK OF INDIA</h3>
            <div className="w-12 h-8 bg-yellow-400/80 rounded-md"></div>
          </div>
          
          <div className="mt-8 relative z-10">
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Account Number</p>
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-mono tracking-[0.2em]">3456 7890 1234</h2>
              <button className="text-slate-400 hover:text-white active:scale-95"><Copy className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-end relative z-10">
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Account Holder</p>
              <p className="font-bold tracking-wide">GANESH SAMITI TRUST</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1 text-right">IFSC Code</p>
              <p className="font-bold font-mono">SBIN0001234</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button className="flex-1 bg-white h-14 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center gap-2 font-bold text-slate-700 text-sm active:scale-95 transition-transform">
            <Download className="w-4 h-4" /> Statement
          </button>
          <button className="flex-1 bg-white h-14 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center gap-2 font-bold text-[#FF7A00] text-sm active:scale-95 transition-transform">
            <Share2 className="w-4 h-4" /> Share Details
          </button>
        </div>

        <h3 className="font-bold text-slate-800 text-[15px] mb-4 px-1">UPI विवरण (UPI Details)</h3>
        
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-50 flex flex-col items-center">
           <div className="w-40 h-40 bg-slate-100 rounded-2xl mb-4 p-2">
             <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" className="w-full h-full opacity-80 mix-blend-multiply" />
           </div>
           <p className="font-mono font-bold text-slate-700 mb-1">ganeshsamiti@sbi</p>
           <p className="text-[11px] text-slate-400 font-medium">Scan to pay directly to bank</p>
        </div>
      </div>
    </div>
  );
}
