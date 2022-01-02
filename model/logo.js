const mongoose = require('mongoose');

const logoSchema = mongoose.Schema({
    logo:{
        type:String,
        required:true["Lütfen Bir Logo Seçiniz"]
    },
    favico:{
        type:String,
        required:true["Lütfen Bir İcon Seçiniz"]
    },
    footerLogo:{
        type:String,
        required:true["Lütfen Bir Logo Seçiniz"]
    },
    loadingLogo:{
        type:String,
        required:true["Lütfen Bir Logo Seçiniz"]
    },
    isActive:{
        type:Boolean
    },
    loadingtext:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
});

module.exports = mongoose.model('Logo', logoSchema);