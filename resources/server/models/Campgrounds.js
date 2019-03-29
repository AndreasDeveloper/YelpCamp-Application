// - Importing Mongoose - \\
const mongoose = require('mongoose');

// - Campground Data Schema - \\
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        { 
            type: mongoose.Schema.Types.ObjectId, // Adding comments Object Id refference
            ref: 'Comments'
        }
    ]
});
// - Compiling mongoose Schema to a model - \\
const Campground = mongoose.model('Campground', campgroundSchema);
// Exporting Campground Model 
module.exports = Campground;