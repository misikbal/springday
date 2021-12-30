const mongoose = require('mongoose');

const procesSchema = mongoose.Schema({
    name:String,
    type: String,
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

module.exports = mongoose.model('process', procesSchema);