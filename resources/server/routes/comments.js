// Importing Express Router
const express = require('express'),
      router = express.Router({ mergeParams: true }); // Merge params from campground and comments together so there is access to id and similar elements
// Importing other files
const Campground = require('../models/Campgrounds'),
      Comment = require('../models/Comments');
// Importing Middleware
const authMiddleware = require('../middlewares/authMiddleware');

// ==================== \\
//  - COMMENTS ROUTE - 
// ==================== \\

// GET - NEW COMMENT FORM | - Add new comment form
router.get('/campgrounds/:id/comments/new', authMiddleware.isLoggedIn, (req, res) => {
    const campID = req.params.id; // Get campground ID
    Campground.findById(campID, (err, campground) => { // Find campground by ID
        if (!err) {
            res.render(`${__dirname}/../../html/comments/new-comment.ejs`, { campground: campground });
        } else {
            throw new Error(err);
        }
    });
});

// POST - CREATE NEW COMMENT | - Create new comment for specific campground
router.post('/campgrounds/:id/comments', authMiddleware.isLoggedIn, (req, res) => {
    const campID = req.params.id;
    const commentsBody = req.body.comment;
    Campground.findById(campID, (err, campground) => {
        if (!err) {
            Comment.create(commentsBody, (err, comment) => {
                if (!err) {
                    // Add username and ID to comment
                    comment.author._id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
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

// GET - EDIT COMMENT FORM | - Displays form for editing/updating comments
router.get('/campgrounds/:id/comments/:comment_id/edit', (req, res) => {
    const campID = req.params.id,
          commentID = req.params.comment_id;
    Comment.findById(commentID, (err, foundComment) => {
        if (!err) {
            res.render(`${__dirname}/../../html/comments/edit-comment.ejs`, { campground_id: campID, comment: foundComment });
        } else {
            throw new Error(err);
        }
    });
});

// PUT - UPDATING COMMENT | - Updates the comment with new content
router.put('/campgrounds/:id/comments/:comment_id', (req, res) => {
    const commentID = req.params.comment_id,
          commentData = req.body.comment,
          campID = req.params.id;
    Comment.findByIdAndUpdate(commentID, commentData, (err, updatedComment) => {
        if (!err) {
            res.redirect(`/campgrounds/${campID}`)
        } else {
            throw new Error(err);
        }
    });
});

// DELETE - DELETE COMMENT | - Delete the comment
router.delete('/campgrounds/:id/comments/:comment_id', (req, res) => {
    const commentID = req.params.comment_id;
    Comment.findByIdAndRemove(commentID, (err) => {
        if (!err) {
            res.redirect('back'); // if specifiying the show page, do it this way ==> /campgrounds/${req.params.id} = id of the campground
        } else {
            throw new Error(err);
        }
    });
});

// Exporting Campgrounds Router
module.exports = router;