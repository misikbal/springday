const mongoose = require('mongoose');;
const themesSchema = mongoose.Schema({

    navbarLight:{
        type:String,
    },
    navbarDark:{
        type:String,
    },
    bodyLight:{
        type:String,
    },
    bodyDark:{
        type:String,
    },
    infoLight:{
        type:String,
    },
    infoDark:{
        type:String,
    },
    footerLight:{
        type:String,
    },
    footerDark:{
        type:String,
    },
    cardLight:{
        type:String,
    },
    cardrDark:{
        type:String,
    },
});

module.exports = mongoose.model('Themes', themesSchema);