
export type BotType = 'volume' | 'trade' | 'snipe' | 'copy-trade';

export interface Bot {
  id: string;
  name: string;
  type: BotType;
  status: 'active' | 'paused' | 'stopped';
  profit: number;
  createdAt: Date;
  lastActive: Date;
  config: BotConfig;
}

export interface BotConfig {
  targetToken?: string;
  tradingPair?: string;
  budget?: number;
  strategy?: string;
  risk?: 'low' | 'medium' | 'high';
  stopLoss?: number;
  takeProfit?: number;
  walletAddress?: string;
  [key: string]: any;
}

export interface User {
  id: string;
  username: string;
  ipAddress: string;
  lastLogin: Date;
}

export interface ProfitData {
  timestamp: Date;
  value: number;
}

export interface DashboardStats {
  totalBots: number;
  activeBots: number;
  totalProfit: number;
  dailyProfit: number;
  weeklyProfit: number;
}
