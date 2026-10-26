import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCcyXXcg-8rh4C_wVLs1Ze6GCQ9eAhIg8s",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "react-portfolio-one.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "react-portfolio-one",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "react-portfolio-one.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "971041502423",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:971041502423:web:d948123d9d8874df62ec92"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
