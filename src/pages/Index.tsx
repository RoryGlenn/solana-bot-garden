import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Bot, Shield, Zap, ChevronRight, ArrowUpRight } from "lucide-react";
import LoginForm from '@/components/LoginForm';
import PriceCard from '@/components/PriceCard';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero Section */}
      <header className="relative w-full overflow-hidden">
        <div className="absolute inset-0 grid-bg"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-solana/20 text-solana bg-solana/5 text-sm mb-4">
              <span>Automate your Solana trading</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight glow-text">
              <span className="bg-gradient-to-r from-solana to-accent bg-clip-text text-transparent">
                Solana Trading Bots
              </span>{" "}
              for Maximum Profits
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Our advanced trading bots help you automate your Solana trading strategies,
              maximize your profits, and minimize your risks in the volatile crypto market.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-solana to-accent hover:translate-y-[-2px] transition-all duration-300"
                onClick={() => scrollToSection('pricing')}
              >
                View Pricing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-solana/20 hover:border-solana/40"
                onClick={() => navigate('/signup')}
              >
                Sign Up <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center">
            <Card className="w-full max-w-md glass glow border-0 p-6 animate-float">
              <LoginForm />
            </Card>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
              <span className="bg-gradient-to-r from-solana to-accent bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our bots come with advanced features to help you trade smarter, faster, and more securely.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot className="h-8 w-8 text-solana" />,
                title: "Multiple Bot Types",
                description: "Volume bots, trade bots, snipe bots, and copy trade bots to suit your trading style."
              },
              {
                icon: <Zap className="h-8 w-8 text-solana" />,
                title: "Real-time Execution",
                description: "Lightning-fast execution to capitalize on market opportunities as they arise."
              },
              {
                icon: <Shield className="h-8 w-8 text-solana" />,
                title: "IP-Locked Security",
                description: "Your account is locked to your IP address for enhanced security against unauthorized access."
              }
            ].map((feature, index) => (
              <Card key={index} className="glass-light hover:glass transition-all duration-300 p-6 border-0">
                <div className="rounded-full w-12 h-12 flex items-center justify-center glass mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 glass-dark">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
              <span className="bg-gradient-to-r from-solana to-accent bg-clip-text text-transparent">
                Pricing Plans
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that best fits your trading needs and budget.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PriceCard
              title="Monthly"
              description="Full access, billed monthly"
              price={1.5}
              features={[
                "All bot types access",
                "Unlimited active bots",
                "Advanced strategies",
                "Priority execution",
                "IP-locked security",
                "Email notifications"
              ]}
            />
            
            <PriceCard
              title="Lifetime"
              description="One-time payment, lifetime access"
              price={10}
              features={[
                "All bot types access",
                "Unlimited active bots",
                "Advanced strategies",
                "Priority execution",
                "IP-locked security",
                "Email & SMS notifications",
                "Dedicated support",
                "Future updates included"
              ]}
              popular={true}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto glass p-12 rounded-3xl border-0 glow">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
              Ready to Automate Your Trading?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of traders using our bots to maximize their Solana profits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-solana to-accent hover:translate-y-[-2px] transition-all duration-300"
                onClick={() => navigate('/signup')}
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-solana/20 hover:border-solana/40"
                onClick={() => scrollToSection('pricing')}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-gradient-to-r from-solana to-accent p-1 rounded-lg mr-2">
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.2 6L4 12.2L10.2 18.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 12.2H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold">SolanaBot Garden</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SolanaBot Garden. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
