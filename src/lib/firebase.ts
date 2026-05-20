/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBk3On7USSfw-MrQtv1CIA_IplDL19LBBU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mtctechers-rights.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mtctechers-rights",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mtctechers-rights.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "206354495513",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:206354495513:web:6955555c004b879dc01288"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
}, "mtcright");
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const ADMIN_EMAIL = 'mtc.teachers.right@gmail.com';
