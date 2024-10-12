const statusOfAdoption = [
    { id: "approved", label: "Approved for Adoption" },
    { id: "inProcess", label: "Adoption in Process" },
    { id: "moreInfo", label: "More Information Needed" },
    { id: "notSuitable", label: "Not Suitable at This Time" },
    { id: "waitlist", label: "Added to Waitlist" },
];

const emailSubjects = {
    approved: [
        "Great News: Your Adoption of {petName} is Approved!",
        "Congratulations on Your Adoption of {petName}!",
        "Welcome {petName} to Your Family - Adoption Approved",
    ],
    inProcess: [
        "Update on Your Adoption Application for {petName}",
        "{petName}'s Adoption: Next Steps",
        "Your Adoption Process for {petName} is Underway",
    ],
    moreInfo: [
        "Additional Information Needed for {petName}'s Adoption",
        "Follow-up on Your Application to Adopt {petName}",
        "Regarding Your Interest in Adopting {petName}",
    ],
    notSuitable: [
        "Update on Your Adoption Application for {petName}",
        "Important Information About Your Interest in {petName}",
        "Regarding Your Adoption Inquiry for {petName}",
    ],
    waitlist: [
        "Your Waitlist Status for Adopting {petName}",
        "{petName}'s Adoption: Waitlist Information",
        "Update on Your Interest in Adopting {petName}",
    ],
};

//Email bodies for each adoption status
const emailBodies = {
    //Random selected email value
    approved: [
        `Dear {userName},

Wonderful news! Your application to adopt {petName} has been approved. We're thrilled that {petName} will be joining your family. Please contact us to arrange the final adoption procedures and bring your new family member home.

Best wishes,
Pet Shelter Team`,
        // Add more approved message templates...
    ],
    inProcess: [
        `Hello {userName},

We're making progress with your application to adopt {petName}. Our team is currently processing your information, and we'll be in touch soon with the next steps or any additional requirements.

Thank you for your patience,
Pet Shelter Team`,
    ],
    moreInfo: [
        `Dear {userName},

Thank you for your interest in adopting {petName}. We need some additional information to proceed with your application. Could you please provide [specific information needed]? This will help us ensure the best match for both you and {petName}.

We appreciate your cooperation,
Pet Shelter Team`,
    ],
    notSuitable: [
        `Dear {userName},

We appreciate your interest in adopting {petName}. After careful consideration, we've determined that this might not be the best match at this time. We encourage you to consider other pets that might be a better fit for your situation.

Thank you for understanding,
Pet Shelter Team`,
    ],
    waitlist: [
        `Hello {userName},

Thank you for your interest in adopting {petName}. We've added you to our waitlist for this pet. We'll contact you if an opportunity becomes available. In the meantime, feel free to check our other available pets.

Best regards,
Pet Shelter Team`,
    ],
};

//Function to get the adoption statuses
export function getAdoptionStatuses() {
    //returns the adoption status
    return statusOfAdoption;
}

//Function to get the random email subject based on the adoption status and the pet name
export function getRandomEmailSubject(status, petName) {
    const subjects = emailSubjects[status]; //declaring a constant variable that will use get the email subjects based on the status
    const randomIndex = Math.floor(Math.random() * subjects.length); //declaring a constant variable that will get a random index from the subjects array
    return subjects[randomIndex].replace("{petName}", petName); //returning the random subject with the pet name replaced
}

//Getting the random email body based on the adoption status, user name, and pet name
export function getRandomEmailBody(status, userName, petName) {
    const bodies = emailBodies[status]; //declaring a constant variable that will use get the email bodies based on the status
    const randomIndex = Math.floor(Math.random() * bodies.length); //declaring a constant variable that will get a random index from the bodies array
    return bodies[randomIndex] //returning the random body with the user name and pet name replaced
        .replace(/{userName}/g, userName) //replacing the user name placeholder with the actual user name
        .replace(/{petName}/g, petName); //replacing the pet name placeholder with the actual pet name
}
