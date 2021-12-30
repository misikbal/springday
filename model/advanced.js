const mongoose = require('mongoose');

const advancedSchema = mongoose.Schema({
    ip:String,
    status: String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('advanced', advancedSchema);