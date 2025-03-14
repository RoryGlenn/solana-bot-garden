
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
    // If we're on the root path ('/'), we should never redirect regardless of payment status
    if (location.pathname === '/') {
      return;
    }
    
    const isPublicPath = publicPaths.includes(location.pathname);
    
    if (!isUserLoggedIn() && !isPublicPath) {
      // Not logged in, redirect to home
      navigate('/');
      return;
    }
    
    if (isUserLoggedIn() && !hasUserPaid() && !isPublicPath) {
      // Logged in but hasn't paid, redirect to payments
      // But NOT if trying to go to home page
      navigate('/payments');
    }
  }, [navigate, location.pathname]);
  
  return <>{children}</>;
};

export default PaywallRedirect;
