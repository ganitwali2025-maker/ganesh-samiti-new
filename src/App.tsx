import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Members } from './components/Members';
import { Transactions } from './components/Transactions';
import { BottomNav } from './components/BottomNav';
import { useCommitteeData } from './hooks/useCommitteeData';
import { Tab } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const data = useCommitteeData();

  return (
    <div className="bg-[#FFF8F1] font-sans w-full h-[100dvh] flex flex-col relative overflow-hidden text-slate-800">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-[#FFF8F1]">
          {currentTab === 'dashboard' && <Dashboard data={data} />}
          {currentTab === 'members' && <Members data={data} />}
          {currentTab === 'transactions' && <Transactions data={data} />}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}
