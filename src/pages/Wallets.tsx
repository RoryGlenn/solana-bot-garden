import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { usePageTransition } from '@/utils/animations';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { 
  Wallet, 
  Plus, 
  ChevronRight, 
  Code, 
  Copy, 
  Trash,
  AlertTriangle,
  Key,
  Download,
  Upload,
  Shuffle,
  ArrowUpDown
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface WalletProps {
  address: string;
  label: string;
  balance: number;
  type: 'regular' | 'developer' | 'funder';
}

const Wallets = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [wallets, setWallets] = useState<WalletProps[]>([
    {
      address: '8xgM2eWzx5iUCydarhH4Dxkk4gVFZq6oCLLZLBXnKEMH',
      label: 'Main Wallet',
      balance: 1.25,
      type: 'regular'
    }
  ]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDevWalletDialogOpen, setIsDevWalletDialogOpen] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<string | null>(null);
  const [isFunderDialogOpen, setIsFunderDialogOpen] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [isDistributeDialogOpen, setIsDistributeDialogOpen] = useState(false);
  const [distributionRange, setDistributionRange] = useState([0.5, 2]);
  const [minDistribution, setMinDistribution] = useState("0.5");
  const [maxDistribution, setMaxDistribution] = useState("2");
  const [isFundWithdrawDialogOpen, setIsFundWithdrawDialogOpen] = useState(false);
  const [currentActionWallet, setCurrentActionWallet] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'fund' | 'withdraw'>('fund');
  const [fundAmount, setFundAmount] = useState(0.1);
  
  const navigate = useNavigate();
  const { animationProps, staggeredAnimationProps } = usePageTransition();

  const hasDevWallet = wallets.some(wallet => wallet.type === 'developer');
  const hasFunderWallet = wallets.some(wallet => wallet.type === 'funder');
  
  const createWallet = (type: 'regular' | 'developer') => {
    if (type === 'developer' && hasDevWallet) {
      setIsDevWalletDialogOpen(true);
      return;
    }
    
    addNewWallet(type);
  };

  const addNewWallet = (type: 'regular' | 'developer' | 'funder') => {
    let updatedWallets = [...wallets];
    if (type === 'developer') {
      updatedWallets = wallets.filter(w => w.type !== 'developer');
    }
    
    const newWallet: WalletProps = {
      address: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      label: type === 'regular' 
        ? `Wallet ${wallets.filter(w => w.type === 'regular').length + 1}` 
        : type === 'developer' 
          ? `Dev Wallet` 
          : `Funder Wallet`,
      balance: type === 'funder' ? 100 : 0,
      type
    };
    
    setWallets([...updatedWallets, newWallet]);
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Wallet Created`,
      description: `Your new ${type} wallet has been created successfully.`,
    });
  };

  const deleteWallet = (address: string) => {
    setWalletToDelete(address);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!walletToDelete) return;
    
    setWallets(wallets.filter(wallet => wallet.address !== walletToDelete));
    setIsDeleteDialogOpen(false);
    setWalletToDelete(null);
    
    toast({
      title: "Wallet Deleted",
      description: "Your wallet has been deleted successfully.",
    });
  };

  const confirmDevWalletReplacement = () => {
    setIsDevWalletDialogOpen(false);
    addNewWallet('developer');
  };
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard.",
    });
  };

  const openFunderDialog = () => {
    setPrivateKey('');
    setIsFunderDialogOpen(true);
  };

  const createFunderWallet = () => {
    if (!privateKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a private key.",
        variant: "destructive",
      });
      return;
    }

    let updatedWallets = wallets.filter(w => w.type !== 'funder');
    
    addNewWallet('funder');
    setIsFunderDialogOpen(false);
    setPrivateKey('');
  };

  const collectAllTokens = () => {
    if (!hasFunderWallet) {
      toast({
        title: "No Funder Wallet",
        description: "You need to create a funder wallet first.",
        variant: "destructive",
      });
      return;
    }

    const funderWallet = wallets.find(w => w.type === 'funder');
    if (!funderWallet) return;

    let totalCollected = 0;
    const updatedWallets = wallets.map(wallet => {
      if (wallet.type !== 'funder') {
        totalCollected += wallet.balance;
        return { ...wallet, balance: 0 };
      }
      return wallet;
    });

    const finalWallets = updatedWallets.map(wallet => 
      wallet.type === 'funder' 
        ? { ...wallet, balance: wallet.balance + totalCollected } 
        : wallet
    );

    setWallets(finalWallets);
    
    toast({
      title: "Tokens Collected",
      description: `Collected ${totalCollected.toFixed(2)} SOL to funder wallet.`,
    });
  };

  const openDistributeDialog = () => {
    if (!hasFunderWallet) {
      toast({
        title: "No Funder Wallet",
        description: "You need to create a funder wallet first.",
        variant: "destructive",
      });
      return;
    }

    setDistributionRange([0.5, 2]);
    setMinDistribution("0.5");
    setMaxDistribution("2");
    setIsDistributeDialogOpen(true);
  };

  const handleMinDistributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinDistribution(value);
    const minVal = parseFloat(value) || 0.1;
    const maxVal = parseFloat(maxDistribution) || 25;
    if (minVal < maxVal) {
      setDistributionRange([minVal, distributionRange[1]]);
    }
  };

  const handleMaxDistributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxDistribution(value);
    const maxVal = parseFloat(value) || 25;
    const minVal = parseFloat(minDistribution) || 0.1;
    if (maxVal > minVal) {
      setDistributionRange([distributionRange[0], maxVal]);
    }
  };

  const handleDistributionRangeChange = (values: number[]) => {
    setDistributionRange(values);
    setMinDistribution(values[0].toString());
    setMaxDistribution(values[1].toString());
  };

  const distributeTokens = () => {
    const funderWallet = wallets.find(w => w.type === 'funder');
    if (!funderWallet) return;

    const regularWallets = wallets.filter(w => w.type === 'regular');
    if (regularWallets.length === 0) {
      toast({
        title: "No Regular Wallets",
        description: "You need at least one regular wallet to distribute tokens.",
        variant: "destructive",
      });
      return;
    }

    let totalToDistribute = 0;
    const distributionAmounts: { [address: string]: number } = {};

    regularWallets.forEach(wallet => {
      const minVal = parseFloat(minDistribution) || 0.1;
      const maxVal = parseFloat(maxDistribution) || 25;
      const randomAmount = Math.random() * (maxVal - minVal) + minVal;
      const roundedAmount = Math.round(randomAmount * 100) / 100;
      distributionAmounts[wallet.address] = roundedAmount;
      totalToDistribute += roundedAmount;
    });

    if (funderWallet.balance < totalToDistribute) {
      toast({
        title: "Insufficient Balance",
        description: "Funder wallet doesn't have enough tokens to distribute.",
        variant: "destructive",
      });
      return;
    }

    const updatedWallets = wallets.map(wallet => {
      if (wallet.type === 'funder') {
        return { ...wallet, balance: wallet.balance - totalToDistribute };
      } else if (wallet.type === 'regular') {
        return { ...wallet, balance: wallet.balance + distributionAmounts[wallet.address] };
      }
      return wallet;
    });

    setWallets(updatedWallets);
    setIsDistributeDialogOpen(false);
    
    toast({
      title: "Tokens Distributed",
      description: `Distributed ${totalToDistribute.toFixed(2)} SOL to ${regularWallets.length} wallets.`,
    });
  };

  const openFundWithdrawDialog = (address: string, action: 'fund' | 'withdraw') => {
    if (!hasFunderWallet) {
      toast({
        title: "No Funder Wallet",
        description: "You need to create a funder wallet first.",
        variant: "destructive",
      });
      return;
    }

    setCurrentActionWallet(address);
    setActionType(action);
    setFundAmount(0.1);
    setIsFundWithdrawDialogOpen(true);
  };

  const processFundWithdraw = () => {
    if (!currentActionWallet) return;
    
    const funderWallet = wallets.find(w => w.type === 'funder');
    const targetWallet = wallets.find(w => w.address === currentActionWallet);
    
    if (!funderWallet || !targetWallet) return;

    if (actionType === 'fund') {
      if (funderWallet.balance < fundAmount) {
        toast({
          title: "Insufficient Balance",
          description: "Funder wallet doesn't have enough tokens.",
          variant: "destructive",
        });
        return;
      }

      const updatedWallets = wallets.map(wallet => {
        if (wallet.type === 'funder') {
          return { ...wallet, balance: wallet.balance - fundAmount };
        } else if (wallet.address === currentActionWallet) {
          return { ...wallet, balance: wallet.balance + fundAmount };
        }
        return wallet;
      });

      setWallets(updatedWallets);
      
      toast({
        title: "Wallet Funded",
        description: `Sent ${fundAmount} SOL to ${targetWallet.label}.`,
      });
    } else {
      if (targetWallet.balance < fundAmount) {
        toast({
          title: "Insufficient Balance",
          description: `${targetWallet.label} doesn't have enough tokens.`,
          variant: "destructive",
        });
        return;
      }

      const updatedWallets = wallets.map(wallet => {
        if (wallet.type === 'funder') {
          return { ...wallet, balance: wallet.balance + fundAmount };
        } else if (wallet.address === currentActionWallet) {
          return { ...wallet, balance: wallet.balance - fundAmount };
        }
        return wallet;
      });

      setWallets(updatedWallets);
      
      toast({
        title: "Wallet Withdrawn",
        description: `Withdrew ${fundAmount} SOL from ${targetWallet.label} and sent to funder wallet.`,
      });
    }

    setIsFundWithdrawDialogOpen(false);
    setCurrentActionWallet(null);
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
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <Wallet className="mr-3 h-7 w-7 text-solana" />
              Wallets
            </h1>
            <p className="text-muted-foreground">
              Manage your Solana wallets
            </p>
          </div>
          
          <div className="mb-6 flex flex-wrap items-center gap-4" {...animationProps}>
            <Button onClick={() => createWallet('regular')} className="bg-gradient-to-r from-solana to-accent">
              <Plus className="mr-2 h-4 w-4" />
              Create Wallet
            </Button>
            <Button 
              onClick={() => createWallet('developer')}
              variant="outline" 
              className="border-solana text-solana hover:bg-solana/10"
            >
              <Code className="mr-2 h-4 w-4" />
              {hasDevWallet ? 'Create New Dev Wallet' : 'Create Dev Wallet'}
            </Button>
            {!hasFunderWallet && (
              <Button 
                onClick={openFunderDialog}
                variant="outline" 
                className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
              >
                <Key className="mr-2 h-4 w-4" />
                Add Funder Wallet
              </Button>
            )}
            {hasFunderWallet && (
              <>
                <Button 
                  onClick={collectAllTokens}
                  variant="outline" 
                  className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Collect All SOL
                </Button>
                <Button 
                  onClick={openDistributeDialog}
                  variant="outline" 
                  className="border-purple-500 text-purple-500 hover:bg-purple-500/10"
                >
                  <Shuffle className="mr-2 h-4 w-4" />
                  Distribute Tokens
                </Button>
              </>
            )}
          </div>
          
          {hasFunderWallet && (
            <>
              <div className="grid gap-4 mb-8" {...animationProps}>
                <h2 className="text-xl font-semibold">Funder Wallet</h2>
                {wallets.filter(wallet => wallet.type === 'funder').map((wallet, index) => (
                  <Card 
                    key={wallet.address} 
                    className="border backdrop-blur-sm bg-black/30 glass-dark hover:bg-black/40 transition-colors border-amber-500/30"
                    {...staggeredAnimationProps(index)}
                  >
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4 text-amber-500" />
                          <h3 className="font-medium">{wallet.label}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          {formatAddress(wallet.address)}
                          <button 
                            onClick={() => copyAddress(wallet.address)}
                            className="text-muted-foreground hover:text-amber-500"
                            title="Copy address"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="font-bold mr-4">{wallet.balance} SOL</p>
                        <button 
                          onClick={() => deleteWallet(wallet.address)}
                          className="text-muted-foreground hover:text-destructive mr-3"
                          title="Delete wallet"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                        <ChevronRight className="h-5 w-5 text-muted-foreground cursor-pointer" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
          
          <div className="grid gap-4" {...animationProps}>
            <h2 className="text-xl font-semibold">Your Wallets</h2>
            {wallets.filter(wallet => wallet.type === 'regular').length === 0 ? (
              <Card className="border backdrop-blur-sm bg-black/30 glass-dark">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No wallets found. Create your first wallet to get started.</p>
                </CardContent>
              </Card>
            ) : (
              wallets.filter(wallet => wallet.type === 'regular').map((wallet, index) => (
                <Card 
                  key={wallet.address} 
                  className="border backdrop-blur-sm bg-black/30 glass-dark hover:bg-black/40 transition-colors"
                  {...staggeredAnimationProps(index)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Wallet className="h-4 w-4 text-solana" />
                        <h3 className="font-medium">{wallet.label}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {formatAddress(wallet.address)}
                        <button 
                          onClick={() => copyAddress(wallet.address)}
                          className="text-muted-foreground hover:text-solana"
                          title="Copy address"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-4">{wallet.balance} SOL</p>
                      {hasFunderWallet && (
                        <button 
                          onClick={() => openFundWithdrawDialog(wallet.address, 'fund')}
                          className="text-muted-foreground hover:text-emerald-500 mr-3"
                          title="Fund/Withdraw"
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteWallet(wallet.address)}
                        className="text-muted-foreground hover:text-destructive mr-3"
                        title="Delete wallet"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                      <ChevronRight className="h-5 w-5 text-muted-foreground cursor-pointer" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            <h2 className="text-xl font-semibold mt-8">Developer Wallet</h2>
            {wallets.filter(wallet => wallet.type === 'developer').length === 0 ? (
              <Card className="border backdrop-blur-sm bg-black/30 glass-dark">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No developer wallet found. Create a developer wallet for testing.</p>
                </CardContent>
              </Card>
            ) : (
              wallets.filter(wallet => wallet.type === 'developer').map((wallet, index) => (
                <Card 
                  key={wallet.address} 
                  className="border backdrop-blur-sm bg-black/30 glass-dark hover:bg-black/40 transition-colors border-dashed"
                  {...staggeredAnimationProps(index)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Code className="h-4 w-4 text-solana" />
                        <h3 className="font-medium">{wallet.label}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {formatAddress(wallet.address)}
                        <button 
                          onClick={() => copyAddress(wallet.address)}
                          className="text-muted-foreground hover:text-solana"
                          title="Copy address"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-4">{wallet.balance} SOL</p>
                      {hasFunderWallet && (
                        <button 
                          onClick={() => openFundWithdrawDialog(wallet.address, 'fund')}
                          className="text-muted-foreground hover:text-emerald-500 mr-3"
                          title="Fund/Withdraw"
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteWallet(wallet.address)}
                        className="text-muted-foreground hover:text-destructive mr-3"
                        title="Delete wallet"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                      <ChevronRight className="h-5 w-5 text-muted-foreground cursor-pointer" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="backdrop-blur-sm bg-black/50 border-destructive">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this wallet? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isDevWalletDialogOpen} onOpenChange={setIsDevWalletDialogOpen}>
        <AlertDialogContent className="backdrop-blur-sm bg-black/50 border-solana">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-solana" />
              Replace Developer Wallet
            </AlertDialogTitle>
            <AlertDialogDescription>
              You already have a developer wallet. Creating a new one will replace the existing one. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDevWalletReplacement} className="bg-solana text-white hover:bg-solana/90">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isFunderDialogOpen} onOpenChange={setIsFunderDialogOpen}>
        <AlertDialogContent className="backdrop-blur-sm bg-black/50 border-amber-500">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-amber-500" />
              Add Funder Wallet
            </AlertDialogTitle>
            <AlertDialogDescription>
              Enter the private key of your funder wallet. This wallet will be used to fund other wallets.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="private-key">Private Key</Label>
              <Input 
                id="private-key" 
                value={privateKey} 
                onChange={(e) => setPrivateKey(e.target.value)} 
                placeholder="Enter private key..."
                className="border-amber-500/30 focus-visible:ring-amber-500"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={createFunderWallet} 
              className="bg-amber-500 text-white hover:bg-amber-500/90"
            >
              Add Wallet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isDistributeDialogOpen} onOpenChange={setIsDistributeDialogOpen}>
        <AlertDialogContent className="backdrop-blur-sm bg-black/50 border-purple-500">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shuffle className="h-5 w-5 text-purple-500" />
              Distribute Tokens
            </AlertDialogTitle>
            <AlertDialogDescription>
              Set the range for random token distribution to regular wallets.
              The funder wallet will send a random amount within this range to each wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Distribution Range (SOL)</Label>
                <span className="text-sm text-muted-foreground">
                  {parseFloat(minDistribution).toFixed(1)} - {parseFloat(maxDistribution).toFixed(1)} SOL
                </span>
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="w-1/3">
                  <Label htmlFor="min-distribution" className="text-xs mb-1 block">Min (SOL)</Label>
                  <Input 
                    id="min-distribution"
                    type="number"
                    value={minDistribution}
                    onChange={handleMinDistributionChange}
                    min="0.1"
                    step="0.1"
                    className="border-purple-500/30 focus-visible:ring-purple-500"
                  />
                </div>
                <div className="w-1/3 flex-grow">
                  <Slider 
                    value={distributionRange}
                    onValueChange={handleDistributionRangeChange}
                    max={25}
                    step={0.1}
                    min={0.1}
                    className="[&_[data-orientation=horizontal]]:h-2 [&_[data-orientation=horizontal]>[data-state]]:bg-purple-500"
                  />
                </div>
                <div className="w-1/3">
                  <Label htmlFor="max-distribution" className="text-xs mb-1 block">Max (SOL)</Label>
                  <Input 
                    id="max-distribution"
                    type="number"
                    value={maxDistribution}
                    onChange={handleMaxDistributionChange}
                    min="0.1"
                    step="0.1"
                    max="100"
                    className="border-purple-500/30 focus-visible:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={distributeTokens} 
              className="bg-purple-500 text-white hover:bg-purple-500/90"
            >
              Distribute
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isFundWithdrawDialogOpen} onOpenChange={setIsFundWithdrawDialogOpen}>
        <AlertDialogContent className="backdrop-blur-sm bg-black/50 border-emerald-500">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-emerald-500" />
              Fund or Withdraw
            </AlertDialogTitle>
            <AlertDialogDescription>
              Transfer tokens between this wallet and the funder wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fund-amount">Amount (SOL)</Label>
              <Input
                id="fund-amount"
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(parseFloat(e.target.value) || 0)}
                min="0.1"
                step="0.1"
                placeholder="Enter amount"
                className="border-emerald-500/30 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Quick Select</Label>
                <span className="text-sm text-muted-foreground">
                  {fundAmount} SOL
                </span>
              </div>
              <Slider 
                value={[fundAmount]}
                onValueChange={(value) => setFundAmount(value[0])}
                max={10}
                step={0.1}
                min={0.1}
                className="[&>.relative]:bg-emerald-800/20 [&_[data-orientation=horizontal]]:h-2 [&_[data-orientation=horizontal]>[data-state]]:bg-emerald-500"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  setActionType('withdraw');
                  processFundWithdraw();
                }} 
                className="bg-amber-500 text-white hover:bg-amber-500/90"
              >
                Withdraw
              </Button>
              <Button 
                onClick={() => {
                  setActionType('fund');
                  processFundWithdraw();
                }} 
                className="bg-emerald-500 text-white hover:bg-emerald-500/90"
              >
                Fund
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Wallets;

