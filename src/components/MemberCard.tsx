import React, { useRef, useState } from 'react';
import { Camera, User, Medal, Calendar, Phone, MapPin } from 'lucide-react';
import { Member } from '../types';
import { useNavigation } from '../context/NavigationContext';

interface MemberCardProps {
  member: Member;
  selectableMode?: 'edit' | 'delete' | null;
  isSelected?: boolean;
  onSelect?: (member: Member) => void;
}

export function MemberCard({ member, selectableMode, isSelected, onSelect }: MemberCardProps) {
  const { navigate } = useNavigation();
  const photo = member.photo || null;

  const handleClick = () => {
    if (selectableMode && onSelect) {
      onSelect(member);
    } else if (!selectableMode) {
      navigate(`member-profile/${member.id}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`w-full bg-white rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative border ${isSelected ? 'border-theme-primary ring-2 ring-theme-primary/50' : 'border-slate-100'} cursor-pointer active:scale-[0.98] transition-transform`}
    >
      {/* HEADER */}
      <div className="relative bg-theme-gradient py-4 px-4 flex items-center shrink-0">
        <div className="w-[70px] h-[70px] bg-white rounded-full p-1 shadow-md relative z-10 shrink-0 border-2 border-white">
          <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full object-cover" />
        </div>
        
        <div className="flex-1 flex flex-col justify-center pl-3 relative z-10 text-white">
          <h2 className="text-[17px] sm:text-[19px] font-extrabold tracking-wide leading-[1.2] drop-shadow-md">
            जय बजरंग युवा गणेश उत्सव समिति
          </h2>
          <div className="flex items-center w-full gap-2 mt-1.5">
            <div className="h-[1px] w-12 bg-white/50"></div>
            <p className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-100 whitespace-nowrap">
              एकता • सेवा • संस्कार • विकास
            </p>
            <div className="h-[1px] flex-1 bg-white/50"></div>
          </div>
        </div>

        {/* Selection Circle */}
        {selectableMode && (
          <div className="absolute top-4 right-4 z-20">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? (selectableMode === 'delete' ? 'bg-red-500 border-red-500' : 'bg-blue-500 border-blue-500') : 'bg-white/30 border-white/80'}`}>
              {isSelected && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              )}
            </div>
          </div>
        )}

      </div>

      {/* BODY */}
      <div className="px-4 py-4 sm:py-6 flex flex-row items-center gap-4 sm:gap-6 bg-white relative z-10">
        
        <div className="relative shrink-0 group ml-1">
          <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full border-[3px] border-theme-primary p-[2px] shadow-[0_8px_20px_rgba(255,122,0,0.15)] bg-white relative overflow-hidden flex items-center justify-center">
            {photo ? (
              <img src={photo} alt={member.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-orange-50 rounded-full flex flex-col items-center justify-center text-theme-primary/50">
                <User className="w-10 h-10 mb-1" />
              </div>
            )}
          </div>
        </div>

        {/* Member Details */}
        <div className="flex-1 flex flex-col">
          
          <div className="flex items-center pb-2 border-b border-dashed border-slate-200">
            <div className="w-8 flex justify-center">
              <div className="w-6 h-6 rounded bg-theme-gradient flex items-center justify-center text-white shadow-sm shrink-0">
                <User className="w-4 h-4" />
              </div>
            </div>
            <div className="w-[45px] text-[11px] font-bold text-slate-500 shrink-0">नाम</div>
            <div className="w-[1px] h-5 bg-slate-300 mx-2 shrink-0"></div>
            <div className="text-[14px] font-bold text-slate-800 truncate">{member.name}</div>
          </div>

          <div className="flex items-center py-2 border-b border-dashed border-slate-200">
            <div className="w-8 flex justify-center">
              <div className="w-6 h-6 rounded bg-theme-gradient flex items-center justify-center text-white shadow-sm shrink-0">
                <Medal className="w-4 h-4" />
              </div>
            </div>
            <div className="w-[45px] text-[11px] font-bold text-slate-500 shrink-0">पद</div>
            <div className="w-[1px] h-5 bg-slate-300 mx-2 shrink-0"></div>
            <div className="text-[14px] font-extrabold text-theme-primary truncate">{member.role || 'सदस्य'}</div>
          </div>

          <div className="flex items-center py-2 border-b border-dashed border-slate-200">
            <div className="w-8 flex justify-center">
              <div className="w-6 h-6 rounded bg-theme-gradient flex items-center justify-center text-white shadow-sm shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="w-[45px] text-[11px] font-bold text-slate-500 shrink-0">आयु</div>
            <div className="w-[1px] h-5 bg-slate-300 mx-2 shrink-0"></div>
            <div className="text-[14px] font-bold text-slate-800 truncate">{member.age || '22 वर्ष'}</div>
          </div>

          <div className="flex items-center pt-2">
            <div className="w-8 flex justify-center">
              <div className="w-6 h-6 rounded bg-theme-gradient flex items-center justify-center text-white shadow-sm shrink-0">
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
      <div className="bg-theme-gradient py-3 px-4 flex items-center justify-center gap-2 text-white shrink-0">
        <MapPin className="w-4 h-4 shrink-0" />
        <p className="text-[12px] font-medium tracking-wide">
          {member.address || 'नागरगांव, धरसीवा, रायपुर (छत्तीसगढ़)'}
        </p>
      </div>
    </div>
  );
}
