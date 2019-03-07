// Is Logged In Middleware Setup \\
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

// Exporting middleware
module.exports = isLoggedIn;