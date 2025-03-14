import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { usePageTransition } from '@/utils/animations';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Crosshair, Play, Pause } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";

interface SnipeBotFormValues {
  devWalletAddress: string;
  checkMaxMarketCap: boolean;
  maxMarketCap: string;
}

const SnipeBots = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const { isVisible, animationProps, staggeredAnimationProps } = usePageTransition();
  
  const form = useForm<SnipeBotFormValues>({
    defaultValues: {
      devWalletAddress: '',
      checkMaxMarketCap: false,
      maxMarketCap: '1000000',
    }
  });
  
  const watchCheckMaxMarketCap = form.watch("checkMaxMarketCap");
  
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
        description: "Snipe Bot has been deactivated."
      });
    } else {
      if (!values.devWalletAddress.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter a developer wallet address to snipe.",
          variant: "destructive"
        });
        return;
      }
      
      if (values.checkMaxMarketCap) {
        const maxMarketCap = parseFloat(values.maxMarketCap);
        
        if (isNaN(maxMarketCap) || maxMarketCap <= 0) {
          toast({
            title: "Invalid Maximum Market Cap",
            description: "Please enter a valid maximum market cap value.",
            variant: "destructive"
          });
          return;
        }
      }
      
      setIsActive(true);
      toast({
        title: "Bot Started",
        description: `Snipe Bot is now monitoring developer wallet: ${values.devWalletAddress.slice(0, 6)}...${values.devWalletAddress.slice(-4)}`
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
          
          <div {...animationProps}>
            <Card className="border backdrop-blur-sm bg-black/30 glass-dark min-h-[400px]">
              <CardContent className="p-6">
                <Form {...form}>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="devWalletAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Snipe Dev Wallet</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter developer wallet address to snipe their new tokens" 
                              className="bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-solana/50" 
                              disabled={isActive}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Monitor this developer address and automatically snipe newly created tokens when they deploy on pump.fun
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="checkMaxMarketCap"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Maximum Market Cap Threshold
                              </FormLabel>
                              <FormDescription>
                                Only buy tokens below a specified market cap value
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isActive}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {watchCheckMaxMarketCap && (
                        <div className="ml-10 space-y-4 pt-2">
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
                                  Maximum market cap threshold for tokens to snipe
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

export default SnipeBots;
