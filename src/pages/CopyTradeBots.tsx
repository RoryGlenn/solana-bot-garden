
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
import { Copy, Save, Play, Pause, BarChart, RefreshCw, WalletCards, Sliders, UserCheck } from "lucide-react";
import { subDays } from 'date-fns';

const CopyTradeBot = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [botConfig, setBotConfig] = useState({
    walletAddress: 'Dg1...',
    strategy: 'Follow Trades',
    risk: 'medium',
    budget: 1500
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
      description: "Copy Trade Bot settings have been updated."
    });
  };
  
  const handleToggleBot = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Bot Stopped" : "Bot Started",
      description: `Copy Trade Bot has been ${isActive ? "deactivated" : "activated"}.`
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
                      <TabsTrigger value="wallets">Wallets</TabsTrigger>
                      <TabsTrigger value="filters">Filters</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="general" className="space-y-4">
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="strategy">Copy Strategy</Label>
                        <Select 
                          defaultValue={botConfig.strategy} 
                          onValueChange={(value) => setBotConfig({...botConfig, strategy: value})}
                        >
                          <SelectTrigger id="strategy">
                            <SelectValue placeholder="Select strategy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Follow Trades">Follow All Trades</SelectItem>
                            <SelectItem value="Smart Copy">Smart Copy (Filter Small Trades)</SelectItem>
                            <SelectItem value="Delayed Copy">Delayed Copy (2 min delay)</SelectItem>
                            <SelectItem value="Reverse Trading">Reverse Trading</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="notifications" defaultChecked />
                        <Label htmlFor="notifications">Enable trade notifications</Label>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="wallets" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="wallet-address">Target Wallet Address</Label>
                          <Input 
                            id="wallet-address" 
                            value={botConfig.walletAddress}
                            onChange={(e) => setBotConfig({...botConfig, walletAddress: e.target.value})}
                            placeholder="Enter wallet address" 
                          />
                        </div>
                        
                        <div className="flex flex-col space-y-2 border border-border rounded-md p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <UserCheck className="h-4 w-4 mr-2 text-solana" />
                              <span className="text-sm font-medium">DeGods Whale</span>
                            </div>
                            <div className="text-xs text-green-500">+412.65 USDC</div>
                          </div>
                          <div className="text-xs text-muted-foreground">Dg1abcdefghi...</div>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          <WalletCards className="mr-2 h-4 w-4" />
                          Add Another Wallet
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="filters" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="min-trade">Minimum Trade Amount (USDC)</Label>
                          <div className="flex items-center space-x-4">
                            <Slider 
                              id="min-trade"
                              defaultValue={[100]} 
                              max={1000} 
                              step={10}
                              className="flex-1"
                            />
                            <div className="w-16 text-center font-medium">100</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="max-trade">Maximum Trade Amount (USDC)</Label>
                          <div className="flex items-center space-x-4">
                            <Slider 
                              id="max-trade"
                              defaultValue={[1000]} 
                              max={5000} 
                              step={100}
                              className="flex-1"
                            />
                            <div className="w-16 text-center font-medium">1000</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="filter-tokens" defaultChecked />
                          <Label htmlFor="filter-tokens">Only copy major tokens</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="avoid-small-mcap" defaultChecked />
                          <Label htmlFor="avoid-small-mcap">Avoid small market cap tokens</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="copy-sells" defaultChecked />
                          <Label htmlFor="copy-sells">Copy sell orders</Label>
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
                      <div className="text-2xl font-bold text-green-500">+412.65 USDC</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground text-xs">Win Rate</div>
                      <div className="text-lg font-medium">85%</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground text-xs">Copied Trades</div>
                      <div className="text-lg font-medium">25</div>
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
                        <div className="text-green-500 text-sm">+85.2 USDC</div>
                      </div>
                      <div className="text-xs text-muted-foreground">5 days ago, 3:45 PM</div>
                    </div>
                    
                    <div className="border-b border-border pb-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Buy JUP</div>
                        <div className="text-green-500 text-sm">+127.3 USDC</div>
                      </div>
                      <div className="text-xs text-muted-foreground">1 week ago, 2:15 PM</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Sell BONK</div>
                        <div className="text-green-500 text-sm">+58.4 USDC</div>
                      </div>
                      <div className="text-xs text-muted-foreground">2 weeks ago, 11:20 AM</div>
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

export default CopyTradeBot;
