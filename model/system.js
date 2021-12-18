const mongoose = require('mongoose');;
const settingsSchema = mongoose.Schema({

    siteUrl:{
        type:String,
        required:true
    },
    language: {
        type: String,
        trim:true
    },
    mainMode: {
        type: Boolean,
    },
    phone: String,
    mail: String,
    address:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    googlemaps:{
        type:String,
    },
    sgMail:{
        type:String,
    },
    tawktoscript:{
        type:String,
    }
});

module.exports = mongoose.model('Settings', settingsSchema);