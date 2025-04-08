import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Bet, BetStatus, Sport } from '../types/bet';

interface BetStore {
  bets: Bet[];
  addBet: (bet: Omit<Bet, 'id'>) => void;
  updateBetStatus: (id: string, status: BetStatus) => void;
  deleteBet: (id: string) => void;
  getBetsByStatus: (status: BetStatus) => Bet[];
  getBetsBySport: (sport: Sport) => Bet[];
  getBetsByDateRange: (startDate: Date, endDate: Date) => Bet[];
  getStats: (filteredBets?: Bet[]) => {
    totalBets: number;
    totalWon: number;
    totalLost: number;
    totalAmount: number;
    totalWinnings: number;
    winRate: number;
    profit: number;
  };
  resetBets: () => void;
  clearBets: () => void;
}

const validateBet = (bet: any): bet is Bet => {
  return (
    typeof bet === 'object' &&
    bet !== null &&
    typeof bet.id === 'string' &&
    bet.date instanceof Date &&
    typeof bet.sport === 'string' &&
    ['Soccer', 'Basketball', 'Tennis', 'Volleyball', 'Other'].includes(bet.sport) &&
    typeof bet.betType === 'string' &&
    ['Single', 'Multiple'].includes(bet.betType) &&
    typeof bet.odd === 'number' &&
    typeof bet.amount === 'number' &&
    typeof bet.status === 'string' &&
    ['Pending', 'Won', 'Lost'].includes(bet.status)
  );
};

export const useBetStore = create<BetStore>()(
  persist(
    (set, get) => ({
      bets: [],
      addBet: (bet) => {
        const newBet = {
          ...bet,
          id: crypto.randomUUID(),
        };
        set((state) => ({ bets: [...state.bets, newBet] }));
      },
      updateBetStatus: (id, status) => {
        set((state) => ({
          bets: state.bets.map((bet) =>
            bet.id === id ? { ...bet, status } : bet
          ),
        }));
      },
      deleteBet: (id) => {
        set((state) => ({
          bets: state.bets.filter((bet) => bet.id !== id),
        }));
      },
      getBetsByStatus: (status) => {
        const bets = get().bets;
        return bets.filter((bet) => bet.status === status);
      },
      getBetsBySport: (sport) => {
        const bets = get().bets;
        return bets.filter((bet) => bet.sport === sport);
      },
      getBetsByDateRange: (startDate, endDate) => {
        const bets = get().bets;
        return bets.filter(
          (bet) => bet.date >= startDate && bet.date <= endDate
        );
      },
      getStats: (filteredBets) => {
        const bets = filteredBets || get().bets;
        const totalBets = bets.length;
        const totalWon = bets.filter((bet) => bet.status === 'Won').length;
        const totalLost = bets.filter((bet) => bet.status === 'Lost').length;
        const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
        const totalWinnings = bets
          .filter((bet) => bet.status === 'Won')
          .reduce((sum, bet) => sum + bet.amount * bet.odd, 0);
        const winRate = totalBets > 0 ? (totalWon / totalBets) * 100 : 0;
        const profit = totalWinnings - totalAmount;

        return {
          totalBets,
          totalWon,
          totalLost,
          totalAmount,
          totalWinnings,
          winRate,
          profit,
        };
      },
      resetBets: () => set({ bets: [] }),
      clearBets: () => {
        set({ bets: [] });
      },
    }),
    {
      name: 'bet-storage',
      partialize: (state) => ({ bets: state.bets }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Validar e converter datas
          state.bets = state.bets.map((bet: any) => ({
            ...bet,
            date: new Date(bet.date),
          })).filter(validateBet);
        }
      },
    }
  )
); 