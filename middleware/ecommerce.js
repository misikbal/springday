module.exports = (req,res,next)=>{
    
    if(!req.system.ecommarce_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}