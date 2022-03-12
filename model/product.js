const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    translate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    
    name:String,
    url:String,
    price:String,
    description:String,
    currency:String,
    tags:{
        type:Array,
    },
    imageUrl: String,
    date: {
        type: Date,
        default: Date.now
    },
    popular:Boolean,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    isActive:Boolean,
    isHome:Boolean,
    brand:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Brand",
    },
    categories:{
        type:Array,
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Category",
        required:false
    },
    
});
module.exports = mongoose.model('Product', productSchema);