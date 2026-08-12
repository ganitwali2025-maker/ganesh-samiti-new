export interface Member {
  id: string;
  name: string;
  mobile: string;
  memberId: string;
  joinDate: string;
  note: string;
}

export interface Jama {
  id: string;
  memberId: string;
  jamaType?: 'MONTHLY' | 'DONATION' | 'GANESH_CHATURTHI';
  date: string;
  amount: number;
  mode: 'Cash' | 'UPI' | 'Bank';
  note: string;
}

export interface Kharcha {
  id: string;
  date: string;
  details: string;
  amount: number;
  mode: 'Cash' | 'UPI' | 'Bank';
  note: string;
}
