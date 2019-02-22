// - Imports - \\
const express = require('express');
const app = express();

// - View Engine - \\
app.set('view engine', 'ejs');

// PAGE #1 | - Landing Page - \\
app.get('/', (req, res) => {
    res.render(`${__dirname}/../html/landing.ejs`);
});

// PAGE #2 | - Camp Grounds - \\
app.get('/campgrounds', (req, res) => {
    // Temp
    const campgrounds = [
        { name: 'Salmon Creek', image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
        { name: 'Granite Hill', image: 'https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
        { name: 'Mountain Goat\'s Rest', image: 'https://images.pexels.com/photos/939723/pexels-photo-939723.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' }
    ];
    // Rendering Campgrounds
    res.render(`${__dirname}/../html/campgrounds.ejs`, { campgrounds: campgrounds });
});


// - Setting the Port | Listen - \\
const port = 3000;
app.listen(port, () => console.log(`Server is running on port - ${port}`));