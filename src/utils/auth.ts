
// Check if the user has completed payment for access
export const hasUserPaid = () => {
  try {
    const userString = localStorage.getItem('user');
    if (!userString) return false;
    
    const user = JSON.parse(userString);
    // Explicitly return false if subscription is undefined or null
    if (!user.subscription) return false;
    
    return user.subscription.active === true;
  } catch (error) {
    console.error('Error checking payment status:', error);
    return false;
  }
};

// Check if the user is logged in
export const isUserLoggedIn = () => {
  try {
    return localStorage.getItem('user') !== null;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};
