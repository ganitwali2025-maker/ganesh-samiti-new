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
import { Home } from './views/Home';
import { Members } from './views/Members';
import { Deposits } from './views/Deposits';
import { Expenses } from './views/Expenses';

type View = 'home' | 'members' | 'deposits' | 'expenses';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'addMember' | 'addJama' | 'addKharcha' | null>(null);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'members':
        return <Members onAddClick={() => setActiveModal('addMember')} />;
      case 'deposits':
        return <Deposits />;
      case 'expenses':
        return <Expenses />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans selection:bg-[#4B20B5] selection:text-white">
      {/* Mobile constraint wrapper */}
      <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-xl overflow-hidden flex flex-col">
        
        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-y-auto">
          {renderView()}
        </main>

        <BottomNav 
          currentView={currentView} 
          onChangeView={(view) => setCurrentView(view as View)}
          onOpenQuickAdd={() => setIsQuickActionOpen(true)}
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
    </div>
  );
}

