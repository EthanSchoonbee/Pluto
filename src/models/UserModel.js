class UserModel {
    constructor(uid, email, fullName) {
        this.uid = uid; // Unique user ID
        this.email = email; // User's email
        this.fullName = fullName; // User's display name
    }

    // Static method to create a UserModel from Firebase user object
    static fromFirebaseUser(firebaseUser) {
        return new UserModel(
            firebaseUser.uid,
            firebaseUser.email,
            firebaseUser.fullName,
        );
    }

    // Method to check if the user is complete
    isComplete() {
        return !!(this.fullName && this.email);
    }

    // Method to update user details (this could call your Firestore update logic)
    async updateDetails(updatedData) {
        // Implement logic to update user details in Firestore
        // For example, you might want to use the Firestore service you've created
        // await FirestoreService.updateUserData('users', this.uid, updatedData);
    }
}

export default UserModel;
