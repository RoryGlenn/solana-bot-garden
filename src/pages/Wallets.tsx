
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
  AlertTriangle 
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

interface WalletProps {
  address: string;
  label: string;
  balance: number;
  type: 'regular' | 'developer';
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
  
  const navigate = useNavigate();
  const { animationProps, staggeredAnimationProps } = usePageTransition();

  const hasDevWallet = wallets.some(wallet => wallet.type === 'developer');
  
  const createWallet = (type: 'regular' | 'developer') => {
    if (type === 'developer' && hasDevWallet) {
      setIsDevWalletDialogOpen(true);
      return;
    }
    
    addNewWallet(type);
  };

  const addNewWallet = (type: 'regular' | 'developer') => {
    // If creating a developer wallet and one already exists, remove the old one first
    let updatedWallets = [...wallets];
    if (type === 'developer') {
      updatedWallets = wallets.filter(w => w.type !== 'developer');
    }
    
    // Mock wallet creation
    const newWallet: WalletProps = {
      address: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      label: type === 'regular' ? `Wallet ${wallets.filter(w => w.type === 'regular').length + 1}` : `Dev Wallet`,
      balance: 0,
      type
    };
    
    setWallets([...updatedWallets, newWallet]);
    
    toast({
      title: `${type === 'developer' ? 'Developer' : ''} Wallet Created`,
      description: `Your new ${type === 'developer' ? 'developer' : ''} wallet has been created successfully.`,
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
          
          <div className="mb-6 flex justify-between items-center" {...animationProps}>
            <div className="flex space-x-4">
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
            </div>
          </div>
          
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
      
      {/* Delete Wallet Confirmation Dialog */}
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
      
      {/* Dev Wallet Replacement Confirmation Dialog */}
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
    </div>
  );
};

export default Wallets;
