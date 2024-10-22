class UserModel {

    constructor(uid, email, fullName, phoneNo, location, role, likedAnimals = []) {
        this.uid = uid;
        this.email = email;
        this.fullName = fullName;
        this.phoneNo = phoneNo;
        this.location = location;
        this.role = role;
        this.likedAnimals = likedAnimals;
    }

}

export default UserModel;
