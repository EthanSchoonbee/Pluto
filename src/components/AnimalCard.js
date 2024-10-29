/*
AUTHOR: Ethan Schoonbee
CREATED ON: 02/09/2024
LAST UPDATED: 29/10/2024

DESCRIPTION:
This file contains the implementation of the `AnimalCard` component, which represents a card-like UI element for displaying information about an animal available for adoption in a shelter home page.

The component fetches and caches the animal's image locally, displays the animal's details (name, age, breed, gender, adoption status), and provides buttons for adopting the animal, viewing its likes, and deleting the animal.

The component also includes a notification badge to indicate the number of likes the animal has received.

SUMMARY:
- `AnimalCard`: The main component that renders the animal card UI.
- `renderGenderIcon`: A helper function that renders the appropriate gender icon (male or female) based on the animal's gender.
- `ActionButton`: A reusable component for rendering the action buttons (Adopt, View Likes, Delete).
*/

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import styles from '../styles/ShelterHomePageStyle';
import { Ionicons } from "@expo/vector-icons";
import colors from "../styles/colors";

/**
 * AnimalCard component
 * Displays an animal's information and provides actions to adopt, view likes, and delete the animal.
 * @param {string} name - The name of the animal.
 * @param {number} age - The age of the animal.
 * @param {string} breed - The breed of the animal.
 * @param {string} gender - The gender of the animal ('M' for male, 'F' for female).
 * @param {boolean} adoptionStatus - The adoption status of the animal.
 * @param {string} imageUrl - The URL of the animal's image.
 * @param {number} notificationCount - The number of likes the animal has received.
 * @param {string} id - The unique identifier of the animal.
 * @param {function} onAdopt - Callback function to handle the adoption of the animal.
 * @param {function} onDelete - Callback function to handle the deletion of the animal.
 * @param {function} onViewLikes - Callback function to handle the viewing of the animal's likes.
 */
const AnimalCard = ({
                        name, age, breed, gender, adoptionStatus,
                        imageUrl, notificationCount, id, onAdopt, onDelete, onViewLikes
                    }) => {
    const [localImageUri, setLocalImageUri] = useState(null);

    // Fetch and cache the animal's image locally
    useEffect(() => {
        const downloadImage = async () => {
            try {
                const fileUri = `${FileSystem.cacheDirectory}${id}.jpg`;
                const fileInfo = await FileSystem.getInfoAsync(fileUri);

                console.log('file uri: >> ', fileUri);

                if (!fileInfo.exists) {
                    // Download the image if it doesn't exist locally
                    const downloadedImage = await FileSystem.downloadAsync(
                        imageUrl,
                        fileUri
                    );
                    setLocalImageUri(downloadedImage.uri);
                } else {
                    // Use the cached image
                    setLocalImageUri(fileInfo.uri);
                }
            } catch (error) {
                console.error('Error downloading image: ', error);
            }
        };

        if (imageUrl) {
            downloadImage();
        }
    }, [imageUrl, id]);

    return (
        <View style={styles.card}>
            <Image
                source={{ uri: localImageUri || imageUrl }} // Fallback to imageUrl if download fails
                style={styles.animalImage}
                resizeMode="cover"
                onError={(e) => {
                    console.log("Error loading image: ", e.nativeEvent.error);
                }}
            />
            <View style={styles.notificationContainer}>
                {notificationCount > 0 && (
                    <View style={styles.notificationBadge}>
                        <Text style={styles.notificationText}>{notificationCount}</Text>
                    </View>
                )}
            </View>
            <View style={styles.animalDetails}>
                <View style={styles.nameAgeContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.age}>, {age} years old</Text>
                </View>
                <View style={styles.genderBreedContainer}>
                    {renderGenderIcon(gender)}
                    <Text style={styles.breed}>{breed}</Text>
                </View>
                <View style={styles.adoptionStatusContainer}>
                    <Text style={styles.adoptionStatus}>
                        {adoptionStatus ? "Adopted" : "Up for Adoption"}
                    </Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <ActionButton
                    title="Adopted"
                    onPress={() => {
                        if (adoptionStatus) {
                            Alert.alert("Warning", "This animal is already adopted and cannot be marked again.");
                        } else {
                            onAdopt(id);
                        }
                    }}
                />
                <ActionButton title="View Likes" onPress={() => onViewLikes(id)} />
                <ActionButton
                    title="Delete"
                    style={styles.deleteButton}
                    onPress={() => onDelete(id)}
                />
            </View>
        </View>
    );
};

/**
 * renderGenderIcon function
 * Renders the appropriate gender icon (male or female) based on the animal's gender.
 * @param {string} gender - The gender of the animal ('M' for male, 'F' for female).
 * @returns {JSX.Element | null} - The gender icon component or null if the gender is not recognized.
 */
const renderGenderIcon = (gender) => {
    const iconName = gender === 'M' ? "male" : gender === 'F' ? "female" : null;
    const iconColor = gender === 'M' ? colors.genderMaleBlue : colors.genderFemalePink;

    return iconName ? (
        <Ionicons style={styles.gender} name={iconName} size={18} color={iconColor} />
    ) : null;
};

/**
 * ActionButton component
 * Renders a button with the specified title and style.
 * @param {string} title - The title of the button.
 * @param {object} style - The optional custom style for the button.
 * @param {function} onPress - The callback function to be executed when the button is pressed.
 * @returns {JSX.Element} - The action button component.
 */
const ActionButton = ({ title, style, onPress }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

export default AnimalCard;
//________________________________....oooOO0_END_OF_FILE_0OOooo....________________________________
