export type Role = 'अध्यक्ष' | 'उपाध्यक्ष' | 'कोषाध्यक्ष' | 'सचिव' | 'सदस्य';

export interface Member {
  id: string;
  name: string;
  phone: string;
  role: Role | string;
  initialContribution: number;
  joinedAt: string;
  age?: string;
  address?: string;
  photo?: string;
}

export type TransactionType = 'DEPOSIT' | 'EXPENSE' | 'CREDIT_PAYMENT';

export type TransactionCategory =
  | 'सजावट'
  | 'मासिक जमा'
  | 'वार्षिक जमा'
  | 'कार्यक्रम'
  | 'ध्वनि / लाइट'
  | 'प्रचार'
  | 'मूर्ति'
  | 'प्रसाद'
  | 'अन्य'
  | string;

export interface Vendor {
  id: string;
  name: string;
}

export type CreditStatus = 'UNPAID' | 'PARTIAL' | 'PAID';

export interface Transaction {
  id: string;
  memberId: string | null;
  amount: number;
  type: TransactionType;
  category: TransactionCategory | string;
  date: string;
  description: string;
  
  // New fields for Expense & Credit
  paymentMethod?: 'CASH' | 'CREDIT' | 'UPI' | 'BANK';
  vendorName?: string;
  dueDate?: string;
  paidAmount?: number; // For tracking partial payments on CREDIT transactions
}

export type Tab = 'dashboard' | 'members' | 'transactions';
