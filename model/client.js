const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    clientlogo:{
        type:String,
        required:true["Lütfen Bir Logo Seçiniz"]
    },
    name:{
        type:String,
        required:true["Markanın ismini yazınız"]
    },
    description:{
        type:String,
    },
    link:{
        type:String,
    },
    isActive: Boolean,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
});

module.exports = mongoose.model('Client', clientSchema);