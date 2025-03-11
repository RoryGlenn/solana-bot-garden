
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { usePageTransition } from '@/utils/animations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Rocket, Coins, ArrowUp } from "lucide-react";

const CoinLaunch = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('launch');
  const navigate = useNavigate();
  const { isVisible, animationProps, staggeredAnimationProps } = usePageTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This is where you would integrate with the pumpportal API
      // Mocking the API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Launch initiated!",
        description: `${tokenName} (${tokenSymbol}) is being prepared for launch on pump.fun`,
      });
      
      // Reset form
      setTokenName('');
      setTokenSymbol('');
      setTotalSupply('');
      setInitialPrice('');
    } catch (error) {
      toast({
        title: "Launch failed",
        description: "There was an error launching your token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLaunchTab = () => {
    setActiveTab('launch');
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
            <h1 className="text-3xl font-bold tracking-tight">Coin Launch</h1>
            <p className="text-muted-foreground">
              Create and launch your own token on pump.fun
            </p>
          </div>
          
          <div {...animationProps}>
            <Tabs defaultValue="launch" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="launch">Launch Token</TabsTrigger>
                <TabsTrigger value="history">Launch History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="launch" className="mt-6">
                <Card className="border backdrop-blur-sm bg-black/30 glass-dark">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-solana" />
                      Launch New Token
                    </CardTitle>
                    <CardDescription>
                      Fill out the form below to create and launch your token on pump.fun
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="tokenName">Token Name</Label>
                            <Input
                              id="tokenName"
                              placeholder="e.g. Solana Bot"
                              value={tokenName}
                              onChange={(e) => setTokenName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tokenSymbol">Token Symbol</Label>
                            <Input
                              id="tokenSymbol"
                              placeholder="e.g. SBOT"
                              value={tokenSymbol}
                              onChange={(e) => setTokenSymbol(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="totalSupply">Total Supply</Label>
                            <Input
                              id="totalSupply"
                              type="number"
                              placeholder="e.g. 1000000"
                              value={totalSupply}
                              onChange={(e) => setTotalSupply(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="initialPrice">Initial Price (SOL)</Label>
                            <Input
                              id="initialPrice"
                              type="number"
                              step="0.000001"
                              placeholder="e.g. 0.000001"
                              value={initialPrice}
                              onChange={(e) => setInitialPrice(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-solana to-accent" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Launching...
                          </>
                        ) : (
                          <>
                            <Rocket className="h-5 w-5 mr-2" />
                            Launch Token
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <Card className="border backdrop-blur-sm bg-black/30 glass-dark">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-solana" />
                      Launch History
                    </CardTitle>
                    <CardDescription>
                      View the history of tokens you've launched
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* If there's no launch history yet */}
                      <div className="text-center py-10">
                        <Rocket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium">No launches yet</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't launched any tokens yet
                        </p>
                        <Button variant="outline" onClick={switchToLaunchTab}>
                          Launch your first token
                        </Button>
                      </div>
                      
                      {/* For future implementations, show launch history here */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoinLaunch;
