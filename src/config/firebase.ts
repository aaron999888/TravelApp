// Firebase configuration for Travel App
// This file contains Firebase setup and initialization

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration object
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4DqDXepUgC_zOUybj6SukvRitMIdzfzI",
    authDomain: "travelapp-471209.firebaseapp.com",
    projectId: "travelapp-471209",
    storageBucket: "travelapp-471209.firebasestorage.app",
    messagingSenderId: "955410291725",
    appId: "1:955410291725:web:d27c693924a719a92ac944"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
