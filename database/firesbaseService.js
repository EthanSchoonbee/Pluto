import { db, auth } from "./firebaseConfig";
import {collection, addDoc, getDoc, doc, updateDoc, getFirestore} from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

class FirebaseService {
    // Authentication Methods:
    // Register a new user account
    async registerUser(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User registered:', userCredential.user);
            return userCredential.user;
        } catch (error) {
            console.log('Error registering user:', error);
            throw error;
        }
    }

    // Login using existing user account credentials
    async loginUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in:', userCredential.user);
            return userCredential.user;
        } catch (error) {
            console.log('Error logging user in:', error);
            throw error;
        }
    }

    // Logout the current user account
    async logoutUser(email, password) {
        try {
            await signOut(auth);
            console.log('User logged out');
        } catch (error) {
            console.log('Error logging out:', error);
            throw error;
        }
    }

    // Add user related data
    async addUserData(collectionName, data) {
        try {
            const docRef = await addDoc(collection(db, collectionName), data);
            console.log('Document written with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.log('Error adding document:', error);
            throw error;
        }
    }

    // Get user related data
    async getUserData(collectionName, docId) {
        try {
            const docRef = doc(db, collectionName, docId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists) {
                console.log('Document data', docSnapshot.data());
                return docSnapshot.data();
            } else {
                console.log('Document not found!');
                return null;
            }
        } catch (error) {
            console.log('Error getting user data:', error);
            throw error;
        }
    }

    // Update user related data
    async updateUserData(collectionName, docId, updatedData) {
        try {
            const docRef = doc(db, collectionName, docId);
            await updateDoc(docRef, updatedData);
            console.log('Document updating document:', docRef.id);
        } catch (error) {
            console.log('Error updating document:', error);
            throw error;
        }
    }
}

export default new FirebaseService();