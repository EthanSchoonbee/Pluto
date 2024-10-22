import * as FileSystem from 'expo-file-system';

export const getLocalImageUrls = async (imageUrls) => {
    return await Promise.all(imageUrls.map(async (url) => {
        const fileName = url.split('/').pop();
        const fileUri = FileSystem.documentDirectory + fileName;

        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
            await downloadImage(url, fileUri);
        }
        return fileUri;
    }));
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
