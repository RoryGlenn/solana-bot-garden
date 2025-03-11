
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Lock, User } from "lucide-react";

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Mock authentication (replace with real authentication)
    setTimeout(() => {
      setIsLoading(false);
      
      // In a real app, check credentials against a backend
      // For now, we'll mock successful login with any credentials
      localStorage.setItem('user', JSON.stringify({ username, id: 'user-123', ipAddress: '127.0.0.1' }));
      
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
      
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-0 backdrop-blur-sm bg-white/90 dark:bg-black/30">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10" 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full transition-all duration-300 bg-gradient-to-r from-solana to-accent hover:shadow-lg hover:translate-y-[-1px]"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-muted-foreground text-center mt-2">
          Your session will be locked to your current IP address for security.
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
