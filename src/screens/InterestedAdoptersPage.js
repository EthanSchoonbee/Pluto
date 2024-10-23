import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getRandomAdoptionMessage } from "../utils/adoptionMessages.js";
//Safe area wrapper to avoid the notch and bottom bar
import SafeAreaWrapper from "../components/SafeAreaWrapper";
//styling for the shelter chats screen
import styles from "../styles/InterestedAdopteesPageStyle";

//Entire shelter chats component
const InterestedAdoptersPage = ({ route }) => {
    //getting the pet name and pet image from the pet page screen
    const { petName, petImage } = route.params;
    //allows for navigation between screens
    const navigation = useNavigation();
    //state to hold the adopters data
    const [adopters, setAdopters] = useState([]);

    //As the page loads, the adopters data is set to a dummy data
    useEffect(() => {
        //An object of adopters holding id, name, image and timestamp
        const dummyAdopters = [
            {
                id: "1",
                name: "John Doe",
                image: "https://randomuser.me/api/portraits/men/1.jpg",
                timestamp: "14:30",
            },
            {
                id: "2",
                name: "Jane Smith",
                image: "https://randomuser.me/api/portraits/women/1.jpg",
                timestamp: "09:45",
            },
            {
                id: "3",
                name: "Mike Johnson",
                image: "https://randomuser.me/api/portraits/men/2.jpg",
                timestamp: "22:15",
            },
            {
                id: "4",
                name: "Emily Brown",
                image: "https://randomuser.me/api/portraits/women/2.jpg",
                timestamp: "03:20",
            },
            {
                id: "5",
                name: "Alex Wilson",
                image: "https://randomuser.me/api/portraits/men/3.jpg",
                timestamp: "18:55",
            },
        ];

        //Declaring a constant mapping function that maps each adopter to an adopters with a random adoption message
        const adoptersWithMessages = dummyAdopters.map((adopter) => ({
            //spreads the adopter object into a new object
            ...adopter,
            //will get a random adoption message from the adoptionMessages.js file inside the utils folder
            adoptionMessage: getRandomAdoptionMessage(adopter.name, petName),
        }));

        //setting the adopters state to the adopters with messages
        setAdopters(adoptersWithMessages);
    }, [petName]);

    //Function that will show all the adopter items
    const showAdopters = ({ item }) => (
        //Touchable interaction state when items are pressed
        <TouchableOpacity
            style={styles.adopterItem}
            //when pressed, it will navigate to the user detail form screen
            onPress={() => {
                //logging state
                console.log("Navigating to UserDetailsForm");
                //navigates to the user detail form screen
                //passing the data of the pet and the adopter to the user detail form screen
                navigation.navigate("UserDetailForm", {
                    petName,//the pet name from the pet page screen
                    petImage,//the pet image from the pet page screen
                    userName: item.name,//the adopter name
                    userImage: item.image,//the adopter image
                    userId: item.id,//the adopter id
                });
            }}
        >
            {/* displays the adopter image */}
            {/* uri is the image string source */}
            <Image source={{ uri: item.image }} style={styles.adopterImage} />
            <View style={styles.adopterInfo}>
                {/* displays the adopter details */}
                <View style={styles.adopterDetails}>
                    <Text style={styles.adopterName}>{item.name}</Text>
                    <Text style={styles.adopterMessage}>{item.adoptionMessage}</Text>
                </View>
                {/* displays the timestamp */}
                <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        //Safe area wrapper to avoid the notch and bottom bar
        <SafeAreaWrapper>
            {/* container for the shelter chats screen */}
            <View style={styles.container}>
                {/* container for the header */}
                <View style={styles.header}>
                    {/* touchable to go back to the previous screen */}
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        {/* arrow back icon */}
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Interested Adopters</Text>
                    <View style={{ width: 24 }} />
                </View>
                {/* container for the pet info */}
                <View style={styles.petInfoContainer}>
                    {/* displays the pet image */}
                    <Image source={{ uri: petImage }} style={styles.petImage} />
                    {/* displays the pet name */}
                    <Text style={styles.petName}>{petName}</Text>
                </View>
                {/* list of adopters messages */}
                <FlatList
                    data={adopters}
                    renderItem={showAdopters}
                    //getting the id of each adopter
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </SafeAreaWrapper>
    );
};

export default InterestedAdoptersPage;
