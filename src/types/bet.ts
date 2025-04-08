export type Sport = 'Soccer' | 'Basketball' | 'Tennis' | 'Volleyball' | 'Other';

export type BetType = 'Single' | 'Multiple';

export type BetStatus = 'Pending' | 'Won' | 'Lost';

export interface Bet {
  id: string;
  date: Date;
  sport: Sport;
  betType: BetType;
  odd: number;
  amount: number;
  status: BetStatus;
  description?: string;
}

export interface BetStats {
  totalBets: number;
  totalWon: number;
  totalLost: number;
  totalAmount: number;
  totalWinnings: number;
  winRate: number;
  profit: number;
} 