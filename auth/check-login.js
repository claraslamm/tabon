const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/login')
}

const notLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) return next();
    res.redirect('/');
}

module.exports = {
    isLoggedIn,
    notLoggedIn
}