/*
AUTHOR: Ethan Schoonbee
CREATED ON: 02/09/2024
LAST UPDATED: 29/10/2024

DESCRIPTION:
This file contains utilities for use throughout the application
*/

//Function for calculating opacities for the like and dislike overlay images
export const calculateOpacities = (positionX) => {
    return [
        Math.min(Math.max(positionX / 100, 0), 1),
        Math.min(Math.max(-positionX / 100, 0), 1),
    ];
};
//________________________________....oooOO0_END_OF_FILE_0OOooo....________________________________