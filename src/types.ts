export type Role = 'अध्यक्ष' | 'उपाध्यक्ष' | 'कोषाध्यक्ष' | 'सचिव' | 'सदस्य';

export interface Member {
  id: string;
  name: string;
  phone: string;
  role: Role | string;
  initialContribution: number;
  joinedAt: string;
}

export type TransactionType = 'DEPOSIT' | 'EXPENSE';

export type TransactionCategory =
  | 'सजावट'
  | 'मासिक जमा'
  | 'कार्यक्रम'
  | 'ध्वनि / लाइट'
  | 'प्रचार'
  | 'अन्य';

export interface Transaction {
  id: string;
  memberId: string | null;
  amount: number;
  type: TransactionType;
  category: TransactionCategory | string;
  date: string;
  description: string;
}

export type Tab = 'dashboard' | 'members' | 'transactions';
