
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
import { Rocket, Coins, ArrowUp, Image as ImageIcon, FileText, Link as LinkIcon, MessageCircle } from "lucide-react";

const CoinLaunch = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [xLink, setXLink] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [telegramLink, setTelegramLink] = useState('');
  const [devBuyIn, setDevBuyIn] = useState('');
  const [tokenImage, setTokenImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('launch');
  const navigate = useNavigate();
  const { isVisible, animationProps, staggeredAnimationProps } = usePageTransition();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTokenImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      setDescription('');
      setXLink('');
      setWebsiteLink('');
      setTelegramLink('');
      setDevBuyIn('');
      setTokenImage(null);
      setImagePreview(null);
      
      // Switch to tokens tab to see the new token
      setActiveTab('tokens');
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
                <TabsTrigger value="tokens">My Tokens</TabsTrigger>
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
                        {/* Token Image Upload */}
                        <div className="mb-6">
                          <Label htmlFor="tokenImage">Token Image</Label>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="h-20 w-20 border-2 border-dashed border-border rounded-full flex items-center justify-center overflow-hidden">
                              {imagePreview ? (
                                <img 
                                  src={imagePreview} 
                                  alt="Token preview" 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('tokenImage')?.click()}
                                className="mb-2"
                              >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Select Image
                              </Button>
                              <input
                                id="tokenImage"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                              />
                              <p className="text-xs text-muted-foreground">
                                Recommended: 512x512 PNG format
                              </p>
                            </div>
                          </div>
                        </div>

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
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            placeholder="Brief description of your token"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="websiteLink">Website Link</Label>
                            <Input
                              id="websiteLink"
                              placeholder="https://"
                              value={websiteLink}
                              onChange={(e) => setWebsiteLink(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="xLink">X/Twitter Link</Label>
                            <Input
                              id="xLink"
                              placeholder="https://x.com/"
                              value={xLink}
                              onChange={(e) => setXLink(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="telegramLink">Telegram Link</Label>
                            <Input
                              id="telegramLink"
                              placeholder="https://t.me/"
                              value={telegramLink}
                              onChange={(e) => setTelegramLink(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="devBuyIn">Developer Buy-In (SOL)</Label>
                            <Input
                              id="devBuyIn"
                              type="number"
                              step="0.001"
                              placeholder="0.5"
                              value={devBuyIn}
                              onChange={(e) => setDevBuyIn(e.target.value)}
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
              
              <TabsContent value="tokens" className="mt-6">
                <Card className="border backdrop-blur-sm bg-black/30 glass-dark">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-solana" />
                      My Tokens
                    </CardTitle>
                    <CardDescription>
                      Manage your launched tokens
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* If there are no tokens yet */}
                      <div className="text-center py-10">
                        <Rocket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium">No tokens found</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't launched any tokens yet
                        </p>
                        <Button variant="outline" onClick={switchToLaunchTab}>
                          Launch your first token
                        </Button>
                      </div>
                      
                      {/* For future implementations, show launched tokens here */}
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
