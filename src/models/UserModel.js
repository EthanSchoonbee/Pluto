// Adjust UserModel constructor to handle nested preferences
class UserModel {

    constructor(uid, email, fullName, phoneNo, location, role, likedAnimals = [], animalType, breed, gender, province, ageRange, activityLevel, size, furColors = []) {
        this.uid = uid;
        this.email = email;
        this.fullName = fullName;
        this.phoneNo = phoneNo;
        this.location = location;
        this.role = role;
        this.likedAnimals = likedAnimals;
        this.animalType = animalType;
        this.breed = breed;
        this.gender = gender;
        this.province = province;
        this.ageRange = ageRange;
        this.activityLevel = activityLevel;
        this.size = size;
        this.furColors = furColors;
    }

}

export default UserModel;
