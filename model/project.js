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
    isHome: Boolean,
    tags:{
        type:Array,
        validate:{
            validator:function(value) {
                return value && value.length>0;
            },
            message:"ürün için en az bir etikten giriniz."
        }
    },
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