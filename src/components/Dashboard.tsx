import { useCommitteeData } from '../hooks/useCommitteeData';
import { useNavigation } from '../context/NavigationContext';
import { 
  Menu, Bell, Users, Landmark, Wallet, Receipt, Target, 
  Building2, BarChart3, Calendar, Megaphone,
  ArrowDownCircle, ArrowUpCircle, UserPlus, FileText,
  HandCoins, WalletCards, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import { formatCurrency } from '../utils/format';

export function Dashboard({ data }: { data: ReturnType<typeof useCommitteeData> }) {
  const { navigate, openDrawer } = useNavigation();
  const stats = data.getStats();

  return (
    <div className="flex flex-col relative pb-[100px] min-h-screen bg-[#FFF8F3]">
      {/* 1. HEADER (Orange Gradient) */}
      <div className="relative bg-gradient-to-b from-[#FF6B00] to-[#FF9F1A] rounded-b-[40px] pt-12 pb-8 px-5 overflow-hidden shadow-sm">
         {/* Subtle watermark */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
         
         <div className="flex justify-between items-center relative z-10">
            <button 
              onClick={openDrawer}
              className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-[16px] flex items-center justify-center text-white active:scale-95 transition-all"
            >
              <Menu className="w-6 h-6" strokeWidth={2} />
            </button>
            
            <div className="flex flex-col items-center">
              <div className="w-[72px] h-[72px] rounded-full bg-white p-1 shadow-lg mb-2 relative">
                 <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <h1 className="text-[22px] font-extrabold text-white tracking-wide shadow-black/10 drop-shadow-sm">गणेश समिति</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-[1px] w-5 bg-white/40"></div>
                <p className="text-[10px] font-bold text-white/95 tracking-widest uppercase">एकता • सेवा • विकास</p>
                <div className="h-[1px] w-5 bg-white/40"></div>
              </div>
            </div>

            <button 
              onClick={() => navigate('notifications')}
              className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-[16px] flex items-center justify-center text-white relative active:scale-95 transition-all"
            >
              <Bell className="w-6 h-6" strokeWidth={2} />
              <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-[#FF5A5F] rounded-full border-2 border-[#FF8A00]"></span>
            </button>
         </div>
      </div>

      {/* 2. TOP DASHBOARD (Purple 70% / Pink 30%) */}
      <div className="px-5 mt-[-16px] relative z-20 flex gap-3">
         {/* Left Card (Purple) */}
         <div className="w-[65%] bg-gradient-to-br from-[#7357FF] to-[#9A7DFF] rounded-[28px] p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div>
              <div className="flex justify-between items-start mb-1">
                <p className="text-[13px] font-semibold opacity-90">कुल जमा राशि</p>
                <div className="w-8 h-6 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <WalletCards className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-[28px] font-bold tracking-wider mb-1" style={{ fontFamily: 'monospace' }}>₹1,25,600</h3>
              
              <div className="flex items-center justify-between mt-1 mb-4">
                 <p className="text-[11px] font-medium opacity-90">गणेश समिति</p>
                 <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm cursor-pointer">
                    <span className="text-[9px] font-semibold">इस महीने</span>
                    <ArrowUpRight className="w-3 h-3" />
                 </div>
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 border-t border-white/20 pt-3">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                 </div>
                 <div>
                   <p className="text-[9px] opacity-80 font-medium">कुल सदस्य</p>
                   <p className="text-[13px] font-bold">125</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                 </div>
                 <div>
                   <p className="text-[9px] opacity-80 font-medium">औसत जमा</p>
                   <p className="text-[13px] font-bold">₹45,300</p>
                 </div>
               </div>
            </div>
         </div>

         {/* Right Card (Pink) */}
         <div className="w-[35%] bg-gradient-to-br from-[#FF5FA2] to-[#FF7EB3] rounded-[28px] p-4 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="flex justify-between items-start mb-2 relative z-10">
               <div>
                  <p className="text-[11px] font-medium opacity-90">मासिक अपडेट</p>
                  <p className="text-[10px] font-bold mt-1">जुलाई - 2025</p>
               </div>
               <Calendar className="w-4 h-4 text-white/80" />
            </div>

            <div className="mt-auto relative z-10 space-y-3">
               <div>
                 <p className="text-[9px] font-medium opacity-80">मासिक जमा</p>
                 <p className="text-[16px] font-bold">₹25,400</p>
               </div>
               <div className="h-[1px] w-full bg-white/20"></div>
               <div>
                 <p className="text-[9px] font-medium opacity-80">मासिक खर्च</p>
                 <p className="text-[16px] font-bold">₹8,750</p>
               </div>
            </div>
         </div>
      </div>

      {/* 3. MENU GRID */}
      <div className="px-5 mt-5">
         <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50">
            <div className="grid grid-cols-5 gap-y-6 gap-x-2">
              {[
                { icon: Users, label: 'सदस्य', color: 'text-[#FF7A00]', bg: 'bg-orange-50', route: 'members' as const },
                { icon: Landmark, label: 'जमा', color: 'text-[#2ECC71]', bg: 'bg-green-50', route: 'collection' as const },
                { icon: WalletCards, label: 'निकासी', color: 'text-[#3B82F6]', bg: 'bg-blue-50', route: 'bank' as const },
                { icon: Receipt, label: 'खर्च', color: 'text-[#FF5FA2]', bg: 'bg-pink-50', route: 'expense' as const },
                { icon: Target, label: 'बजट', color: 'text-[#7357FF]', bg: 'bg-purple-50', route: 'budget' as const },
                { icon: HandCoins, label: 'ऋण', color: 'text-[#FF5A5F]', bg: 'bg-red-50', route: 'savings' as const },
                { icon: Building2, label: 'सेविंग', color: 'text-[#20B2AA]', bg: 'bg-teal-50', route: 'savings' as const },
                { icon: BarChart3, label: 'रिपोर्ट', color: 'text-[#2ECC71]', bg: 'bg-emerald-50', route: 'reports' as const },
                { icon: Calendar, label: 'प्रोग्राम', color: 'text-[#F59E0B]', bg: 'bg-amber-50', route: 'events' as const },
                { icon: Megaphone, label: 'सूचनाएं', color: 'text-[#8B5CF6]', bg: 'bg-violet-50', route: 'notice' as const },
              ].map((item, i) => (
                <div key={i} onClick={() => navigate(item.route)} className="flex flex-col items-center gap-2 cursor-pointer active:scale-90 transition-transform">
                  <div className={`w-12 h-12 rounded-[16px] ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-bold text-[#666666] tracking-wide">{item.label}</span>
                </div>
              ))}
            </div>
         </div>
      </div>

      {/* 4. QUICK SUMMARY (त्वरित जानकारी) */}
      <div className="px-5 mt-5">
         <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-[15px] font-bold text-[#222222]">त्वरित जानकारी</h3>
            <div className="flex items-center gap-1 text-[#999999]">
               <RefreshCw className="w-3 h-3" />
               <span className="text-[10px] font-medium">अपडेट: आज, 9:30 AM</span>
            </div>
         </div>
         
         <div className="grid grid-cols-3 gap-3">
            {/* Green */}
            <div className="bg-white rounded-[20px] p-3 shadow-sm border border-emerald-50">
               <div className="flex justify-center mb-2">
                  <p className="text-[10px] font-semibold text-[#666666]">कुल जमा (माह)</p>
               </div>
               <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-[#2ECC71] flex items-center justify-center shadow-sm">
                        <ArrowUpRight className="w-4 h-4 text-white" />
                     </div>
                     <span className="text-[15px] font-bold text-[#2ECC71]">₹25,400</span>
                  </div>
                  <p className="text-[9px] font-bold text-[#2ECC71]">↑ 12% इस माह</p>
               </div>
            </div>

            {/* Pink */}
            <div className="bg-white rounded-[20px] p-3 shadow-sm border border-pink-50">
               <div className="flex justify-center mb-2">
                  <p className="text-[10px] font-semibold text-[#666666]">कुल खर्च (माह)</p>
               </div>
               <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-[#FF5FA2] flex items-center justify-center shadow-sm">
                        <ArrowDownRight className="w-4 h-4 text-white" />
                     </div>
                     <span className="text-[15px] font-bold text-[#FF5FA2]">₹8,750</span>
                  </div>
                  <p className="text-[9px] font-bold text-[#FF5FA2]">↓ 8% इस माह</p>
               </div>
            </div>

            {/* Blue */}
            <div className="bg-white rounded-[20px] p-3 shadow-sm border border-blue-50">
               <div className="flex justify-center mb-2">
                  <p className="text-[10px] font-semibold text-[#666666]">शेष राशि</p>
               </div>
               <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-[#3B82F6] flex items-center justify-center shadow-sm">
                        <Wallet className="w-3.5 h-3.5 text-white" />
                     </div>
                     <span className="text-[15px] font-bold text-[#3B82F6]">₹45,300</span>
                  </div>
                  <p className="text-[9px] font-medium text-[#999999]">कुल शेष</p>
               </div>
            </div>
         </div>
      </div>

      {/* 5. MAIN ACTIONS (मुख्य गतिविधियाँ) */}
      <div className="px-5 mt-5 mb-6">
         <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-[15px] font-bold text-[#222222]">मुख्य गतिविधियाँ</h3>
         </div>
         <div className="bg-white rounded-[24px] p-4 shadow-sm grid grid-cols-4 gap-3">
            <div onClick={() => navigate('members')} className="flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all">
               <div className="w-[52px] h-[52px] rounded-[16px] bg-green-50 border border-green-100 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-[#2ECC71]" strokeWidth={2} />
               </div>
               <span className="text-[10px] font-bold text-[#666666]">सदस्य जोड़ें</span>
            </div>
            
            <div onClick={() => navigate('deposit')} className="flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all">
               <div className="w-[52px] h-[52px] rounded-[16px] bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <ArrowDownCircle className="w-6 h-6 text-[#3B82F6]" strokeWidth={2} />
               </div>
               <span className="text-[10px] font-bold text-[#666666]">जमा जोड़ें</span>
            </div>

            <div onClick={() => navigate('expense')} className="flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all">
               <div className="w-[52px] h-[52px] rounded-[16px] bg-red-50 border border-red-100 flex items-center justify-center">
                  <ArrowUpCircle className="w-6 h-6 text-[#FF5A5F]" strokeWidth={2} />
               </div>
               <span className="text-[10px] font-bold text-[#666666]">खर्च जोड़ें</span>
            </div>

            <div onClick={() => navigate('reports')} className="flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all">
               <div className="w-[52px] h-[52px] rounded-[16px] bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#7357FF]" strokeWidth={2} />
               </div>
               <span className="text-[10px] font-bold text-[#666666]">रिपोर्ट देखें</span>
            </div>
         </div>
      </div>
      
    </div>
  );
}
