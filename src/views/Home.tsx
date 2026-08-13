import React from 'react';
import { useAppStore } from '../store';
import { formatCurrency, formatDate } from '../utils';
import { Menu, Bell, Users, Wallet, TrendingUp, PiggyBank, UserPlus, ChevronRight, ArrowDownCircle, ArrowUpCircle, FileDown, FileUp, Banknote } from 'lucide-react';

export function Home({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { members, jamas, kharchas } = useAppStore();

  const totalMembers = members.length;
  const totalJama = jamas.reduce((acc, curr) => acc + curr.amount, 0);
  const totalKharcha = kharchas.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalJama - totalKharcha;

  // Combine and sort recent transactions
  const recentActivity = [
    ...jamas.map(j => ({ ...j, type: 'jama' as const })),
    ...kharchas.map(k => ({ ...k, type: 'kharcha' as const }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      {/* Top Header - Fixed/Shrink-0 */}
      <div className="flex-shrink-0 bg-gradient-to-r from-[#3A1499] to-[#5B2ACF] pt-safe px-4 text-white relative z-20 shadow-sm">
        <div className="flex justify-between items-center h-14 mt-2 pb-2">
          <button className="p-2 -ml-2" onClick={onOpenSidebar}>
            <Menu size={28} />
          </button>
          <h1 className="text-xl font-bold tracking-wide">डैशबोर्ड</h1>
          <button className="p-2 -mr-2 relative">
            <Bell size={24} />
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold border border-[#3A1499]">3</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto z-10 relative">
        {/* Purple curve extension */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#3A1499] to-[#5B2ACF] rounded-b-[2rem] -z-10"></div>
        
        <div className="px-4 pb-6 pt-4 space-y-5">
          {/* Welcome Card */}
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-[24px] p-4 shadow-sm border border-purple-100 flex justify-between items-center relative">
          <div className="flex items-center gap-4">
            {/* Ganesha Placeholder Image */}
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
              <img src="https://cdn-icons-png.flaticon.com/512/10008/10008169.png" alt="Ganesh" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
              <span className="text-3xl hidden">🕉️</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2C185A]">स्वागत है, मित्र !</h2>
              <p className="text-xs font-medium text-[#6B5A99] leading-snug mt-1">Ganesh Samiti App में<br/>आपका स्वागत है</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-purple-200/60 rounded-full flex items-center justify-center text-[#4B20B5] flex-shrink-0">
            <Users size={24} strokeWidth={2.5} />
          </div>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          <StatCard
            icon={<Users size={24} className="text-emerald-600" />}
            label="कुल सदस्य"
            value={totalMembers.toString()}
            subLabel="सदस्य"
            bgColor="bg-emerald-50/70 border-emerald-100/50"
            arrowColor="text-emerald-500 bg-emerald-100"
          />
          <StatCard
            icon={<Wallet size={24} className="text-blue-600" />}
            label="कुल जमा राशि"
            value={formatCurrency(totalJama)}
            subLabel="कुल जमा"
            bgColor="bg-blue-50/70 border-blue-100/50"
            arrowColor="text-blue-500 bg-blue-100"
          />
          <StatCard
            icon={<TrendingUp size={24} className="text-orange-500" />}
            label="कुल खर्च राशि"
            value={formatCurrency(totalKharcha)}
            subLabel="कुल खर्च"
            bgColor="bg-orange-50/70 border-orange-100/50"
            arrowColor="text-orange-500 bg-orange-100"
          />
          <StatCard
            icon={<PiggyBank size={24} className="text-purple-600" />}
            label="उपलब्ध बैलेंस"
            value={formatCurrency(balance)}
            subLabel="बैलेंस शेष"
            bgColor="bg-purple-50/70 border-purple-100/50"
            arrowColor="text-purple-500 bg-purple-100"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-[15px] font-bold text-gray-900 mb-3 ml-1">त्वरित कार्य करें</h3>
          <div className="flex gap-3">
            <QuickActionBtn
              icon={<UserPlus size={24} strokeWidth={2.5} />}
              title="सदस्य जोड़ें"
              subtitle="नया सदस्य जोड़ें"
              color="text-emerald-600"
              iconBg="bg-emerald-100"
            />
            <QuickActionBtn
              icon={<Banknote size={24} strokeWidth={2.5} />}
              title="पैसा जमा करें"
              subtitle="जमा प्रविष्टि करें"
              color="text-blue-600"
              iconBg="bg-blue-100"
            />
            <QuickActionBtn
              icon={<FileDown size={24} strokeWidth={2.5} />}
              title="खर्च जोड़ें"
              subtitle="नया खर्च जोड़ें"
              color="text-orange-500"
              iconBg="bg-orange-100"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="pt-2">
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-[15px] font-bold text-gray-900">हाल की गतिविधि</h3>
            <button className="text-xs text-[#4B20B5] font-semibold">देखें सभी</button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm font-medium">अभी तक कोई गतिविधि नहीं</div>
            ) : (
              recentActivity.map((activity, index) => {
                if (activity.type === 'jama') {
                  const member = members.find(m => m.id === activity.memberId);
                  return (
                    <div key={`jama-${activity.id}`} className="p-4 flex justify-between items-center">
                      <div className="flex gap-3.5 items-center">
                        <div className="w-10 h-10 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-500 bg-emerald-50 flex-shrink-0">
                          <ArrowDownCircle size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-gray-900">{member?.name || 'Unknown'} ने {formatCurrency(activity.amount)} जमा किया</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[15px] text-emerald-600 flex-shrink-0">{formatCurrency(activity.amount)}</span>
                    </div>
                  );
                } else {
                  return (
                    <div key={`kharcha-${activity.id}`} className="p-4 flex justify-between items-center">
                      <div className="flex gap-3.5 items-center">
                        <div className="w-10 h-10 rounded-full border border-orange-200 flex items-center justify-center text-orange-500 bg-orange-50 flex-shrink-0">
                          <ArrowUpCircle size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-gray-900">{activity.details} पर खर्च</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[15px] text-red-500 flex-shrink-0">{formatCurrency(activity.amount)}</span>
                    </div>
                  );
                }
              })
            )}
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-4 opacity-50 pb-4">
            <div className="h-px w-6 bg-gray-400"></div>
            <span className="text-[11px] font-medium text-[#4B20B5]">और देखने के लिए ऊपर खींचें</span>
            <div className="h-px w-6 bg-gray-400"></div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subLabel, bgColor, arrowColor }: { icon: React.ReactNode, label: string, value: string, subLabel: string, bgColor: string, arrowColor: string }) {
  return (
    <div className={`${bgColor} p-4 rounded-3xl shadow-sm border relative overflow-hidden flex flex-col justify-between min-h-[110px]`}>
      <div className="flex gap-3 items-center mb-1">
        <div className="p-2 rounded-full bg-white/60">
          {icon}
        </div>
        <div className="flex-1">
           <span className="text-[11px] font-bold text-gray-800">{label}</span>
        </div>
      </div>
      
      <div className="mt-1 pl-12 flex justify-between items-end">
        <div>
          <span className="text-xl font-extrabold text-gray-900 leading-none block">{value}</span>
          <span className="text-[10px] font-medium text-gray-600 mt-1 block leading-none">{subLabel}</span>
        </div>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${arrowColor}`}>
          <ChevronRight size={14} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}

function QuickActionBtn({ icon, title, subtitle, color, iconBg }: { icon: React.ReactNode, title: string, subtitle: string, color: string, iconBg: string }) {
  return (
    <button className="flex-1 bg-white rounded-2xl py-4 px-2 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 active:bg-gray-50 transition-colors">
      <div className={`${iconBg} ${color} w-12 h-12 rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <div className="text-center mt-1">
        <span className={`text-[12px] font-extrabold ${color} block leading-tight`}>{title}</span>
        <span className="text-[9px] font-medium text-gray-500 mt-1 block">{subtitle}</span>
      </div>
    </button>
  );
}
