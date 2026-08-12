import React from 'react';
import { useAppStore } from '../store';
import { formatCurrency, formatDate } from '../utils';
import { Menu, Bell, Users, Wallet, TrendingDown, LayoutDashboard, UserPlus, FileDown, FileUp } from 'lucide-react';

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
      <div className="flex-shrink-0 bg-gradient-to-r from-[#4B20B5] to-[#5B2ACF] pt-safe px-4 pb-20 text-white relative z-0">
        <div className="flex justify-between items-center h-14 mt-2">
          <button className="p-2 -ml-2" onClick={onOpenSidebar}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold">डैशबोर्ड</h1>
          <button className="p-2 -mr-2 relative">
            <Bell size={24} />
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">3</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 -mt-16 z-10 relative space-y-4">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">स्वागत है, मित्र !</h2>
            <p className="text-sm text-gray-500">Ganesh Samiti App में आपका स्वागत है</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-[#4B20B5]">
            <Users size={24} />
          </div>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Users size={18} className="text-emerald-600" />}
            label="कुल सदस्य"
            value={totalMembers.toString()}
            subLabel="सदस्य"
            bgColor="bg-emerald-50"
          />
          <StatCard
            icon={<Wallet size={18} className="text-blue-600" />}
            label="कुल जमा राशि"
            value={formatCurrency(totalJama)}
            subLabel="कुल जमा"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<TrendingDown size={18} className="text-orange-600" />}
            label="कुल खर्च राशि"
            value={formatCurrency(totalKharcha)}
            subLabel="कुल खर्च"
            bgColor="bg-orange-50"
          />
          <StatCard
            icon={<LayoutDashboard size={18} className="text-[#4B20B5]" />}
            label="उपलब्ध बैलेंस"
            value={formatCurrency(balance)}
            subLabel="बैलेंस शेष"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-2.5 ml-1">त्वरित कार्य करें</h3>
          <div className="flex gap-3">
            <QuickActionBtn
              icon={<UserPlus size={24} />}
              label="सदस्य जोड़ें"
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <QuickActionBtn
              icon={<FileDown size={24} />}
              label="पैसा जमा करें"
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <QuickActionBtn
              icon={<FileUp size={24} />}
              label="खर्च जोड़ें"
              color="text-orange-600"
              bg="bg-orange-50"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="pt-1">
          <div className="flex justify-between items-center mb-2.5 px-1">
            <h3 className="text-sm font-bold text-gray-900">हाल की गतिविधि</h3>
            <button className="text-xs text-[#4B20B5] font-medium">देखें सभी</button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {recentActivity.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">अभी तक कोई गतिविधि नहीं</div>
            ) : (
              recentActivity.map((activity, index) => {
                if (activity.type === 'jama') {
                  const member = members.find(m => m.id === activity.memberId);
                  return (
                    <div key={`jama-${activity.id}`} className="p-3.5 flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1"></div>
                        <div>
                          <p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">{member?.name || 'Unknown'}</span> ने {formatCurrency(activity.amount)} जमा किया</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-emerald-600">{formatCurrency(activity.amount)}</span>
                    </div>
                  );
                } else {
                  return (
                    <div key={`kharcha-${activity.id}`} className="p-3.5 flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1"></div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{activity.details} <span className="font-normal text-gray-700">खर्च</span></p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-orange-600">{formatCurrency(activity.amount)}</span>
                    </div>
                  );
                }
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subLabel, bgColor }: { icon: React.ReactNode, label: string, value: string, subLabel: string, bgColor: string }) {
  return (
    <div className={`${bgColor} p-3 rounded-2xl border border-white/50 shadow-sm relative overflow-hidden flex flex-col justify-between`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[11px] font-semibold text-gray-700 leading-tight">{label}</span>
        <div className="bg-white p-1 rounded-md opacity-80 flex-shrink-0">
          {icon}
        </div>
      </div>
      <div className="mt-auto">
        <span className="text-xl font-bold text-gray-900 leading-none">{value}</span>
      </div>
      <span className="text-[10px] text-gray-500 mt-1 block leading-none">{subLabel}</span>
    </div>
  );
}

function QuickActionBtn({ icon, label, color, bg }: { icon: React.ReactNode, label: string, color: string, bg: string }) {
  return (
    <button className="flex-1 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 active:bg-gray-50 transition-colors">
      <div className={`${bg} ${color} w-10 h-10 rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <span className={`text-[10px] font-semibold ${color} text-center leading-tight`}>{label}</span>
    </button>
  );
}
