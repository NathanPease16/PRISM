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