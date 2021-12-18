const mongoose=require("mongoose");
const {isEmail}=require("validator");
const loginSchema=mongoose.Schema({
    
    email:{
        type:String,
        validator:[isEmail,"Hatalı E-Posta Adresi"]
    },
    password:{
        type:String,
        reqiured:[true,"Parola Girmelisiniz"]
    }
});

module.exports=mongoose.model("Login",loginSchema);
