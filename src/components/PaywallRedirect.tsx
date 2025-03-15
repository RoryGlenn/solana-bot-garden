
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { hasUserPaid, isUserLoggedIn } from '@/utils/auth';

interface PaywallRedirectProps {
  children: React.ReactNode;
}

const PaywallRedirect = ({ children }: PaywallRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecked, setIsChecked] = useState(false);
  
  // Define public paths that don't require authentication or payment
  const publicPaths = ['/', '/signup', '/payments'];
  
  useEffect(() => {
    // Prevent multiple redirects by checking if we've already processed this navigation
    if (isChecked) return;
    
    console.log('Current path:', location.pathname);
    console.log('Is user logged in:', isUserLoggedIn());
    console.log('Has user paid:', hasUserPaid());
    
    // If we're on a public path, always allow access without any redirection
    if (publicPaths.includes(location.pathname)) {
      console.log('On public path, allowing access');
      setIsChecked(true);
      return;
    }
    
    // If user is not logged in, redirect to home only if on a protected path
    if (!isUserLoggedIn()) {
      console.log('User not logged in, redirecting to home');
      navigate('/', { replace: true });
      setIsChecked(true);
      return;
    }
    
    // If user is logged in but hasn't paid, redirect to payments only if on a protected path
    if (isUserLoggedIn() && !hasUserPaid()) {
      console.log('User logged in but not paid, redirecting to payments');
      navigate('/payments', { replace: true });
      setIsChecked(true);
      return;
    }
    
    // User is logged in and has paid, allow access to any page
    console.log('User logged in and paid, allowing access');
    setIsChecked(true);
  }, [navigate, location.pathname, isChecked]);
  
  // Reset the check when the path changes
  useEffect(() => {
    setIsChecked(false);
  }, [location.pathname]);
  
  return <>{children}</>;
};

export default PaywallRedirect;
