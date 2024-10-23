import * as FileSystem from 'expo-file-system';

const DEFAULT_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/pluto-2b00c.appspot.com/o/default_animal_image.png?alt=media&token=94dbc329-5848-4dfc-8a93-fe806a48b4bd';

export const getLocalImageUrl = async (imageUrls) => {
    try {
        // Get the first image URL or use the default image URL if the list is empty
        const imageUrl = imageUrls[0] || DEFAULT_IMAGE_URL;
        const fileName = imageUrl.split('/').pop();
        const fileUri = FileSystem.documentDirectory + fileName;

        console.log('Image Firestore Url:', imageUrl);

        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        // Check if the file already exists locally, if not, download it
        if (!fileInfo.exists) {
            await downloadImage(imageUrl, fileUri);
        }

        console.log('Image Uri:', fileUri);
        return fileUri;
    } catch (error) {
        console.error('Error handling image URL:', error);

        // Return the default image URI as a fallback if any error occurs
        const defaultFileName = DEFAULT_IMAGE_URL.split('/').pop();
        const defaultFileUri = FileSystem.documentDirectory + defaultFileName;

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
    const fileUri = FileSystem.documentDirectory + fileName;
    try {
        await FileSystem.deleteAsync(fileUri);
        console.log('Image deleted successfully:', fileUri);
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};
