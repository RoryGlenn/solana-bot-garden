import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, DashboardStats, ProfitData } from '@/types';
import BotCard from '@/components/BotCard';
import ProfitChart from '@/components/ProfitChart';
import Sidebar from '@/components/Sidebar';
import { usePageTransition } from '@/utils/animations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Activity, Bot as BotIcon, Cpu, DollarSign } from "lucide-react";
import { addDays, format, subDays, subHours, subMonths, subWeeks } from 'date-fns';

const generateMockBots = (): Bot[] => {
  return [
    {
      id: '1',
      name: 'SOL/USDC Volume Bot',
      type: 'volume',
      status: 'active',
      profit: 245.87,
      createdAt: subDays(new Date(), 7),
      lastActive: new Date(),
      config: {
        tradingPair: 'SOL/USDC',
        strategy: 'Moving Average',
        risk: 'medium',
        budget: 1000,
        stopLoss: 5,
        takeProfit: 15
      }
    },
    {
      id: '2',
      name: 'BONK Sniper',
      type: 'snipe',
      status: 'active',
      profit: 127.32,
      createdAt: subDays(new Date(), 5),
      lastActive: subHours(new Date(), 1),
      config: {
        targetToken: 'BONK',
        tradingPair: 'BONK/USDC',
        strategy: 'Momentum',
        risk: 'high',
        budget: 500
      }
    },
    {
      id: '3',
      name: 'JUP/USDC Trader',
      type: 'trade',
      status: 'paused',
      profit: -52.18,
      createdAt: subDays(new Date(), 3),
      lastActive: subHours(new Date(), 12),
      config: {
        tradingPair: 'JUP/USDC',
        strategy: 'Range Trading',
        risk: 'low',
        budget: 800,
        stopLoss: 3,
        takeProfit: 8
      }
    },
    {
      id: '4',
      name: 'DeGods Whale Tracker',
      type: 'copy-trade',
      status: 'stopped',
      profit: 412.65,
      createdAt: subDays(new Date(), 14),
      lastActive: subDays(new Date(), 2),
      config: {
        walletAddress: 'Dg1...',
        strategy: 'Follow Trades',
        risk: 'medium',
        budget: 1500
      }
    }
  ];
};

const generateProfitData = (): {daily: ProfitData[], weekly: ProfitData[], monthly: ProfitData[]} => {
  const daily = Array.from({ length: 24 }, (_, i) => ({
    timestamp: subHours(new Date(), 23 - i),
    value: Math.random() * 200 - 50
  }));
  
  const weekly = Array.from({ length: 7 }, (_, i) => ({
    timestamp: subDays(new Date(), 6 - i),
    value: Math.random() * 500 - 100
  }));
  
  const monthly = Array.from({ length: 30 }, (_, i) => ({
    timestamp: subDays(new Date(), 29 - i),
    value: Math.random() * 1000 - 200
  }));
  
  return { daily, weekly, monthly };
};

const Dashboard = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBots: 0,
    activeBots: 0,
    totalProfit: 0,
    dailyProfit: 0,
    weeklyProfit: 0,
  });
  const [profitData, setProfitData] = useState({
    daily: [] as ProfitData[],
    weekly: [] as ProfitData[],
    monthly: [] as ProfitData[]
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { isVisible, animationProps, staggeredAnimationProps } = usePageTransition();
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }
    
    const mockBots = generateMockBots();
    setBots(mockBots);
    
    const totalProfit = mockBots.reduce((sum, bot) => sum + bot.profit, 0);
    const activeBots = mockBots.filter(bot => bot.status === 'active').length;
    
    setStats({
      totalBots: mockBots.length,
      activeBots,
      totalProfit,
      dailyProfit: totalProfit * 0.1,
      weeklyProfit: totalProfit * 0.5,
    });
    
    setProfitData(generateProfitData());
  }, [navigate]);
  
  const handleBotAction = (action: string, id: string) => {
    setBots(prevBots => prevBots.map(bot => {
      if (bot.id === id) {
        let newStatus = bot.status;
        
        switch (action) {
          case 'play':
            newStatus = 'active';
            break;
          case 'pause':
            newStatus = 'paused';
            break;
          case 'stop':
            newStatus = 'stopped';
            break;
        }
        
        toast({
          title: `Bot ${action === 'delete' ? 'deleted' : action === 'play' ? 'started' : action === 'pause' ? 'paused' : 'stopped'}`,
          description: `${bot.name} has been ${action === 'delete' ? 'deleted' : action === 'play' ? 'started' : action === 'pause' ? 'paused' : 'stopped'}.`
        });
        
        return {
          ...bot,
          status: newStatus,
          lastActive: action === 'play' ? new Date() : bot.lastActive
        };
      }
      return bot;
    }));
    
    if (action === 'delete') {
      setBots(prevBots => prevBots.filter(bot => bot.id !== id));
      toast({
        title: "Bot deleted",
        description: "The bot has been removed from your dashboard."
      });
    }
  };
  
  const handleViewBotDetails = (id: string) => {
    navigate(`/bot/${id}`);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6">
          <div className="mb-8" {...animationProps}>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your bots and trading performance
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border backdrop-blur-sm bg-black/30" {...staggeredAnimationProps(0)}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
                <BotIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBots}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeBots} active
                </p>
              </CardContent>
            </Card>
            
            <Card className="border backdrop-blur-sm bg-black/30" {...staggeredAnimationProps(1)}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(stats.totalProfit)}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time
                </p>
              </CardContent>
            </Card>
            
            <Card className="border backdrop-blur-sm bg-black/30" {...staggeredAnimationProps(2)}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Daily Profit</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stats.dailyProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(stats.dailyProfit)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 24 hours
                </p>
              </CardContent>
            </Card>
            
            <Card className="border backdrop-blur-sm bg-black/30" {...staggeredAnimationProps(3)}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Weekly Profit</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stats.weeklyProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(stats.weeklyProfit)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3 mb-8" {...animationProps}>
            <div className="md:col-span-3 lg:col-span-3">
              <ProfitChart 
                dailyData={profitData.daily}
                weeklyData={profitData.weekly}
                monthlyData={profitData.monthly}
                totalProfit={stats.totalProfit}
              />
            </div>
          </div>
          
          <div className="mb-6" {...animationProps}>
            <h2 className="text-xl font-bold tracking-tight mb-4">Recent Bots</h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {bots.map((bot, index) => (
                <div key={bot.id} {...staggeredAnimationProps(index)}>
                  <BotCard 
                    bot={bot}
                    onPlay={(id) => handleBotAction('play', id)}
                    onPause={(id) => handleBotAction('pause', id)}
                    onStop={(id) => handleBotAction('stop', id)}
                    onDelete={(id) => handleBotAction('delete', id)}
                    onViewDetails={handleViewBotDetails}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
