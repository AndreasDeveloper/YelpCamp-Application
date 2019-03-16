// - Importing Other Mandatory Files - \\
const Campground = require('../models/Campgrounds');

// isLoggedIn Middleware | - Checks if user is logged in \\
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

// checkCampgroundOwnership Middleware | - Check if user owns rights to edit/delete campground
const checkCampgroundOwnership = (req, res, next) => {
    // Check if user is logged in
    if (req.isAuthenticated()) {
        const campID = req.params.id;
        Campground.findById(campID, (err, campground) => {
            if (!err) {
                // Check if user owns the campground
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            } else {
                throw new Error(err);
            }
        });
    } else {
        res.redirect('back');
    }
};
 
// Exporting middleware
module.exports = {
    isLoggedIn,
    checkCampgroundOwnership
};