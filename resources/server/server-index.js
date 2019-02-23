// - Imports - \\
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// - Body Parser - \\
app.use(bodyParser.urlencoded({extended: true }));
// - View Engine - \\
app.set('view engine', 'ejs');

    // Temp
    const campgrounds = [
        { name: 'Salmon Creek', image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
        { name: 'Granite Hill', image: 'https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
        { name: 'Mountain Goat\'s Rest', image: 'https://images.pexels.com/photos/939723/pexels-photo-939723.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' }
    ];

// GET PAGE #1 | - Landing Page - \\
app.get('/', (req, res) => {
    res.render(`${__dirname}/../html/landing.ejs`);
});

// GET PAGE #2 | - Camp Grounds - \\
app.get('/campgrounds', (req, res) => {

    // Rendering Campgrounds
    res.render(`${__dirname}/../html/campgrounds.ejs`, { campgrounds: campgrounds });
});

// GET PAGE #3 | - Adding new Camp grounds page - \\
app.get('/campgrounds/new', (req, res) => {
    res.render(`${__dirname}/../html/new-camp.ejs`);
});

// POST Route for PAGE #3 | - Adding Camp Grounds - \\
app.post('/campgrounds', (req, res) => {
    const name = req.body.name, // accessing name and image from form name attributes
          image = req.body.image,
          newCampground = {name: name, image: image}; // storing extracted form data into the object
    // Pushing newly created campgrounds
    campgrounds.push(newCampground);
    // Redirecting back to campgrounds page
    res.redirect('/campgrounds');
});


// - Setting the Port | Listen - \\
const port = 3000;
app.listen(port, () => console.log(`Server is running on port - ${port}`));