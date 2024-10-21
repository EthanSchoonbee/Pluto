


const ValidationClass = {

    isEmptyOrWhitespace: function(input) {
        return !input || input.trim() === '';
    },

    // Check if the input string contains the '@' symbol
    containsAtSymbol: function(input) {
        return input.includes('@');
    },

    // Check if the input string contains any number
    containsNumber: function(input) {
        return /\d/.test(input); // \d matches any digit (0-9)
    },

    // Ensure the string contains only digits and the '+' character
    isValidNumberInput: function(input) {
        return /^[+\d]*$/.test(input); // Only allows digits and '+'
    },


    // Check if two strings are exactly the same
    areStringsEqual: function(stringA, stringB) {
        return stringA === stringB; // Returns true if both strings are exactly the same
    },

};

export default ValidationClass;
