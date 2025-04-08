export type TransactionType = 'Deposit' | 'Withdrawal';

export interface Transaction {
  id: string;
  date: Date;
  type: TransactionType;
  amount: number;
  description?: string;
}

export interface BankStats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalBalance: number;
  totalProfit: number;
} 