// Importing Express Router
const express = require('express'),
      router = express.Router(),
      passport = require('passport');
// Importing other files 
const User = require('../models/User');

// ======================== \\
// - AUTHENTICATION ROUTES - 
// ======================== \\

// GET - REGISTER PAGE | - Page to sign up
router.get('/register', (req, res) => {
    res.render(`${__dirname}/../../html/authentication/register.ejs`);
});

// POST - REGISTER USER | - Create new user
router.post('/register', (req, res) => {
    const username = req.body.username,
          password = req.body.password;
    User.register(new User({ username: username}), password, (err, user) => { // user => newly created user
        if (!err) {
            passport.authenticate('local')(req, res, () => {
                req.flash('success', `Successfully Signed Up as ${user.username}`);
                res.redirect('/campgrounds');
            });      
        } else {
            req.flash('error', err.message);
            res.redirect('/register');
        }
    });
});

// --- LOGIN SETUP --- \\

// GET - LOGIN PAGE | - Page to login
router.get('/login', (req, res) => {
    res.render(`${__dirname}/../../html/authentication/login.ejs`);
});

// POST - LOGIN USER | - Login's user
router.post('/login', passport.authenticate('local', { 
    successRedirect: '/campgrounds', 
    failureRedirect: '/login' }), 
    (req, res) => {
});

// --- LOGOUT SETUP --- \\

// GET - LOGOUT | - Logout Get Request
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out');
    res.redirect('/');
});

// Exporting Campgrounds Router
module.exports = router;