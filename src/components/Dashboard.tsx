import { useState, useRef } from 'react';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { useNavigation } from '../context/NavigationContext';
import { 
  Menu, Bell, Users, Landmark, Wallet, Receipt, Target, 
  Building2, BarChart3, Calendar, Megaphone,
  ArrowDownCircle, ArrowUpCircle, UserPlus, FileText,
  HandCoins, WalletCards, ArrowUpRight, ArrowDownRight, RefreshCw,
  Banknote
} from 'lucide-react';
import { formatCurrency } from '../utils/format';

export function Dashboard({ data }: { data: ReturnType<typeof useCommitteeData> }) {
  const { navigate, openDrawer } = useNavigation();
  const stats = data.getStats();

  const [activeCard, setActiveCard] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.offsetWidth;
      // Calculate which card is currently most visible
      const newIndex = Math.round(scrollPosition / cardWidth);
      if (newIndex !== activeCard && newIndex >= 0 && newIndex < 4) {
        setActiveCard(newIndex);
      }
    }
  };

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

      {/* 2. TOP DASHBOARD CAROUSEL */}
      <div className="mt-5 relative z-20">
         <div 
           ref={carouselRef}
           onScroll={handleScroll}
           className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-4 pb-2"
           style={{ scrollBehavior: 'smooth' }}
         >
            {/* Card 1 (Purple) */}
            <div className="min-w-[92vw] snap-center bg-gradient-to-br from-[#7357FF] to-[#9A7DFF] rounded-[30px] p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
               <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
               
               <div>
                 <div className="flex justify-between items-start mb-2">
                   <p className="text-[14px] font-semibold opacity-90">कुल जमा राशि</p>
                   <div className="w-9 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                     <WalletCards className="w-4 h-4 text-white" />
                   </div>
                 </div>
                 <h3 className="text-[32px] font-bold tracking-wider mb-1" style={{ fontFamily: 'monospace' }}>₹1,25,600</h3>
                 
                 <div className="flex items-center justify-between mt-2 mb-6">
                    <p className="text-[12px] font-medium opacity-90">गणेश समिति</p>
                    <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                       <span className="text-[10px] font-semibold">इस महीने</span>
                       <ArrowUpRight className="w-3 h-3" />
                    </div>
                 </div>
               </div>

               <div className="flex justify-between items-center gap-2 border-t border-white/20 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                       <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] opacity-80 font-medium">कुल सदस्य</p>
                      <p className="text-[14px] font-bold">125</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                       <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] opacity-80 font-medium">औसत जमा</p>
                      <p className="text-[14px] font-bold">₹45,300</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Card 2 (Pink) */}
            <div className="min-w-[92vw] snap-center bg-gradient-to-br from-[#FF5FA2] to-[#FF7EB3] rounded-[30px] p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
               <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
               
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                     <p className="text-[14px] font-semibold opacity-90">मासिक अपडेट</p>
                     <p className="text-[12px] font-bold mt-1 opacity-80">जुलाई - 2025</p>
                  </div>
                  <div className="w-9 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                     <Calendar className="w-4 h-4 text-white" />
                  </div>
               </div>

               <div className="mt-auto relative z-10 flex flex-col gap-4">
                  <div className="flex justify-between items-center bg-white/10 rounded-2xl p-4 border border-white/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><ArrowDownCircle className="w-4 h-4 text-white" /></div>
                       <p className="text-[12px] font-medium opacity-90">मासिक जमा</p>
                    </div>
                    <p className="text-[18px] font-bold">₹25,400</p>
                  </div>
                  
                  <div className="flex justify-between items-center bg-white/10 rounded-2xl p-4 border border-white/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><ArrowUpCircle className="w-4 h-4 text-white" /></div>
                       <p className="text-[12px] font-medium opacity-90">मासिक खर्च</p>
                    </div>
                    <p className="text-[18px] font-bold">₹8,750</p>
                  </div>
               </div>
            </div>

            {/* Card 3 (Green) */}
            <div className="min-w-[92vw] snap-center bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-[30px] p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
               <div className="absolute right-[-10px] top-[-10px] w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
               
               <div>
                 <div className="flex justify-between items-start mb-2">
                   <p className="text-[14px] font-semibold opacity-90">बैंक बैलेंस</p>
                   <div className="w-9 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                     <Building2 className="w-4 h-4 text-white" />
                   </div>
                 </div>
                 <h3 className="text-[32px] font-bold tracking-wider mb-4" style={{ fontFamily: 'monospace' }}>₹45,300</h3>
               </div>

               <div className="mt-auto relative z-10 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-white/20 pb-3">
                    <p className="text-[12px] font-medium opacity-90">आज का जमा</p>
                    <p className="text-[14px] font-bold">+₹1,200</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[12px] font-medium opacity-90">आज का खर्च</p>
                    <p className="text-[14px] font-bold">-₹350</p>
                  </div>
               </div>
            </div>

            {/* Card 4 (Orange) */}
            <div className="min-w-[92vw] snap-center bg-gradient-to-br from-[#FF7A00] to-[#E65100] rounded-[30px] p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
               <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
               
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                     <p className="text-[14px] font-semibold opacity-90">ऋण जानकारी</p>
                  </div>
                  <div className="w-9 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                     <Banknote className="w-4 h-4 text-white" />
                  </div>
               </div>

               <div className="mt-auto relative z-10 flex flex-col gap-4">
                  <div className="flex justify-between items-center bg-white/10 rounded-2xl p-4 border border-white/20 backdrop-blur-sm">
                    <p className="text-[12px] font-medium opacity-90">कुल ऋण (Total Loan)</p>
                    <p className="text-[16px] font-bold">₹15,000</p>
                  </div>
                  
                  <div className="flex justify-between items-center px-2">
                    <p className="text-[12px] font-medium opacity-90">बाकी EMI</p>
                    <p className="text-[14px] font-bold">3 Months</p>
                  </div>
                  
                  <div className="flex justify-between items-center px-2">
                    <p className="text-[12px] font-medium opacity-90">ब्याज (Interest)</p>
                    <p className="text-[14px] font-bold">2.5%</p>
                  </div>
               </div>
            </div>

         </div>

         {/* Carousel Dots */}
         <div className="flex justify-center gap-2 mt-4 mb-6">
            {[0, 1, 2, 3].map((idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-300 ${activeCard === idx ? 'w-6 bg-[#FF7A00]' : 'w-2 bg-slate-200'}`}
              />
            ))}
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
