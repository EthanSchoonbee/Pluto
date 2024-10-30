import { db, auth } from "./firebaseConfig";
import {
    setDoc,
    getDoc,
    doc,
} from "firebase/firestore";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    getAuth,
    updatePassword
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useState} from "react";

class FirebaseService {
    constructor() {
        this.auth = getAuth();
    }

    registerUser(fullName, email, password, phoneNo, selectedProvince, onComplete) {
        console.log("Firebase Authentication Service: Registering User");
        createUserWithEmailAndPassword(this.auth, email, password)
            .then(async (userCredential) => {
                const firebaseUser = userCredential.user;
                const userData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    profileImage: "https://firebasestorage.googleapis.com/v0/b/pluto-2b00c.appspot.com/o/default_profile_image.jpg?alt=media&token=76543e99-1803-403a-9d11-eabfe5db5584",
                    fullName,
                    phoneNo,
                    selectedProvince,
                    role: "user",
                    likedAnimals: [],
                    preferences: {
                        animalType: "Dog",
                        breed: "Any",
                        gender: "Any",
                        province: selectedProvince,
                        ageRange: [1, 20],
                        activityLevel: 1,
                        size: 0,
                        furColors: []
                    }
                };

                try {
                    await this.addUserData('users', userData);
                    await AsyncStorage.setItem('userData', JSON.stringify(userData));
                    console.log("Firebase Authentication Service: Registration Process Successful");

                    // Ensure onComplete is a function before calling it
                    if (typeof onComplete === "function") {
                        onComplete(true, null);  // Registration successful
                    }
                } catch (error) {
                    console.log("Error adding user data:", error);

                    if (typeof onComplete === "function") {
                        onComplete(false, error.message);  // Registration failed
                    }
                }
            })
            .catch((error) => {
                console.log("Firebase Authentication Service: Registration Process Failed", error);
                if (typeof onComplete === "function") {
                    onComplete(false, error.message);  // Handle Firebase Authentication error
                }
            });
    }

    loginUser(email, password, onComplete) {
        console.log("Firebase Authentication Service: Logging In User");
        signInWithEmailAndPassword(this.auth, email, password)
            .then(async (userCredentials) => {
                const userId = userCredentials.user.uid;

                // Fetch user data from Firestore
                const userData = await this.getUserData('users', userId) ||
                    await this.getUserData('shelters', userId);

                if (userData) {
                    // Cache the user data using AsyncStorage
                    await AsyncStorage.setItem('userData', JSON.stringify(userData));
                }

                console.log("Firebase Authentication Service: Login Process Successful");
                onComplete(true, null); // Login successful
            })
            .catch((error) => {
                console.log("Firebase Authentication Service: Login Process Failed");
                onComplete(false, error.message); // Login failed, return error message
            });
    }

    // Get the currently logged-in user
    getCurrentUser() {
        console.log("Firebase Authentication Service: Getting Current User If Applicable");
        return this.auth.currentUser; // Return the current user or null
    }

    // Log out the current user
    logoutUser() {
        console.log("Firebase Authentication Service: Logging Out User");
        signOut(this.auth)
            .then(() => {
                console.log("Firebase Authentication Service: User Logged Out Successfully");
            })
            .catch((error) => {
                console.error("Firebase Authentication Service: Logout Failed", error.message);
            });
    }

    // Add user-related data to Firestore
    async addUserData(collectionName, data) {
        try {
            const docRef = await setDoc(doc(db, collectionName, data.uid), data);
            console.log('Document written with ID:', data.uid);
            return data.uid; // Return the user's UID
        } catch (error) {
            console.log('Error adding document:', error);
            throw error;
        }
    }

    // Get user-related data from Firestore
    async getUserData(collectionName, docId) {
        try {
            const docRef = doc(db, collectionName, docId); // Fetch by user UID
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

    async updateUserSettings(collectionName, data) {
        try {
            const currentUser = this.getCurrentUser(); // Get the current logged-in user
            if (currentUser) {
                const docRef = doc(db, collectionName, currentUser.uid); // Reference to the user's document
                await setDoc(docRef, data, { merge: true }); // Update the document with the new data, merging with existing fields
                console.log('User settings updated successfully for:', currentUser.uid);
            } else {
                throw new Error("No user logged in.");
            }
        } catch (error) {
            console.error('Error updating user settings:', error);
            throw error;
        }
    }


    // Method to change the password
    async changePassword(newPassword) {
        try {
            const currentUser = this.getCurrentUser();
            if (currentUser) {
                await updatePassword(currentUser, newPassword);
                console.log('Password updated successfully.');

            } else {
                throw new Error("No user logged in.");
            }
        } catch (error) {
            console.error('Error updating password:', error.message);

        }
    }


}

export default new FirebaseService();
