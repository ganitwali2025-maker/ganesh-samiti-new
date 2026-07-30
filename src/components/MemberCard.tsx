import React, { useRef, useState } from 'react';
import { Camera, User, Medal, Calendar, Phone, MapPin } from 'lucide-react';
import { Member } from '../types';

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  const [photo, setPhoto] = useState<string | null>(member.photo || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhoto(e.target.result as string);
          // In a real app, you would also save this to the backend/state here
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full bg-white rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative border border-slate-100">
      {/* HEADER */}
      <div className="relative bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] pt-5 pb-8 px-4 flex items-center shrink-0">
        {/* Right Mandala */}
        <svg viewBox="0 0 200 200" className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(100, 100)">
            <circle r="90" stroke="white" strokeWidth="0.5" fill="none" />
            <circle r="75" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
            <circle r="60" stroke="white" strokeWidth="0.5" fill="none" />
            <circle r="40" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
            {Array.from({ length: 16 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 22.5})`}>
                <path d="M 0 -60 C 15 -75, -15 -75, 0 -60" stroke="white" strokeWidth="0.5" fill="none" />
                <path d="M 0 -75 C 10 -85, -10 -85, 0 -75" stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="0" cy="-90" r="1.5" fill="white" />
                <path d="M 0 -40 L 5 -50 L 0 -60 L -5 -50 Z" stroke="white" strokeWidth="0.5" fill="none" />
              </g>
            ))}
          </g>
        </svg>

        <div className="w-[64px] h-[64px] bg-white rounded-full p-1 shadow-md relative z-10 shrink-0 border-2 border-white">
          <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full object-cover" />
        </div>
        
        <div className="flex-1 flex flex-col pl-3 relative z-10 text-white">
          <h2 className="text-[17px] sm:text-[18px] font-extrabold tracking-wide leading-tight drop-shadow-md">
            जय बजरंग युवा गणेश उत्सव समिति
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-[1px] flex-1 bg-white/40"></div>
            <p className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-95">
              एकता • सेवा • संस्कार • विकास
            </p>
            <div className="h-[1px] flex-1 bg-white/40"></div>
          </div>
        </div>

        {/* Curved separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="block w-full h-[20px]" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ transform: 'rotate(180deg)' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FFFFFF"></path>
          </svg>
        </div>
      </div>

      {/* BODY */}
      <div className="px-4 py-4 sm:py-6 flex flex-row items-center gap-4 sm:gap-6 bg-white relative z-10">
        
        {/* Photo Upload Area */}
        <div className="relative shrink-0 group ml-1">
          <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full border-[3px] border-[#FF7A00] p-[2px] shadow-[0_8px_20px_rgba(255,122,0,0.15)] bg-white relative overflow-hidden flex items-center justify-center">
            {photo ? (
              <img src={photo} alt={member.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-orange-50 rounded-full flex flex-col items-center justify-center text-[#FF7A00]/50">
                <User className="w-10 h-10 mb-1" />
                <span className="text-[9px] font-bold">Upload</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 w-8 h-8 bg-[#FF7A00] rounded-full border-2 border-white flex items-center justify-center text-white shadow-md active:scale-95 transition-transform"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Member Details */}
        <div className="flex-1 flex flex-col">
          
          <div className="flex items-center pb-2 border-b border-dashed border-slate-200">
            <div className="w-8 flex justify-center">
              <div className="w-6 h-6 rounded bg-[#FF7A00] flex items-center justify-center text-white shadow-sm shrink-0">
                <User className="w-4 h-4" />
              </div>
            </div>
            <div className="w-[45px] text-[11px] font-bold text-slate-500 shrink-0">नाम</div>
            <div className="w-[1px] h-5 bg-slate-300 mx-2 shrink-0"></div>
            <div className="text-[14px] font-bold text-slate-800 truncate">{member.name}</div>
          </div>

          <div className="flex items-center py-2 border-b border-dashed border-slate-200">
            <div className="w-8 flex justify-center">
              <div className="w-6 h-6 rounded bg-[#FF7A00] flex items-center justify-center text-white shadow-sm shrink-0">
                <Medal className="w-4 h-4" />
              </div>
            </div>
            <div className="w-[45px] text-[11px] font-bold text-slate-500 shrink-0">पद</div>
            <div className="w-[1px] h-5 bg-slate-300 mx-2 shrink-0"></div>
            <div className="text-[14px] font-extrabold text-[#FF7A00] truncate">{member.role || 'सदस्य'}</div>
          </div>

          <div className="flex items-center py-2 border-b border-dashed border-slate-200">
            <div className="w-8 flex justify-center">
              <div className="w-6 h-6 rounded bg-[#FF7A00] flex items-center justify-center text-white shadow-sm shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="w-[45px] text-[11px] font-bold text-slate-500 shrink-0">आयु</div>
            <div className="w-[1px] h-5 bg-slate-300 mx-2 shrink-0"></div>
            <div className="text-[14px] font-bold text-slate-800 truncate">{member.age || '22 वर्ष'}</div>
          </div>

          <div className="flex items-center pt-2">
            <div className="w-8 flex justify-center">
              <div className="w-6 h-6 rounded bg-[#FF7A00] flex items-center justify-center text-white shadow-sm shrink-0">
                <Phone className="w-4 h-4" />
              </div>
            </div>
            <div className="w-[45px] text-[11px] font-bold text-slate-500 shrink-0">मोबाइल</div>
            <div className="w-[1px] h-5 bg-slate-300 mx-2 shrink-0"></div>
            <div className="text-[14px] font-bold text-slate-800 truncate">{member.phone}</div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] py-3 px-4 flex items-center justify-center gap-2 text-white shrink-0">
        <MapPin className="w-4 h-4 shrink-0" />
        <p className="text-[12px] font-medium tracking-wide">
          {member.address || 'नागरगांव, धरसीवा, रायपुर (छत्तीसगढ़)'}
        </p>
      </div>
    </div>
  );
}
