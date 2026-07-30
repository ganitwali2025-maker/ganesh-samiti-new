import React, { useState } from 'react';
import { X, User, Phone, MapPin, Medal, Calendar, DollarSign, Camera } from 'lucide-react';
import { Member } from '../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: Omit<Member, 'id' | 'joinedAt'>) => void;
}

export function AddMemberModal({ isOpen, onClose, onAdd }: AddMemberModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('सदस्य');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [initialContribution, setInitialContribution] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhoto(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    onAdd({
      name,
      phone,
      role,
      age,
      address,
      photo,
      initialContribution: Number(initialContribution) || 0
    });
    
    // Reset
    setName('');
    setPhone('');
    setRole('सदस्य');
    setAge('');
    setAddress('');
    setInitialContribution('');
    setPhoto(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[18px] font-bold tracking-wide">नया सदस्य जोड़ें</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FFF8F3]">
          <form id="add-member-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Photo Upload */}
            <div className="flex flex-col items-center mb-2">
              <div className="w-[90px] h-[90px] rounded-full border-[3px] border-[#FF7A00] p-1 bg-white relative">
                {photo ? (
                  <img src={photo} alt="Preview" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-orange-50 rounded-full flex flex-col items-center justify-center text-[#FF7A00]/50">
                    <User className="w-8 h-8 mb-1" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#FF7A00] rounded-full border-2 border-white flex items-center justify-center text-white shadow-md active:scale-95 transition-transform cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
              <span className="text-[12px] font-bold text-slate-500 mt-2">फोटो अपलोड करें</span>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              
              {/* Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text" required
                  placeholder="सदस्य का नाम *"
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full h-[52px] bg-white border border-[#ECECEC] text-[#1F2937] text-[14px] rounded-[16px] pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 font-medium placeholder:text-slate-400 shadow-sm"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="tel" required
                  placeholder="मोबाइल नंबर *"
                  value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full h-[52px] bg-white border border-[#ECECEC] text-[#1F2937] text-[14px] rounded-[16px] pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 font-medium placeholder:text-slate-400 shadow-sm"
                />
              </div>

              {/* Role & Age Row */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Medal className="w-5 h-5 text-slate-400" />
                  </div>
                  <select 
                    value={role} onChange={e => setRole(e.target.value)}
                    className="w-full h-[52px] bg-white border border-[#ECECEC] text-[#1F2937] text-[14px] rounded-[16px] pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 font-medium shadow-sm appearance-none"
                  >
                    <option value="सदस्य">सदस्य</option>
                    <option value="अध्यक्ष">अध्यक्ष</option>
                    <option value="उपाध्यक्ष">उपाध्यक्ष</option>
                    <option value="सचिव">सचिव</option>
                    <option value="कोषाध्यक्ष">कोषाध्यक्ष</option>
                  </select>
                </div>
                
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="आयु (जैसे: 25 वर्ष)"
                    value={age} onChange={e => setAge(e.target.value)}
                    className="w-full h-[52px] bg-white border border-[#ECECEC] text-[#1F2937] text-[14px] rounded-[16px] pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 font-medium placeholder:text-slate-400 shadow-sm"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="relative">
                <div className="absolute top-3.5 left-4 pointer-events-none">
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
                <textarea 
                  placeholder="पूरा पता"
                  value={address} onChange={e => setAddress(e.target.value)}
                  className="w-full h-[80px] py-3 bg-white border border-[#ECECEC] text-[#1F2937] text-[14px] rounded-[16px] pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 font-medium placeholder:text-slate-400 shadow-sm resize-none"
                />
              </div>

              {/* Initial Contribution */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="number" 
                  placeholder="शुरुआती जमा राशि (₹)"
                  value={initialContribution} onChange={e => setInitialContribution(e.target.value)}
                  className="w-full h-[52px] bg-white border border-[#ECECEC] text-[#1F2937] text-[14px] rounded-[16px] pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 font-medium placeholder:text-slate-400 shadow-sm"
                />
              </div>
              
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0 pb-8 sm:pb-4">
          <button 
            type="submit" form="add-member-form"
            className="w-full h-[56px] bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] text-white text-[16px] font-bold rounded-[16px] shadow-[0_8px_20px_rgba(255,106,0,0.3)] active:scale-[0.98] transition-transform"
          >
            सदस्य जोड़ें
          </button>
        </div>

      </div>
    </div>
  );
}
