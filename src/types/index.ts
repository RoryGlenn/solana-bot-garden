
export type BotType = 'volume' | 'trade' | 'snipe' | 'copy-trade' | 'coin-launch';

export interface Bot {
  id: string;
  name: string;
  type: BotType;
  status: 'active' | 'paused' | 'stopped';
  config: BotConfig;
}

export interface BotConfig {
  targetToken?: string;
  tradingPair?: string;
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

export interface LaunchedToken {
  id: string;
  name: string;
  symbol: string;
  totalSupply: number;
  initialPrice: number;
  currentPrice?: number;
  launchDate: Date;
  status: 'pending' | 'active' | 'failed';
}
