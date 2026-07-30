import { ChevronLeft } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

interface TopAppBarProps {
  title: string;
  rightAction?: React.ReactNode;
}

export function TopAppBar({ title, rightAction }: TopAppBarProps) {
  const { goBack } = useNavigation();

  return (
    <div className="flex items-center justify-between px-4 h-16 bg-[#FFF8F1] border-b border-[#FF7A00]/10 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button 
          onClick={goBack}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-700 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 ml-[-2px]" />
        </button>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h2>
      </div>
      
      {rightAction && (
        <div>{rightAction}</div>
      )}
    </div>
  );
}
