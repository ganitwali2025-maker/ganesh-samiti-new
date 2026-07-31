import { Transaction } from '../types';

export interface MonthlyStatus {
  monthIndex: number;
  monthName: string;
  dueDate: string;
  paidDate: string | null;
  amount: number;
  status: 'PAID' | 'PENDING' | 'UPCOMING';
}

export function getMonthlySavingStatus(
  memberTransactions: Transaction[], // All deposits for category 'मासिक जमा' for this member
  currentDate: Date = new Date(),
  year: number = new Date().getFullYear(),
  monthlyAmount: number = 500
): MonthlyStatus[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result: MonthlyStatus[] = [];

  // Sort transactions by date ascending
  const sortedTx = [...memberTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let currentTxIndex = 0;
  let remainingInCurrentTx = sortedTx.length > 0 ? sortedTx[0].amount : 0;

  for (let i = 0; i < 12; i++) {
    const dueDay = 15;
    const dueMonth = i;
    const dueDateObj = new Date(year, dueMonth, dueDay);
    const dueDateStr = `${dueDay} ${months[i]} ${year}`;
    
    let status: 'PAID' | 'PENDING' | 'UPCOMING' = 'UPCOMING';
    let paidDate: string | null = null;
    let neededAmount = monthlyAmount;
    
    let covered = 0;
    let lastUsedTxDate = null;

    // Try to cover the monthly amount from available transactions
    while (covered < neededAmount && currentTxIndex < sortedTx.length) {
      const available = remainingInCurrentTx;
      const toTake = Math.min(available, neededAmount - covered);
      
      covered += toTake;
      remainingInCurrentTx -= toTake;
      lastUsedTxDate = sortedTx[currentTxIndex].date;

      if (remainingInCurrentTx === 0) {
        currentTxIndex++;
        if (currentTxIndex < sortedTx.length) {
          remainingInCurrentTx = sortedTx[currentTxIndex].amount;
        }
      }
    }

    if (covered >= neededAmount) {
      status = 'PAID';
      paidDate = lastUsedTxDate;
    } else {
      // Not fully paid
      // If currentDate > 15th of this month, it is PENDING
      // We compare just the date part (ignoring time)
      const currentZeroTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      if (currentZeroTime.getTime() > dueDateObj.getTime()) {
        status = 'PENDING';
      } else {
        status = 'UPCOMING';
      }
    }

    result.push({
      monthIndex: i,
      monthName: months[i],
      dueDate: dueDateStr,
      paidDate: paidDate ? new Date(paidDate).toLocaleDateString('en-IN') : null,
      amount: monthlyAmount,
      status
    });
  }

  return result;
}
