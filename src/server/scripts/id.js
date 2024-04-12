/**
 * Generates a random ID between 0 -> (2 ^ size) - 1
 * @param {*} size Bit limit of the ID
 * @param {*} existingIds IDs that already exist to prevent collisions
 * @returns The generated ID (or -1 if one could not be generated)
 */
function generateRandomId(size, existingIds) {
    // Calculate highest possible number for the ID based on given size
    const bitLimit = 2 ** size;

    // If all options have been exhausted, return -1 as no new numbers can be
    // generated
    if (existingIds.length == bitLimit) {
        return -1;
    }

    // Generate a random number
    let number = Math.floor(Math.random() * bitLimit);
    // Keep re-generating it until a unique number is found
    while (existingIds.includes(number)) {
        number = Math.floor(Math.random() * bitLimit);
    }

    return number;
}

module.exports = generateRandomId;