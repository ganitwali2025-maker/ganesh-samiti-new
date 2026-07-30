import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string; // Kept for compatibility but not rendered
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  showBack = true, 
  rightAction 
}: PageHeaderProps) {
  const { goBack, navigate } = useNavigation();

  return (
    <div className="h-[72px] bg-theme-gradient rounded-b-[20px] shadow-[0_8px_24px_rgba(255,106,0,0.2)] px-4 flex items-center justify-between z-30 relative shrink-0">
       
       {/* LEFT: Back Button */}
       <div className="flex items-center gap-3 relative z-10 w-1/4">
          {showBack && (
            <button 
              onClick={goBack} 
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0 border border-white/10"
            >
               <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          )}
       </div>

       {/* CENTER: Page Title */}
       <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-1/2 text-center z-0">
          <h1 className="text-[22px] font-[700] text-white leading-none whitespace-nowrap drop-shadow-sm pt-0.5">
            {title}
          </h1>
       </div>
       
       {/* RIGHT: Notifications & Action */}
       <div className="flex items-center justify-end gap-2 relative z-10 w-1/4">
         {rightAction && (
           <div className="shrink-0 flex items-center justify-center">
             {/* Note: In screens, this action might need text-white/bg-white classes to match the orange background */}
             {rightAction}
           </div>
         )}
         <button 
            onClick={() => navigate('notifications')}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white active:scale-95 transition-transform relative border border-white/10 shrink-0"
         >
           <Bell className="w-4 h-4" strokeWidth={2.5} />
           <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-theme-primary"></span>
         </button>
       </div>

    </div>
  );
}
