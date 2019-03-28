// - Importing Mandatory Files - \\
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      methodOverride = require('method-override'),
      flash = require('connect-flash');
// - Importing Other Project Files | MVC - \\
const Campground = require('./models/Campgrounds'),
      Comment = require('./models/Comments'),
      User = require('./models/User'),
      seedDB = require('./seeds'); // Temp - For Testing
// - Importing Middlewares - \\
const isLoggedIn = require('./middlewares/authMiddleware');
// - Importing Routes Files - \\
const authenticationRoutes = require('./routes/authentication'),
      campgroundRoutes = require('./routes/campgrounds'),
      commentsRoutes = require('./routes/comments'),
      indexRoutes = require('./routes/index');

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
// - Seeding Database - TESTING - \\
//seedDB();
// - Importing Static Files - \\
app.use(express.static(`${__dirname}/../`));
// - Method Override - \\
app.use(methodOverride('_method'));
// - Connect Flash - \\
app.use(flash());

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
    // Flash Messages Setup | Error & Success
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// - Using Routes Files - \\
app.use(authenticationRoutes);
app.use(campgroundRoutes);
app.use(commentsRoutes);
app.use(indexRoutes);

/*  
    app.use('/campgrounds', campgroundRoutes);
    app.use('/campgrounds/:id/comments', commentsRoutes);
    app.use('/', indexRoutes);

    -- Reduces route codes in each route files. Instead of writing app.get('/campgrounds/new') ==> app.get('/new')
*/

// ==================== \\
//  - LISTENING PORT - 
// ==================== \\
// - Setting the Port | Listen - \\
const port = 3000;
app.listen(port, () => console.log(`Server is running on port - ${port}`));