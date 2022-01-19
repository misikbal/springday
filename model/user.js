const Product=require("./product");
const mongoose=require("mongoose");
const {isEmail}=require("validator");
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        validator:[isEmail,"invalid email"]
    },
    password:{
        type:String,
        reqiured:true
    },
    resetToken:String,
    resetTokenExpiration:Date,
    isAdmin:{
        type:Boolean,
        default:false
    },
    isLimited:{
        type:Boolean,
        default:false
    },
    date: {
        type: Date,
        default: Date.now
    },
    cart:{
        items:[
            {
                productId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product"
                },
                quantity:{
                    type:Number
            }
            }
        ]
    }
});
userSchema.methods.addToCart=function(product){
    const index=this.cart.items.findIndex(cp=>{
        return cp.productId.toString()===product._id.toString();
    })
    const updatedCartItem=[...this.cart.items];
    let itemQuantity=1;
    if(index>=0){
        itemQuantity=this.cart.items[index].quantity+1;
        updatedCartItem[index].quantity=itemQuantity;
    }else{
        updatedCartItem.push({
            productId:product._id,
            quantity:itemQuantity
        });
    }
    this.cart={
        items:updatedCartItem
    }
    return this.save();
}
userSchema.methods.getCart=function (params) {
        
        const ids=this.cart.items.map(i=>{
            return i.productId;
        });
        
        return Product
            .find({
                _id:{
                    $in:ids
                }
            })
            .select("name price imageUrl")
            .then(products=>{
                return products.map(p=>{
                    return{
                        name:p.name,
                        price:p.price,
                        imageUrl:p.imageUrl,
                        quantity:this.cart.items.find(i=>{
                            return i.productId.toString()==p._id.toString()
                        }).quantity
                    }
                });
            });
    
}
userSchema.methods.deleteCartItem=function (productid) {
    
        const cartItems=this.cart.items.filter(item=>{
            return  item.productId.toString()!==productid.toString()
        });
        this.cart.items=cartItems;
        return this.save();
    
}
userSchema.methods.clearCart=function () {
    this.cart={items:[]};
    return this.save();
}
module.exports=mongoose.model("User",userSchema);
