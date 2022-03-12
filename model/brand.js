const mongoose = require('mongoose');

const brandSchema = mongoose.Schema({
    name: {
        type: String,
    },
    
    brandImg: String,
    date: {
        type: Date,
        default: Date.now
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    isActive:Boolean,
    
});
module.exports = mongoose.model('Brand', brandSchema);