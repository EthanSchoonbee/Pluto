/*
AUTHOR: Ethan Schoonbee
CREATED ON: 02/09/2024
LAST UPDATED: 29/10/2024

DESCRIPTION:
This file contains utility functions for managing images in a mobile app:

getLocalImageUrl: Ensures an image is available locally, downloading it if needed, and falling back to a default image.
downloadImage: Helper function to download an image from a URL and save it locally.
deleteLocalImage: Deletes a locally cached image file.
preloadImages: Downloads and caches a list of images locally, returning their local URIs.
The file also defines a DEFAULT_IMAGE_URL constant for use as a fallback.

These functions optimize performance and user experience by handling image caching and fallbacks.
*/
import * as FileSystem from 'expo-file-system';
import {getDownloadURL, getStorage, ref} from "firebase/storage";

// Default image URL to be used if no image is provided
const DEFAULT_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/pluto-2b00c.appspot.com/o/default_animal_image.png?alt=media&token=94dbc329-5848-4dfc-8a93-fe806a48b4bd';

// Function to get the local image URL for a given set of image URLs
export const getLocalImageUrl = async (imageUrls) => {
    try {
        // Get the first image URL or use the default image URL
        const imageUrl = imageUrls[0] || DEFAULT_IMAGE_URL;
        // Extract the filename from the image URL
        const fileName = imageUrl.split('/').pop();
        // Build the local file directory and URI
        const fileDir = `${FileSystem.documentDirectory}animals/`;
        const fileUri = `${fileDir}${fileName}`;

        console.log('Image Firestore Url:', imageUrl);

        // Check if the directory exists, and create it if it doesn't
        const dirInfo = await FileSystem.getInfoAsync(fileDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(fileDir, { intermediates: true });
            console.log('Directory created:', fileDir);
        }

        // Check if the file exists locally
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
            // Download the image if it doesn't exist locally
            await downloadImage(imageUrl, fileUri);
        }

        console.log('Image Uri:', fileUri);
        return fileUri;
    } catch (error) {
        console.error('Error handling image URL:', error);

        // If there's an error, use the default image
        const defaultFileName = DEFAULT_IMAGE_URL.split('/').pop();
        const defaultFileUri = `${FileSystem.documentDirectory}animals/${defaultFileName}`; // Corrected the path here
        const defaultFileInfo = await FileSystem.getInfoAsync(defaultFileUri);
        if (!defaultFileInfo.exists) {
            await downloadImage(DEFAULT_IMAGE_URL, defaultFileUri);
        }
        return defaultFileUri;
    }
};

// Function to download an image from a URL and save it to a local file URI
export const downloadImage = async (url, fileUri) => {
    try {
        // Download the image and save it to the local file URI
        const response = await FileSystem.downloadAsync(url, fileUri);

        console.log('Image downloaded successfully:', response.uri);
    } catch (error) {
        console.error('Error downloading image:', error);
    }
};

// Function to delete a local image file
export const deleteLocalImage = async (id) => {
    const fileUri = `${FileSystem.cacheDirectory}${id}.jpg`;
    try {
        // Check if the file exists locally
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
            // Delete the local image file
            await FileSystem.deleteAsync(fileUri);
            console.log(`Local image for animal ${id} deleted from cache.`);
        } else {
            console.log(`No cached image found for animal ${id}.`);
        }
    } catch (error) {
        console.error('Error deleting local image:', error);
    }
};

// Function to preload a set of images and cache them locally
export const preloadImages = async (imageUrls) => {
    const storage = getStorage();
    const promises = imageUrls.map(async (imageUrl) => {
        try {
            // Get the download URL from Firebase Storage
            const storageRef = ref(storage, imageUrl);
            const downloadUrl = await getDownloadURL(storageRef);
            // Use the image filename as the cache file name
            const fileName = imageUrl.split('/').pop().replace(/%2F/g, '_'); // Replace any %2F with _ to avoid subdirectories
            const localUri = `${FileSystem.cacheDirectory}${fileName}`;
            // Check if the image is already cached
            const fileInfo = await FileSystem.getInfoAsync(localUri);

            if (!fileInfo.exists) {
                // Download the image if it doesn't exist locally
                await FileSystem.downloadAsync(downloadUrl, localUri);
            }

            // Return the local URI for the image
            return { uri: localUri };
        } catch (error) {
            console.error('Error downloading or caching image:', error);
            return null; // Return null if there was an error
        }
    });
    // Filter out any null results and return only successful image URIs
    return (await Promise.all(promises)).filter(Boolean);
};
//________________________________....oooOO0_END_OF_FILE_0OOooo....________________________________