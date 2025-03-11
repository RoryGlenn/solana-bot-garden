
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { usePageTransition } from '@/utils/animations';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Settings as SettingsIcon, Shield, Bell, Moon, Sun } from "lucide-react";

const Settings = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [ipLock, setIpLock] = useState(true);
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();
  const { animationProps } = usePageTransition();
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      setUsername(userData.username || '');
    } catch (error) {
      console.error('Failed to parse user data', error);
    }
  }, [navigate]);
  
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast({
        title: "Missing information",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call the backend to update the password
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const handleToggleSetting = (setting: string, value: boolean) => {
    toast({
      title: `${setting} ${value ? 'enabled' : 'disabled'}`,
      description: `${setting} has been ${value ? 'enabled' : 'disabled'}.`,
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
              <SettingsIcon className="mr-3 h-7 w-7 text-solana" />
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6" {...animationProps}>
              <Card className="backdrop-blur-sm bg-black/30">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        disabled 
                      />
                      <p className="text-xs text-muted-foreground">
                        Username cannot be changed
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-solana to-accent hover:shadow-lg transition-all duration-300"
                    >
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6" {...animationProps}>
              <Card className="backdrop-blur-sm bg-black/30">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="notifications" className="text-base">Notifications</Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Receive alerts about your bots' activity
                      </p>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={notifications} 
                      onCheckedChange={(value) => {
                        setNotifications(value);
                        handleToggleSetting('Notifications', value);
                      }} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        {darkMode ? 
                          <Moon className="mr-2 h-4 w-4 text-muted-foreground" /> : 
                          <Sun className="mr-2 h-4 w-4 text-muted-foreground" />
                        }
                        <Label htmlFor="darkMode" className="text-base">Dark Mode</Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Use dark theme for easier viewing
                      </p>
                    </div>
                    <Switch 
                      id="darkMode" 
                      checked={darkMode} 
                      onCheckedChange={(value) => {
                        setDarkMode(value);
                        handleToggleSetting('Dark Mode', value);
                      }} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="ipLock" className="text-base">IP Lock</Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Restrict account access to your current IP address
                      </p>
                    </div>
                    <Switch 
                      id="ipLock" 
                      checked={ipLock} 
                      onCheckedChange={(value) => {
                        setIpLock(value);
                        handleToggleSetting('IP Lock', value);
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-sm bg-black/30">
                <CardHeader>
                  <CardTitle>API Access</CardTitle>
                  <CardDescription>
                    Manage API keys for automated trading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="apiKey" 
                          value="●●●●●●●●●●●●●●●●" 
                          disabled 
                          className="flex-1"
                        />
                        <Button variant="outline">
                          Show
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-solana to-accent hover:shadow-lg transition-all duration-300"
                    >
                      Generate New API Key
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
