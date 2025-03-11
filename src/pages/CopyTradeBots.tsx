
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from '@/types';
import BotCard from '@/components/BotCard';
import Sidebar from '@/components/Sidebar';
import { usePageTransition } from '@/utils/animations';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Copy, Plus } from "lucide-react";
import { subDays } from 'date-fns';

// Filtered mock data for copy trade bots
const generateCopyTradeBots = (): Bot[] => {
  return [
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

const CopyTradeBots = () => {
  const [bots, setBots] = useState<Bot[]>([]);
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
    setBots(generateCopyTradeBots());
  }, [navigate]);
  
  const handleBotAction = (action: string, id: string) => {
    // Handle bot actions (play, pause, stop, delete)
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
                Copy Trade Bots
              </h1>
              <p className="text-muted-foreground">
                Automatically copy trades from successful wallets
              </p>
            </div>
            
            <Button 
              className="bg-gradient-to-r from-solana to-accent hover:shadow-lg transition-all duration-300"
              onClick={() => navigate('/copy-trade-bots/create')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Copy Trade Bot
            </Button>
          </div>
          
          <div className="mb-6" {...animationProps}>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {bots.length > 0 ? (
                bots.map((bot, index) => (
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
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Copy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Copy Trade Bots Yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first copy trade bot to automatically copy trades from successful wallets.</p>
                  <Button 
                    className="bg-gradient-to-r from-solana to-accent hover:shadow-lg transition-all duration-300"
                    onClick={() => navigate('/copy-trade-bots/create')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Copy Trade Bot
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CopyTradeBots;
