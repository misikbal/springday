const mongoose = require('mongoose');

const bankSchema = mongoose.Schema({
    iban: {
        type: String,
        required: true
    },
    imageUrl: String,
    holder:String,
    date: {
        type: Date,
        default: Date.now
    },
    accountType:String,
    isActive: Boolean,    
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
});

module.exports = mongoose.model('Bank', bankSchema);
