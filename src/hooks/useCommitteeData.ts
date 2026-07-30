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
  
  const deleteMember = (id: string) => {
     setMembers((prev) => prev.filter(m => m.id !== id));
  };

  const getStats = () => {
    const totalCollection = transactions
      .filter((t) => t.type === 'DEPOSIT')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalCollection,
      totalExpenses,
      availableBalance: totalCollection - totalExpenses,
    };
  };

  return {
    members,
    transactions,
    addMember,
    addTransaction,
    deleteTransaction,
    deleteMember,
    getStats,
  };
}
