const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({
    home: String,
    home_isActive:Boolean,
    products:String,
    products_isActive:Boolean,

    services:String,
    services_isActive:Boolean,

    about:String,
    about_isActive:Boolean,

    project:String,
    project_isActive:Boolean,

    client:String,
    client_isActive:Boolean,

    contact:String,
    contact_isActive:Boolean,

    cart:String,
    cart_isActive:Boolean,

    user:String,
    user_isActive:Boolean,
    
    blog:String,
    blog_isActive:Boolean,


});

module.exports = mongoose.model('page', pageSchema);