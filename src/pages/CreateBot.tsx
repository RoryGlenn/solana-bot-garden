
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { usePageTransition } from '@/utils/animations';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { Activity, ArrowLeft, Cpu, Copy, Zap } from "lucide-react";
import { BotType } from '@/types';

const botTypes: { id: BotType; name: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'volume',
    name: 'Volume Bot',
    description: 'Trade based on volume indicators and market movements',
    icon: <Activity className="h-6 w-6" />,
  },
  {
    id: 'trade',
    name: 'Trade Bot',
    description: 'Execute trades using custom strategies and parameters',
    icon: <Cpu className="h-6 w-6" />,
  },
  {
    id: 'snipe',
    name: 'Snipe Bot',
    description: 'Quickly buy tokens as soon as liquidity is added',
    icon: <Zap className="h-6 w-6" />,
  },
  {
    id: 'copy-trade',
    name: 'Copy Trade Bot',
    description: 'Automatically copy trades from successful wallets',
    icon: <Copy className="h-6 w-6" />,
  },
];

const CreateBot = () => {
  const navigate = useNavigate();
  const { isVisible, animationProps, staggeredAnimationProps } = usePageTransition();
  const [selectedType, setSelectedType] = useState<BotType>('volume');
  const [name, setName] = useState('');
  const [tradingPair, setTradingPair] = useState('SOL/USDC');
  const [walletAddress, setWalletAddress] = useState('');
  const [risk, setRisk] = useState('medium');
  const [budget, setBudget] = useState('1000');
  const [strategy, setStrategy] = useState('');
  const [stopLoss, setStopLoss] = useState<number[]>([5]);
  const [takeProfit, setTakeProfit] = useState<number[]>([15]);
  
  const handleGoBack = () => {
    navigate('/dashboard');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your bot.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedType === 'copy-trade' && !walletAddress) {
      toast({
        title: "Missing information",
        description: "Please provide a wallet address to copy trades from.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedType !== 'copy-trade' && !tradingPair) {
      toast({
        title: "Missing information",
        description: "Please select a trading pair.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new bot (in a real app, this would be sent to a backend)
    const newBot = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      type: selectedType,
      status: 'active',
      profit: 0,
      createdAt: new Date(),
      lastActive: new Date(),
      config: {
        tradingPair: selectedType !== 'copy-trade' ? tradingPair : undefined,
        walletAddress: selectedType === 'copy-trade' ? walletAddress : undefined,
        strategy: strategy || getDefaultStrategy(selectedType),
        risk,
        budget: Number(budget),
        stopLoss: stopLoss[0],
        takeProfit: takeProfit[0],
      }
    };
    
    // In a real app, save to backend
    // For now, we'll simulate adding it to localStorage
    const existingBotsJson = localStorage.getItem('bots');
    const existingBots = existingBotsJson ? JSON.parse(existingBotsJson) : [];
    localStorage.setItem('bots', JSON.stringify([...existingBots, newBot]));
    
    toast({
      title: "Bot created successfully",
      description: `Your ${selectedType} bot is now active and running.`,
    });
    
    navigate('/dashboard');
  };
  
  const getDefaultStrategy = (type: BotType): string => {
    switch (type) {
      case 'volume':
        return 'Volume Profile';
      case 'trade':
        return 'Moving Average';
      case 'snipe':
        return 'First Buy';
      case 'copy-trade':
        return 'Follow Trades';
      default:
        return '';
    }
  };
  
  const renderBotTypeForm = () => {
    switch (selectedType) {
      case 'volume':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tradingPair">Trading Pair</Label>
              <Select value={tradingPair} onValueChange={setTradingPair}>
                <SelectTrigger id="tradingPair">
                  <SelectValue placeholder="Select trading pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL/USDC">SOL/USDC</SelectItem>
                  <SelectItem value="JUP/USDC">JUP/USDC</SelectItem>
                  <SelectItem value="BONK/USDC">BONK/USDC</SelectItem>
                  <SelectItem value="RNDR/USDC">RNDR/USDC</SelectItem>
                  <SelectItem value="ETH/USDC">ETH/USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger id="strategy">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Volume Profile">Volume Profile</SelectItem>
                  <SelectItem value="VWAP">VWAP</SelectItem>
                  <SelectItem value="Liquidity Hunting">Liquidity Hunting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                <span className="text-sm text-muted-foreground">{stopLoss[0]}%</span>
              </div>
              <Slider id="stopLoss" value={stopLoss} onValueChange={setStopLoss} max={20} step={1} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="takeProfit">Take Profit (%)</Label>
                <span className="text-sm text-muted-foreground">{takeProfit[0]}%</span>
              </div>
              <Slider id="takeProfit" value={takeProfit} onValueChange={setTakeProfit} max={50} step={1} />
            </div>
          </div>
        );
        
      case 'trade':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tradingPair">Trading Pair</Label>
              <Select value={tradingPair} onValueChange={setTradingPair}>
                <SelectTrigger id="tradingPair">
                  <SelectValue placeholder="Select trading pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL/USDC">SOL/USDC</SelectItem>
                  <SelectItem value="JUP/USDC">JUP/USDC</SelectItem>
                  <SelectItem value="BONK/USDC">BONK/USDC</SelectItem>
                  <SelectItem value="RNDR/USDC">RNDR/USDC</SelectItem>
                  <SelectItem value="ETH/USDC">ETH/USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger id="strategy">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Moving Average">Moving Average</SelectItem>
                  <SelectItem value="Range Trading">Range Trading</SelectItem>
                  <SelectItem value="Momentum">Momentum</SelectItem>
                  <SelectItem value="Breakout">Breakout</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                <span className="text-sm text-muted-foreground">{stopLoss[0]}%</span>
              </div>
              <Slider id="stopLoss" value={stopLoss} onValueChange={setStopLoss} max={20} step={1} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="takeProfit">Take Profit (%)</Label>
                <span className="text-sm text-muted-foreground">{takeProfit[0]}%</span>
              </div>
              <Slider id="takeProfit" value={takeProfit} onValueChange={setTakeProfit} max={50} step={1} />
            </div>
          </div>
        );
        
      case 'snipe':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tradingPair">Token to Snipe</Label>
              <Select value={tradingPair} onValueChange={setTradingPair}>
                <SelectTrigger id="tradingPair">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL/USDC">SOL/USDC</SelectItem>
                  <SelectItem value="JUP/USDC">JUP/USDC</SelectItem>
                  <SelectItem value="BONK/USDC">BONK/USDC</SelectItem>
                  <SelectItem value="RNDR/USDC">RNDR/USDC</SelectItem>
                  <SelectItem value="Custom">Custom Token</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {tradingPair === 'Custom' && (
              <div className="space-y-2">
                <Label htmlFor="customToken">Custom Token Address</Label>
                <Input id="customToken" placeholder="Enter token address" />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger id="strategy">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First Buy">First Buy</SelectItem>
                  <SelectItem value="Wait for Confirmed Liquidity">Wait for Confirmed Liquidity</SelectItem>
                  <SelectItem value="Sandwich">Sandwich</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="takeProfit">Take Profit (%)</Label>
                <span className="text-sm text-muted-foreground">{takeProfit[0]}%</span>
              </div>
              <Slider id="takeProfit" value={takeProfit} onValueChange={setTakeProfit} max={200} step={5} />
            </div>
          </div>
        );
        
      case 'copy-trade':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="walletAddress">Wallet Address to Copy</Label>
              <Input 
                id="walletAddress" 
                placeholder="Enter wallet address" 
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy">Copy Strategy</Label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger id="strategy">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Follow Trades">Follow All Trades</SelectItem>
                  <SelectItem value="Copy Only Buys">Copy Only Buys</SelectItem>
                  <SelectItem value="Copy Only Sells">Copy Only Sells</SelectItem>
                  <SelectItem value="Copy with Delay">Copy with 1min Delay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <NavBar />
      
      <main className="container px-4 py-6">
        <div className="flex items-center mb-8 cursor-pointer" onClick={handleGoBack} {...animationProps}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Back to Dashboard</span>
        </div>
        
        <div className="max-w-4xl mx-auto" {...animationProps}>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Bot</h1>
          <p className="text-muted-foreground mb-6">
            Configure your automated trading bot
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">Bot Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter a name for your bot"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-6"
                />
                
                <Label htmlFor="budget" className="mb-2 block">Budget (USDC)</Label>
                <Input 
                  id="budget" 
                  type="number"
                  placeholder="Enter amount in USDC"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="mb-6"
                />
                
                <Label htmlFor="risk" className="mb-2 block">Risk Level</Label>
                <Select value={risk} onValueChange={setRisk}>
                  <SelectTrigger id="risk">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="mb-3 block">Bot Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {botTypes.map((type, index) => (
                    <Card 
                      key={type.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedType === type.id 
                          ? 'border-solana dark:border-solana ring-2 ring-solana/20' 
                          : 'hover:border-primary/50'
                      } backdrop-blur-sm bg-white/90 dark:bg-black/30`}
                      onClick={() => setSelectedType(type.id)}
                      {...staggeredAnimationProps(index)}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1.5 rounded-full ${selectedType === type.id ? 'bg-solana/10 text-solana' : 'bg-muted text-muted-foreground'}`}>
                            {type.icon}
                          </div>
                          <CardTitle className="text-base">{type.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-1">
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            
            <Card className="mb-6 backdrop-blur-sm bg-white/90 dark:bg-black/30">
              <CardHeader>
                <CardTitle>Bot Configuration</CardTitle>
                <CardDescription>
                  Configure settings specific to your bot type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderBotTypeForm()}
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={handleGoBack}>
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-solana to-accent hover:shadow-lg transition-all duration-300"
              >
                Create Bot
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateBot;
