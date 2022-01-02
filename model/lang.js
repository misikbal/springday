const mongoose = require('mongoose');

const langSchema = mongoose.Schema({
    lang:String,
    imageUrl: String,
    value:String, 
    isActive:Boolean,   
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('lang', langSchema);