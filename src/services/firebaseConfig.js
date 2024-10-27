// Import the necessary functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth, initializeAuth} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Make sure AsyncStorage is imported

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAF5DNQqipRyQ_RZ-c2wrU1uYg4bxHgGIE",
    authDomain: "pluto-2b00c.firebaseapp.com",
    projectId: "pluto-2b00c",
    storageBucket: "pluto-2b00c.appspot.com",
    messagingSenderId: "302787790119",
    appId: "1:302787790119:web:6223f569cd039f40995502",
    measurementId: "G-S70EJV7C1C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };