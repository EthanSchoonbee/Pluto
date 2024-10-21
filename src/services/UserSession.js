import UserModel from "../models/UserModel";
import { getAuth } from 'firebase/auth';

class UserSession {
    constructor() {
        if (!UserSession.instance) {
            this.user = null;
            this.token = null;
            UserSession.instance = this;
        }
        return UserSession.instance;
    }

    // Set user data and token
    setUser(user, token) {
        // Ensure that the user is an instance of UserModel
        if (!(user instanceof UserModel)) {
            this.user = new UserModel(
                user.uid,
                user.email,
                user.fullName,
                user.phoneNo,
                user.location,
                user.role
            );
        } else {
            this.user = user;
        }
        this.token = token;
        console.log('User session set user called', { user, token });
    }

    // Get the current token
    getToken() {
        return this.token;
    }

    // Clear the session (on logout)
    clearUser() {
        this.user = null;
        this.token = null;
    }

    // Check if the session is valid (user and token are not null)
    isValidSession() {
        return this.user !== null && this.token !== null;
    }
}

// Ensure that UserSession is a singleton
const userSessionInstance = new UserSession();
Object.freeze(userSessionInstance);
export default userSessionInstance;