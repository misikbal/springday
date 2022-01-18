module.exports = (req,res,next)=>{
    
    if(!req.system.cart_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}