const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,"Ürün ismi girmelisiniz"],
        minlength:[5,"Ürün ismi için minimum 5 karakter girmelisiniz"],
        maxlength:[255,"Ürün ismi için minimum 255 karakter girmelisiniz"],
        lowercase:true,
        trim:true
    },
    
    url:String,
    currency:String,

    price: {
        type: Number,
    },
    description: {
        type: String,
        minlength:10
    },
    imageUrl: String,
    date: {
        type: Date,
        default: Date.now
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    tags:{
        type:Array,
        validate:{
            validator:function(value) {
                return value && value.length>0;
            },
            message:"ürün için en az bir etikten giriniz."
        }
    },
    isActive:Boolean,
    isHome:Boolean,

    categories:{
        type:Array,
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Category",
        required:false
    },
    popular:{
        type:Boolean,
    },
    lang:[{
            translate:{
                type:String,
                ref:"lang",
            },
            
            name:String,
            url:String,
            price:String,
            description:String,
            currency:String,
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            tags:{
                type:Array,
                validate:{
                    validator:function(value) {
                        return value && value.length>0;
                    },
                    message:"ürün için en az bir etikten giriniz."
                }
            },
        }
    ]
});
module.exports = mongoose.model('Product', productSchema);