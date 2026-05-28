import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { user, loading, login, signup, loginWithGoogle, loginAsGuest, logout } = useAuthContext();

  return { 
    user, 
    loading, 
    login, 
    signup, 
    loginWithGoogle, 
    loginAsGuest, 
    logout 
  };
};
