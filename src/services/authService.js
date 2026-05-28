import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously,
  signOut as firebaseSignOut,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { auth, db } from "./firebase";

const googleProvider = new GoogleAuthProvider();

export const authService = {
  signUp: async (email, password, name, grade) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      const userProfile = {
        uid: user.uid,
        name,
        email,
        grade,
        score: 0,
        completedExamsCount: 0,
        isAnonymous: false,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, "users", user.uid), userProfile);
      return userProfile;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  },

  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return { uid: user.uid, email: user.email, name: user.displayName };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        const userProfile = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          grade: "Grade 12", // Default
          score: 0,
          completedExamsCount: 0,
          isAnonymous: false,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, "users", user.uid), userProfile);
        return userProfile;
      }
      return userDoc.data();
    } catch (error) {
      console.error("Error with Google sign in:", error);
      throw error;
    }
  },

  signInAsGuest: async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      
      const userProfile = {
        uid: user.uid,
        name: "Guest Student",
        isAnonymous: true,
        grade: "Grade 12",
        score: 0,
        completedExamsCount: 0,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, "users", user.uid), userProfile);
      return userProfile;
    } catch (error) {
      console.error("Error with Guest sign in:", error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  getUserProfile: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }
};
