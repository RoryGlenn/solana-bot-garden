
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from '@/types';
import BotCard from '@/components/BotCard';
import Sidebar from '@/components/Sidebar';
import { usePageTransition } from '@/utils/animations';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Plus, Zap } from "lucide-react";
import { subDays, subHours } from 'date-fns';

// Filtered mock data for snipe bots
const generateSnipeBots = (): Bot[] => {
  return [
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
      id: '8',
      name: 'New Token Sniper',
      type: 'snipe',
      status: 'stopped',
      profit: 58.92,
      createdAt: subDays(new Date(), 2),
      lastActive: subDays(new Date(), 1),
      config: {
        tradingPair: 'Custom',
        strategy: 'First Buy',
        risk: 'high',
        budget: 300
      }
    }
  ];
};

const SnipeBots = () => {
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
    setBots(generateSnipeBots());
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
                <Zap className="mr-3 h-7 w-7 text-solana" />
                Snipe Bot
              </h1>
              <p className="text-muted-foreground">
                Quickly buy tokens as soon as liquidity is added
              </p>
            </div>
            
            <Button 
              className="bg-gradient-to-r from-solana to-accent hover:shadow-lg transition-all duration-300"
              onClick={() => navigate('/snipe-bots/create')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Snipe Bot
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
                  <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Snipe Bot Yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first snipe bot to quickly buy tokens as soon as liquidity is added.</p>
                  <Button 
                    className="bg-gradient-to-r from-solana to-accent hover:shadow-lg transition-all duration-300"
                    onClick={() => navigate('/snipe-bots/create')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Snipe Bot
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

export default SnipeBots;
