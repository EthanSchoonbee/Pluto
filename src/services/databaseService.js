/*
AUTHOR: Ethan Schoonbee
CREATED ON: 02/09/2024
LAST UPDATED: 29/10/2024

DESCRIPTION:
This file contains functions to handle animal adoption and deletion within a React Native app.
These functions use Firebase Firestore for data updates and React Native's Alert for user confirmations.
- `handleAnimalAdopt`: Confirms and updates the adoption status of an animal in the database.
- `handleAnimalDelete`: Confirms deletion and removes an animal's record and associated local image.
*/
import { Alert } from 'react-native';
import {
    doc,
    updateDoc,
    deleteDoc,
    query,
    collection,
    limit,
    where,
} from 'firebase/firestore';
import { db } from './firebaseConfig'; // Firebase configuration import
import { deleteLocalImage } from '../utils/imageUtils'; // Utility function for image deletion
import { preloadImages } from '../utils/imageUtils';

/**
 * handleAnimalAdopt function
 * Prompts the user to confirm the adoption of an animal and updates the adoption status in Firestore.
 * @param {string} animalId - The ID of the animal to mark as adopted.
 */
export const handleAnimalAdopt = async (animalId) => {
    Alert.alert(
        "Confirm Adoption",
        "Are you sure this animal has been adopted?",
        [
            { text: "No", onPress: () => console.log("Adoption canceled"), style: "cancel" },
            {
                text: "Yes",
                onPress: async () => {
                    try {
                        const animalRef = doc(db, 'animals', animalId);
                        await updateDoc(animalRef, { adoptionStatus: true }); // Update the adoption status
                        console.log(`Animal with ID ${animalId} updated to adopted.`);
                        Alert.alert('Success', 'The animal has been marked as adopted.');
                    } catch (error) {
                        console.error('Error updating animal adoption status:', error);
                    }
                }
            }
        ],
        { cancelable: false }
    );
};

/**
 * handleAnimalDelete function
 * Prompts the user to confirm the deletion of an animal and removes it from Firestore.
 * Deletes the local image associated with the animal.
 * @param {string} animalId - The ID of the animal to delete.
 * @param {string} imageUrl - The URL of the animal's image.
 */
export const handleAnimalDelete = async (animalId, imageUrl) => {
    Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete this animal?",
        [
            { text: "No", onPress: () => console.log("Deletion canceled"), style: "cancel" },
            {
                text: "Yes",
                onPress: async () => {
                    try {

                        console.log(imageUrl); // Log the image URL for debugging
                        const animalRef = doc(db, 'animals', animalId);
                        console.log(animalId)// Log the animal ID for debugging
                        await deleteDoc(animalRef);

                        await deleteLocalImage(animalId);// Delete the local image
                        console.log(`Animal with ID ${animalId} deleted.`);
                        Alert.alert('Success', 'The animal has been deleted successfully.');
                    } catch (error) {
                        console.error('Error deleting animal:', error);
                        Alert.alert('Error', 'An error occurred while deleting the animal.');
                    }
                }
            }
        ],
        { cancelable: false }
    );
};


/**
 * buildQuery function
 * Constructs a Firestore query based on the provided preferences.
 * @param {Object} preferences - An object containing the user's search preferences.
 * @returns {QueryConstraint} - The constructed Firestore query.
 */
export const buildQuery = (preferences) => {
    let q = query(collection(db, 'animals'), limit(10));
    const {
        activityLevel,
        ageRange,
        animalType,
        breed,
        furColors,
        gender,
        province,
        size,
    } = preferences;

    if (activityLevel) q = query(q, where('activityLevel', '==', activityLevel));
    if (ageRange) q = query(q, where('age', '>=', ageRange[0]), where('age', '<=', ageRange[1]));
    if (animalType) q = query(q, where('species', '==', animalType));
    if (breed && breed !== 'Any') q = query(q, where('breed', '==', breed));
    if (furColors?.length > 0) q = query(q, where('furColors', 'array-contains-any', furColors));
    if (gender && gender !== 'Any') q = query(q, where('gender', '==', gender));
    if (province) q = query(q, where('province', '==', province));
    if (size) q = query(q, where('size', '==', size));

    return q;
};

/**
 * processQuerySnapshot function
 * Processes the Firestore query snapshot and returns an array of animal data objects.
 * It preloads the images associated with each animal and only includes animals with successfully preloaded images.
 * @param {QuerySnapshot} querySnapshot - The Firestore query snapshot.
 * @returns {Promise<Object[]>} - An array of animal data objects.
 */
export const processQuerySnapshot = async (querySnapshot) => {
    const animals = [];
    for (const doc of querySnapshot.docs) {
        const animalData = doc.data();
        animalData.id = doc.id;
        animalData.images = await preloadImages(animalData.imageUrls  || []);

        console.log('Captured animal:', animalData);

        // Only add animals with successfully preloaded images
        if (animalData.images.length > 0) {
            animals.push(animalData);
        } else {
            console.warn('No images found for animal: ${animalData.id}');
        }
    }
    return animals;
};
//________________________________....oooOO0_END_OF_FILE_0OOooo....________________________________