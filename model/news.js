const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    title:String,
    description: String,
    tags: String,
    imageUrl: String,
    isActive:Boolean,

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    newsdate: String,
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('news', newsSchema);