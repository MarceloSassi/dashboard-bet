import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, TransactionType, BankStats } from '../types/bank';
import { useBetStore } from './useBetStore';

interface BankStore {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  clearTransactions: () => void;
  getStats: () => BankStats;
}

export const useBankStore = create<BankStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: crypto.randomUUID(),
        };
        set((state) => ({ transactions: [...state.transactions, newTransaction] }));
      },
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== id),
        }));
      },
      clearTransactions: () => {
        set({ transactions: [] });
      },
      getStats: () => {
        const transactions = get().transactions;
        const betStats = useBetStore.getState().getStats();

        const totalDeposits = transactions
          .filter((t) => t.type === 'Deposit')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalWithdrawals = transactions
          .filter((t) => t.type === 'Withdrawal')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalBalance = totalDeposits + betStats.totalWinnings - totalWithdrawals;
        const totalProfit = totalBalance - totalDeposits;

        return {
          totalDeposits,
          totalWithdrawals,
          totalBalance,
          totalProfit,
        };
      },
    }),
    {
      name: 'bank-storage',
    }
  )
); 