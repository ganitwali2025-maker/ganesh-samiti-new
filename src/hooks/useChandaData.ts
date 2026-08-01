import { useState, useEffect } from 'react';
import { Chanda, ChandaPayment, AuditLog } from '../types';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export function useChandaData() {
  const [chandas, setChandas] = useState<Chanda[]>(() => {
    try {
      const saved = localStorage.getItem('samiti_chanda');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [chandaPayments, setChandaPayments] = useState<ChandaPayment[]>(() => {
    try {
      const saved = localStorage.getItem('samiti_chanda_payments');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('samiti_chanda_audit');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('samiti_chanda', JSON.stringify(chandas));
  }, [chandas]);

  useEffect(() => {
    localStorage.setItem('samiti_chanda_payments', JSON.stringify(chandaPayments));
  }, [chandaPayments]);

  useEffect(() => {
    localStorage.setItem('samiti_chanda_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (recordId: string, action: AuditLog['action'], changes?: string) => {
    const log: AuditLog = {
      id: generateId(),
      recordId,
      action,
      module: 'CHANDA',
      changes,
      createdAt: new Date().toISOString(),
      createdBy: 'Admin',
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const addChanda = (chanda: Omit<Chanda, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    const newChanda: Chanda = {
      ...chanda,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Admin',
      updatedBy: 'Admin',
    };
    setChandas(prev => [newChanda, ...prev]);
    addAuditLog(newChanda.id, 'CREATE', `Created Chanda for ${newChanda.donorName} of ₹${newChanda.amount}`);
  };

  const updateChanda = (id: string, updates: Partial<Chanda>) => {
    setChandas(prev => prev.map(c => {
      if (c.id === id) {
        const updated = {
          ...c,
          ...updates,
          updatedAt: new Date().toISOString(),
          updatedBy: 'Admin',
        };
        return updated;
      }
      return c;
    }));
    addAuditLog(id, 'UPDATE', `Updated record`);
  };

  const deleteChanda = (id: string) => {
    setChandas(prev => prev.filter(c => c.id !== id));
    // Optionally delete payments, but keeping them might be good for hard-audit, or cascading delete.
    setChandaPayments(prev => prev.filter(p => p.chandaId !== id));
    addAuditLog(id, 'DELETE', `Deleted Chanda record`);
  };

  const receivePayment = (chandaId: string, amount: number, paymentMethod: 'CASH' | 'UPI' | 'BANK', remark?: string) => {
    const payment: ChandaPayment = {
      id: generateId(),
      chandaId,
      amount,
      paymentMethod,
      remark,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      createdBy: 'Admin'
    };

    setChandaPayments(prev => [payment, ...prev]);
    
    setChandas(prev => prev.map(c => {
      if (c.id === chandaId) {
        const newPaidAmount = c.paidAmount + amount;
        const newStatus = newPaidAmount >= c.amount ? 'PAID' : 'PENDING';
        return {
          ...c,
          paidAmount: newPaidAmount,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          updatedBy: 'Admin',
        };
      }
      return c;
    }));

    addAuditLog(chandaId, 'PAYMENT_RECEIVED', `Received payment of ₹${amount} via ${paymentMethod}`);
  };

  const getChandaStats = () => {
    let totalChanda = 0;
    let cashCollection = 0; // Purely CASH payment type
    let creditCollection = 0; // The total requested in CREDIT
    let creditPaid = 0; // The amount paid against CREDIT

    chandas.forEach(c => {
      totalChanda += Number(c.amount) || 0;
      if (c.paymentType === 'CASH') {
        cashCollection += Number(c.amount) || 0;
      } else if (c.paymentType === 'CREDIT') {
        creditCollection += Number(c.amount) || 0;
      }
    });

    chandaPayments.forEach(p => {
      creditPaid += Number(p.amount) || 0;
    });

    // Today's Collection (Cash + Payments)
    const today = new Date().toISOString().split('T')[0];
    const todayCollection = 
      chandas.filter(c => c.paymentType === 'CASH' && c.date === today).reduce((sum, c) => sum + (Number(c.amount) || 0), 0) +
      chandaPayments.filter(p => p.date === today).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    
    // Monthly Collection (Cash + Payments)
    const currentMonth = today.substring(0, 7);
    const monthlyCollection = 
      chandas.filter(c => c.paymentType === 'CASH' && c.date.startsWith(currentMonth)).reduce((sum, c) => sum + (Number(c.amount) || 0), 0) +
      chandaPayments.filter(p => p.date.startsWith(currentMonth)).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Yearly Collection (Cash + Payments)
    const currentYear = today.substring(0, 4);
    const yearlyCollection = 
      chandas.filter(c => c.paymentType === 'CASH' && c.date.startsWith(currentYear)).reduce((sum, c) => sum + (Number(c.amount) || 0), 0) +
      chandaPayments.filter(p => p.date.startsWith(currentYear)).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const outstandingChanda = creditCollection - creditPaid;
    
    return {
      totalChanda,
      cashCollection,
      creditCollection,
      creditPaid,
      outstandingChanda,
      todayCollection,
      monthlyCollection,
      yearlyCollection,
      totalReceived: cashCollection + creditPaid // Total physical money received
    };
  };

  return {
    chandas,
    chandaPayments,
    auditLogs,
    addChanda,
    updateChanda,
    deleteChanda,
    receivePayment,
    getChandaStats
  };
}
