const mongoose = require('mongoose');;
const themesSchema = mongoose.Schema({

    navbarLight:{
        type:String,
        required:true
    },
    navbarDark:{
        type:String,
        required:true
    },
    bodyLight:{
        type:String,
        required:true
    },
    bodyDark:{
        type:String,
        required:true
    },
    infoLight:{
        type:String,
        required:true
    },
    infoDark:{
        type:String,
        required:true
    },
    footerLight:{
        type:String,
        required:true
    },
    footerDark:{
        type:String,
        required:true
    },
    cardLight:{
        type:String,
        required:true
    },
    cardrDark:{
        type:String,
        required:true
    },
});

module.exports = mongoose.model('Themes', themesSchema);