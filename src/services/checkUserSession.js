import userSession from './UserSession';
import { auth } from './firebaseConfig'; // Your firebase service

// Check if the user has a valid session when app starts
const checkUserSession = async () => {
    const currentUser = auth.currentUser; // Get currently signed-in user
    if (currentUser) {
        const token = await currentUser.getIdToken(true); // Force refresh the token
        userSession.setUser(currentUser, token); // Set the user session
        console.log('Valid session found, user is already logged in');
        return true;
    } else {
        console.log('No valid session, user needs to log in');
        return false;
    }
};

export default checkUserSession;
