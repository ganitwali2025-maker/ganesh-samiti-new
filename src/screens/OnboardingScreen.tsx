import { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight } from 'lucide-react';

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to Ganesh Samiti',
    description: 'Manage your committee finances, members, and events effortlessly in one premium application.',
    image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Transparent Accounting',
    description: 'Track every single rupee deposited and spent. Keep all members informed with real-time reports.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Digital & Secure',
    description: '100% safe, digital records. Save time and go paperless with our ultra-modern dashboard.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=400&auto=format&fit=crop'
  }
];

export function OnboardingScreen() {
  const { navigate } = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('login');
    }
  };

  const handleSkip = () => {
    navigate('login');
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#FFF8F1] overflow-hidden relative">
      
      {/* Header / Skip */}
      <div className="p-6 flex justify-end relative z-20">
        <button 
          onClick={handleSkip}
          className="text-[13px] font-bold text-slate-400 active:scale-95 transition-transform"
        >
          Skip
        </button>
      </div>

      {/* Slider Content */}
      <div className="flex-1 relative flex flex-col items-center justify-center -mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center px-8"
          >
            <div className="w-64 h-64 rounded-full bg-theme-gradient/5 flex items-center justify-center p-6 mb-8 relative">
              <div className="absolute inset-0 bg-theme-gradient/10 rounded-full blur-2xl"></div>
              <img 
                src={onboardingData[currentIndex].image} 
                alt="Onboarding" 
                className="w-full h-full object-cover rounded-full shadow-2xl relative z-10 border-4 border-white"
              />
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-800 mb-3 tracking-tight">
              {onboardingData[currentIndex].title}
            </h2>
            <p className="text-[14px] font-medium text-slate-500 leading-relaxed">
              {onboardingData[currentIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="p-8 pb-12 flex items-center justify-between">
        
        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {onboardingData.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-theme-gradient' : 'w-2 bg-theme-gradient/20'}`}
            />
          ))}
        </div>

        {/* Next / Get Started Button */}
        <button 
          onClick={handleNext}
          className="h-14 px-8 rounded-full bg-theme-gradient text-white font-bold flex items-center gap-2 shadow-[0_8px_20px_rgb(255,122,0,0.3)] active:scale-95 transition-all"
        >
          {currentIndex === onboardingData.length - 1 ? (
            <>Get Started <ArrowRight className="w-5 h-5" /></>
          ) : (
            <>Next <ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
      
    </div>
  );
}
