import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { SideDrawer } from './components/SideDrawer';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { useCommitteeData } from './hooks/useCommitteeData';
import { motion, AnimatePresence } from 'motion/react';
import { AppRouter } from './router';

import { LanguageProvider } from './context/LanguageContext';

function AppLayout({ data }: { data: any }) {
  const { currentScreen } = useNavigation();

  // Screens that should NOT show the bottom nav
  const hideBottomNavScreens = ['splash', 'login'];
  const showBottomNav = !hideBottomNavScreens.includes(currentScreen);

  return (
    <>
      <main className={`flex-1 overflow-y-auto scrollbar-hide bg-[#FFF8F1] relative ${showBottomNav ? 'pb-24' : ''}`}>
        <AppRouter />
      </main>
      
      {showBottomNav && <BottomNav />}
      <SideDrawer />
    </>
  );
}

export default function App() {
  const data = useCommitteeData();

  return (
    <LanguageProvider>
      <div className="bg-[#FFF8F1] font-sans w-full h-[100dvh] flex flex-col relative overflow-hidden text-slate-800">
        <NavigationProvider>
          <AppLayout data={data} />
        </NavigationProvider>
      </div>
    </LanguageProvider>
  );
}
