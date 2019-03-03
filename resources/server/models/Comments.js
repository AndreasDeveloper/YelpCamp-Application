// - Importing Mongoose - \\
const mongoose = require('mongoose');

// - Comments Data Schema - \\
const commentSchema = new mongoose.Schema({
    text: String,
    author: String
});
// - Compiling mongoose Schema to a model - \\
const Comments = mongoose.model('Comments', commentSchema);
// Exporting Comments Model 
module.exports = Comments;