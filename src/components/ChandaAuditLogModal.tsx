import { X, History } from 'lucide-react';
import { useChandaData } from '../hooks/useChandaData';

interface ChandaAuditLogModalProps {
  chandaId: string;
  onClose: () => void;
}

export function ChandaAuditLogModal({ chandaId, onClose }: ChandaAuditLogModalProps) {
  const { auditLogs } = useChandaData();
  const logs = auditLogs.filter(log => log.recordId === chandaId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300">
        
        <div className="bg-slate-800 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <History className="w-5 h-5" />
            <h3 className="font-bold text-[16px]">Audit Log</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-90 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 h-[400px] overflow-y-auto bg-slate-50">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
              <History className="w-12 h-12 mb-3 text-slate-400" />
              <p className="text-sm font-semibold">No logs found</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-4 pt-2">
              {logs.map((log, idx) => (
                <div key={log.id} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-2 border-slate-50">
                     {log.action === 'CREATE' && <div className="w-full h-full bg-emerald-500 rounded-full"></div>}
                     {log.action === 'UPDATE' && <div className="w-full h-full bg-blue-500 rounded-full"></div>}
                     {log.action === 'DELETE' && <div className="w-full h-full bg-red-500 rounded-full"></div>}
                     {log.action === 'PAYMENT_RECEIVED' && <div className="w-full h-full bg-amber-500 rounded-full"></div>}
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-600' :
                        log.action === 'UPDATE' ? 'bg-blue-50 text-blue-600' :
                        log.action === 'DELETE' ? 'bg-red-50 text-red-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          day: '2-digit', month: 'short', year: '2-digit',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {log.changes && <p className="text-[12px] text-slate-600 mt-2 font-medium">{log.changes}</p>}
                    <p className="text-[10px] text-slate-400 mt-2 text-right">by {log.createdBy}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
