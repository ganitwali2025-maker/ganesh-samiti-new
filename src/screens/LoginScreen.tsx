import { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, ShieldCheck, Mail, Lock } from 'lucide-react';

export function LoginScreen() {
  const { navigate } = useNavigation();
  const [loginMethod, setLoginMethod] = useState<'otp' | 'admin'>('otp');

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#FFF8F1] overflow-hidden relative">
      {/* Top Background Design */}
      <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-br from-[#FF7A00] to-[#E66D00] rounded-b-[40px] z-0 overflow-hidden shadow-lg">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
         <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
         
         <div className="relative z-10 flex flex-col items-center justify-center h-full pt-10">
           <div className="w-20 h-20 bg-white rounded-[20px] p-1 shadow-xl mb-4">
              <img src="/logo.png" 
                   alt="Logo" className="w-full h-full rounded-[16px] object-cover" />
           </div>
           <h1 className="text-2xl font-extrabold text-white tracking-tight">गणेश समिति</h1>
           <p className="text-orange-100 text-xs font-semibold mt-1">Welcome Back</p>
         </div>
      </div>

      {/* Login Card */}
      <div className="flex-1 px-6 pt-[260px] pb-6 relative z-10 overflow-y-auto scrollbar-hide">
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-50">
          
          {/* Tabs */}
          <div className="flex bg-slate-50 p-1 rounded-2xl mb-8">
            <button 
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all ${loginMethod === 'otp' ? 'bg-white text-[#FF7A00] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Member Login
            </button>
            <button 
              onClick={() => setLoginMethod('admin')}
              className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all ${loginMethod === 'admin' ? 'bg-white text-[#FF7A00] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Admin Login
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={loginMethod}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {loginMethod === 'otp' ? (
                <div className="space-y-5">
                  <div>
                    <label className="text-[12px] font-bold text-slate-700 mb-1.5 block">Mobile Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="w-5 h-5 text-slate-400" />
                      </div>
                      <input 
                        type="tel" 
                        placeholder="Enter 10-digit number"
                        className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-sm rounded-2xl pl-11 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 transition-all font-medium"
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate('dashboard')}
                    className="w-full h-14 bg-[#FF7A00] text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgb(255,122,0,0.3)] active:scale-[0.98] transition-transform mt-2"
                  >
                    Send OTP <ShieldCheck className="w-5 h-5" />
                  </button>

                  <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold uppercase">Or login with</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                  </div>

                  <button 
                    onClick={() => navigate('dashboard')}
                    className="w-full h-14 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
                  >
                    <Mail className="w-5 h-5 text-blue-500" /> Google Login
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="text-[12px] font-bold text-slate-700 mb-1.5 block">Admin ID / Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Enter admin ID"
                        className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-sm rounded-2xl pl-11 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 transition-all font-medium"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[12px] font-bold text-slate-700 block">Password</label>
                      <a href="#" className="text-[11px] font-bold text-[#FF7A00]">Forgot Password?</a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-sm rounded-2xl pl-11 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember" className="w-4 h-4 rounded text-[#FF7A00] focus:ring-[#FF7A00] border-slate-300" />
                    <label htmlFor="remember" className="text-[12px] font-semibold text-slate-500">Remember me</label>
                  </div>
                  
                  <button 
                    onClick={() => navigate('dashboard')}
                    className="w-full h-14 bg-[#FF7A00] text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgb(255,122,0,0.3)] active:scale-[0.98] transition-transform mt-2"
                  >
                    Secure Login <ShieldCheck className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <p className="text-center text-[11px] font-semibold text-slate-400 mt-8 mb-4">
          By logging in, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );
}
