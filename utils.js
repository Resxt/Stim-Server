function arrayToString(array, separator) {
    let result = "";

    for (let i = 0; i < array.length; i++) {
        if (i === array.length - 1) {
            separator = "";
        }
        result += array[i] + separator
    }

    return result;
}

module.exports = { arrayToString }
