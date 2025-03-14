
// Check if the user has completed payment for access
export const hasUserPaid = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.subscription && user.subscription.active === true;
};

// Check if the user is logged in
export const isUserLoggedIn = () => {
  return localStorage.getItem('user') !== null;
};
