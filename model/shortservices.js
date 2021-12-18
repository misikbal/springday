const mongoose = require('mongoose');

const shortServicesSchema = mongoose.Schema({
    icon:{
        type:String,
        required:true["Lütfen Bir İcon Seçiniz"]
    },
    name:{
        type:String,
        required:true["Hizmet ismini yazınız"]
    },
    decription:{
        type:String,
    },
    isActive: Boolean,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
});

module.exports = mongoose.model('Shortservices', shortServicesSchema);