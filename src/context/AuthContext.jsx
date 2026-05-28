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
      try {
        if (firebaseUser) {
          // Fetch additional profile data from Firestore
          const profile = await authService.getUserProfile(firebaseUser.uid);
          if (profile) {
            setUser(profile);
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || "Student",
              isAnonymous: firebaseUser.isAnonymous
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-900 font-black animate-pulse uppercase tracking-widest text-xs">Initializing Portal...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
