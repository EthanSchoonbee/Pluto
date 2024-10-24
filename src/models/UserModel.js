// Adjust UserModel constructor to handle nested preferences
class UserModel {
    constructor(uid, profileImage, email, fullName, phoneNo, selectedProvince, role, likedAnimals = [], preferences) {
        this.uid = uid;
        this.profileImage = profileImage;
        this.email = email;
        this.fullName = fullName;
        this.phoneNo = phoneNo;
        this.selectedProvince = selectedProvince;
        this.role = role;
        this.likedAnimals = likedAnimals;

        // Assign preferences if passed as an object
        if (preferences) {
            this.animalType = preferences.animalType || 'Dog';
            this.breed = preferences.breed || 'Any';
            this.gender = preferences.gender || 'Any';
            this.province = preferences.province;
            this.ageRange = preferences.ageRange || [0, 20];
            this.activityLevel = preferences.activityLevel || 0;
            this.size = preferences.size || 1;
            this.furColors = preferences.furColors || 'Any';
        }
    }
}
