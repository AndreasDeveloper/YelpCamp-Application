// - Importing Other Mandatory Files - \\
const Campground = require('../models/Campgrounds'),
      Comment = require('../models/Comments');

// isLoggedIn Middleware | - Checks if user is logged in \\
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Log In First in order to do that');
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
                    req.flash('error', 'Error Occured');
                    res.redirect('back');
                }
            } else {
                req.flash('error', 'No permission to do that');
                throw new Error(err);
            }
        });
    } else {
        req.flash('error', 'Log In First in order to do that');
        res.redirect('back');
    }
};

// checkCampgroundOwnership Middleware | - Check if user owns rights to edit/delete campground
const checkCommentOwnership = (req, res, next) => {
    // Check if user is logged in
    if (req.isAuthenticated()) {
        const commentID = req.params.comment_id;
        Comment.findById(commentID, (err, foundComment) => {
            if (!err) {
                // Check if user owns the campground
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'Error Occured');
                    res.redirect('back');
                }
            } else {
                req.flash('error', 'No permission to do that');
                throw new Error(err);
            }
        });
    } else {
        req.flash('error', 'Log In First in order to do that');
        res.redirect('back');
    }
};
 
// Exporting middleware
module.exports = {
    isLoggedIn,
    checkCampgroundOwnership,
    checkCommentOwnership
};