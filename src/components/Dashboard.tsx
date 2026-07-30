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
    <div className="flex flex-col relative pb-8">
      {/* Background Mandala & Header Section */}
      <div className="absolute top-0 inset-x-0 h-[400px] pointer-events-none -z-10 flex justify-center">
         <div className="absolute top-8 w-72 h-72 bg-[#FF7A00]/10 rounded-full blur-[80px]"></div>
         <svg className="w-full h-[400px] opacity-10 text-[#FF7A00] absolute top-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="1 3" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="4 2" />
         </svg>
      </div>
      
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex justify-between items-start relative z-10">
        <button 
          onClick={openDrawer}
          className="w-11 h-11 bg-white rounded-[16px] flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-slate-700 active:scale-95 transition-transform"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center">
          {/* Ganesha Illustration Wrapper */}
          <div className="w-32 h-32 mb-1 relative flex justify-center items-center">
             <img src="https://images.unsplash.com/photo-1579737920194-6725ea6198f7?q=80&w=256&auto=format&fit=crop" 
                  alt="Lord Ganesha" 
                  className="w-24 h-24 object-cover rounded-full shadow-lg border-[3px] border-white relative z-10" />
             <div className="absolute inset-0 bg-yellow-300 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-extrabold text-[#4A3B32] tracking-tight mb-1" style={{ fontFamily: 'sans-serif' }}>गणेश समिति</h1>
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-8 bg-[#FF7A00]/40"></div>
            <p className="text-xs font-bold text-[#FF7A00]">एकता • सेवा • विकास</p>
            <div className="h-[1px] w-8 bg-[#FF7A00]/40"></div>
          </div>
        </div>

        <button 
          onClick={() => navigate('notifications')}
          className="w-11 h-11 bg-white rounded-[16px] flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-slate-700 relative active:scale-95 transition-transform"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* Dashboard Cards (Horizontal Scroll) */}
      <div className="px-5 mt-6 flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
        {/* Total Collection */}
        <div 
          onClick={() => navigate('collection')}
          className="min-w-[155px] flex-1 bg-white rounded-[24px] p-5 shadow-[0_8px_20px_rgb(0,0,0,0.03)] border border-slate-100 snap-center relative overflow-hidden active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">कुल जमा</p>
              <p className="text-[10px] text-slate-400">इस महीने</p>
            </div>
          </div>
          <h3 className="text-[22px] font-bold text-emerald-500 relative z-10">₹1,25,600</h3>
        </div>

        {/* Total Expenses */}
        <div 
          onClick={() => navigate('expense')}
          className="min-w-[155px] flex-1 bg-white rounded-[24px] p-5 shadow-[0_8px_20px_rgb(0,0,0,0.03)] border border-slate-100 snap-center relative overflow-hidden active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">कुल खर्च</p>
              <p className="text-[10px] text-slate-400">इस महीने</p>
            </div>
          </div>
          <h3 className="text-[22px] font-bold text-rose-500 relative z-10">₹68,450</h3>
        </div>

        {/* Balance */}
        <div 
          onClick={() => navigate('bank')}
          className="min-w-[155px] flex-1 bg-gradient-to-br from-[#8066FF] to-[#5C3CE6] rounded-[24px] p-5 shadow-[0_12px_24px_rgb(108,76,241,0.25)] snap-center relative overflow-hidden active:scale-[0.98] transition-transform"
        >
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-indigo-100 font-semibold">शेष राशि</p>
              <p className="text-[10px] text-indigo-200">आज तक</p>
            </div>
          </div>
          <h3 className="text-[22px] font-bold text-white relative z-10">₹57,150</h3>
        </div>
      </div>

      {/* Quick Menu Grid (2 Rows x 5 Columns) */}
      <div className="px-5 mt-2">
        <div className="bg-white rounded-[32px] p-5 shadow-[0_8px_20px_rgb(0,0,0,0.02)] border border-slate-50">
          <div className="grid grid-cols-5 gap-y-5 gap-x-2">
            {[
              { icon: Users, label: 'सदस्य', color: 'text-[#FF7A00]', bg: 'bg-[#FF7A00]/10', route: 'members' as const },
              { icon: Landmark, label: 'मासिक जमा', color: 'text-emerald-500', bg: 'bg-emerald-50', route: 'collection' as const },
              { icon: Wallet, label: 'पैसा जमा', color: 'text-blue-500', bg: 'bg-blue-50', route: 'deposit' as const },
              { icon: Receipt, label: 'खर्च', color: 'text-rose-500', bg: 'bg-rose-50', route: 'expense' as const },
              { icon: Target, label: 'बजट', color: 'text-[#6C4CF1]', bg: 'bg-[#6C4CF1]/10', route: 'budget' as const },
              { icon: PiggyBank, label: 'बचत', color: 'text-pink-500', bg: 'bg-pink-50', route: 'savings' as const },
              { icon: Building2, label: 'बैंक विवरण', color: 'text-indigo-500', bg: 'bg-indigo-50', route: 'bank' as const },
              { icon: BarChart3, label: 'रिपोर्ट', color: 'text-emerald-600', bg: 'bg-emerald-50', route: 'reports' as const },
              { icon: Calendar, label: 'कार्यक्रम', color: 'text-[#FF7A00]', bg: 'bg-[#FF7A00]/10', route: 'events' as const },
              { icon: Megaphone, label: 'सूचनाएं', color: 'text-violet-500', bg: 'bg-violet-50', route: 'notice' as const },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => navigate(item.route)}
                className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              >
                <div className={`w-12 h-12 rounded-[18px] ${item.bg} flex items-center justify-center`}>
                  <item.icon className={`w-[22px] h-[22px] ${item.color}`} />
                </div>
                <span className="text-[10px] font-medium text-slate-600 whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="px-5 mt-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#FF7A00] rounded-full"></div>
            <h3 className="text-base font-bold text-slate-800">हालिया लेन-देन</h3>
          </div>
          <button className="text-[12px] font-semibold text-blue-600 flex items-center bg-blue-50 px-3 py-1 rounded-full">
            सभी देखें <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="bg-white rounded-[28px] p-2 shadow-[0_8px_20px_rgb(0,0,0,0.02)] border border-slate-50 space-y-1">
          {recentTransactions.map((t, i) => {
            const member = data.members.find(m => m.id === t.memberId);
            const isDeposit = t.type === 'DEPOSIT';
            return (
              <div key={t.id} className="flex items-center justify-between p-3.5 bg-transparent hover:bg-slate-50 rounded-[20px] transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-[16px] flex items-center justify-center ${isDeposit ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                    {isDeposit ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-[13px]">{member ? member.name : t.category}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {isDeposit ? `सदस्य आईडी: GM-${1000 + (member?.id || 1)}` : `खर्च श्रेणी: ${t.category}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-[14px] ${isDeposit ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {formatCurrency(t.amount)}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {new Date(t.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <button className="w-full py-3 flex items-center justify-center text-[12px] font-semibold text-[#FF7A00] gap-1">
            और देखें <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Savings Goal & Quick Actions Grid */}
      <div className="px-5 mt-5 grid grid-cols-2 gap-4 pb-12">
        {/* Savings Goal Card */}
        <div className="bg-white rounded-[28px] p-5 shadow-[0_8px_20px_rgb(0,0,0,0.02)] border border-slate-50 relative overflow-hidden flex flex-col justify-between">
          {/* Lotus Watermark */}
          <div className="absolute -bottom-6 -right-6 opacity-[0.04] pointer-events-none">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-36 h-36 text-[#FF7A00]">
              <path d="M12 2C12 2 12 12 2 12C12 12 12 22 12 22C12 22 12 12 22 12C12 12 12 2 12 2Z"/>
            </svg>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#FF7A00]" />
                <h4 className="font-bold text-slate-800 text-[13px]">बचत लक्ष्य</h4>
              </div>
              <button className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-md">संपादित करें</button>
            </div>
            
            <p className="text-[10px] font-medium text-slate-500 mb-0.5">इस वर्ष का लक्ष्य</p>
            <p className="text-lg font-bold text-slate-800 mb-5">₹2,00,000</p>
          </div>
          
          <div>
            <div className="relative h-2.5 bg-orange-100/50 rounded-full overflow-hidden mb-2">
              <div className="absolute top-0 left-0 h-full bg-[#FF7A00] rounded-full w-[62%]"></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-semibold">
              <span className="text-emerald-500">प्राप्त राशि: ₹1,25,600</span>
              <span className="text-slate-600">62%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-[28px] p-4 shadow-[0_8px_20px_rgb(0,0,0,0.02)] border border-slate-50">
          <div className="flex items-center gap-1.5 mb-3">
            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <h4 className="font-bold text-slate-800 text-[13px]">त्वरित कार्य</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 h-full pb-2">
            <button 
              onClick={() => navigate('members')}
              className="flex flex-col items-center justify-center gap-1.5 bg-slate-50/80 hover:bg-slate-100 rounded-2xl p-2 active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                 <UserPlus className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-[9px] font-medium text-slate-600">सदस्य जोड़ें</span>
            </button>
            <button 
              onClick={() => navigate('deposit')}
              className="flex flex-col items-center justify-center gap-1.5 bg-slate-50/80 hover:bg-slate-100 rounded-2xl p-2 active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                 <ArrowDownCircle className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-[9px] font-medium text-slate-600">जमा करें</span>
            </button>
            <button 
              onClick={() => navigate('expense')}
              className="flex flex-col items-center justify-center gap-1.5 bg-slate-50/80 hover:bg-slate-100 rounded-2xl p-2 active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                 <ArrowUpCircle className="w-4 h-4 text-rose-500" />
              </div>
              <span className="text-[9px] font-medium text-slate-600">खर्च जोड़ें</span>
            </button>
            <button 
              onClick={() => navigate('reports')}
              className="flex flex-col items-center justify-center gap-1.5 bg-slate-50/80 hover:bg-slate-100 rounded-2xl p-2 active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                 <FileText className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-[9px] font-medium text-slate-600">रिपोर्ट देखें</span>
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
