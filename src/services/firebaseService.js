import { db, auth } from "./firebaseConfig";
import userSession from './UserSession';
import {collection, addDoc, setDoc ,getDoc, doc, updateDoc, getFirestore} from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

class FirebaseService {
    // Authentication Methods:
    // Register a new user account
    async registerUser(fullName, email, password, phoneNo, location) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData = {
                uid: user.uid,
                email: user.email,
                fullName: fullName,
                phoneNo: phoneNo,
                location: location,
                role: "customer",
            };

            await this.addUserData('users', userData);

            const token = await user.getIdToken();
            userSession.setUser(userData, token);

            console.log('User registered and saved to Firestore:', userData);
            return user;
        } catch (error) {
            console.log('Error registering user:', error);
            throw error;
        }
    }

    // Login using existing user account credentials
    async loginUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const token = await user.getIdToken();

            // Fetch user data from Firestore
            const userData = await this.getUserData('users', user.uid);
            console.log('Fetched user data:', userData);

            if (!userData) {
                console.log('No user data found in Firestore');
                return;
            }

            // Check if userData is correctly fetched
            console.log('Fetched user data from Firestore:', userData);

            // Store the user data and token in UserSession
            userSession.setUser(userData, token);  // Make sure this is called with correct data
            console.log('User logged in and session initialized:', userData);

            return user;
        } catch (error) {
            console.log('Error logging user in:', error);
            throw error;
        }
    }

    // Logout the current user account
    async logoutUser() {
        try {
            await signOut(auth);
            userSession.clearUser(); // Clear the session on logout
            console.log('User logged out and session cleared');
        } catch (error) {
            console.log('Error logging out:', error);
            throw error;
        }
    }

    // Add user related data
    async addUserData(collectionName, data) {
        try {
            // Use setDoc to set the document ID to the user's UID
            const docRef = await setDoc(doc(db, collectionName, data.uid), data);
            console.log('Document written with ID:', data.uid);
            return data.uid;  // Return the user's UID
        } catch (error) {
            console.log('Error adding document:', error);
            throw error;
        }
    }

    // Get user related data
    async getUserData(collectionName, docId) {
        try {
            const docRef = doc(db, collectionName, docId);  // Fetch by user UID
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
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

    // Observe authentication state changes
    observeAuthState(callback) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                callback(user); // User is authenticated
            } else {
                callback(null); // User is signed out
            }
        }, (error) => {
            console.error("Error observing authentication state:", error);
            callback(null); // Handle errors by treating user as signed out
        });
    }
}

export default new FirebaseService();