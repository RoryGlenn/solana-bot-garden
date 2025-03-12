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
import { Crosshair, Save, Play, Pause, BarChart, RefreshCw, Bolt, Sliders, Search } from "lucide-react";
import { subDays, subHours } from 'date-fns';

const SnipeBots = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [botConfig, setBotConfig] = useState({
    targetToken: 'BONK',
    tradingPair: 'BONK/USDC',
    strategy: 'Momentum',
    risk: 'high',
    budget: 500
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
      description: "Snipe Bot settings have been updated."
    });
  };
  
  const handleToggleBot = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Bot Stopped" : "Bot Started",
      description: `Snipe Bot has been ${isActive ? "deactivated" : "activated"}.`
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
                <Crosshair className="mr-3 h-7 w-7 text-solana" />
                Snipe Bot
              </h1>
              <p className="text-muted-foreground">
                Quickly buy tokens as soon as liquidity is added
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
                      <TabsTrigger value="targets">Targets</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="general" className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="target-token">Target Token</Label>
                          <Select 
                            defaultValue={botConfig.targetToken} 
                            onValueChange={(value) => setBotConfig({...botConfig, targetToken: value})}
                          >
                            <SelectTrigger id="target-token">
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BONK">BONK</SelectItem>
                              <SelectItem value="JUP">JUP</SelectItem>
                              <SelectItem value="PYTH">PYTH</SelectItem>
                              <SelectItem value="Custom">Custom Token</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
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
                              <SelectItem value="BONK/USDC">BONK/USDC</SelectItem>
                              <SelectItem value="JUP/USDC">JUP/USDC</SelectItem>
                              <SelectItem value="PYTH/USDC">PYTH/USDC</SelectItem>
                              <SelectItem value="Custom">Custom Pair</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {botConfig.targetToken === 'Custom' && (
                        <div className="space-y-2">
                          <Label htmlFor="custom-token">Custom Token Address</Label>
                          <Input id="custom-token" placeholder="Enter token address" />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget (USDC)</Label>
                        <div className="flex items-center space-x-4">
                          <Slider 
                            id="budget"
                            defaultValue={[botConfig.budget]} 
                            max={2000} 
                            step={50}
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
                    
                    <TabsContent value="targets" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="strategy">Snipe Strategy</Label>
                          <Select 
                            defaultValue={botConfig.strategy} 
                            onValueChange={(value) => setBotConfig({...botConfig, strategy: value})}
                          >
                            <SelectTrigger id="strategy">
                              <SelectValue placeholder="Select strategy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="First Buy">First Buy</SelectItem>
                              <SelectItem value="Momentum">Momentum</SelectItem>
                              <SelectItem value="Liquidity Detection">Liquidity Detection</SelectItem>
                              <SelectItem value="Flash Buy">Flash Buy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="auto-sell" defaultChecked />
                          <Label htmlFor="auto-sell">Auto-sell on target reached</Label>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="take-profit">Take Profit (%)</Label>
                          <div className="flex items-center space-x-4">
                            <Slider 
                              id="take-profit"
                              defaultValue={[100]} 
                              max={500} 
                              step={10}
                              className="flex-1"
                            />
                            <div className="w-16 text-center font-medium">100%</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                          <div className="flex items-center space-x-4">
                            <Slider 
                              id="stop-loss"
                              defaultValue={[30]} 
                              max={100} 
                              step={5}
                              className="flex-1"
                            />
                            <div className="w-16 text-center font-medium">30%</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="advanced" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="front-run" />
                          <Label htmlFor="front-run">Enable front-running</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="auto-approve" defaultChecked />
                          <Label htmlFor="auto-approve">Auto-approve token spending</Label>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="gas-limit">Gas Limit (Multiplier)</Label>
                          <div className="flex items-center space-x-4">
                            <Slider 
                              id="gas-limit"
                              defaultValue={[1.5]} 
                              min={1}
                              max={5} 
                              step={0.1}
                              className="flex-1"
                            />
                            <div className="w-16 text-center font-medium">1.5x</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="monitorDelay">Monitoring Delay (ms)</Label>
                          <Input id="monitorDelay" type="number" placeholder="0" defaultValue="200" />
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
                      <div className="text-2xl font-bold text-green-500">+127.32 USDC</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground text-xs">Win Rate</div>
                      <div className="text-lg font-medium">75%</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground text-xs">Total Snipes</div>
                      <div className="text-lg font-medium">12</div>
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
                        <div className="text-sm font-medium">Buy BONK</div>
                        <div className="text-green-500 text-sm">+52.1 USDC</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Today, 11:22 AM</div>
                    </div>
                    
                    <div className="border-b border-border pb-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Sell BONK</div>
                        <div className="text-green-500 text-sm">+23.7 USDC</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Yesterday, 2:15 PM</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Buy JUP</div>
                        <div className="text-red-500 text-sm">-15.3 USDC</div>
                      </div>
                      <div className="text-xs text-muted-foreground">3 days ago, 9:45 AM</div>
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

export default SnipeBots;
