/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBYYIMdqZVczYdpEOctNDupMPtRSH0jXV0",
  authDomain: "mtctechers-rights.firebaseapp.com",
  projectId: "mtctechers-rights",
  storageBucket: "mtctechers-rights.firebasestorage.app",
  messagingSenderId: "206354495513",
  appId: "1:206354495513:web:b606a7a4dc16b163c01288"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const ADMIN_EMAIL = 'mtc.teachers.right@gmail.com';
