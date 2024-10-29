import { Alert } from 'react-native';
import {
    doc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import { db } from './firebaseConfig'; // Adjust the import path as needed
import { deleteLocalImage } from '../utils/imageUtils'; // Adjust the import path as needed


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
                        await updateDoc(animalRef, { adoptionStatus: true });
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

                        console.log(imageUrl);
                        const animalRef = doc(db, 'animals', animalId);
                        console.log(animalId)
                        await deleteDoc(animalRef);

                        await deleteLocalImage(animalId);
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

