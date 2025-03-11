
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from '@/types';
import BotCard from '@/components/BotCard';
import Sidebar from '@/components/Sidebar';
import { usePageTransition } from '@/utils/animations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";
import { subDays } from 'date-fns';

// Filtered mock data for copy trade bot
const generateCopyTradeBot = (): Bot => {
  return {
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
  };
};

const CopyTradeBot = () => {
  const [bot, setBot] = useState<Bot | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { isVisible, animationProps, staggeredAnimationProps } = usePageTransition();
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }
    
    // Load mock data
    setBot(generateCopyTradeBot());
  }, [navigate]);
  
  const handleBotAction = (action: string, id: string) => {
    // Handle bot actions (play, pause, stop, delete)
    if (!bot) return;
    
    let newBot = { ...bot };
    
    switch (action) {
      case 'play':
        newBot.status = 'active';
        newBot.lastActive = new Date();
        break;
      case 'pause':
        newBot.status = 'paused';
        break;
      case 'stop':
        newBot.status = 'stopped';
        break;
    }
    
    setBot(newBot);
    
    toast({
      title: `Bot ${action === 'delete' ? 'deleted' : action === 'play' ? 'started' : action === 'pause' ? 'paused' : 'stopped'}`,
      description: `${bot.name} has been ${action === 'delete' ? 'deleted' : action === 'play' ? 'started' : action === 'pause' ? 'paused' : 'stopped'}.`
    });
    
    if (action === 'delete') {
      setBot(null);
      toast({
        title: "Bot deleted",
        description: "The bot has been removed."
      });
    }
  };
  
  const handleViewBotDetails = (id: string) => {
    // In a real app, this would navigate to a detailed view
    toast({
      title: "Bot Details",
      description: "Viewing detailed configuration for this bot."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8" {...animationProps}>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center">
                <Copy className="mr-3 h-7 w-7 text-solana" />
                Copy Trade Bot
              </h1>
              <p className="text-muted-foreground">
                Automatically copy trades from successful wallets
              </p>
            </div>
          </div>
          
          <div className="mb-6" {...animationProps}>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {bot ? (
                <div key={bot.id} {...staggeredAnimationProps(0)}>
                  <BotCard 
                    bot={bot}
                    onPlay={(id) => handleBotAction('play', id)}
                    onPause={(id) => handleBotAction('pause', id)}
                    onStop={(id) => handleBotAction('stop', id)}
                    onDelete={(id) => handleBotAction('delete', id)}
                    onViewDetails={handleViewBotDetails}
                  />
                </div>
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Copy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Copy Trade Bot Configuration</h3>
                  <p className="text-muted-foreground mb-6">Configure your copy trade bot to automatically copy trades from successful wallets.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CopyTradeBot;
