// * ------------ * \\
// - TESTING SEED - \\
// * ------------ * \\

// - Importing Mandatory Files - \\
const mongoose = require('mongoose');
// - Importing Other Files - \\
const Campground = require('./models/Campgrounds'),
      Comments = require('./models/Comments');

// Temp data for filling seedDB
const data = [
    { name: 'Goats Peak', image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', description: 'Nice Campground'  },
    { name: 'Honey Badge', image: 'https://images.pexels.com/photos/939723/pexels-photo-939723.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', description: 'Beautiful Campsite'  },
    { name: 'Owl Valley', image: 'https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', description: 'Relaxing Environment'  },
]


// Function seedDB | - Deletes all data from DB when app starts
const seedDB = () => {
    // Remove Data
    Campground.remove({}, err => {
        if (!err) {
            console.log('Removed All Data');
            // Add Data - START
            data.forEach(el => {
                Campground.create(el, (err, data) => {
                    if (!err) {
                        console.log('Added Seed Data');
                        Comments.create({ text: 'This is really cool place.', author: 'Ripley'}, (error, comment) => {
                            if (!err) {
                                data.comments.push(comment);
                                data.save();
                                console.log('Comment added');
                            } else {
                                throw new Error(error);
                            }
                        });
                    } else {
                        throw new Error(err);
                    }
                });
            }); 
            // Add Data - END
        } else {
            throw new Error(err);
        }
    });
};

// Exporting seedDB Function 
module.exports = seedDB;