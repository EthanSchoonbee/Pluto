import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import styles from '../styles/ShelterHomePageStyle'; // Update path as necessary
import { Ionicons } from "@expo/vector-icons";
import colors from "../styles/colors";

const AnimalCard = ({
                        name, age, breed, gender, adoptionStatus,
                        imageUrls, notificationCount,
                        id, onAdopt, onDelete, onViewLikes
                    }) => (
    <View style={styles.card}>
        <Image
            source={{ uri: imageUrls.length > 0 ? imageUrls[0] : '' }}
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
                onPress={() => onDelete(id, imageUrls)} // Pass the id and imageUrls to the onDelete function
            />
        </View>
    </View>
);

const renderGenderIcon = (gender) => {
    const iconName = gender === 'M' ? "male" : gender === 'F' ? "female" : null;
    const iconColor = gender === 'M' ? colors.genderMaleBlue : colors.genderFemalePink;

    return iconName ? (
        <Ionicons style={styles.gender} name={iconName} size={18} color={iconColor} />
    ) : null;
};

const ActionButton = ({ title, style, deleteButtonText, onPress }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Text style={[styles.buttonText, deleteButtonText && styles.deleteButtonText]}>{title}</Text>
    </TouchableOpacity>
);

export default AnimalCard;
