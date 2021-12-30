const mongoose = require('mongoose');

const aboutSchema = mongoose.Schema({
    name:{
        type:String,
        required:true["Hizmet ismini yazınız"]
    },
    description:{
        type:String,
    },
    isHome: Boolean,

    isActive: Boolean,
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

module.exports = mongoose.model('about', aboutSchema);