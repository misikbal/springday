const mongoose = require('mongoose');
const Sequelize=require("sequelize");
const slideSchema = mongoose.Schema({

    image:{
        type:String,
        required:[true,"Resim Yüklemelisiniz"],
    },
    title: {
        type: String,
        trim:true
    },
    description: {
        type: String,
    },
    buttonName: String,
    buttonLink: String,
    animate:String,
    
    isActive:Boolean,
    
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Slide', slideSchema);