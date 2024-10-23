import * as FileSystem from 'expo-file-system';

const DEFAULT_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/pluto-2b00c.appspot.com/o/default_animal_image.png?alt=media&token=94dbc329-5848-4dfc-8a93-fe806a48b4bd';

export const getLocalImageUrl = async (imageUrls) => {
    try {
        const imageUrl = imageUrls[0] || DEFAULT_IMAGE_URL;
        const fileName = imageUrl.split('/').pop();
        const fileDir = `${FileSystem.documentDirectory}animals/`;
        const fileUri = `${fileDir}${fileName}`;

        console.log('Image Firestore Url:', imageUrl);

        // Create the directory if it doesn't exist
        const dirInfo = await FileSystem.getInfoAsync(fileDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(fileDir, { intermediates: true });
            console.log('Directory created:', fileDir);
        }

        // Check if the file exists
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
            await downloadImage(imageUrl, fileUri);
        }

        console.log('Image Uri:', fileUri);
        return fileUri;
    } catch (error) {
        console.error('Error handling image URL:', error);
        const defaultFileName = DEFAULT_IMAGE_URL.split('/').pop();
        const defaultFileUri = `${FileSystem.documentDirectory}animals/${defaultFileName}`; // Corrected the path here
        const defaultFileInfo = await FileSystem.getInfoAsync(defaultFileUri);
        if (!defaultFileInfo.exists) {
            await downloadImage(DEFAULT_IMAGE_URL, defaultFileUri);
        }
        return defaultFileUri;
    }
};

export const downloadImage = async (url, fileUri) => {
    try {
        const response = await FileSystem.downloadAsync(url, fileUri);
        console.log('Image downloaded successfully:', response.uri);
    } catch (error) {
        console.error('Error downloading image:', error);
    }
};

export const deleteLocalImage = async (fileName) => {
    const fileUri = `${FileSystem.documentDirectory}animals/${fileName}`; // Corrected the path here
    try {
        await FileSystem.deleteAsync(fileUri);
        console.log('Image deleted successfully:', fileUri);
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};
