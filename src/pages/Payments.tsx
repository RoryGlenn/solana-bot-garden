
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { CheckIcon, ArrowRight, LockIcon } from "lucide-react";
import { hasUserPaid } from '@/utils/auth';

const Payments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (!user) {
      // If not logged in, navigate to signup first
      navigate('/signup');
      return;
    }
    
    // If user has already paid, redirect to dashboard
    if (hasUserPaid()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Mock payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Update user with subscription information
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.subscription = {
        active: true,
        plan: 'lifetime', // or 'monthly'
        startDate: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase! Your subscription is now active.",
      });
      
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Card className="w-full max-w-md glass glow border-0">
        <CardHeader className="space-y-1">
          <div className="mx-auto bg-solana/10 p-3 rounded-full mb-2">
            <LockIcon className="h-8 w-8 text-solana" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Access Restricted</CardTitle>
          <CardDescription className="text-center">
            Purchase a subscription to unlock all SolanaBot features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg glass-light">
            <h3 className="font-bold text-lg mb-2">Lifetime Access</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">One-time payment</span>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold">10</span>
                <span className="text-lg font-medium text-solana">SOL</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-solana shrink-0 mt-0.5" />
                <span>All bot types access</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-solana shrink-0 mt-0.5" />
                <span>Unlimited active bots</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-solana shrink-0 mt-0.5" />
                <span>Future updates included</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-solana to-accent hover:shadow-lg hover:translate-y-[-1px] transition-all duration-300"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Complete Payment"}
              {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground"
          >
            Cancel and return to home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Payments;
