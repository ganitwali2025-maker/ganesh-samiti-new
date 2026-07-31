import { useState, useEffect } from 'react';
import { Member, Transaction } from '../types';

const generateId = () => {
  return (typeof crypto !== 'undefined' && crypto.randomUUID) 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 10);
};

export function useCommitteeData() {
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem('committee_members');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('committee_transactions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('committee_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('committee_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addMember = (member: Omit<Member, 'id' | 'joinedAt'>) => {
    const newMember: Member = {
      ...member,
      id: generateId(),
      joinedAt: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMember]);
    
    if (member.initialContribution > 0) {
      addTransaction({
        memberId: newMember.id,
        amount: member.initialContribution,
        type: 'DEPOSIT',
        category: 'मासिक जमा',
        date: new Date().toISOString().split('T')[0],
        description: 'Initial Contribution / प्रारंभिक जमा',
      });
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter(t => t.id !== id));
  };
  
  const updateMember = (id: string, updatedData: Partial<Omit<Member, 'id' | 'joinedAt'>>) => {
    setMembers((prev) => 
      prev.map(member => 
        member.id === id ? { ...member, ...updatedData } : member
      )
    );
  };

  const deleteMember = (id: string) => {
     setMembers((prev) => prev.filter(m => m.id !== id));
     setTransactions((prev) => prev.filter(t => t.memberId !== id));
  };

  // Auto-cleanup orphaned deposits (if a member was deleted in the past but their deposit remained)
  useEffect(() => {
    setTransactions((prev) => {
      const validMemberIds = new Set(members.map(m => m.id));
      const filtered = prev.filter(t => {
        if (t.type === 'DEPOSIT' && t.memberId) {
          return validMemberIds.has(t.memberId);
        }
        return true;
      });
      return filtered.length !== prev.length ? filtered : prev;
    });
  }, [members]);

  const payCredit = (transactionId: string, paymentAmount: number, paymentMethod: 'CASH' | 'UPI' | 'BANK', remark: string) => {
    setTransactions((prev) => {
      let vendorName = '';
      const updated = prev.map(t => {
        if (t.id === transactionId && t.type === 'EXPENSE' && t.paymentMethod === 'CREDIT') {
          vendorName = t.vendorName || '';
          return {
            ...t,
            paidAmount: (t.paidAmount || 0) + paymentAmount,
          };
        }
        return t;
      });

      if (vendorName) {
        // Add a new CREDIT_PAYMENT transaction
        updated.push({
          id: generateId(),
          memberId: null,
          amount: paymentAmount,
          type: 'CREDIT_PAYMENT',
          category: 'उधार भुगतान (Credit Paid)',
          date: new Date().toISOString().split('T')[0],
          description: `Paid to ${vendorName} - ${remark}`,
          paymentMethod: paymentMethod,
        });
      }
      return updated;
    });
  };

  const payDepositCredit = (transactionId: string, paymentAmount: number, paymentMethod: 'CASH' | 'UPI' | 'BANK', remark: string) => {
    setTransactions((prev) => {
      let memberName = '';
      let memberId = '';
      const updated = prev.map(t => {
        if (t.id === transactionId && t.type === 'DEPOSIT' && t.paymentMethod === 'CREDIT') {
          const member = members.find(m => m.id === t.memberId);
          memberName = member ? member.name : 'Member';
          memberId = t.memberId || '';
          return {
            ...t,
            paidAmount: (t.paidAmount || 0) + paymentAmount,
          };
        }
        return t;
      });

      if (memberName) {
        // Add a new DEPOSIT_PAYMENT transaction
        updated.push({
          id: generateId(),
          memberId: memberId,
          amount: paymentAmount,
          type: 'DEPOSIT_PAYMENT',
          category: 'जमा भुगतान (Deposit Paid)',
          date: new Date().toISOString().split('T')[0],
          description: `Received from ${memberName} - ${remark}`,
          paymentMethod: paymentMethod,
        });
      }
      return updated;
    });
  };

  const getStats = () => {
    const totalCollection = transactions
      .filter((t) => {
         if (t.type === 'DEPOSIT') {
            return t.paymentMethod !== 'CREDIT';
         }
         if (t.type === 'DEPOSIT_PAYMENT') {
            return true;
         }
         return false;
      })
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      
    const totalExpensesPaid = transactions
      .filter((t) => {
         if (t.type === 'EXPENSE') {
            return t.paymentMethod !== 'CREDIT';
         }
         if (t.type === 'CREDIT_PAYMENT') {
            return true;
         }
         return false;
      })
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const totalExpensesIncurred = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const totalCreditOutstanding = transactions
      .filter(t => t.type === 'EXPENSE' && t.paymentMethod === 'CREDIT')
      .reduce((sum, t) => sum + ((Number(t.amount) || 0) - (Number(t.paidAmount) || 0)), 0);

    const totalCreditPaid = transactions
      .filter(t => t.type === 'CREDIT_PAYMENT')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const totalDepositOutstanding = transactions
      .filter(t => t.type === 'DEPOSIT' && t.paymentMethod === 'CREDIT')
      .reduce((sum, t) => sum + ((Number(t.amount) || 0) - (Number(t.paidAmount) || 0)), 0);

    return {
      totalDeposit: totalCollection,
      totalExpenses: totalExpensesIncurred,
      totalExpensesPaid,
      currentBalance: totalCollection - totalExpensesPaid,
      outstandingCredit: totalCreditOutstanding,
      creditPaid: totalCreditPaid,
      outstandingDeposit: totalDepositOutstanding,
      totalMembers: members.length
    };
  };

  return {
    members,
    transactions,
    addMember,
    updateMember,
    deleteMember,
    addTransaction,
    deleteTransaction,
    getStats,
    payCredit,
    payDepositCredit
  };
}
