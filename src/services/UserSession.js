//class to store the logged-in user’s data and token globally

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
        this.user = user;
        this.token = token;
    }

    // Get the current user
    getUser() {
        return this.user;
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

// Export a single instance of the class
const userSessionInstance = new UserSession();
Object.freeze(userSessionInstance);
export default userSessionInstance;
