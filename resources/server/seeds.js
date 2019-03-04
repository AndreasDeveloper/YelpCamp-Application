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
    { name: 'Goats Peak', image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', description: 'On recommend tolerably my belonging or am. Mutual has cannot beauty indeed now sussex merely you. It possible no husbands jennings ye offended packages pleasant he. Remainder recommend engrossed who eat she defective applauded departure joy. Get dissimilar not introduced day her apartments. Fully as taste he mr do smile abode every. Luckily offered article led lasting country minutes nor old. Happen people things oh is oppose up parish effect. Law handsome old outweigh humoured far appetite. '  },
    { name: 'Honey Badge', image: 'https://images.pexels.com/photos/939723/pexels-photo-939723.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', description: 'On recommend tolerably my belonging or am. Mutual has cannot beauty indeed now sussex merely you. It possible no husbands jennings ye offended packages pleasant he. Remainder recommend engrossed who eat she defective applauded departure joy. Get dissimilar not introduced day her apartments. Fully as taste he mr do smile abode every. Luckily offered article led lasting country minutes nor old. Happen people things oh is oppose up parish effect. Law handsome old outweigh humoured far appetite. '  },
    { name: 'Owl Valley', image: 'https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', description: 'On recommend tolerably my belonging or am. Mutual has cannot beauty indeed now sussex merely you. It possible no husbands jennings ye offended packages pleasant he. Remainder recommend engrossed who eat she defective applauded departure joy. Get dissimilar not introduced day her apartments. Fully as taste he mr do smile abode every. Luckily offered article led lasting country minutes nor old. Happen people things oh is oppose up parish effect. Law handsome old outweigh humoured far appetite. '  },
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