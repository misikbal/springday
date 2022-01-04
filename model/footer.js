const mongoose = require('mongoose');

const footerSchema = mongoose.Schema({
    title: {
        type:String,
    },
    description:{
        type:String
    },
    slogan:{
        type:String
    },
    alt:{
        type:String
    },
});

module.exports = mongoose.model('footer', footerSchema);