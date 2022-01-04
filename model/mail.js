const mongoose = require('mongoose');

const mailSchema = mongoose.Schema({
    title: {
        required:true,
        type:String,
    },
    // from:{
    //     required:true,
    //     type:String
    // },
    html:{
        required:true,
        type:String
    },
    properties:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
});

module.exports = mongoose.model('Mail', mailSchema);