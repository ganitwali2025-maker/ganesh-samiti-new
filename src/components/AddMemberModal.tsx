import React, { useState } from 'react';
import { useAppStore } from '../store';
import { generateId } from '../utils';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddMemberModal({ isOpen, onClose }: Props) {
  const addMember = useAppStore(state => state.addMember);
  
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [memberId, setMemberId] = useState('');
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !memberId) return;

    addMember({
      id: generateId(),
      name,
      mobile,
      memberId,
      joinDate,
      note
    });

    // Reset and close
    setName(''); setMobile(''); setMemberId(''); setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex flex-col justify-end sm:justify-center items-center max-w-md mx-auto h-full">
      <div className="bg-white w-full h-full sm:h-auto sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-full duration-300 flex flex-col">
        {/* Purple Header */}
        <div className="bg-[#4B20B5] text-white p-4 flex items-center justify-between sm:rounded-t-3xl shadow-sm z-10">
          <div className="flex items-center">
            <button onClick={onClose} className="p-2 -ml-2 mr-2">
              <X size={24} />
            </button>
            <h2 className="text-lg font-semibold">सदस्य जोड़ें</h2>
          </div>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">सदस्य का नाम</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4B20B5] focus:border-[#4B20B5] outline-none transition-all text-sm" placeholder="नाम दर्ज करें" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">मोबाइल नंबर</label>
              <input required type="tel" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4B20B5] focus:border-[#4B20B5] outline-none transition-all text-sm" placeholder="मोबाइल नंबर दर्ज करें" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">सदस्य ID</label>
              <input required type="text" value={memberId} onChange={e => setMemberId(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4B20B5] focus:border-[#4B20B5] outline-none transition-all text-sm" placeholder="जैसे: GSM001" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">जुड़ने की तारीख</label>
              <input required type="date" value={joinDate} onChange={e => setJoinDate(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4B20B5] focus:border-[#4B20B5] outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">नोट (वैकल्पिक)</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4B20B5] focus:border-[#4B20B5] outline-none transition-all text-sm" placeholder="नोट लिखें..." rows={2}></textarea>
            </div>
            
            <div className="pt-2">
              <button type="submit" className="w-full bg-[#4B20B5] text-white font-semibold text-base py-3.5 rounded-xl hover:bg-purple-800 active:bg-purple-900 transition-colors shadow-[0_4px_12px_rgba(75,32,181,0.2)]">
                सदस्य जोड़ें
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
