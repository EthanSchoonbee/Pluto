import * as FileSystem from 'expo-file-system';

const DEFAULT_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/pluto-2b00c.appspot.com/o/default_animal_image.png?alt=media&token=94dbc329-5848-4dfc-8a93-fe806a48b4bd';
const IMAGE_DIRECTORY = `${FileSystem.documentDirectory}images/`;

export const getLocalImageUrl = async (imageUrls) => {
    try {
        // Get the first image URL or use the default image URL if the list is empty
        const imageUrl = imageUrls[0] || DEFAULT_IMAGE_URL;
        const fileName = getFileNameFromUrl(imageUrl);
        const fileUri = `${IMAGE_DIRECTORY}${fileName}`;

        console.log('Image Firestore URL:', imageUrl);
        console.log('File URI for image:', fileUri);

        // Ensure the directory exists before proceeding with the download
        await ensureDirectoryExists(IMAGE_DIRECTORY);

        if (!(await FileSystem.getInfoAsync(fileUri)).exists) {
            console.log('Image does not exist locally. Downloading to:', fileUri);
            await downloadImage(imageUrl, fileUri);
        } else {
            console.log('Image already exists at:', fileUri);
        }

        return fileUri;
    } catch (error) {
        console.error('Error handling image URL:', error);

        // Handle fallback to default image in case of error
        return await getLocalImageUrl();

    }
};

const getFileNameFromUrl = (url) => {
    return decodeURIComponent(url.split('/').pop().split('?')[0]);
};

const ensureDirectoryExists = async (directory) => {
    try {
        const dirInfo = await FileSystem.getInfoAsync(directory);
        if (!dirInfo.exists) {
            console.log('Directory does not exist. Creating:', directory);
            await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
            console.log('Directory created:', directory);
        } else {
            console.log('Directory already exists:', directory);
        }
    } catch (error) {
        console.error('Error ensuring directory exists:', error);
    }
};

async function downloadImage(imageUrl, localPath) {
    try {
        console.log('Starting download from:', imageUrl);
        await FileSystem.downloadAsync(imageUrl, localPath);
        console.log('Image downloaded to:', localPath);
    } catch (error) {
        console.error('Error downloading image:', error);
    }
}

export const deleteLocalImage = async (fileName) => {
    const fileUri = `${FileSystem.documentDirectory}images/${fileName}`;
    try {
        await FileSystem.deleteAsync(fileUri);
        console.log('Image deleted successfully:', fileUri);
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};

const getDefaultImageUrl = async () => {
    const defaultFileName = getFileNameFromUrl(DEFAULT_IMAGE_URL);
    const defaultFileUri = `${IMAGE_DIRECTORY}${defaultFileName}`;

    await ensureDirectoryExists(IMAGE_DIRECTORY);

    const defaultFileInfo = await FileSystem.getInfoAsync(defaultFileUri);
    if (!defaultFileInfo.exists) {
        await downloadImage(DEFAULT_IMAGE_URL, defaultFileUri);
    }
    return defaultFileUri;
};
