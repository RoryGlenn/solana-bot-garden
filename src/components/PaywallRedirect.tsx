
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
    const isPublicPath = publicPaths.includes(location.pathname);
    
    if (!isUserLoggedIn() && !isPublicPath) {
      // Not logged in, redirect to home
      navigate('/');
      return;
    }
    
    if (isUserLoggedIn() && !hasUserPaid() && !isPublicPath) {
      // Logged in but hasn't paid, redirect to payments
      navigate('/payments');
    }
  }, [navigate, location.pathname]);
  
  return <>{children}</>;
};

export default PaywallRedirect;
