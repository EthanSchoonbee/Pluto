import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import styles from '../styles/ShelterHomePageStyle';
import { Ionicons } from "@expo/vector-icons";
import colors from "../styles/colors";

const AnimalCard = ({
                        name, age, breed, gender, adoptionStatus,
                        imageUrl, notificationCount, id, onAdopt, onDelete, onViewLikes
                    }) => {
    const [localImageUri, setLocalImageUri] = useState(null);

    useEffect(() => {
        const downloadImage = async () => {
            try {
                const fileUri = `${FileSystem.cacheDirectory}${id}.jpg`;
                const fileInfo = await FileSystem.getInfoAsync(fileUri);

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

const renderGenderIcon = (gender) => {
    const iconName = gender === 'M' ? "male" : gender === 'F' ? "female" : null;
    const iconColor = gender === 'M' ? colors.genderMaleBlue : colors.genderFemalePink;

    return iconName ? (
        <Ionicons style={styles.gender} name={iconName} size={18} color={iconColor} />
    ) : null;
};

const ActionButton = ({ title, style, onPress }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

export default AnimalCard;
