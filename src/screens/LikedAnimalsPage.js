import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import PetPageHeader from "../components/PetPageHeader";
import Navbar from "../components/Navbar";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import styles from "../styles/LikedAnimalsPageStyle";

//Creating an object of dummy pets for testing that will have a id, name, image and type. Type is either dog or cat
const dummyPets = [
    {
        id: "1",
        name: "Max",
        image:
            "https://www.usatoday.com/gcdn/-mm-/c85c9394cb01a8015d8939de412ad73f42eafc87/c=835-682-5178-3135/local/-/media/2015/06/17/USATODAY/USATODAY/635701398627851742-MAX-17945.jpg?width=660&height=373&fit=crop&format=pjpg&auto=webp",
        type: "dog",
    },
    {
        id: "2",
        name: "Bella",
        image: "https://images.dog.ceo/breeds/poodle-toy/n02113624_1178.jpg",
        type: "dog",
    },
    {
        id: "3",
        name: "Charlie",
        image: "https://images.dog.ceo/breeds/rottweiler/n02106550_6286.jpg",
        type: "dog",
    },
    {
        id: "4",
        name: "Lucy",
        image: "https://images.dog.ceo/breeds/australian-shepherd/sadie.jpg",
        type: "dog",
    },
    {
        id: "5",
        name: "Whiskers",
        image: "https://api-ninjas.com/images/cats/abyssinian.jpg",
        type: "cat",
    },
    {
        id: "6",
        name: "Mittens",
        image: "https://cdn2.thecatapi.com/images/BborJBuoW.jpg",
        type: "cat",
    },
    {
        id: "7",
        name: "Luna",
        image: "https://cdn2.thecatapi.com/images/UCifm-g71.jpg",
        type: "cat",
    },
    {
        id: "8",
        name: "Oliver",
        image: "https://cdn2.thecatapi.com/images/Va2B7D5rG.png",
        type: "cat",
    },
];

//The entire pet list component frontend elements
const LikedAnimalsPage = ({ navigation }) => {
    //The current active tab will be set to dogs
    const [activeTab, setActiveTab] = useState("Dogs");

    //function to show each pet item
    //The item is touchable when pressed and will be used to navigate to a different screen when pressed
    const showPetItem = ({ item }) => (
        <TouchableOpacity
            //uses the pet item style
            style={styles.petItem}
            //when its pressed will navigate to the shelter chats screen
            onPress={() =>
                navigation.navigate("InterestedAdoptersPage", {
                    //its passing the pet name and pet image to the shelter chats screen
                    petName: item.name,
                    petImage: item.image,
                })
            }
        >
            {/* displays the pet image */}
            <Image source={{ uri: item.image }} style={styles.petImage} />
            {/* displays the pet name */}
            <Text style={styles.petName}>{item.name}</Text>
        </TouchableOpacity>
    );

    //filters the pets based on the active tab
    const filteredPets = dummyPets.filter(
        (pet) => pet.type + "s" === activeTab.toLowerCase()
    );

    //The entire pet Page component frontend elements
    return (
        <SafeAreaWrapper>
            <PetPageHeader />
            {/* in a scroll view so the content can scroll up and down */}
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* title of the page */}
                <Text style={styles.title}>Available Pets</Text>

                {/* container for the tabs */}
                <View style={styles.tabContainer}>
                    {/* touchable dog tab */}
                    <TouchableOpacity
                        style={[styles.tab, activeTab === "Dogs" && styles.activeTab]}
                        onPress={() => setActiveTab("Dogs")}
                    >
                        {/* text for the dog tab */}
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "Dogs" && styles.activeTabText,
                            ]}
                        >
                            Dogs
                        </Text>
                    </TouchableOpacity>
                    {/* touchable cat tab */}
                    <TouchableOpacity
                        style={[styles.tab, activeTab === "Cats" && styles.activeTab]}
                        onPress={() => setActiveTab("Cats")}
                    >
                        {/* text for the cat tab */}
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "Cats" && styles.activeTabText,
                            ]}
                        >
                            Cats
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* flat list to display the pets */}
                <FlatList
                    //filtered pets, is all the pets that pertains to the type of pet either dog or cat
                    data={filteredPets}
                    //shows each pet item
                    renderItem={showPetItem}
                    //getting the id of each pet
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    scrollEnabled={false}
                />
            </ScrollView>
            <Navbar />
        </SafeAreaWrapper>
    );
};

export default LikedAnimalsPage;
