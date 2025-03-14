
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { usePageTransition } from '@/utils/animations';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Copy, Play, Pause } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface CopyTradeBotFormValues {
  targetWallet: string;
  buyAmount: string;
  copyMode: 'buyOnly' | 'buyAndSell';
  checkMarketCap: boolean;
  minMarketCap: string;
  maxMarketCap: string;
  checkVolume: boolean;
  minVolume: string;
}

const CopyTradeBot = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const { isVisible, animationProps, staggeredAnimationProps } = usePageTransition();
  
  const form = useForm<CopyTradeBotFormValues>({
    defaultValues: {
      targetWallet: '',
      buyAmount: '0.1',
      copyMode: 'buyOnly',
      checkMarketCap: false,
      minMarketCap: '10000',
      maxMarketCap: '1000000',
      checkVolume: false,
      minVolume: '5000'
    }
  });
  
  const watchCheckMarketCap = form.watch("checkMarketCap");
  const watchCheckVolume = form.watch("checkVolume");
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }
  }, [navigate]);
  
  const handleToggleBot = () => {
    const values = form.getValues();
    
    if (isActive) {
      setIsActive(false);
      toast({
        title: "Bot Stopped",
        description: "Copy Trade Bot has been deactivated."
      });
    } else {
      if (!values.targetWallet.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter a wallet address to copy trades from.",
          variant: "destructive"
        });
        return;
      }
      
      if (!values.buyAmount || parseFloat(values.buyAmount) <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid buy amount.",
          variant: "destructive"
        });
        return;
      }
      
      if (values.checkMarketCap) {
        const minMcap = parseFloat(values.minMarketCap);
        const maxMcap = parseFloat(values.maxMarketCap);
        
        if (isNaN(minMcap) || minMcap <= 0) {
          toast({
            title: "Invalid Minimum Market Cap",
            description: "Please enter a valid minimum market cap value.",
            variant: "destructive"
          });
          return;
        }
        
        if (isNaN(maxMcap) || maxMcap <= 0) {
          toast({
            title: "Invalid Maximum Market Cap",
            description: "Please enter a valid maximum market cap value.",
            variant: "destructive"
          });
          return;
        }
        
        if (minMcap >= maxMcap) {
          toast({
            title: "Invalid Market Cap Range",
            description: "Maximum market cap must be greater than minimum market cap.",
            variant: "destructive"
          });
          return;
        }
      }
      
      if (values.checkVolume) {
        const minVolume = parseFloat(values.minVolume);
        
        if (isNaN(minVolume) || minVolume <= 0) {
          toast({
            title: "Invalid Minimum Volume",
            description: "Please enter a valid minimum volume value.",
            variant: "destructive"
          });
          return;
        }
      }
      
      setIsActive(true);
      toast({
        title: "Bot Started",
        description: `Copy Trade Bot is now monitoring wallet: ${values.targetWallet.slice(0, 6)}...${values.targetWallet.slice(-4)} ${values.copyMode === 'buyOnly' ? '(Buy Only)' : '(Buy & Sell)'}`
      });
    }
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
          
          <div {...animationProps}>
            <Card className="border backdrop-blur-sm bg-black/30 glass-dark min-h-[400px]">
              <CardContent className="p-6">
                <Form {...form}>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="targetWallet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Target Wallet Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter wallet address to copy trades from" 
                              className="bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-solana/50" 
                              disabled={isActive}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The bot will monitor and copy trades from this wallet address
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="buyAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Buy Amount (SOL)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              min="0.01"
                              placeholder="0.1" 
                              className="bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-solana/50" 
                              disabled={isActive}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Amount in SOL to use for each copied transaction
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="copyMode"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-medium">Copy Mode</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                              disabled={isActive}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="buyOnly" id="buyOnly" />
                                <Label htmlFor="buyOnly">Copy Buy Transactions Only</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="buyAndSell" id="buyAndSell" />
                                <Label htmlFor="buyAndSell">Copy Both Buy and Sell Transactions</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Additional Checks</Label>
                      
                      <div className="flex items-center space-x-3 pt-2">
                        <FormField
                          control={form.control}
                          name="checkMarketCap"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isActive}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Check Market Cap
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {watchCheckMarketCap && (
                        <div className="ml-10 space-y-4 pt-2">
                          <FormField
                            control={form.control}
                            name="minMarketCap"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Minimum Market Cap ($)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0"
                                    placeholder="10000" 
                                    className="bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-solana/50" 
                                    disabled={isActive}
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Minimum market cap threshold for copied tokens
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="maxMarketCap"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Maximum Market Cap ($)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0"
                                    placeholder="1000000" 
                                    className="bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-solana/50" 
                                    disabled={isActive}
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Maximum market cap threshold for copied tokens
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <FormField
                          control={form.control}
                          name="checkVolume"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isActive}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Check Volume
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {watchCheckVolume && (
                        <div className="ml-10 space-y-4 pt-2">
                          <FormField
                            control={form.control}
                            name="minVolume"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Minimum Volume ($)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0"
                                    placeholder="5000" 
                                    className="bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-solana/50" 
                                    disabled={isActive}
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Minimum 24h trading volume threshold for copied tokens
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CopyTradeBot;
