import React, { useState } from 'react';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { Plus, ArrowDownRight, ArrowUpRight, Trash2, Camera } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { TransactionType, TransactionCategory } from '../types';
import { FullScreenImageViewer } from './FullScreenImageViewer';

export function Transactions({ data }: { data: ReturnType<typeof useCommitteeData> }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewerFileId, setViewerFileId] = useState<string | null>(null);
  
  const [type, setType] = useState<TransactionType>('DEPOSIT');
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory | string>('मासिक जमा');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const categories = ["सजावट", "मासिक जमा", "कार्यक्रम", "ध्वनि / लाइट", "प्रचार", "अन्य"];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    if (type === 'DEPOSIT' && !memberId) return;
    
    data.addTransaction({
      memberId: type === 'DEPOSIT' ? memberId : null,
      type,
      amount: Number(amount),
      category,
      date,
      description: description.trim(),
    });
    
    setAmount('');
    setDescription('');
    setShowAddForm(false);
  };

  const sortedTransactions = data.transactions.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <div>
           <h2 className="text-xl font-bold text-slate-900">लेन-देन (Transactions)</h2>
           <p className="text-sm text-slate-500">सभी आय और व्यय</p>
         </div>
         <button 
           onClick={() => setShowAddForm(!showAddForm)}
           className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
         >
           <Plus className="w-5 h-5" />
           <span className="hidden sm:inline">नया लेन-देन</span>
         </button>
       </div>

       {showAddForm && (
         <form onSubmit={handleAdd} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5 animate-in slide-in-from-top-4 fade-in duration-300">
            <h3 className="font-semibold text-lg text-slate-900 border-b border-slate-100 pb-3">नया लेन-देन दर्ज करें (New Entry)</h3>
            
            <div className="flex gap-6 mb-2 p-2 bg-gray-50 rounded-xl inline-flex">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                <input 
                  type="radio" 
                  checked={type === 'DEPOSIT'} 
                  onChange={() => { setType('DEPOSIT'); setCategory('मासिक जमा'); }} 
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                />
                <span className="font-medium text-emerald-700">जमा (Deposit)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                <input 
                  type="radio" 
                  checked={type === 'EXPENSE'} 
                  onChange={() => { setType('EXPENSE'); setCategory('कार्यक्रम'); }} 
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                />
                <span className="font-medium text-rose-700">खर्च (Expense)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {type === 'DEPOSIT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">सदस्य (Member) *</label>
                  <select required value={memberId} onChange={e => setMemberId(e.target.value)} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white">
                    <option value="" disabled>सदस्य चुनें...</option>
                    {data.members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">राशि (Amount) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input required type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 pl-8 border" placeholder="0" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">श्रेणी (Category)</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white">
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">दिनांक (Date) *</label>
                <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">विवरण (Description)</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border" placeholder="Any additional notes..." />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">रद्द करें (Cancel)</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">सुरक्षित करें (Save)</button>
            </div>
         </form>
       )}

       <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {sortedTransactions.length === 0 ? (
            <div className="text-center py-16">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <ArrowDownRight className="w-8 h-8 text-slate-300" />
               </div>
               <p className="text-slate-500 font-medium">कोई लेन-देन नहीं मिला।</p>
               <p className="text-sm text-slate-400 mt-1">पहला लेन-देन दर्ज करने के लिए ऊपर बटन पर क्लिक करें।</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sortedTransactions.map(t => {
                const member = data.members.find(m => m.id === t.memberId);
                const isDeposit = t.type === 'DEPOSIT';
                return (
                  <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 hover:bg-slate-50 transition-colors gap-3 group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDeposit ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                         {isDeposit ? '↓' : '↑'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 leading-tight">{t.category}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-bold uppercase">
                            {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          {isDeposit && member ? <span className="font-medium text-slate-800">{member.name}</span> : null}
                          {isDeposit && member && t.description ? <span className="mx-1 text-slate-300">•</span> : ''}
                          {t.description}
                        </p>
                        {(t.receiptPhoto || t.vendorPhoto || t.paymentScreenshot) && (
                          <div className="flex gap-2 mt-2">
                            {t.receiptPhoto && (
                              <button onClick={() => setViewerFileId(t.receiptPhoto!)} className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md hover:bg-slate-200">
                                <Camera className="w-3 h-3" /> Receipt
                              </button>
                            )}
                            {t.vendorPhoto && (
                              <button onClick={() => setViewerFileId(t.vendorPhoto!)} className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md hover:bg-slate-200">
                                <Camera className="w-3 h-3" /> Vendor
                              </button>
                            )}
                            {t.paymentScreenshot && (
                              <button onClick={() => setViewerFileId(t.paymentScreenshot!)} className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md hover:bg-slate-200">
                                <Camera className="w-3 h-3" /> Screenshot
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-16 sm:pl-0">
                      <div className={`font-bold text-lg ${isDeposit ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isDeposit ? '+' : '-'}{formatCurrency(t.amount)}
                      </div>
                      <button 
                         onClick={() => {
                           if(window.confirm('क्या आप वाकई इस लेन-देन को हटाना चाहते हैं?')) {
                             data.deleteTransaction(t.id);
                           }
                         }}
                         className="text-gray-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
       </div>

       {viewerFileId && (
         <FullScreenImageViewer 
           fileId={viewerFileId} 
           onClose={() => setViewerFileId(null)} 
           title="Attachment Viewer"
         />
       )}
    </div>
  );
}
