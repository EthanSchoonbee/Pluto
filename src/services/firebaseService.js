import { db, auth } from "./firebaseConfig";
import userSession from './UserSession';
import {collection, addDoc, getDoc, doc, updateDoc, getFirestore} from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

class FirebaseService {
    // Authentication Methods:
    // Register a new user account
    async registerUser(fullName, email, password, phoneNo, location, role) {
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
            userSession.setUser(user, token);

            console.log('User registered and saved to Firestore:', user);
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
            const token = await user.getIdToken(); // Get token
            userSession.setUser(user, token); // Store in singleton
            console.log('User logged in and session initialized:', user);
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