const mongoose=require("mongoose");
const orderSchema=mongoose.Schema({
    user:{
        userId:{
            type:mongoose.Types.ObjectId,
            required:true,
            ref:"User"
        },
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        }
    },    
    items:[
        {
            product:{
                type:Object,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
    ],
    cargonumber:String,
    cargocompany:String,
    city:String,
    district:String,
    adress:String,
    name:String,
    phone:String,
    postcode:String,
    mail:String,
    approval:{
        type:Boolean, default:false
    },
    cargo:{
        type:Boolean, default:false
    },
    done:{
        type:Boolean, default:false
    },
    payment:{
        type:Boolean, default:false
    },
    date:{
        type:Date,
        default:Date.now
    },

})
module.exports=mongoose.model("Order",orderSchema) 