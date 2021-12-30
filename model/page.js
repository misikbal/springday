const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({
    home: String,
    products:String,
    services:String,
    about:String,
    project:String,
    client:String,
    contact:String,
    cart:String,
    user:String


});

module.exports = mongoose.model('page', pageSchema);