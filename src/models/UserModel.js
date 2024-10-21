class UserModel {

        //likedAnimals: [], // Array of liked animal IDs

    constructor(uid, email, fullName, phoneNo, location, role) {
        this.uid = uid;
        this.email = email;
        this.fullName = fullName;
        this.phoneNo = phoneNo;
        this.location = location;
        this.role = role;
    }

    static fromFirebaseUser(firebaseUser) {
        return new UserModel(
            firebaseUser.uid,
            firebaseUser.email,
            firebaseUser.fullName,
            firebaseUser.phoneNo,
            firebaseUser.location,
            firebaseUser.role
        );
    }

    isComplete() {
        return !!(this.fullName && this.email && this.phoneNo && this.location);
    }

    async updateDetails(updatedData) {
        // Logic to update Firestore
    }
}

export default UserModel;
