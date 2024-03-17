/**
 * Generates a random ID between 0 -> (2 ^ size) - 1
 * @param {*} size Bit limit of the ID
 * @param {*} existingIds IDs that already exist to prevent collisions
 * @returns The generated ID (or -1 if one could not be generated)
 */
function generateRandomId(size, existingIds) {
    const bitLimit = 2 ** size;

    if (existingIds.length == bitLimit) {
        return -1;
    }

    let number = Math.floor(Math.random() * bitLimit);
    while (existingIds.includes(number)) {
        number = Math.floor(Math.random() * bitLimit);
    }

    return number;
}

module.exports = generateRandomId;