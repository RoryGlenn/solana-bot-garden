import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Bot, Copy, Home, LogOut, Rocket, Settings, Zap, Wallet } from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ collapsed = false, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };
  
  const navItems = [
    { name: 'Dashboard', icon: <Home className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Volume Bot', icon: <Activity className="h-5 w-5" />, path: '/volume-bot' },
    { name: 'Snipe Bot', icon: <Zap className="h-5 w-5" />, path: '/snipe-bot' },
    { name: 'Copy Trade Bot', icon: <Copy className="h-5 w-5" />, path: '/copy-trade-bot' },
    { name: 'Coin Launch', icon: <Rocket className="h-5 w-5" />, path: '/coin-launch' },
    { name: 'Wallets', icon: <Wallet className="h-5 w-5" />, path: '/wallets' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
  ];

  return (
    <aside 
      className={`h-screen fixed top-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out 
      ${collapsed ? 'w-20' : 'w-64'} glass-dark border-r border-sidebar-border`}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <div className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="p-1.5 bg-gradient-to-r from-solana to-accent rounded-lg">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.2 6L4 12.2L10.2 18.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12.2H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {!collapsed && (
            <span className="ml-3 font-bold text-lg bg-gradient-to-r from-solana to-accent bg-clip-text text-transparent">
              SolanaBot
            </span>
          )}
        </div>
        <button 
          onClick={onToggle} 
          className={`p-1 rounded-lg hover:bg-white/5 ${collapsed ? 'hidden' : 'block'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414L8.414 13H15a1 1 0 110 2H6a1 1 0 01-1-1V5a1 1 0 112 0v6.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200
                ${location.pathname === item.path 
                  ? 'bg-solana/20 text-solana' 
                  : 'hover:bg-white/5'
                }
                ${collapsed ? 'justify-center' : ''}
                `}
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className={`flex items-center p-3 rounded-lg text-red-400 hover:bg-white/5 transition-colors w-full
          ${collapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Log out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
