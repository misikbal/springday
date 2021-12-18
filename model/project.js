const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    imageUrl:{
        type:String,
        required:true["Lütfen Bir Resim Seçiniz"]
    },
    name:{
        type:String,
        required:true["Hizmet ismini yazınız"]
    },
    description:{
        type:String,
    },
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

module.exports = mongoose.model('Project', projectSchema);