import firebase from 'firebase/compat/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCrlKcQ-YLUTYu3uEPg66Vb1bGNj33B974",
  authDomain: "ready1au.firebaseapp.com",
  projectId: "ready1au",
  storageBucket: "ready1au.firebasestorage.app",
  messagingSenderId: "725476150025",
  appId: "1:725476150025:web:42ca951725808a9d45e1d8",
  measurementId: "G-MJYBPYH7YN"
};

// Use compat initialization to resolve the missing export issue
const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);

// Cast app to any to ensure compatibility between compat app instance and modular auth
export const auth = getAuth(app as any);