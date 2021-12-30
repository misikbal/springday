module.exports = (req,res,next)=>{
    
    if(!req.active.ecommarce_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}