module.exports = (req,res,next)=>{
    
    if(!req.system.products_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}