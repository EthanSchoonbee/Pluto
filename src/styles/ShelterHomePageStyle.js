import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
    addButton: {
        color: colors.genderMaleBlue,
        fontSize: 18,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
        scrollView: {
            maxHeight: '88%',
        },
            card: {
                flex: 1,
                marginHorizontal: 5,
                marginVertical: 10,
                borderRadius: 10,
                // overflow: 'hidden'
                backgroundColor: '#fff',
                // shadow for IOS:
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                // shadow for Android
                elevation: 5,
            },
                notificationContainer: {
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    zIndex: 1,
                },
                    notificationBadge: {
                        backgroundColor: 'red',
                        borderRadius: 20,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                    },
                        notificationText: {
                            color: colors.white,
                            fontSize: 12,
                        },
                animalImage: {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    width: '100%',
                    height: 300, // Adjust height as needed
                    position: 'relative',
                },
                animalDetails: {
                    position: 'absolute',
                    bottom: '17%',
                    left: 10,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background for readability
                    padding: 10,
                    borderRadius: 5,
                },
                    nameAgeContainer: {
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                    },
                        name: {
                            fontSize: 24,
                            color: '#fff',
                            fontWeight: 'bold',
                        },
                        age: {
                            fontSize: 18,
                            color: '#ddd',
                        },
                    genderBreedContainer: {
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                    },
                        gender: {
                            fontSize: 18,
                            marginRight: 7,
                        },
                        breed: {
                            fontSize: 18,
                            color: '#ddd',
                        },
                    adoptionStatusContainer: {
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                    },
                        adoptionStatus: {
                            fontSize: 18,
                            color: '#ddd',
                        },
                buttonContainer: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 0,
                    borderRadius: 10,
                    backgroundColor: '#f0f0f0',
                },
                    button: {
                        flex: 1,
                        margin: 5,
                        backgroundColor: '#3498db',
                        borderRadius: 5,
                        paddingVertical: 10,
                        alignItems: 'center',
                    },
                        buttonText: {
                            color: '#fff',
                            fontSize: 14,
                        },
                deleteButton: {
                    backgroundColor: '#e74c3c',
                },
                    deleteButtonText: {
                        color: '#fff',
                    },
});

