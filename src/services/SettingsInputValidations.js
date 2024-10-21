


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
    }
};

export default ValidationClass;
