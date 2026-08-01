import { useState, useEffect } from 'react';
import { Expense, ExpensePayment, AuditLog, Transaction } from '../types';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export function useExpenseData() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem('samiti_expenses');
      let parsed = saved ? JSON.parse(saved) : [];
      
      // MIGRATION SCRIPT: If no expenses found, migrate from old transactions
      if ((!parsed || parsed.length === 0)) {
        const oldSaved = localStorage.getItem('committee_transactions');
        const oldTransactions: Transaction[] = oldSaved ? JSON.parse(oldSaved) : [];
        const oldExpenses = oldTransactions.filter(t => t.type === 'EXPENSE');
        
        if (oldExpenses.length > 0) {
           parsed = oldExpenses.map((t, index) => ({
             id: t.id,
             date: t.date,
             expenseNo: `EXP-${1000 + index}`,
             vendorName: t.vendorName || 'Unknown Vendor',
             category: t.category,
             description: t.description,
             amount: t.amount,
             paymentType: t.paymentMethod || 'CASH',
             dueDate: t.dueDate,
             paidAmount: t.paymentMethod === 'CREDIT' ? (t.paidAmount || 0) : t.amount,
             status: t.paymentMethod === 'CREDIT' ? (t.paidAmount >= t.amount ? 'PAID' : 'PENDING') : 'PAID',
             remark: '',
             billPhoto: t.receiptPhoto,
             invoicePhoto: '',
             otherPhoto: t.vendorPhoto,
             createdAt: new Date().toISOString(),
             updatedAt: new Date().toISOString(),
             createdBy: 'Admin',
             updatedBy: 'Admin'
           }));
           // We do NOT delete from old transactions automatically here to prevent data loss in case of error.
           // They will just be ignored by getStats in useCommitteeData if we filter them out.
        }
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [expensePayments, setExpensePayments] = useState<ExpensePayment[]>(() => {
    try {
      const saved = localStorage.getItem('samiti_expense_payments');
      let parsed = saved ? JSON.parse(saved) : [];

      // MIGRATION SCRIPT for payments
      if ((!parsed || parsed.length === 0)) {
        const oldSaved = localStorage.getItem('committee_transactions');
        const oldTransactions: Transaction[] = oldSaved ? JSON.parse(oldSaved) : [];
        const oldPayments = oldTransactions.filter(t => t.type === 'CREDIT_PAYMENT');
        
        if (oldPayments.length > 0) {
           parsed = oldPayments.map(t => ({
             id: t.id,
             // Note: In old system we didn't store the exact expense ID in the payment, 
             // but we will assign a dummy or try to match. Migration of payments might be imperfect 
             // but we will just map what we can. 
             expenseId: t.memberId || 'legacy', 
             amount: t.amount,
             paymentMethod: t.paymentMethod || 'CASH',
             remark: t.description,
             date: t.date,
             createdAt: new Date().toISOString(),
             createdBy: 'Admin'
           }));
        }
      }

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('samiti_expense_audit');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('samiti_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('samiti_expense_payments', JSON.stringify(expensePayments));
  }, [expensePayments]);

  useEffect(() => {
    localStorage.setItem('samiti_expense_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (recordId: string, action: AuditLog['action'], changes?: string) => {
    const log: AuditLog = {
      id: generateId(),
      recordId,
      action,
      module: 'EXPENSE',
      changes,
      createdAt: new Date().toISOString(),
      createdBy: 'Admin',
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'expenseNo' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    const nextExpenseNo = `EXP-${1000 + expenses.length}`;
    
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      expenseNo: nextExpenseNo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Admin',
      updatedBy: 'Admin',
    };
    setExpenses(prev => [newExpense, ...prev]);
    addAuditLog(newExpense.id, 'CREATE', `Created Expense ${nextExpenseNo} for ₹${newExpense.amount}`);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          ...updates,
          updatedAt: new Date().toISOString(),
          updatedBy: 'Admin',
        };
      }
      return e;
    }));
    addAuditLog(id, 'UPDATE', `Updated expense record`);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    setExpensePayments(prev => prev.filter(p => p.expenseId !== id));
    addAuditLog(id, 'DELETE', `Deleted expense record`);
  };

  const payCredit = (expenseId: string, amount: number, paymentMethod: 'CASH' | 'UPI' | 'BANK', remark?: string) => {
    const payment: ExpensePayment = {
      id: generateId(),
      expenseId,
      amount,
      paymentMethod,
      remark,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      createdBy: 'Admin'
    };

    setExpensePayments(prev => [payment, ...prev]);
    
    setExpenses(prev => prev.map(e => {
      if (e.id === expenseId) {
        const newPaidAmount = e.paidAmount + amount;
        const newStatus = newPaidAmount >= e.amount ? 'PAID' : 'PENDING';
        return {
          ...e,
          paidAmount: newPaidAmount,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          updatedBy: 'Admin',
        };
      }
      return e;
    }));

    addAuditLog(expenseId, 'PAYMENT_MADE', `Made payment of ₹${amount} via ${paymentMethod}`);
  };

  const getExpenseStats = () => {
    let totalExpense = 0;
    let cashExpense = 0; 
    let creditExpense = 0; 
    let creditPaid = 0; 

    expenses.forEach(e => {
      totalExpense += Number(e.amount) || 0;
      if (e.paymentType === 'CASH' || e.paymentType === 'UPI' || e.paymentType === 'BANK') {
        cashExpense += Number(e.amount) || 0;
      } else if (e.paymentType === 'CREDIT') {
        creditExpense += Number(e.amount) || 0;
      }
    });

    expensePayments.forEach(p => {
      creditPaid += Number(p.amount) || 0;
    });

    const today = new Date().toISOString().split('T')[0];
    const todayExpense = 
      expenses.filter(e => e.paymentType !== 'CREDIT' && e.date === today).reduce((sum, e) => sum + (Number(e.amount) || 0), 0) +
      expensePayments.filter(p => p.date === today).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    
    const currentMonth = today.substring(0, 7);
    const monthlyExpense = 
      expenses.filter(e => e.paymentType !== 'CREDIT' && e.date.startsWith(currentMonth)).reduce((sum, e) => sum + (Number(e.amount) || 0), 0) +
      expensePayments.filter(p => p.date.startsWith(currentMonth)).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const currentYear = today.substring(0, 4);
    const yearlyExpense = 
      expenses.filter(e => e.paymentType !== 'CREDIT' && e.date.startsWith(currentYear)).reduce((sum, e) => sum + (Number(e.amount) || 0), 0) +
      expensePayments.filter(p => p.date.startsWith(currentYear)).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const outstandingCredit = creditExpense - creditPaid;
    
    return {
      totalExpense,
      cashExpense,
      creditExpense,
      creditPaid,
      outstandingCredit,
      todayExpense,
      monthlyExpense,
      yearlyExpense,
      totalPaid: cashExpense + creditPaid // Total actual physical money gone
    };
  };

  return {
    expenses,
    expensePayments,
    auditLogs,
    addExpense,
    updateExpense,
    deleteExpense,
    payCredit,
    getExpenseStats
  };
}
