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
    getAuth
} from "firebase/auth";

class FirebaseService {
    constructor() {
        this.auth = getAuth();
    }

    registerUser(fullName, email, password, phoneNo, location, onComplete) {
        console.log("Firebase Authentication Service: Registering User");
        createUserWithEmailAndPassword(this.auth, email, password)
            .then(async (userCredential) => {
                const firebaseUser = userCredential.user;

                const userData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    fullName,
                    phoneNo,
                    location,
                    role: "user",
                    likedAnimals: [],
                };

                await this.addUserData('users', userData);
                console.log("Firebase Authentication Service: Registration Process Successful");
                onComplete(true, null); // Registration successful
            })
            .catch((error) => {
                console.log("Firebase Authentication Service: Registration Process Failed");
                onComplete(false, error.message); // Registration failed, return error message
            });
    }

    loginUser(email, password, onComplete) {
        console.log("Firebase Authentication Service: Logging In User");
        signInWithEmailAndPassword(this.auth, email, password)
            .then(() => {
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
}

export default new FirebaseService();
