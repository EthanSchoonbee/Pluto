export default {
    KNOWN_FACT: 'Cameron is a cute poes',


    pluto_title: "PLUTO",
    full_name_placeholder: "FULL NAME",
    email_placeholder: "EMAIL",
    phone_placeholder: "PHONE NUMBER",
    password_placeholder: "PASSWORD",
    location_placeholder: "LOCATION",
    login_button: "LOGIN",
    register_button: "REGISTER",
    dont_have_account: "Don't have an account?",
    already_have_account: "Already have an account?",
    register_link: "Register here.",
    login_link: "Login here.",

    //Filter Page//
    title: "ANIMAL FILTERS",
    lookingForLabel: "Looking for:",
    dogsButton: "DOGS",
    catsButton: "CATS",
    breedLabel: "Breed:",
    anyBreed: "Any",
    furColorLabel: "Fur Color:",
    selectFurColor: "Select Fur Color",
    maximumDistanceLabel: (maxDistance) => `Maximum distance: ${maxDistance} km`,
    ageRangeLabel: (min, max) => `Age range: ${min} - ${max} years`,
    activityLevelLabel: (activityLevel) => `Activity level: ${activityLevel}`,
    sizeLabel: (size) => `Size: ${size}`,
    applyFilterButton: "Apply",
    applyFiltersMessage: "Filters applied!",
    closeButton: "Close",
    selectFurColors: "Select Fur Colors:",
    provincesLabel: "Province:",
    genderLabel: "Gender:",
    provinceArray: ['Western Cape', 'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West',],


    //Add Animal Page//
    shelterAvailableFurColors: ['Black', 'White', 'Brown', 'Golden', 'Spotted', 'Striped'],
    addAnimalTitle: "Add New Animal",
    dogToggle: "Dogs",
    catToggle: "Cats",
    nameLabel: "Name",
    namePlaceholder: "Enter Animal Name",
    breedPlaceholder: "Enter Breed",
    ageLabel: "Age",
    agePlaceholder: "Enter Age",
    biographyLabel: "Biography",
    biographyPlaceholder: "Write a brief biography",
    couchCushion: "Couch Cushion",
    moderatelyActive: "Moderately Active",
    highlyActive: "Highly Active",
    doneButton: "Done",
    cancelButton: "Cancel",
    uploadImageText: "Upload Image",
    maxImagesWarning: "You can upload up to 7 images.",
    minImagesWarning: "Please upload at least 3 images.",
    removeImageButton: "Remove",
    selectSpecies: "Select Species:",
    selectBreed: "Select Breed:",
    selectFur: "Select Fur Color:",
    selectGender: "Select Gender:",
    dogBreeds: [
        'Australian Shepherd', 'Beagle', 'Boxer', 'Bulldog', 'Cavalier King Charles Spaniel',
        'Chihuahua', 'Dachshund', 'Doberman Pinscher', 'French Bulldog', 'German Shepherd',
        'Golden Retriever', 'Great Dane', 'Labrador Retriever', 'Pembroke Welsh Corgi',
        'Poodle', 'Rottweiler', 'Shih Tzu', 'Shetland Sheepdog', 'Siberian Husky', 'Yorkshire Terrier'
    ],

    catBreeds: [
        'Abyssinian', 'American Shorthair', 'Bengal', 'Birman', 'British Shorthair',
        'Burmese', 'Chartreux', 'Devon Rex', 'Himalayan', 'Maine Coon',
        'Norwegian Forest Cat', 'Oriental', 'Persian', 'Ragdoll', 'Russian Blue',
        'Scottish Fold', 'Siamese', 'Sphynx', 'Tonkinese', 'Turkish Angora'
    ],

    activityLevels: ['Couch Cushion', 'Lap Cat', 'Playful Pup', 'Adventure Hound'],
    sizes: ['Small', 'Medium', 'Large'],
    availableFurColors: ['Any','Black', 'White', 'Brown', 'Golden', 'Spotted', 'Striped'],
    shortImageLength: "Please add at least 3 images.",
    noCurrentUser: "You must be signed in to add an animal.",
    animalUploadFailed: "Failed to save the animal data. Please try again.",
    animalUploadSuccessful: "Successfully uploaded.",

    // User Settings page
    user_settings: {
        user_name: "User Name:",
        location: "Location:",
        your_details_title: "Your Details:",
        name_label: "Name:",
        surname_label: "Surname:",
        email_label: "Email:",
        password_label: "Password:",
        renew_password_label: "New Password:",
        privacy_title: "Privacy:",
        push_notifications: "Push Notifications",
        update_button: "Update",
        logout_button: "Logout",
        sample_text: "Sample Text",
        password_placeholder: "********",
        confirm_password_placeholder: "********",

        name_required: 'Name is required',
        surname_required: "Surname is required",
        email_required: "Email is required",
        password_required: "Password is required",
        confirm_required: "Password must be at least 5 characters long.",
        location_required: "Location is required",
        validation_error: "Validation Error",

        valid_email: "Enter a valid email address",
        name_number: "Your name cannot contain a digit.",
        surname_number: "Your surname cannot contain a digit.",
        location_number: "Your location cannot contain a digit.",
        password_match: "Passwords do not match.",
    },

    // Shelter Settings page
    shelter_settings: {
        shelter_name: "Shelter Name:",
        shelter_location: "Location:",
        shelter_email: "Email:",
        shelter_tel: "Telephone:",
        shelter_password: "Password:",
        shelter_renew_password: "New Password:",
        shelter_details_title: "Shelter Details:",
        shelter_update_button: "Update",
        shelter_logout_button: "Logout",
        shelter_sample_text: "Sample Shelter Info",
        shelter_password_placeholder: "********",
        shelter_confirm_password_placeholder: "********",
        shelter_email_placeholder: 'youremail@email.com',
        shelter_tel_placeholder: '1238946572',
        shelter_image: "Shelter Image:",
        shelter_privacy_title: "Privacy:",
        shelter_push_notifications: "Push Notifications",

        name_required: "Shelter name required.",
        location_required: "Location required.",
        email_required: "Email required.",
        phone_required: "Telephone number required.",
        password_required: "Password required.",
        confirm_required: "Password must be at least 5 characters long.",
        validation_error: "Validation Error",

        valid_email: "Enter a valid email address",
        location_number: "Your location cannot contain a digit.",
        valid_number: 'Enter a valid phone number',
        password_match: "Passwords do not match.",
    }
};