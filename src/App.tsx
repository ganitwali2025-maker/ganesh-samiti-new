import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { SideDrawer } from './components/SideDrawer';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { useCommitteeData } from './hooks/useCommitteeData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SplashScreen, LoginScreen, MembersScreen, 
  CollectionScreen, DepositScreen, ExpenseScreen, BudgetScreen, 
  SavingsScreen, BankScreen, ReportsScreen, EventsScreen, 
  NoticeScreen, ProfileScreen, NotificationsScreen, SearchScreen, 
  SettingsScreen 
} from './screens';

function ScreenRenderer({ data }: { data: any }) {
  const { currentScreen } = useNavigation();

  // Screens that should NOT show the bottom nav
  const hideBottomNavScreens = ['splash', 'login'];
  const showBottomNav = !hideBottomNavScreens.includes(currentScreen);

  const getScreenComponent = () => {
    switch (currentScreen) {
      case 'splash': return <SplashScreen />;
      case 'login': return <LoginScreen />;
      case 'dashboard': return <Dashboard data={data} />;
      case 'members': return <MembersScreen />;
      case 'collection': return <CollectionScreen />;
      case 'deposit': return <DepositScreen />;
      case 'expense': return <ExpenseScreen />;
      case 'budget': return <BudgetScreen />;
      case 'savings': return <SavingsScreen />;
      case 'bank': return <BankScreen />;
      case 'reports': return <ReportsScreen />;
      case 'events': return <EventsScreen />;
      case 'notice': return <NoticeScreen />;
      case 'profile': return <ProfileScreen />;
      case 'notifications': return <NotificationsScreen />;
      case 'search': return <SearchScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <Dashboard data={data} />;
    }
  };

  // Android-style shared axis transition (slide and fade)
  const variants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  };

  return (
    <>
      <main className={`flex-1 overflow-y-auto scrollbar-hide bg-[#FFF8F1] relative ${showBottomNav ? 'pb-24' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full min-h-full"
          >
            {getScreenComponent()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {showBottomNav && <BottomNav />}
      <SideDrawer />
    </>
  );
}

export default function App() {
  const data = useCommitteeData();

  return (
    <div className="bg-[#FFF8F1] font-sans w-full h-[100dvh] flex flex-col relative overflow-hidden text-slate-800">
      <NavigationProvider>
        <ScreenRenderer data={data} />
      </NavigationProvider>
    </div>
  );
}
