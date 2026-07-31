import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  | 'monthly_savings'
  | 'bank'
  | 'reports'
  | 'events'
  | 'notice'
  | 'profile'
  | 'notifications'
  | 'search'
  | 'settings';

interface NavigationContextType {
  currentScreen: string;
  navigate: (screen: ScreenName | string) => void;
  goBack: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const routerNavigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // currentScreen is derived from pathname, e.g., '/dashboard' -> 'dashboard'
  // default to 'splash' if at root '/'
  const currentScreen = location.pathname === '/' ? 'splash' : location.pathname.substring(1);

  const navigate = (screen: ScreenName | string) => {
    if (screen === currentScreen) return;
    routerNavigate(screen === 'splash' ? '/' : `/${screen}`);
    setIsDrawerOpen(false); // Auto close drawer on navigate
  };

  const goBack = () => {
    routerNavigate(-1);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Auto transition from Splash -> Login after 2.5 seconds
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        navigate('login');
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
