
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '@/components/SignupForm';

const Signup = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-block p-2 bg-gradient-to-r from-solana to-accent rounded-2xl shadow-lg mb-6">
            <svg className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.2 6L4 12.2L10.2 18.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12.2H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-solana to-accent bg-clip-text text-transparent">
            SolanaBot Garden
          </h1>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            Automate your Solana trading with advanced bots and maximize your profits
          </p>
        </div>
        
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
