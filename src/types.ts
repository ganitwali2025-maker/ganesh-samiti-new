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
  profilePhoto?: string;
  aadhaarPhoto?: string;
  panPhoto?: string;
  familyPhoto?: string;
  documents?: string[];
}

export type TransactionType = 'DEPOSIT' | 'EXPENSE' | 'CREDIT_PAYMENT' | 'DEPOSIT_PAYMENT';

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
  donorName?: string; // For external depositors (non-members)
  dueDate?: string;
  paidAmount?: number; // For tracking partial payments on CREDIT transactions
  
  // File attachments
  receiptPhoto?: string;
  paymentScreenshot?: string;
  vendorPhoto?: string;
}

export type Tab = 'dashboard' | 'members' | 'transactions';

export interface AuditLog {
  id: string;
  recordId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PAYMENT_RECEIVED' | 'PAYMENT_MADE';
  module: 'CHANDA' | 'EXPENSE';
  changes?: string;
  createdAt: string; // ISO String
  createdBy: string;
}

export interface ChandaPayment {
  id: string;
  chandaId: string;
  amount: number;
  paymentMethod: 'CASH' | 'UPI' | 'BANK';
  remark?: string;
  date: string;
  createdAt: string;
  createdBy: string;
}

export interface Chanda {
  id: string;
  date: string; // Collection Date
  donorName: string;
  mobileNumber?: string;
  address?: string;
  amount: number;
  paymentType: 'CASH' | 'CREDIT';
  
  // If CREDIT
  dueDate?: string;
  paidAmount: number; // For cash, paidAmount = amount. For credit, initialized to 0.
  status: 'PAID' | 'PENDING';
  remark?: string;

  // File attachments
  receiptPhoto?: string;

  // Audit
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  createdBy: string;
  updatedBy: string;
}

export interface ExpensePayment {
  id: string;
  expenseId: string;
  amount: number;
  paymentMethod: 'CASH' | 'UPI' | 'BANK';
  remark?: string;
  date: string;
  createdAt: string;
  createdBy: string;
}

export interface Expense {
  id: string;
  date: string;
  expenseNo: string;
  vendorName: string;
  category: string;
  description: string;
  amount: number;
  paymentType: 'CASH' | 'CREDIT' | 'UPI' | 'BANK';
  
  // If CREDIT
  dueDate?: string;
  paidAmount: number; 
  status: 'PAID' | 'PENDING';
  remark?: string;

  // Attachments
  billPhoto?: string;
  invoicePhoto?: string;
  otherPhoto?: string;
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
