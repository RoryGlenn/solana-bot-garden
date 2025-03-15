// Check if the user has completed payment for access
export const hasUserPaid = (): boolean => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Checking if user has paid:', user);
  const hasPaid = user.subscription && user.subscription.active;
  console.log('Has user paid:', hasPaid);
  return hasPaid;
};

// Check if the user is logged in
export const isUserLoggedIn = (): boolean => {
  try {
    return localStorage.getItem('user') !== null;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};
