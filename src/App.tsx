/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { QuickActionModal } from './components/QuickActionModal';
import { AddMemberModal } from './components/AddMemberModal';
import { AddJamaModal } from './components/AddJamaModal';
import { AddKharchaModal } from './components/AddKharchaModal';
import { Sidebar } from './components/Sidebar';
import { Home } from './views/Home';
import { Members } from './views/Members';
import { Deposits } from './views/Deposits';
import { Expenses } from './views/Expenses';

type View = 'home' | 'members' | 'deposits' | 'expenses';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'addMember' | 'addJama' | 'addKharcha' | null>(null);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onOpenSidebar={() => setIsSidebarOpen(true)} />;
      case 'members':
        return <Members onAddClick={() => setActiveModal('addMember')} onOpenSidebar={() => setIsSidebarOpen(true)} />;
      case 'deposits':
        return <Deposits onOpenSidebar={() => setIsSidebarOpen(true)} />;
      case 'expenses':
        return <Expenses onOpenSidebar={() => setIsSidebarOpen(true)} />;
      default:
        return <Home onOpenSidebar={() => setIsSidebarOpen(true)} />;
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 font-sans selection:bg-[#4B20B5] selection:text-white h-[100dvh] w-full overflow-hidden flex flex-col relative">
      
      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-hidden flex flex-col relative pb-[100px]">
        {renderView()}
      </main>

      <BottomNav 
        currentView={currentView} 
        onChangeView={(view) => setCurrentView(view as View)}
        onOpenQuickAdd={() => setIsQuickActionOpen(true)}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentView={currentView}
        onChangeView={(view) => setCurrentView(view as View)}
      />

      <QuickActionModal 
        isOpen={isQuickActionOpen} 
        onClose={() => setIsQuickActionOpen(false)} 
        onSelectAction={(action) => setActiveModal(action)} 
      />

      <AddMemberModal isOpen={activeModal === 'addMember'} onClose={() => setActiveModal(null)} />
      <AddJamaModal isOpen={activeModal === 'addJama'} onClose={() => setActiveModal(null)} />
      <AddKharchaModal isOpen={activeModal === 'addKharcha'} onClose={() => setActiveModal(null)} />
    </div>
  );
}
