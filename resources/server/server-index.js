// - Importing Mandatory Files - \\
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');
// - Importing Other Project Files | MVC - \\
const Campground = require('./models/Campgrounds');
const seedDB = require('./seeds'); // Temp - For Testing

// - Body Parser - \\
app.use(bodyParser.urlencoded({extended: true }));
// - View Engine - \\
app.set('view engine', 'ejs');
// - MongoDB Database - \\
mongoose.connect('mongodb://localhost/yelp_camp');
mongoose.set('useNewUrlParser', true);
// - Deleting Data - TESTING - \\
seedDB();

// GET PAGE #1 | - Landing Page - \\
app.get('/', (req, res) => {
    res.render(`${__dirname}/../html/landing.ejs`);
});

// GET PAGE #2 | - Camp Grounds - \\
app.get('/campgrounds', (req, res) => {
    // Get campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (!err) {
            res.render(`${__dirname}/../html/campgrounds/index.ejs`, {campgrounds: allCampgrounds}); // campgrounds param in ejs : allCampgrounds as DB data
        } else {
            throw new Error(err);
        }
    });
});

// GET PAGE #3 | - Adding new Camp grounds page with form - \\
app.get('/campgrounds/new', (req, res) => {
    res.render(`${__dirname}/../html/campgrounds/new.ejs`);
});

// POST Request for PAGE #3 | - Adding Camp Grounds using Form - \\
app.post('/campgrounds', (req, res) => {
    const name = req.body.name, // accessing name, image, desc from form name attributes
          image = req.body.image,
          description = req.body.description,
          newCampground = {name: name, image: image, description: description}; // storing extracted form data into the object
    // Create a new campground, save it to DB
    Campground.create(newCampground, (err, newlyCreatedCamp) => { // newlyCreatedCamp is a object of newly created data
        if (!err) {
            // Redirecting back to campgrounds page
            res.redirect('/campgrounds');
        } else {
            throw new Error(err);
        }
    })
});

// GET PAGE #4 | - Shows more info to specific campground - \\
app.get('/campgrounds/:id', (req, res) => {
    const campID = req.params.id;
    // Display specific campground with given ID
    Campground.findById(campID).populate('comments').exec((err, foundCampground) => { // Populating campgrounds object with comments
        if (!err) {
            // Render show campground page for specific ID
            res.render(`${__dirname}/../html/campgrounds/show.ejs`, {campground: foundCampground});
        } else {
            throw new Error(err);
        }
    });
});


// ==================== \\
// - COMMENTS ROUTE - 
// ==================== \\

//
app.get('/campgrounds/:id/comments/new', (req, res) => {
    const campID = req.params.id;
    Campground.findById(campID, (err, campground) => {
        if (!err) {
            res.render(`${__dirname}/../html/comments/new-comment.ejs`, { campground: campground });
        } else {
            throw new Error(err);
        }
    });
});


// - Setting the Port | Listen - \\
const port = 3000;
app.listen(port, () => console.log(`Server is running on port - ${port}`));