import React, { useState } from 'react';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { Plus, User, Phone, Trash2, Shield } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { Role } from '../types';

export function Members({ data }: { data: ReturnType<typeof useCommitteeData> }) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role | string>('सदस्य');
  const [initialContribution, setInitialContribution] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    data.addMember({
      name: name.trim(),
      phone: phone.trim(),
      role,
      initialContribution: Number(initialContribution) || 0,
    });
    
    setName('');
    setPhone('');
    setRole('सदस्य');
    setInitialContribution('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <div>
           <h2 className="text-xl font-bold text-slate-900">सदस्य सूची (Members)</h2>
           <p className="text-sm text-slate-500">कुल सदस्य: {data.members.length}</p>
         </div>
         <button 
           onClick={() => setShowAddForm(!showAddForm)}
           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
         >
           <Plus className="w-5 h-5" />
           <span className="hidden sm:inline">नया सदस्य</span>
         </button>
       </div>

       {showAddForm && (
         <form onSubmit={handleAdd} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5 animate-in slide-in-from-top-4 fade-in duration-300">
            <h3 className="font-semibold text-lg text-slate-900 border-b border-slate-100 pb-3">नया सदस्य जोड़ें (Add New Member)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">नाम (Name) *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" placeholder="e.g. Ramesh Kumar" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">फोन (Phone)</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" placeholder="e.g. 9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">पद (Role)</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white">
                  <option value="अध्यक्ष">अध्यक्ष (President)</option>
                  <option value="उपाध्यक्ष">उपाध्यक्ष (Vice President)</option>
                  <option value="सचिव">सचिव (Secretary)</option>
                  <option value="कोषाध्यक्ष">कोषाध्यक्ष (Treasurer)</option>
                  <option value="सदस्य">सदस्य (Member)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">प्रारंभिक जमा (Initial Deposit)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input type="number" min="0" value={initialContribution} onChange={e => setInitialContribution(e.target.value)} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 pl-8 border" placeholder="0" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">रद्द करें (Cancel)</button>
              <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm">सुरक्षित करें (Save)</button>
            </div>
         </form>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {data.members.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
               <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <p className="text-slate-500 font-medium">अभी तक कोई सदस्य नहीं जोड़ा गया है।</p>
               <p className="text-sm text-slate-400 mt-1">ऊपर 'नया सदस्य' बटन पर क्लिक करें।</p>
            </div>
         ) : (
           data.members.map(member => {
             const totalContributed = data.transactions
               .filter(t => t.memberId === member.id && t.type === 'DEPOSIT')
               .reduce((sum, t) => sum + t.amount, 0);

             return (
               <div key={member.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 relative group hover:border-indigo-200 transition-colors">
                 <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                       {member.name.charAt(0).toUpperCase()}
                     </div>
                     <div>
                       <h3 className="font-bold text-slate-900 leading-tight">{member.name}</h3>
                       <div className="flex items-center gap-1.5 mt-0.5">
                         <Shield className="w-3.5 h-3.5 text-indigo-500" />
                         <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold uppercase">{member.role}</span>
                       </div>
                     </div>
                   </div>
                   <button 
                     onClick={() => {
                       if(window.confirm(`क्या आप वाकई ${member.name} को हटाना चाहते हैं?`)) {
                         data.deleteMember(member.id);
                       }
                     }}
                     className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
                 
                 <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                   {member.phone && (
                     <div className="flex items-center gap-2 text-sm text-slate-500">
                       <Phone className="w-4 h-4 text-slate-400" />
                       {member.phone}
                     </div>
                   )}
                   <div className="flex items-center justify-between mt-2">
                     <span className="text-sm text-slate-500">कुल जमा (Total)</span>
                     <span className="text-emerald-600 font-bold">{formatCurrency(totalContributed)}</span>
                   </div>
                 </div>
               </div>
             )
           })
         )}
       </div>
    </div>
  );
}
