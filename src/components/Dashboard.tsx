import { useCommitteeData } from '../hooks/useCommitteeData';
import { useNavigation } from '../context/NavigationContext';
import { 
  Menu, Bell, Users, Landmark, Wallet, Receipt, Target, 
  PiggyBank, Building2, BarChart3, Calendar, Megaphone,
  ArrowDownCircle, ArrowUpCircle, ChevronRight, UserPlus, FileText,
  Zap, ChevronDown
} from 'lucide-react';
import { formatCurrency } from '../utils/format';

export function Dashboard({ data }: { data: ReturnType<typeof useCommitteeData> }) {
  const { navigate, openDrawer } = useNavigation();
  const stats = data.getStats();
  const recentTransactions = data.transactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return (
    <div className="flex flex-col relative pb-8 min-h-screen bg-[#FFF8F1]">
      {/* Fixed Sticky Header */}
      <div className="fixed top-0 inset-x-0 z-40 bg-gradient-to-r from-[#FF7A00] via-[#FFA726] to-[#FFD54F] rounded-b-[40px] shadow-[0_12px_40px_rgba(255,122,0,0.25)] overflow-hidden pt-12 pb-6 px-5 border-b border-white/20">
         {/* Subtle glowing watermark */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
         
         <div className="flex justify-between items-center relative z-10">
            <button 
              onClick={openDrawer}
              className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-[18px] flex items-center justify-center text-white active:scale-95 transition-all border border-white/30 shadow-sm hover:bg-white/30"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 relative flex justify-center items-center mb-1.5">
                 <img src="/logo.png" 
                      alt="Logo" 
                      className="w-14 h-14 object-cover rounded-full shadow-lg border-[2px] border-white relative z-10" />
                 <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-40 animate-pulse"></div>
              </div>
              <h1 className="text-[22px] font-extrabold text-white tracking-wide leading-tight shadow-black/10 drop-shadow-md" style={{ fontFamily: 'sans-serif' }}>गणेश समिति</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-[1px] w-4 bg-white/40"></div>
                <p className="text-[9px] font-extrabold text-white/95 tracking-widest uppercase">एकता • सेवा • विकास</p>
                <div className="h-[1px] w-4 bg-white/40"></div>
              </div>
            </div>

            <button 
              onClick={() => navigate('notifications')}
              className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-[18px] flex items-center justify-center text-white relative active:scale-95 transition-all border border-white/30 shadow-sm hover:bg-white/30"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-orange-400"></span>
            </button>
         </div>
      </div>

      {/* Main Content Padding - To push content below fixed header */}
      <div className="pt-[220px]"></div>

      {/* Dashboard Cards (Horizontal Scroll) */}
      <div className="px-5 mt-6 flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
        {/* Total Collection */}
        <div 
          onClick={() => navigate('collection')}
          className="min-w-[85vw] md:min-w-[280px] h-[170px] bg-[#A78BFA] rounded-[24px] p-6 snap-center relative overflow-hidden active:scale-[0.98] transition-transform flex flex-col justify-between text-white"
        >
          <div className="flex justify-between items-start relative z-10">
            <p className="font-medium tracking-wide text-[13px] opacity-90">कुल जमा</p>
            <div className="w-10 h-7 bg-white/20 rounded-md flex items-center justify-center">
               <Users className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h3 className="text-[34px] font-bold relative z-10 tracking-widest mt-auto mb-3" style={{ fontFamily: 'monospace' }}>₹1,25,600</h3>
          
          <div className="flex justify-between items-end relative z-10">
            <p className="text-[12px] opacity-90 font-medium tracking-wide">गणेश समिति</p>
            <p className="text-[11px] opacity-80 font-medium">इस महीने</p>
          </div>
        </div>

        {/* Total Expenses */}
        <div 
          onClick={() => navigate('expense')}
          className="min-w-[85vw] md:min-w-[280px] h-[170px] bg-[#F472B6] rounded-[24px] p-6 snap-center relative overflow-hidden active:scale-[0.98] transition-transform flex flex-col justify-between text-white"
        >
          <div className="flex justify-between items-start relative z-10">
            <p className="font-medium tracking-wide text-[13px] opacity-90">कुल खर्च</p>
            <div className="w-10 h-7 bg-white/20 rounded-md flex items-center justify-center">
               <ArrowDownCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h3 className="text-[34px] font-bold relative z-10 tracking-widest mt-auto mb-3" style={{ fontFamily: 'monospace' }}>₹68,450</h3>
          
          <div className="flex justify-between items-end relative z-10">
            <p className="text-[12px] opacity-90 font-medium tracking-wide">गणेश समिति</p>
            <p className="text-[11px] opacity-80 font-medium">इस महीने</p>
          </div>
        </div>

        {/* Balance */}
        <div 
          onClick={() => navigate('bank')}
          className="min-w-[85vw] md:min-w-[280px] h-[170px] bg-[#6366F1] rounded-[24px] p-6 snap-center relative overflow-hidden active:scale-[0.98] transition-transform flex flex-col justify-between text-white"
        >
          <div className="flex justify-between items-start relative z-10">
            <p className="font-medium tracking-wide text-[13px] opacity-90">शेष राशि</p>
            <div className="w-10 h-7 bg-white/20 rounded-md flex items-center justify-center">
               <Wallet className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h3 className="text-[34px] font-bold relative z-10 tracking-widest mt-auto mb-3" style={{ fontFamily: 'monospace' }}>₹57,150</h3>
          
          <div className="flex justify-between items-end relative z-10">
            <p className="text-[12px] opacity-90 font-medium tracking-wide">गणेश समिति</p>
            <p className="text-[11px] opacity-80 font-medium">आज तक</p>
          </div>
        </div>
      </div>

      {/* Quick Menu Grid (2 Rows x 5 Columns) */}
      <div className="px-5 mt-2">
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
          <div className="grid grid-cols-5 gap-y-6 gap-x-3">
            {[
              { icon: Users, label: 'सदस्य', color: 'text-orange-500', bg: 'bg-orange-50', route: 'members' as const },
              { icon: Landmark, label: 'मासिक', color: 'text-emerald-500', bg: 'bg-emerald-50', route: 'collection' as const },
              { icon: Wallet, label: 'जमा', color: 'text-blue-500', bg: 'bg-blue-50', route: 'deposit' as const },
              { icon: Receipt, label: 'खर्च', color: 'text-rose-500', bg: 'bg-rose-50', route: 'expense' as const },
              { icon: Target, label: 'बजट', color: 'text-indigo-500', bg: 'bg-indigo-50', route: 'budget' as const },
              { icon: PiggyBank, label: 'बचत', color: 'text-pink-500', bg: 'bg-pink-50', route: 'savings' as const },
              { icon: Building2, label: 'बैंक', color: 'text-cyan-500', bg: 'bg-cyan-50', route: 'bank' as const },
              { icon: BarChart3, label: 'रिपोर्ट', color: 'text-teal-600', bg: 'bg-teal-50', route: 'reports' as const },
              { icon: Calendar, label: 'प्रोग्राम', color: 'text-amber-500', bg: 'bg-amber-50', route: 'events' as const },
              { icon: Megaphone, label: 'सूचनाएं', color: 'text-violet-500', bg: 'bg-violet-50', route: 'notice' as const },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => navigate(item.route)}
                className="flex flex-col items-center gap-2.5 cursor-pointer active:scale-90 transition-transform group"
              >
                <div className={`w-[46px] h-[46px] rounded-[18px] ${item.bg} flex items-center justify-center shadow-sm border border-white/50 group-hover:shadow-md transition-all`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-extrabold text-slate-600 whitespace-nowrap tracking-wide">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Savings Goal & Quick Actions Grid */}
      <div className="px-5 mt-5 grid grid-cols-2 gap-4 pb-[100px]">
        {/* Savings Goal Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden flex flex-col justify-center items-center">
          <div className="flex w-full justify-between items-center mb-2 absolute top-4 left-0 px-5">
            <h4 className="font-extrabold text-slate-800 text-[12px] flex items-center gap-1.5"><Target className="w-4 h-4 text-[#FF7A00]" /> बचत लक्ष्य</h4>
          </div>
          
          <div className="relative w-28 h-28 mt-6">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-orange-100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="text-[#FF7A00]"
                strokeDasharray="62, 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-slate-800">62%</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">पूर्ण</span>
            </div>
          </div>
          <div className="text-center mt-3">
             <p className="text-[10px] font-bold text-slate-500">लक्ष्य: ₹2,00,000</p>
             <p className="text-[11px] font-extrabold text-emerald-500 mt-0.5">₹1,25,600 प्राप्त</p>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
          <div className="flex items-center gap-1.5 mb-4">
            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <h4 className="font-extrabold text-slate-800 text-[12px]">त्वरित कार्य</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('members')} className="flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 rounded-[20px] p-3 border border-slate-100 active:scale-95 transition-all">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shadow-inner"><UserPlus className="w-4 h-4 text-emerald-600" /></div>
              <span className="text-[9px] font-extrabold text-slate-600">सदस्य</span>
            </button>
            <button onClick={() => navigate('deposit')} className="flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 rounded-[20px] p-3 border border-slate-100 active:scale-95 transition-all">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shadow-inner"><ArrowDownCircle className="w-4 h-4 text-blue-600" /></div>
              <span className="text-[9px] font-extrabold text-slate-600">जमा</span>
            </button>
            <button onClick={() => navigate('expense')} className="flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 rounded-[20px] p-3 border border-slate-100 active:scale-95 transition-all">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shadow-inner"><ArrowUpCircle className="w-4 h-4 text-rose-600" /></div>
              <span className="text-[9px] font-extrabold text-slate-600">खर्च</span>
            </button>
            <button onClick={() => navigate('reports')} className="flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 rounded-[20px] p-3 border border-slate-100 active:scale-95 transition-all">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shadow-inner"><FileText className="w-4 h-4 text-purple-600" /></div>
              <span className="text-[9px] font-extrabold text-slate-600">रिपोर्ट</span>
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
