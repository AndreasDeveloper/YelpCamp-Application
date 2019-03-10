// - Importing Mandatory Files - \\
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      LocalStrategy = require('passport-local');
// - Importing Other Project Files | MVC - \\
const Campground = require('./models/Campgrounds'),
      Comment = require('./models/Comments'),
      User = require('./models/User');
      seedDB = require('./seeds'); // Temp - For Testing
// - Importing Middlewares - \\
const isLoggedIn = require('./middlewares/isLoggedIn');

// ==================== \\
// - DEPENDENCIES SETUP - 
// ==================== \\
// - Body Parser - \\
app.use(bodyParser.urlencoded({extended: true }));
// - View Engine - \\
app.set('view engine', 'ejs');
// - MongoDB Database - \\
mongoose.connect('mongodb://localhost/yelp_camp');
mongoose.set('useNewUrlParser', true);
// - Seeding - TESTING - \\
seedDB();
// - Importing Static Files - \\
app.use(express.static(`${__dirname}/../`));

// ==================== \\
//  - PASSPORT SETUP - 
// ==================== \\
// - Express Session - \\
app.use(require('express-session')({
    secret: 'Accessing secret data',
    resave: false,
    saveUninitialized: false
}));
// - Passport Methods - \\
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Displays user on every single page (if logged in)
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// ==================== \\
//    - INDEX ROUTE - 
// ==================== \\

// GET PAGE #1 | - Landing Page - \\
app.get('/', (req, res) => {
    res.render(`${__dirname}/../html/landing.ejs`);
});

// ==================== \\
// - CAMPGROUNDS ROUTE - 
// ==================== \\

// GET - ALL CAMPGROUNDS - INDEX | - Camp Grounds - \\
app.get('/campgrounds', (req, res) => {
    const userBody = req.user;
    // Get campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (!err) {
            res.render(`${__dirname}/../html/campgrounds/index.ejs`, {campgrounds: allCampgrounds, currentUser: userBody}); // campgrounds param in ejs : allCampgrounds as DB data
        } else {
            throw new Error(err);
        }
    });
});

// GET - NEW CAMPGROUND FORM | - Adding new Camp grounds page with form - \\
app.get('/campgrounds/new', (req, res) => {
    res.render(`${__dirname}/../html/campgrounds/new.ejs`);
});

// POST - CREATE NEW CAMPGROUND | - Adding Camp Grounds using Form - \\
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
    });
});

// GET - SHOW SPECIFIC CAMPGROUND | - Shows more info to specific campground - \\
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
//  - COMMENTS ROUTE - 
// ==================== \\

// GET - NEW COMMENT FORM | - Add new comment form
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    const campID = req.params.id; // Get campground ID
    Campground.findById(campID, (err, campground) => { // Find campground by ID
        if (!err) {
            res.render(`${__dirname}/../html/comments/new-comment.ejs`, { campground: campground });
        } else {
            throw new Error(err);
        }
    });
});

// POST - NEW COMMENT | - Create new comment for specific campground
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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


// ======================== \\
// - AUTHENTICATION ROUTES - 
// ======================== \\

// GET - REGISTER PAGE | - Page to sign up
app.get('/register', (req, res) => {
    res.render(`${__dirname}/../html/authentication/register.ejs`);
});

// POST - REGISTER USER | - Create new user
app.post('/register', (req, res) => {
    const username = req.body.username,
          password = req.body.password;
    User.register(new User({ username: username}), password, (err, user) => { // user => newly created user
        if (!err) {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/campgrounds');
            });      
        } else {
            throw new Error(err);
        }
    });
});

// --- LOGIN SETUP --- \\

// GET - LOGIN PAGE | - Page to login
app.get('/login', (req, res) => {
    res.render(`${__dirname}/../html/authentication/login.ejs`);
});

// POST - LOGIN USER | - Login's user
app.post('/login', passport.authenticate('local', { 
    successRedirect: '/campgrounds', 
    failureRedirect: '/login' }), 
    (req, res) => {
});

// --- LOGOUT SETUP --- \\

// GET - LOGOUT | - Logout Get Request
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


// ==================== \\
//  - LISTENING PORT - 
// ==================== \\
// - Setting the Port | Listen - \\
const port = 3000;
app.listen(port, () => console.log(`Server is running on port - ${port}`));