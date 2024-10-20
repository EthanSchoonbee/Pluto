class UserModel {

    /*
    {
        "firstName": "John",
        "lastName": "Doe",
        "email": "johndoe@example.com",
        "phoneNumber": "+123456789",
        "location": "Cape Town",
        "likedAnimals": ["animalId1", "animalId2"],
        "createdAt": "2024-10-01T12:00:00Z",
        "updatedAt": "2024-10-10T12:00:00Z"
    }

    export const User = {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        location: "", // Location for filtering animals
        likedAnimals: [], // Array of liked animal IDs
        createdAt: null,
        updatedAt: null,
    };
     */

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
