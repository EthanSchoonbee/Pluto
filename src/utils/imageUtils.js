import * as FileSystem from 'expo-file-system';

const DEFAULT_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/pluto-2b00c.appspot.com/o/default_animal_image.png?alt=media&token=94dbc329-5848-4dfc-8a93-fe806a48b4bd';

export const getLocalImageUrl = async (imageUrls) => {
    try {
        // Get the first image URL or use the default image URL if the list is empty
        const imageUrl = imageUrls[0] || DEFAULT_IMAGE_URL;
        const fileName = imageUrl.split('/').pop();
        const directory = `${FileSystem.documentDirectory}animals/`;
        const fileUri = `${directory}${fileName}`;

        console.log('Image Firestore Url:', imageUrl);

        // Ensure the directory exists before proceeding with the download
        await ensureDirectoryExists(directory);

        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        // Check if the file already exists locally, if not, download it
        if (!fileInfo.exists) {
            console.log('Downloading image to:', fileUri);
            await downloadImage(imageUrl, fileUri);
        } else {
            console.log('Image already exists at:', fileUri);
        }

        return fileUri;
    } catch (error) {
        console.error('Error handling image URL:', error);

        // Handle fallback to default image in case of error
        const defaultFileName = DEFAULT_IMAGE_URL.split('/').pop();
        const defaultDirectory = `${FileSystem.documentDirectory}animals/`;
        const defaultFileUri = `${defaultDirectory}${defaultFileName}`;

        await ensureDirectoryExists(defaultDirectory);

        const defaultFileInfo = await FileSystem.getInfoAsync(defaultFileUri);
        if (!defaultFileInfo.exists) {
            await downloadImage(DEFAULT_IMAGE_URL, defaultFileUri);
        }
        return defaultFileUri;
    }
};

const ensureDirectoryExists = async (directory) => {
    try {
        const dirInfo = await FileSystem.getInfoAsync(directory);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
            console.log('Directory created:', directory);
        } else {
            console.log('Directory already exists:', directory);
        }
    } catch (error) {
        console.error('Error ensuring directory exists:', error);
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
    const fileUri = `${FileSystem.documentDirectory}animals/${fileName}`;
    try {
        await FileSystem.deleteAsync(fileUri);
        console.log('Image deleted successfully:', fileUri);
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};
