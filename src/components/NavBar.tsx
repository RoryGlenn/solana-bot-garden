
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, LogOut, Settings, User, Bell } from "lucide-react";

interface User {
  id: string;
  username: string;
  ipAddress: string;
}

const NavBar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (location.pathname !== '/') {
      // If not logged in and not on the login page, redirect to login
      navigate('/');
    }
  }, [navigate, location.pathname]);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };
  
  const handleCreateBot = () => {
    navigate('/create-bot');
  };
  
  if (!user && location.pathname === '/') {
    return null; // Don't show navbar on login page if not logged in
  }

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-sm border-b bg-white/90 dark:bg-black/30">
      <div className="container flex h-16 items-center px-4 transition-all duration-200">
        <div className="mr-8">
          <div className="flex items-center space-x-2">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.2 6L4 12.2L10.2 18.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12.2H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="hidden font-bold sm:inline-block text-lg bg-gradient-to-r from-solana to-accent bg-clip-text text-transparent">
              SolanaBot Garden
            </span>
          </div>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 w-9 p-0 rounded-full" 
            onClick={() => {}}
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="h-9 gap-1 bg-gradient-to-r from-solana to-accent hover:shadow-md transition-all duration-300"
            onClick={handleCreateBot}
          >
            <PlusCircle className="h-4 w-4" />
            New Bot
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-solana text-white">
                    {user?.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{user?.username}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
