// Importing Express Router
const express = require('express'),
      router = express.Router();
// Importing middlewares
const authMiddleware = require('../middlewares/authMiddleware');
// Importing other files 
const Campground = require('../models/Campgrounds'),
      Comment = require('../models/Comments'),
      escapeRegex = require('../../js/utilities/regex-escape');

// ==================== \\
// - CAMPGROUNDS ROUTE - 
// ==================== \\

// GET - ALL CAMPGROUNDS - INDEX | - Camp Grounds - \\
router.get('/campgrounds', (req, res) => {
    // Declaring Variables
    let noMatch = '';
    if (req.query.search) {
        const userBody = req.user;
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}, (err, foundCampground) => {
            if (!err) {
                if (foundCampground.length < 1) {
                    noMatch = 'No results found.';
                }
                res.render(`${__dirname}/../../html/campgrounds/index.ejs`, {campgrounds: foundCampground, currentUser: userBody, noMatch: noMatch});
            } else {
                throw new Error(err);
            }
        });
    } else {
        const userBody = req.user;
        // Get campgrounds from DB
        Campground.find({}, (err, allCampgrounds) => {
            if (!err) {
                res.render(`${__dirname}/../../html/campgrounds/index.ejs`, {campgrounds: allCampgrounds, currentUser: userBody, noMatch: noMatch}); // campgrounds param in ejs : allCampgrounds as DB data
            } else {
                throw new Error(err);
            }
        });
    }
});

// GET - NEW CAMPGROUND FORM | - Adding new Camp grounds page with form - \\
router.get('/campgrounds/new', authMiddleware.isLoggedIn, (req, res) => {
    res.render(`${__dirname}/../../html/campgrounds/new.ejs`);
});

// POST - CREATE NEW CAMPGROUND | - Adding Camp Grounds using Form - \\
router.post('/campgrounds', authMiddleware.isLoggedIn, (req, res) => {
    // Author object filled with users ID and username (In order to display username that created campground)
    const author = { id: req.user._id, username: req.user.username };
    // accessing name, image, price, desc from form name attributes (Campground data)
    const name = req.body.name, 
          image = req.body.image,
          description = req.body.description,
          price = req.body.price,
          newCampground = {name: name, image: image, price: price, description: description, author: author}; // storing extracted form data into the object
    // Create a new campground, save it to DB
    Campground.create(newCampground, (err, newlyCreatedCamp) => { // newlyCreatedCamp is a object of newly created data
        if (!err) {
            // Redirecting back to campgrounds page
            res.redirect('/campgrounds');
        } else {
            throw new Error(err);
        }
    });
});

// GET - SHOW SPECIFIC CAMPGROUND | - Shows more info to specific campground - \\
router.get('/campgrounds/:id', (req, res) => {
    const campID = req.params.id;
    // Display specific campground with given ID
    Campground.findById(campID).populate('comments').exec((err, foundCampground) => { // Populating campgrounds object with comments
        if (!err) {
            // Render show campground page for specific ID
            res.render(`${__dirname}/../../html/campgrounds/show.ejs`, {campground: foundCampground});
        } else {
            throw new Error(err);
        }
    });
});

// GET - EDIT CAMPGROUND | - Edit campground page
router.get('/campgrounds/:id/edit', authMiddleware.checkCampgroundOwnership, (req, res) => {
        const campID = req.params.id;
        Campground.findById(campID, (err, campground) => {
            if (!err) {
                res.render(`${__dirname}/../../html/campgrounds/edit.ejs`, {campground: campground});
            } else {
                req.flash('error', 'Campground doesn\'t exist');
                throw new Error(err);
            }
    });
});

// PUT - UPDATE CAMPGROUND | - Update campground with new info
router.put('/campgrounds/:id', authMiddleware.checkCampgroundOwnership, (req, res) => {
    const campID = req.params.id,
          campContent = req.body.campground; // Includes name, image and text content of campground
    // Find & Update campground
    Campground.findByIdAndUpdate(campID, campContent, (err, updateCamp) => {
        if (!err) {
            res.redirect(`/campgrounds/${campID}`);
        } else {
            throw new Error(err);
        }
    });
});

// DELETE - DELETE CAMPGROUND | - Deletes campground from database
router.delete('/campgrounds/:id', authMiddleware.checkCampgroundOwnership, (req, res) => {
    const campID = req.params.id;
    Campground.findByIdAndRemove(campID, (err, campgrounds) => {
        if (!err) {
            res.redirect('/campgrounds');
        } else {    
            throw new Error(err);
        }
        // Delete associated comments 
        Comment.deleteMany({ _id: {$in: campgrounds.comments}}, (err) => {
            if (err) {
                throw new Error(err);
            } 
        });
    });
});

// Exporting Campgrounds Router
module.exports = router;