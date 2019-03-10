// Importing Express Router
const express = require('express'),
      router = express.Router({ mergeParams: true }); // Merge params from campground and comments together so there is access to id and similar elements
      
// Importing other files
const Campground = require('../models/Campgrounds'),
      Comment = require('../models/Comments');
// Importing Middleware
const isLoggedIn = require('../middlewares/isLoggedIn');

// ==================== \\
//  - COMMENTS ROUTE - 
// ==================== \\

// GET - NEW COMMENT FORM | - Add new comment form
router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    const campID = req.params.id; // Get campground ID
    Campground.findById(campID, (err, campground) => { // Find campground by ID
        if (!err) {
            res.render(`${__dirname}/../../html/comments/new-comment.ejs`, { campground: campground });
        } else {
            throw new Error(err);
        }
    });
});

// POST - NEW COMMENT | - Create new comment for specific campground
router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    const campID = req.params.id;
    const commentsBody = req.body.comment;
    Campground.findById(campID, (err, campground) => {
        if (!err) {
            Comment.create(commentsBody, (err, comment) => {
                if (!err) {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                } else {
                    throw new Error(err);
                }
            });
        } else {
            throw new Error(err);
        }
    });
});

// Exporting Campgrounds Router
module.exports = router;