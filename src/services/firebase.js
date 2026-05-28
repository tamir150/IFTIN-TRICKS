import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2JpNHePf51ofaDnW-5KePZib_XJID0KA",
  authDomain: "iftin-tricks-dfd73.firebaseapp.com",
  projectId: "iftin-tricks-dfd73",
  storageBucket: "iftin-tricks-dfd73.firebasestorage.app",
  messagingSenderId: "438572838074",
  appId: "1:438572838074:web:a5108dbb4d1ec034522683",
  measurementId: "G-VXTCP3MHG5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
