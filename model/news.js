const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    title:String,
    description: String,
    tags: String,
    imageUrl: String,
    isActive:Boolean,
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
    newsdate: String,
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('news', newsSchema);