function save(res, name, value) {
    res.cookie(name, value, {
        httpOnly: true,
        secure: false, // CHANGE IN PRODUCTION,
        sameSite: 'strict',
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Lasts for ~ 1 year
    });
}

module.exports = save;