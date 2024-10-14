class UserModel {
    constructor(uid, email, fullName, phoneNo, address) {
        this.uid = uid;
        this.email = email;
        this.fullName = fullName;
        this.phoneNo = phoneNo; // User's phone number
        this.address = address; // User's address
    }

    static fromFirebaseUser(firebaseUser) {
        return new UserModel(
            firebaseUser.uid,
            firebaseUser.email,
            firebaseUser.fullName,
            firebaseUser.phoneNo,
            firebaseUser.address,
        );
    }

    isComplete() {
        return !!(this.fullName && this.email && this.phoneNo && this.address);
    }

    async updateDetails(updatedData) {
        // Logic to update Firestore (unchanged)
    }
}

export default UserModel;
