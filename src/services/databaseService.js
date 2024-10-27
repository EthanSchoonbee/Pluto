import { Alert } from 'react-native';
import {
    doc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig'; // Adjust the import path as needed
import { deleteLocalImage } from '../utils/imageUtils'; // Adjust the import path as needed

export const handleAdopt = async (animalId, fetchAnimals) => {
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

export const handleDelete = async (animalId, imageUrls, fetchAnimals) => {
    Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete this animal?",
        [
            { text: "No", onPress: () => console.log("Deletion canceled"), style: "cancel" },
            {
                text: "Yes",
                onPress: async () => {
                    try {
                        const animalRef = doc(db, 'animals', animalId);
                        await deleteDoc(animalRef);
                        console.log(`Animal with ID ${animalId} deleted.`);
                        for (const imageUrl of imageUrls) {
                            const fileName = imageUrl.split('/').pop();
                            await deleteLocalImage(fileName);
                        }
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
