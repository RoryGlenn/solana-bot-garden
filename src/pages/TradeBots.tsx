
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { usePageTransition } from '@/utils/animations';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Cpu, Save, Play, Pause, BarChart, RefreshCw, ChartLine, Sliders, DollarSign } from "lucide-react";
import { subDays, subHours } from 'date-fns';

const TradeBots = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [botConfig, setBotConfig] = useState({
    tradingPair: 'SOL/ETH',
    strategy: 'Momentum',
    risk: 'medium',
    budget: 1200,
    stopLoss: 5,
    takeProfit: 12
  });
  const navigate = useNavigate();
  const { isVisible, animationProps, staggeredAnimationProps } = usePageTransition();
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }
  }, [navigate]);
  
  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: "Trade Bot settings have been updated."
    });
  };
  
  const handleToggleBot = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Bot Stopped" : "Bot Started",
      description: `Trade Bot has been ${isActive ? "deactivated" : "activated"}.`
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
                <Cpu className="mr-3 h-7 w-7 text-solana" />
                Trade Bot
              </h1>
              <p className="text-muted-foreground">
                Execute trades using custom strategies and parameters
              </p>
            </div>
            
            <Button 
              className={`${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-solana to-accent'} hover:shadow-lg transition-all duration-300`}
              onClick={handleToggleBot}
            >
              {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isActive ? 'Stop Bot' : 'Start Bot'}
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4" {...animationProps}>
            <div className="md:col-span-2 lg:col-span-3">
              <Card className="border backdrop-blur-sm bg-black/30 glass-dark h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sliders className="mr-2 h-5 w-5" />
                    Bot Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="strategy">Strategy</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="general" className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="trading-pair">Trading Pair</Label>
                          <Select 
                            defaultValue={botConfig.tradingPair} 
                            onValueChange={(value) => setBotConfig({...botConfig, tradingPair: value})}
                          >
                            <SelectTrigger id="trading-pair">
                              <SelectValue placeholder="Select trading pair" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SOL/ETH">SOL/ETH</SelectItem>
                              <SelectItem value="SOL/USDC">SOL/USDC</SelectItem>
                              <SelectItem value="JUP/USDC">JUP/USDC</SelectItem>
                              <SelectItem value="BONK/USDC">BONK/USDC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="strategy">Strategy</Label>
                          <Select 
                            defaultValue={botConfig.strategy} 
                            onValueChange={(value) => setBotConfig({...botConfig, strategy: value})}
                          >
                            <SelectTrigger id="strategy">
                              <SelectValue placeholder="Select strategy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Momentum">Momentum</SelectItem>
                              <SelectItem value="Range Trading">Range Trading</SelectItem>
                              <SelectItem value="Trend Following">Trend Following</SelectItem>
                              <SelectItem value="Scalping">Scalping</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget (USDC)</Label>
                        <div className="flex items-center space-x-4">
                          <Slider 
                            id="budget"
                            defaultValue={[botConfig.budget]} 
                            max={5000} 
                            step={100}
                            onValueChange={(value) => setBotConfig({...botConfig, budget: value[0]})}
                            className="flex-1"
                          />
                          <div className="w-16 text-center font-medium">{botConfig.budget}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="risk">Risk Level</Label>
                        <Select 
                          defaultValue={botConfig.risk} 
                          onValueChange={(value) => setBotConfig({...botConfig, risk: value})}
                        >
                          <SelectTrigger id="risk">
                            <SelectValue placeholder="Select risk level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="strategy" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                          <div className="flex items-center space-x-4">
                            <Slider 
                              id="stop-loss"
                              defaultValue={[botConfig.stopLoss]} 
                              max={20} 
                              step={1}
                              onValueChange={(value) => setBotConfig({...botConfig, stopLoss: value[0]})}
                              className="flex-1"
                            />
                            <div className="w-16 text-center font-medium">{botConfig.stopLoss}%</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="take-profit">Take Profit (%)</Label>
                          <div className="flex items-center space-x-4">
                            <Slider 
                              id="take-profit"
                              defaultValue={[botConfig.takeProfit]} 
                              max={50} 
                              step={1}
                              onValueChange={(value) => setBotConfig({...botConfig, takeProfit: value[0]})}
                              className="flex-1"
                            />
                            <div className="w-16 text-center font-medium">{botConfig.takeProfit}%</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="time-frame">Analysis Timeframe</Label>
                          <Select defaultValue="15m">
                            <SelectTrigger id="time-frame">
                              <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1m">1 minute</SelectItem>
                              <SelectItem value="5m">5 minutes</SelectItem>
                              <SelectItem value="15m">15 minutes</SelectItem>
                              <SelectItem value="1h">1 hour</SelectItem>
                              <SelectItem value="4h">4 hours</SelectItem>
                              <SelectItem value="1d">1 day</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="auto-compound" defaultChecked />
                          <Label htmlFor="auto-compound">Auto-compound profits</Label>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="advanced" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="trailing-stop" defaultChecked />
                          <Label htmlFor="trailing-stop">Use trailing stop loss</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="dca" />
                          <Label htmlFor="dca">Enable dollar-cost averaging</Label>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="indicators">Technical Indicators</Label>
                          <Select defaultValue="rsi-macd">
                            <SelectTrigger id="indicators">
                              <SelectValue placeholder="Select indicators" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rsi">RSI</SelectItem>
                              <SelectItem value="macd">MACD</SelectItem>
                              <SelectItem value="rsi-macd">RSI + MACD</SelectItem>
                              <SelectItem value="bollinger">Bollinger Bands</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="api-key">API Key (optional)</Label>
                          <Input id="api-key" type="password" placeholder="Enter API key" />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end mt-6">
                    <Button 
                      onClick={handleSaveConfig}
                      className="bg-gradient-to-r from-solana to-accent hover:shadow-lg transition-all duration-300"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="border backdrop-blur-sm bg-black/30 glass-dark mb-6">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <BarChart className="mr-2 h-4 w-4" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-muted-foreground text-xs">Total Profit</div>
                      <div className="text-2xl font-bold text-green-500">+178.33 USDC</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground text-xs">Win Rate</div>
                      <div className="text-lg font-medium">62%</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground text-xs">Total Trades</div>
                      <div className="text-lg font-medium">35</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border backdrop-blur-sm bg-black/30 glass-dark">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border-b border-border pb-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Buy SOL</div>
                        <div className="text-green-500 text-sm">+18.2 USDC</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Today, 1:15 PM</div>
                    </div>
                    
                    <div className="border-b border-border pb-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Sell SOL</div>
                        <div className="text-green-500 text-sm">+7.8 USDC</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Yesterday, 4:32 PM</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Buy SOL</div>
                        <div className="text-red-500 text-sm">-4.2 USDC</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Yesterday, 10:20 AM</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TradeBots;
