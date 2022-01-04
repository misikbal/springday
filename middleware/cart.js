module.exports = (req,res,next)=>{
    
    if(!req.page.cart_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}