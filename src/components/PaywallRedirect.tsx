
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { hasUserPaid, isUserLoggedIn } from '@/utils/auth';

interface PaywallRedirectProps {
  children: React.ReactNode;
}

const PaywallRedirect = ({ children }: PaywallRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const publicPaths = ['/', '/signup', '/payments'];
  
  useEffect(() => {
    // If we're on the root path ('/'), never redirect
    if (location.pathname === '/') {
      return;
    }
    
    const isPublicPath = publicPaths.includes(location.pathname);
    
    // Only redirect non-public paths for users who aren't logged in
    if (!isUserLoggedIn() && !isPublicPath) {
      navigate('/');
      return;
    }
    
    // Only redirect non-public, non-root paths for users who haven't paid
    if (isUserLoggedIn() && !hasUserPaid() && !isPublicPath) {
      navigate('/payments');
    }
  }, [navigate, location.pathname]);
  
  return <>{children}</>;
};

export default PaywallRedirect;
