// Importing Express Router
const express = require('express'),
      router = express.Router();
// Importing middlewares
const isLoggedIn = require('../middlewares/isLoggedIn');
// Importing other files 
const Campground = require('../models/Campgrounds');

// ==================== \\
// - CAMPGROUNDS ROUTE - 
// ==================== \\

// GET - ALL CAMPGROUNDS - INDEX | - Camp Grounds - \\
router.get('/campgrounds', (req, res) => {
    const userBody = req.user;
    // Get campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (!err) {
            res.render(`${__dirname}/../../html/campgrounds/index.ejs`, {campgrounds: allCampgrounds, currentUser: userBody}); // campgrounds param in ejs : allCampgrounds as DB data
        } else {
            throw new Error(err);
        }
    });
});

// GET - NEW CAMPGROUND FORM | - Adding new Camp grounds page with form - \\
router.get('/campgrounds/new', isLoggedIn, (req, res) => {
    res.render(`${__dirname}/../../html/campgrounds/new.ejs`);
});

// POST - CREATE NEW CAMPGROUND | - Adding Camp Grounds using Form - \\
router.post('/campgrounds', isLoggedIn, (req, res) => {
    // Author object filled with users ID and username (In order to display username that created campground)
    const author = { id: req.user._id, username: req.user.username };
    // accessing name, image, desc from form name attributes (Campground data)
    const name = req.body.name, 
          image = req.body.image,
          description = req.body.description,
          newCampground = {name: name, image: image, description: description, author: author}; // storing extracted form data into the object
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
router.get('/campgrounds/:id/edit', (req, res) => {
    const campID = req.params.id;
    Campground.findById(campID, (err, campground) => {
        if (!err) {
            res.render(`${__dirname}/../../html/campgrounds/edit.ejs`, {campground: campground});
        } else {
            throw new Error(err);
        }
    });
});

// PUT - UPDATE CAMPGROUND | - Update campground with new info
router.put('/campgrounds/:id', (req, res) => {
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
    // Redirect
});

// Exporting Campgrounds Router
module.exports = router;