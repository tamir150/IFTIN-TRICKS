import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional profile data from Firestore
        const profile = await authService.getUserProfile(firebaseUser.uid);
        if (profile) {
          setUser(profile);
        } else {
          // Fallback if firestore document doesn't exist yet (shouldn't happen with our logic)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            isAnonymous: firebaseUser.isAnonymous
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    return await authService.signIn(email, password);
  };

  const signup = async (email, password, name, grade) => {
    return await authService.signUp(email, password, name, grade);
  };

  const loginWithGoogle = async () => {
    return await authService.signInWithGoogle();
  };

  const loginAsGuest = async () => {
    return await authService.signInAsGuest();
  };

  const logout = async () => {
    return await authService.signOut();
  };

  const value = {
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    loginAsGuest,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
