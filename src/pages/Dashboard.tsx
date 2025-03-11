import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, DashboardStats, ProfitData } from '@/types';
import BotCard from '@/components/BotCard';
import ProfitChart from '@/components/ProfitChart';
import Sidebar from '@/components/Sidebar';
import { usePageTransition } from '@/utils/animations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Activity, Bot as BotIcon, Clock, Cpu, DollarSign } from "lucide-react";
import { addDays, format, subDays, subHours, subMonths, subWeeks } from 'date-fns';

const generateMockBots = (): Bot[] => {
  return [
    {
      id: '1',
      name: 'Volume Bot',
      type: 'volume',
      status: 'active',
      config: {
        targetToken: 'BONK',
        tradingPair: 'BONK/SOL',// ticker of coin and sol ofc
        risk: 'moderate',
      }
    },
    {
      id: '2',
      name: 'Snipe Bot',
      type: 'snipe',
      status: 'active',
      config: {
        targetToken: 'BONK',
        tradingPair: 'BONK/SOL',
        risk: 'high',
      }
    },
    {
      id: '4',
      name: 'Copy Trade Bot',
      type: 'copy-trade',
      status: 'stopped',
      config: {
        targetWallet: 'HJLqkCFiNMUsXvqA9btLXFwKpWgCAXXXmNBFnSELvXSC',
        strategy: 'Follow Trades',
        risk: 'high',
        buyIn: 1.0 // 1 sol... when buying in it should display the the link on axiom and ca for the coin
      }
    }
  ];
};

const generateProfitData = (): {monthly: ProfitData[]} => {
  const monthly = Array.from({ length: 30 }, (_, i) => ({
    timestamp: subDays(new Date(), 29 - i),
    value: Math.random() * 1000 - 200
  }));
  
  return { monthly };
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
    
    const totalProfit = profitData.monthly.reduce((sum, data) => sum + data.value, 0);
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
        }
        
        toast({
          title: `Bot ${action === 'play' ? 'started' : 'paused'}`,
          description: `${bot.name} has been ${action === 'play' ? 'started' : 'paused'}.`
        });
        
        return {
          ...bot,
          status: newStatus,
        };
      }
      return bot;
    }));
  };
  
  const handleViewBotDetails = (id: string) => {
    const bot = bots.find(b => b.id === id);
    if (bot) {
      switch (bot.type) {
        case 'volume':
          navigate('/volume-bot');
          break;
        case 'snipe':
          navigate('/snipe-bot');
          break;
        case 'copy-trade':
          navigate('/copy-trade-bot');
          break;
        default:
          break;
      }
    }
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
          <div className="mb-8 flex items-center justify-between" {...animationProps}>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                <span className="font-semibold text-solana">{stats.activeBots}</span> active bots out of {stats.totalBots} total
              </p>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3 mb-8" {...animationProps}>
            <div className="md:col-span-3 lg:col-span-3">
              <ProfitChart 
                monthlyData={profitData.monthly}
                totalProfit={stats.totalProfit}
              />
            </div>
          </div>
          
          <div className="mb-6" {...animationProps}>
            <h2 className="text-xl font-bold tracking-tight mb-4">Bot Activity</h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {bots.map((bot, index) => (
                <div key={bot.id} {...staggeredAnimationProps(index)}>
                  <BotCard 
                    bot={bot}
                    onPlay={(id) => handleBotAction('play', id)}
                    onPause={(id) => handleBotAction('pause', id)}
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
