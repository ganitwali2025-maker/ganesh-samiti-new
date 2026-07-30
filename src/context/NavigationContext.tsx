import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type ScreenName = 
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'dashboard'
  | 'members'
  | 'collection'
  | 'deposit'
  | 'expense'
  | 'budget'
  | 'savings'
  | 'bank'
  | 'reports'
  | 'events'
  | 'notice'
  | 'profile'
  | 'notifications'
  | 'search'
  | 'settings';

interface NavigationContextType {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<ScreenName[]>(['splash']);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const currentScreen = history[history.length - 1];

  const navigate = (screen: ScreenName) => {
    if (screen === currentScreen) return;
    setHistory((prev) => [...prev, screen]);
    setIsDrawerOpen(false); // Auto close drawer on navigate
  };

  const goBack = () => {
    setHistory((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Auto transition from Splash -> Onboarding after 2 seconds
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        navigate('onboarding');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  return (
    <NavigationContext.Provider 
      value={{ 
        currentScreen, 
        navigate, 
        goBack, 
        isDrawerOpen, 
        openDrawer, 
        closeDrawer 
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
